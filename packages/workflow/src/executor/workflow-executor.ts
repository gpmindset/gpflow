import { WorkflowContextManager } from "@/context/workflow-context-manager";
import { ConditionalNext, WorkflowDefinition } from "@/types";
import { AbstractWorkflowExecutor, ExecutionEngine, IConnection, IExecutionContext, IExecutionResult, INode, IWorkflow, NodeRegistry, NodeValidationResult } from "@gpflow/core";

export class WorkflowExecutor extends AbstractWorkflowExecutor<WorkflowDefinition> {

    constructor(private contextManager: WorkflowContextManager, private executionEngine: ExecutionEngine) {
        super();
    }


    async executeWorkflow(workflow: WorkflowDefinition): Promise<IExecutionResult> {
        try {
            const transformedWorkflow = this.transformWorkflow(workflow);

            const validatedWorkflow = this.validateWorkflow(transformedWorkflow.workflow);
            if (!validatedWorkflow.isValid) {
                throw new Error(validatedWorkflow.errors?.join(", ") || "Invalid workflow");
            }

            this.contextManager.initContext(transformedWorkflow.workflow);

            const initialexecutionContext: IExecutionContext = {
                workflow: transformedWorkflow.workflow,
                secrets: transformedWorkflow.secrets,
                variables: {},
                nodeResults: {}
            };

            const result = await this.executionEngine.execute(initialexecutionContext);

            if (result.success) {
                Object.entries(result.nodeResults).forEach(([id, nodeResult]) => {
                    this.contextManager.setNodeResult(id, nodeResult);
                });
            }

            return result;

        } catch (error) {
            return {
                success: false,
                nodeResults: {},
                error: error as Error,
                executedNodes: []
            };
        }
    }

    validateWorkflow(workflow: IWorkflow): NodeValidationResult {
        const errors: string[] = [];
        const nodeIds = new Set<string>();

        // 1. Check for duplicate node IDs and required fields
        for (const node of workflow.nodes) {
            if (!node.id || !node.type) {
                errors.push(`Node missing required fields (id or type): ${JSON.stringify(node)}`);
            }

            if (nodeIds.has(node.id)) {
                errors.push(`Duplicate node ID found: ${node.id}`);
            }
            nodeIds.add(node.id);
        }

        // 2. Check that all connection references are valid
        for (const conn of workflow.connections) {
            if (!nodeIds.has(conn.sourceNode)) {
                errors.push(`Connection references unknown source node: ${conn.sourceNode}`);
            }
            if (!nodeIds.has(conn.targetNode)) {
                errors.push(`Connection references unknown target node: ${conn.targetNode}`);
            }
        }

        // 3. Check for unreachable nodes using BFS
        const reachable = new Set<string>();
        const graph = new Map<string, string[]>();

        for (const node of workflow.nodes) {
            graph.set(node.id, []);
        }

        for (const conn of workflow.connections) {
            graph.get(conn.sourceNode)?.push(conn.targetNode);
        }

        // Start from nodes with no incoming connections
        const allTargets = new Set(workflow.connections.map(c => c.targetNode));
        const entryNodes = workflow.nodes.filter(n => !allTargets.has(n.id));

        const queue = [...entryNodes.map(n => n.id)];
        while (queue.length) {
            const current = queue.shift()!;
            reachable.add(current);
            for (const neighbor of graph.get(current) || []) {
                if (!reachable.has(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }

        for (const node of workflow.nodes) {
            if (!reachable.has(node.id)) {
                errors.push(`Node "${node.id}" is not connected or unreachable from entry nodes.`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    transformWorkflow(workflow: WorkflowDefinition): IExecutionContext {
        const nodes: INode[] = workflow.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            parameters: node.parameters,
        }));

        const connections: IConnection[] = [];

        for (const node of workflow.nodes) {
            if (Array.isArray(node.next)) {
                for (const target of node.next) {
                    connections.push({ sourceNode: node.id, targetNode: target });
                }
            } else if (node.next && typeof node.next === "object") {
                const conditionalNext = node.next as ConditionalNext;
                for (const target of conditionalNext.true) {
                    connections.push({ sourceNode: node.id, targetNode: target });
                }
                for (const target of conditionalNext.false) {
                    connections.push({ sourceNode: node.id, targetNode: target });
                }
            }
        }

        const workflowDef: IWorkflow = {
            id: workflow.id,
            name: workflow.name,
            nodes,
            connections,
        };

        const secrets: Record<string, string> = { ...workflow.secrets };

        // Merge node-level secrets
        for (const node of workflow.nodes) {
            if (node.secrets) {
                for (const [key, value] of Object.entries(node.secrets)) {
                    secrets[value.replace(/^@secret:/, "")] = value;
                }
            }
        }

        const context: IExecutionContext = {
            workflow: workflowDef,
            secrets,
            variables: {},
            nodeResults: {},
        };

        return context;
    }
}
