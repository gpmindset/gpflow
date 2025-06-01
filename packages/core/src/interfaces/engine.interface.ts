import { NodeParameters, NodeValidationResult } from "@/types/nodes";

export interface IWorkflow {
  id: string;
  name: string;
  nodes: INode[];
  connections: IConnection[];
}

export interface INode {
  id: string;
  type: string;
  parameters: NodeParameters;
}

export interface IConnection {
  sourceNode: string;
  targetNode: string;
}

export interface IExecutionContext {
  workflow: IWorkflow;
  secrets: Record<string, string>;
  variables: Record<string, any>;
  nodeResults: Record<string, any>;
}

export interface IExecutionResult {
  success: boolean;
  nodeResults: Record<string, any>;
  error?: Error;
  executedNodes: string[];
}

export interface INodeExecutor {
  execute(node: INode, context: IExecutionContext): Promise<any>;
  validateParameters(parameters: Record<string, any>): NodeValidationResult;
}

export interface IExecutionEngine {
  execute(context: IExecutionContext): Promise<IExecutionResult>;
}
