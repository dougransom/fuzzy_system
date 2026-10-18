/**
 * Type definitions for the Fuzzy System Home Assistant Frontend.
 */

export interface HomeAssistant {
  callWS: <T = any>(params: { type: string; [key: string]: any }) => Promise<T>;
  states: Record<string, any>;
  user?: {
    is_admin: boolean;
    name: string;
  };
  themes?: any;
  language?: string;
}

export interface TermConfig {
  type: string;
  params: number[];
  hedge?: string;
}

export interface InputVariableConfig {
  entity_id: string;
  range: [number, number];
  resolution?: number;
  default?: number;
  terms: Record<string, TermConfig>;
}

export interface OutputVariableConfig {
  range: [number, number];
  resolution?: number;
  defuzzifier?: string;
  epsilon?: number;
  name?: string;
  icon?: string;
  unit_of_measurement?: string;
  terms: Record<string, TermConfig>;
}

export interface FuzzySystemConfig {
  system_id: string;
  name: string;
  description?: string;
  inference: "mamdani" | "sugeno";
  defuzzifier: string;
  expose_system_sensor?: boolean;
  max_updates_per_period?: number;
  update_period?: number;
  epsilon?: number;
  inputs: Record<string, InputVariableConfig>;
  outputs: Record<string, OutputVariableConfig>;
  rules: string[];
}

export interface SystemSummary {
  system_id: string;
  name: string;
  description: string;
  inference: "mamdani" | "sugeno";
  defuzzifier: string;
  source: "yaml" | "config_entry";
  entry_id?: string;
  input_count: number;
  output_count: number;
  rule_count: number;
  max_updates_per_period: number;
  update_period: number;
  epsilon: number;
  config: FuzzySystemConfig;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  domain: string;
  inference: "mamdani" | "sugeno";
  defuzzifier: string;
  input_count: number;
  output_count: number;
  rule_count: number;
}

export interface SimulationResultOutput {
  defuzzified_value: number;
  dominant_term: string;
  term_activations: Record<string, number>;
  term_memberships: Record<string, number>;
  rule_strengths: Array<{ rule: string; firing_strength: number }>;
  universe: number[];
  aggregated_set: number[];
  epsilon?: number;
}

export type SimulationResults = Record<string, SimulationResultOutput>;
