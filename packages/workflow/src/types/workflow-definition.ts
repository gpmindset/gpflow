// For conditional node's branching logic
import { NodeParamsByType } from "@gpflow/nodes";

export type NodeType = keyof NodeParamsByType;

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

// Workflow node definition
export interface NodeDefinition<T extends  NodeType = NodeType> {
  id: string;
  type: T;
  name: string;
  parameters: NodeParamsByType[T];
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
  nodes: NodeDefinition[];
}

export interface RunWorkflowParams {
    secrets?: Record<string, string>;
    variables?: Record<string, any>;
}
