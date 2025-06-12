import { BaseContextManager } from "./base-context-manager";
import { BaseWorkflowContext } from "@/types/context";
import { INode } from "@/interfaces/engine.interface";

export abstract class AbstractWorkflowContextManager<T extends BaseWorkflowContext> extends BaseContextManager<T> {
	/**
	 * Set the workflow ID
	 */
	abstract setWorkflowId(id: string): void;

	/**
	 * Get the workflow ID
	 */
	abstract getWorkflowId(): string;

	/**
	 * Register all nodes for a workflow
	 */
	abstract registerNodes(nodes: any[]): void;

	/**
	 * Get all registered nodes
	 */
	abstract getNodes(): any[];

	/**
	 * Set agent result of a node
	 */
	abstract setNodeResult(id: string, result: any): void;

	/**
	 * Get agent result of a node
	 */
	abstract getNodeResult(id: string): any;

	/**
	 * Check if node has been executed
	 */
	abstract hasNodeExecuted(nodeId: string): boolean;

	/**
	 * Reset workflow-related context
	 */
	abstract resetWorkflow(): void;

    /**
     * Initialize workflow context
     */
    abstract initContext(definition: { id: string; nodes: INode[] }): void;
}
