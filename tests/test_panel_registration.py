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

    with (
        patch("homeassistant.components.frontend.async_register_built_in_panel") as mock_panel,
        patch("homeassistant.components.frontend.add_extra_js_url") as mock_extra_js,
    ):
        result = await async_setup(hass, {})
        assert result is True

        # Verify static path registered
        assert hass.http.async_register_static_paths.called

        # Verify extra js URL added
        mock_extra_js.assert_called_with(hass, "/fuzzy_system_frontend/fuzzy-system-panel.js")

        # Verify custom panel registered in sidebar
        mock_panel.assert_called_once_with(
            hass,
            component_name="fuzzy-system-panel",
            sidebar_title="Fuzzy Systems",
            sidebar_icon="mdi:chart-bell-curve-cumulative",
            frontend_url_path="fuzzy-system",
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
