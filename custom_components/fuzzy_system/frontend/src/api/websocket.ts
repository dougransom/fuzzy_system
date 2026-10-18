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
  const response = await hass.callWS<any>({
    type: WS_TYPE_SIMULATE,
    system_config: systemConfig,
    inputs,
  });
  const data = response?.results || response;
  if (!data) return {};

  // If backend returns the { defuzzified_values, dominant_terms, ... } format:
  if (data.defuzzified_values) {
    const results: SimulationResults = {};
    const outKeys = Object.keys(systemConfig.outputs || {});
    for (const outKey of outKeys) {
      const agg = data.aggregated_sets?.[outKey] || [];
      let u = data.universes?.[outKey] || [];
      if ((!u || u.length === 0) && agg.length > 0) {
        const r = systemConfig.outputs[outKey]?.range || [0, 100];
        const span = r[1] - r[0];
        const step = span / (agg.length - 1 || 1);
        u = Array.from({ length: agg.length }, (_, i) => r[0] + i * step);
      }

      results[outKey] = {
        defuzzified_value: data.defuzzified_values[outKey],
        dominant_term: data.dominant_terms?.[outKey] || "",
        term_activations: data.term_activations?.[outKey] || {},
        term_memberships: data.term_memberships?.[outKey] || {},
        rule_strengths: data.rule_strengths || [],
        universe: u,
        aggregated_set: agg,
      };
    }
    return results;
  }

  return data;
}
