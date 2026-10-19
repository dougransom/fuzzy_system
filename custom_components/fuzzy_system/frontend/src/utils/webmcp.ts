import { HomeAssistant, FuzzySystemConfig } from "../types";
import {
  fetchSystems,
  fetchSystem,
  simulateSystem,
  fetchTemplates,
  instantiateTemplate,
  generateCardConfig,
  addCardToDashboard,
} from "../api/websocket";

export interface WebMCPTool {
  name: string;
  description: string;
  parameters?: Record<string, any>;
  readOnlyHint?: boolean;
  consequentialHint?: boolean;
  handler: (args: any) => Promise<any> | any;
}

export interface FuzzyMCPContextHolder {
  getHass: () => HomeAssistant | undefined;
  getActiveConfig?: () => FuzzySystemConfig | undefined;
  updateActiveConfig?: (updater: (cfg: FuzzySystemConfig) => FuzzySystemConfig) => void;
  openSystemInEditor?: (config: FuzzySystemConfig) => void;
  refreshCatalog?: () => void;
}

let _initialized = false;
let _currentHolder: FuzzyMCPContextHolder | null = null;

export function initWebMCP(holder: FuzzyMCPContextHolder): void {
  _currentHolder = holder;
  if (_initialized) return;
  _initialized = true;

  const tools: WebMCPTool[] = [
    {
      name: "list_fuzzy_systems",
      description: "List all configured fuzzy systems (both YAML and UI entries) with variable names and rule counts.",
      readOnlyHint: true,
      handler: async () => {
        const hass = _currentHolder?.getHass();
        if (!hass) throw new Error("Home Assistant connection not ready");
        return fetchSystems(hass);
      },
    },
    {
      name: "get_fuzzy_system",
      description: "Retrieve full configuration of a specific fuzzy system.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" },
        },
        required: ["system_id"],
      },
      readOnlyHint: true,
      handler: async (args: { system_id: string }) => {
        const hass = _currentHolder?.getHass();
        if (!hass) throw new Error("Home Assistant connection not ready");
        return fetchSystem(hass, { system_id: args.system_id });
      },
    },
    {
      name: "simulate_fuzzy_system",
      description: "Perform dry-run fuzzy inference simulation with specified numerical input values.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" },
          inputs: { type: "object", description: "Key-value input map", additionalProperties: { type: "number" } },
        },
        required: ["system_id", "inputs"],
      },
      readOnlyHint: true,
      handler: async (args: { system_id: string; inputs: Record<string, number> }) => {
        const hass = _currentHolder?.getHass();
        if (!hass) throw new Error("Home Assistant connection not ready");
        const sys = await fetchSystem(hass, { system_id: args.system_id });
        return simulateSystem(hass, sys, args.inputs);
      },
    },
    {
      name: "generate_card_config",
      description: "Generate custom:fuzzy-system-card Lovelace dashboard card configuration and YAML.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" },
          title: { type: "string", description: "Optional card title" },
          show_graph: { type: "boolean", default: true },
          show_inputs: { type: "boolean", default: true },
          show_rules: { type: "boolean", default: true },
        },
        required: ["system_id"],
      },
      readOnlyHint: true,
      handler: async (args) => {
        const hass = _currentHolder?.getHass();
        if (!hass) throw new Error("Home Assistant connection not ready");
        return generateCardConfig(hass, args);
      },
    },
    {
      name: "add_card_to_dashboard",
      description: "Automatically inserts a custom:fuzzy-system-card into a Lovelace dashboard view.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" },
          dashboard_path: { type: "string", description: "Dashboard URL path (leave blank for primary overview)" },
          view_title: { type: "string", description: "Title of target view to add to" },
          card_title: { type: "string", description: "Optional custom title for the card" },
          show_graph: { type: "boolean", default: true },
          show_inputs: { type: "boolean", default: true },
          show_rules: { type: "boolean", default: true },
        },
        required: ["system_id"],
      },
      consequentialHint: true,
      handler: async (args) => {
        const hass = _currentHolder?.getHass();
        if (!hass) throw new Error("Home Assistant connection not ready");
        return addCardToDashboard(hass, args);
      },
    },
    {
      name: "list_starter_templates",
      description: "Discover all pre-built starter templates in the fuzzy system library.",
      readOnlyHint: true,
      handler: async () => {
        const hass = _currentHolder?.getHass();
        if (!hass) throw new Error("Home Assistant connection not ready");
        return fetchTemplates(hass);
      },
    },
    {
      name: "instantiate_starter_template",
      description: "Instantiate a starter template into a new configuration draft.",
      parameters: {
        type: "object",
        properties: {
          template_id: { type: "string", description: "Template identifier" },
          system_id: { type: "string", description: "New system identifier" },
          name: { type: "string", description: "Optional friendly name" },
        },
        required: ["template_id", "system_id"],
      },
      consequentialHint: true,
      handler: async (args: { template_id: string; system_id: string; name?: string }) => {
        const hass = _currentHolder?.getHass();
        if (!hass) throw new Error("Home Assistant connection not ready");
        const res = await instantiateTemplate(hass, args.template_id, args.system_id, args.name);
        if (_currentHolder?.openSystemInEditor && res.system) {
          _currentHolder.openSystemInEditor(res.system);
        }
        return res;
      },
    },
    {
      name: "get_active_editor_system",
      description: "Returns the fuzzy system configuration currently open and active in the workbench editor.",
      readOnlyHint: true,
      handler: () => {
        const cfg = _currentHolder?.getActiveConfig?.();
        if (!cfg) {
          return { error: "No system currently open in the editor (workbench is in catalog view)." };
        }
        return cfg;
      },
    },
    {
      name: "tune_editor_term",
      description: "Tunes membership function parameters for an antecedent or consequent in the active workbench editor.",
      parameters: {
        type: "object",
        properties: {
          variable_type: { type: "string", enum: ["input", "output"] },
          variable_name: { type: "string" },
          term_name: { type: "string" },
          mf_type: { type: "string" },
          params: { type: "array", items: { type: "number" } },
        },
        required: ["variable_type", "variable_name", "term_name", "mf_type", "params"],
      },
      handler: (args) => {
        if (!_currentHolder?.updateActiveConfig) {
          return { error: "Active editor is not available." };
        }
        let updated = false;
        _currentHolder.updateActiveConfig((cfg) => {
          const next = JSON.parse(JSON.stringify(cfg));
          const targetMap = args.variable_type === "input" ? next.inputs : next.outputs;
          if (targetMap?.[args.variable_name]?.terms?.[args.term_name]) {
            targetMap[args.variable_name].terms[args.term_name] = {
              type: args.mf_type,
              params: args.params,
            };
            updated = true;
          }
          return next;
        });
        return { success: updated, message: updated ? "Term parameters updated." : "Variable or term not found." };
      },
    },
    {
      name: "add_editor_rule",
      description: "Appends a new linguistic rule to the currently open fuzzy system in the workbench editor.",
      parameters: {
        type: "object",
        properties: {
          rule: { type: "string", description: "Linguistic rule string (e.g. IF temp IS cold THEN fan IS low)" },
        },
        required: ["rule"],
      },
      handler: (args: { rule: string }) => {
        if (!_currentHolder?.updateActiveConfig) {
          return { error: "Active editor is not available." };
        }
        _currentHolder.updateActiveConfig((cfg) => {
          const next = JSON.parse(JSON.stringify(cfg));
          next.rules = [...(next.rules || []), args.rule];
          return next;
        });
        return { success: true, message: `Added rule: '${args.rule}'` };
      },
    },
  ];

  // 1. Register with standard browser WebMCP API (document.modelContext or navigator.modelContext)
  const navOrDoc: any =
    (typeof navigator !== "undefined" && (navigator as any).modelContext) ||
    (typeof document !== "undefined" && (document as any).modelContext) ||
    (typeof window !== "undefined" && (window as any).modelContext);

  if (navOrDoc && typeof navOrDoc.provideContext === "function") {
    try {
      navOrDoc.provideContext({
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters,
          readOnlyHint: t.readOnlyHint,
          consequentialHint: t.consequentialHint,
          handler: t.handler,
        })),
      });
      // eslint-disable-next-line no-console
      console.log("[FuzzySystem] Registered", tools.length, "tools with WebMCP");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[FuzzySystem] Failed to register with WebMCP context:", e);
    }
  }

  // 2. Attach global helper for browser DevTools, subagents, and scripts: window.fuzzySystemMCP
  const mcpGlobal: Record<string, any> = {
    tools: tools.map((t) => ({ name: t.name, description: t.description })),
  };
  for (const t of tools) {
    mcpGlobal[t.name] = t.handler;
  }
  (window as any).fuzzySystemMCP = mcpGlobal;

  // 3. PostMessage handler for cross-context invocation
  window.addEventListener("message", async (event) => {
    if (event.data?.type === "fuzzy_system:mcp_call") {
      const { id, tool, args } = event.data;
      const targetTool = tools.find((t) => t.name === tool);
      if (!targetTool) {
        window.postMessage({ type: "fuzzy_system:mcp_result", id, error: `Tool '${tool}' not found` }, "*");
        return;
      }
      try {
        const result = await targetTool.handler(args || {});
        window.postMessage({ type: "fuzzy_system:mcp_result", id, result }, "*");
      } catch (err: any) {
        window.postMessage({ type: "fuzzy_system:mcp_result", id, error: err?.message || String(err) }, "*");
      }
    }
  });
}
