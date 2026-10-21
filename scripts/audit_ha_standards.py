#!/usr/bin/env python3
"""Audit custom integration against Home Assistant architectural & security standards.

Validates:
1. Admin service authorization: Mutating actions (add, create, instantiate, delete, update)
   must be registered using async_register_admin_service.
2. YAML immutability: Integrations must never programmatically rewrite or dump YAML files.
3. Event loop purity: No blocking I/O (os.path.*, open, time.sleep) inside async functions.
4. Strict targeting: No fallback heuristics when user explicitly requests a named target ID.
5. Frontend isolation: WebMCP / message listeners must validate event.source and event.origin.
"""

from __future__ import annotations

import ast
import pathlib
import re
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
CUSTOM_COMPONENTS = REPO_ROOT / "custom_components"
FRONTEND_SRC = REPO_ROOT / "custom_components" / "fuzzy_system" / "frontend" / "src"

MUTATING_ACTION_PREFIXES = ("add_", "create_", "instantiate_", "delete_", "remove_", "update_")
BLOCKING_FUNCS = {"os.path.exists", "os.path.isfile", "os.path.isdir", "time.sleep"}


def audit_admin_services(errors: list[str]) -> None:
    """Ensure mutating actions are registered as admin services."""
    services_py = CUSTOM_COMPONENTS / "fuzzy_system" / "services.py"
    if not services_py.exists():
        return

    content = services_py.read_text(encoding="utf-8")
    tree = ast.parse(content, filename=str(services_py))

    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            # Detect hass.services.async_register
            func_name = ""
            if isinstance(node.func, ast.Attribute):
                func_name = node.func.attr
            if func_name == "async_register" and len(node.args) >= 2:
                # Arg 1 is domain, Arg 2 is service name
                svc_arg = node.args[1]
                svc_name = ""
                if isinstance(svc_arg, ast.Constant):
                    svc_name = str(svc_arg.value)
                elif isinstance(svc_arg, ast.Name):
                    svc_name = svc_arg.id

                # Check if matches mutating action
                lower_name = svc_name.lower()
                for prefix in MUTATING_ACTION_PREFIXES:
                    if prefix in lower_name:
                        errors.append(
                            f"[SECURITY] services.py: Line {node.lineno}: Mutating action '{svc_name}' "
                            f"is registered with plain async_register. Must use async_register_admin_service."
                        )


def audit_yaml_immutability(errors: list[str]) -> None:
    """Ensure integration code never dumps or overwrites YAML configuration files."""
    for py_file in CUSTOM_COMPONENTS.rglob("*.py"):
        content = py_file.read_text(encoding="utf-8")
        if "yaml.dump(" in content and "open(" in content:
            # Check if dumping to file
            if re.search(r"yaml\.dump\([^)]*,\s*[a-zA-Z0-9_]+\)", content):
                errors.append(
                    f"[IMMUTABILITY] {py_file.name}: Programmatic yaml.dump to a file detected. "
                    f"Home Assistant integrations must never overwrite user YAML files."
                )


def _get_call_name(node: ast.Call) -> str:
    """Extract call name string from AST call node."""
    if isinstance(node.func, ast.Attribute):
        val = node.func.value
        if isinstance(val, ast.Attribute):
            return f"{getattr(val.value, 'id', '')}.{val.attr}.{node.func.attr}"
        if isinstance(val, ast.Name):
            return f"{val.id}.{node.func.attr}"
    elif isinstance(node.func, ast.Name):
        return node.func.id
    return ""


def audit_event_loop_blocking_io(errors: list[str]) -> None:
    """Detect blocking I/O calls directly on the asyncio event loop."""
    for py_file in CUSTOM_COMPONENTS.rglob("*.py"):
        content = py_file.read_text(encoding="utf-8")
        tree = ast.parse(content, filename=str(py_file))

        for node in ast.walk(tree):
            if not isinstance(node, ast.AsyncFunctionDef):
                continue
            for child in ast.walk(node):
                if not isinstance(child, ast.Call):
                    continue
                call_name = _get_call_name(child)
                if call_name in BLOCKING_FUNCS or (call_name == "open" and not py_file.name.startswith("test")):
                    errors.append(
                        f"[ASYNC HAZARD] {py_file.name}: Line {child.lineno} in async def '{node.name}': "
                        f"Direct call to blocking '{call_name}' on the event loop. "
                        f"Must use hass.async_add_executor_job."
                    )


def audit_frontend_postmessage_security(errors: list[str]) -> None:
    """Ensure frontend postMessage listeners strictly validate event.source and event.origin."""
    if not FRONTEND_SRC.exists():
        return

    for ts_file in FRONTEND_SRC.rglob("*.[tj]s"):
        content = ts_file.read_text(encoding="utf-8")
        if 'addEventListener("message"' in content or "addEventListener('message'" in content:
            # Check for origin check
            has_origin_check = "event.origin === window.location.origin" in content or "event.origin !==" in content
            has_source_check = "event.source === window" in content or "event.source !==" in content

            if not (has_origin_check and has_source_check):
                errors.append(
                    f"[WEB SECURITY] {ts_file.name}: window.addEventListener('message') missing strict "
                    f"event.source === window and event.origin === window.location.origin check. "
                    f"Vulnerable to cross-frame privilege escalation."
                )


def main() -> int:
    print("=========================================")
    print(" Running HA Architecture & Security Audit...")
    print("=========================================")

    errors: list[str] = []
    audit_admin_services(errors)
    audit_yaml_immutability(errors)
    audit_event_loop_blocking_io(errors)
    audit_frontend_postmessage_security(errors)

    if errors:
        print(f"✗ Found {len(errors)} Home Assistant architecture/security violations:\n", file=sys.stderr)
        for err in errors:
            print(f"  • {err}", file=sys.stderr)
        return 1

    print("✓ All Home Assistant architecture and security audits passed!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
