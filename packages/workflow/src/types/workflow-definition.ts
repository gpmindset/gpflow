// For conditional node's branching logic
import { NodeParamsByType, NodeSecretsByType } from "@gpflow/nodes";

export type NodeType = keyof NodeParamsByType;

export interface ConditionalNext {
  true: string[];
  false: string[];
}


// Workflow node definition
export interface NodeDefinition<T extends  NodeType = NodeType> {
  id: string;
  type: T;
  name: string;
  parameters: NodeParamsByType[T];
  secrets?: NodeSecretsByType[T];
  next?: string[] | ConditionalNext;
}


// Global workflow secrets
interface WorkflowSecrets {
  [key: string]: string;
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
