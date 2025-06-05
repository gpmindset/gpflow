// For conditional node's branching logic
export interface ConditionalNext {
  true: string[];
  false: string[];
}

// Common secret reference pattern
type SecretReference = string; // Should follow "@secret:<key>"

// Node-level secrets (optional)
interface NodeSecrets {
  [key: string]: SecretReference;
}

// Parameters can be any key-value pair
interface NodeParameters {
  [key: string]: any;
}

// Workflow node definition
interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  parameters: NodeParameters;
  secrets?: NodeSecrets;
  next?: string[] | ConditionalNext;
}

// Global workflow secrets
interface WorkflowSecrets {
  [key: string]: SecretReference;
}

// Root workflow definition
export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  secrets?: WorkflowSecrets;
  nodes: WorkflowNode[];
}

export interface RunWorkflowParams {
    secrets?: Record<string, string>;
    variables?: Record<string, any>;
}
