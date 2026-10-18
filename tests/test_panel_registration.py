"""Tests for the Fuzzy System custom frontend panel registration."""

from unittest.mock import MagicMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.fuzzy_system import async_setup
from custom_components.fuzzy_system.const import DOMAIN


async def test_panel_and_static_path_registration(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test that async_setup registers static path and built-in panel."""
    # Set up http mock
    hass.http = MagicMock()
    hass.http.async_register_static_paths = MagicMock()

    with patch(
        "homeassistant.components.panel_custom.async_register_panel"
    ) as mock_panel:
        result = await async_setup(hass, {})
        assert result is True

        # Verify static path registered
        assert hass.http.async_register_static_paths.called

        # Verify custom panel registered in sidebar
        mock_panel.assert_called_once_with(
            hass,
            frontend_url_path="fuzzy-system",
            webcomponent_name="fuzzy-system-panel",
            sidebar_title="Fuzzy Systems",
            sidebar_icon="mdi:chart-bell-curve-cumulative",
            module_url="/fuzzy_system_frontend/fuzzy-system-panel.js",
            require_admin=True,
        )


async def test_full_component_setup_loads_services(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test that async_setup_component sets up the fuzzy_system domain."""
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()

    # Verify reload service is registered
    assert hass.services.has_service(DOMAIN, "reload")
