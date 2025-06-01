import { BaseWorkflowContext } from "@gpflow/core";

export interface NodeResult {
    id: string;
    type: string;
    status: 'success' | 'failed' | 'running';
    startTime?: Date;
    endTime?: Date;
    output?: any;
    error?: Error;
    metadata?: Record<string, any>;
}

export interface WorkflowState {
    status: 'pending' | 'running' | 'completed' | 'failed';
    startTime?: Date;
    endTime?: Date;
    currentNode?: string;
    nodeResults: Record<string, NodeResult>;
    metadata: Record<string, any>;
}

export interface WorkflowContext extends BaseWorkflowContext {
    id: string;
    state: WorkflowState;
}