export interface NodeParameters {
  [key: string]: any;
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