import { ResolvableValue } from "@/types/parser";

export interface NodeParameters {
  [key: string]: ResolvableValue;
}

export interface NodeDefinition<T extends NodeParameters = NodeParameters> {
  id: string;
  type: string;
  parameters: T;
}

export interface NodeValidationResult {
  isValid: boolean;
  errors?: string[];
}