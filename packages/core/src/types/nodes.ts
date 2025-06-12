import { ResolvableValue } from "@/types/parser";
import {AbstractNodeExecutor} from "@/engine/abstract-node-executor";

export interface NodeParameters {
  [key: string]: ResolvableValue;
}

export type ExecutionTarget = "default" | "agent"

export interface NodeDefinition<T extends NodeParameters = NodeParameters> {
  id: string;
  type: string;
  parameters: T;
}

export interface NodeValidationResult {
  isValid: boolean;
  errors?: string[];
}

export type NodeConstructor = new (...args: any[]) => AbstractNodeExecutor