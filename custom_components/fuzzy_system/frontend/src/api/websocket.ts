import {
  FuzzySystemConfig,
  HomeAssistant,
  SimulationResults,
  SystemSummary,
  TemplateSummary,
} from "../types";

export const WS_TYPE_LIST_SYSTEMS = "fuzzy_system/systems/list";
export const WS_TYPE_GET_SYSTEM = "fuzzy_system/systems/get";
export const WS_TYPE_SAVE_SYSTEM = "fuzzy_system/systems/save";
export const WS_TYPE_DELETE_SYSTEM = "fuzzy_system/systems/delete";
export const WS_TYPE_SIMULATE = "fuzzy_system/simulate";
export const WS_TYPE_LIST_TEMPLATES = "fuzzy_system/templates/list";
export const WS_TYPE_INSTANTIATE_TEMPLATE = "fuzzy_system/templates/instantiate";

export async function fetchSystems(hass: HomeAssistant): Promise<SystemSummary[]> {
  const response = await hass.callWS<SystemSummary[] | { systems: SystemSummary[] }>({
    type: WS_TYPE_LIST_SYSTEMS,
  });
  return Array.isArray(response) ? response : (response.systems || []);
}

export async function fetchSystem(
  hass: HomeAssistant,
  params: { system_id?: string; entry_id?: string }
): Promise<FuzzySystemConfig> {
  const response = await hass.callWS<{ system: FuzzySystemConfig; config?: FuzzySystemConfig }>({
    type: WS_TYPE_GET_SYSTEM,
    ...params,
  });
  return response.system || response.config!;
}

export async function saveSystem(
  hass: HomeAssistant,
  systemConfig: FuzzySystemConfig,
  entryId?: string
): Promise<{ system_id: string; entry_id: string }> {
  return hass.callWS<{ system_id: string; entry_id: string }>({
    type: WS_TYPE_SAVE_SYSTEM,
    system_id: systemConfig.system_id,
    name: systemConfig.name,
    description: systemConfig.description,
    inference: systemConfig.inference,
    defuzzifier: systemConfig.defuzzifier,
    expose_system_sensor: systemConfig.expose_system_sensor ?? true,
    max_updates_per_period: systemConfig.max_updates_per_period ?? 20,
    update_period: systemConfig.update_period ?? 0.05,
    epsilon: systemConfig.epsilon ?? 0.01,
    inputs: systemConfig.inputs,
    outputs: systemConfig.outputs,
    rules: systemConfig.rules,
    entry_id: entryId,
  });
}

export async function deleteSystem(
  hass: HomeAssistant,
  entryId: string
): Promise<{ success: boolean }> {
  return hass.callWS<{ success: boolean }>({
    type: WS_TYPE_DELETE_SYSTEM,
    entry_id: entryId,
  });
}

export async function fetchTemplates(hass: HomeAssistant): Promise<TemplateSummary[]> {
  const response = await hass.callWS<{ templates: TemplateSummary[] }>({
    type: WS_TYPE_LIST_TEMPLATES,
  });
  return response.templates || [];
}

export async function instantiateTemplate(
  hass: HomeAssistant,
  templateId: string,
  systemId: string,
  name?: string
): Promise<{ system: FuzzySystemConfig }> {
  return hass.callWS<{ system: FuzzySystemConfig }>({
    type: WS_TYPE_INSTANTIATE_TEMPLATE,
    template_id: templateId,
    system_id: systemId,
    name,
  });
}

export async function simulateSystem(
  hass: HomeAssistant,
  systemConfig: FuzzySystemConfig,
  inputs: Record<string, number>
): Promise<SimulationResults> {
  const response = await hass.callWS<{ results: SimulationResults }>({
    type: WS_TYPE_SIMULATE,
    system_config: systemConfig,
    inputs,
  });
  return response.results;
}
