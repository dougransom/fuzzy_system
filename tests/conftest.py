"""Pytest configuration and global fixtures for fuzzy_system tests."""

try:
    import pycares

    # Start pycares shutdown manager before tests run so the daemon thread
    # is not flagged as a lingering thread by pytest-homeassistant-custom-component.
    pycares._shutdown_manager.start()
except (ImportError, AttributeError):
    pass
