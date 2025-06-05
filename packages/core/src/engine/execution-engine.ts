import { Parser } from "@/parser/parser";
import { IExecutionContext, IExecutionEngine, IExecutionResult } from "../interfaces/engine.interface";
import { NodeRegistry } from "./node-registry";
import { NodeParameters } from "@/types/nodes";
import { SecretsManager } from "@/secrets/secrets-manager";


export class ExecutionEngine implements IExecutionEngine {
    constructor(private nodeRegistry: NodeRegistry, private secretManager: SecretsManager) { }

    async execute(context: IExecutionContext): Promise<IExecutionResult> {
        const nodeResults: Record<string, any> = {};
        const executedNodes = new Set<string>();
        const visitedNodes = new Set<string>();
        const queue: string[] = [];

        const { nodes, connections } = context.workflow;

        // Build connection graph
        const outgoingMap = new Map<string, string[]>();
        for (const conn of connections) {
            if (!outgoingMap.has(conn.sourceNode)) {
                outgoingMap.set(conn.sourceNode, []);
            }
            outgoingMap.get(conn.sourceNode)!.push(conn.targetNode);
        }

        // Find entry nodes (those with no incoming edges)
        const inDegree = new Map<string, number>();
        for (const node of nodes) inDegree.set(node.id, 0);
        for (const conn of connections) {
            inDegree.set(conn.targetNode, (inDegree.get(conn.targetNode) || 0) + 1);
        }

        for (const [id, degree] of inDegree.entries()) {
            if (degree === 0) queue.push(id);
        }

        while (queue.length > 0) {
            const currentNodeId = queue.shift()!;
            if (visitedNodes.has(currentNodeId)) continue;
            visitedNodes.add(currentNodeId);

            const node = nodes.find(n => n.id === currentNodeId);
            if (!node) {
                return {
                    success: false,
                    nodeResults,
                    executedNodes: Array.from(executedNodes),
                    error: new Error(`Node not found: ${currentNodeId}`)
                };
            }

            const executor = this.nodeRegistry.getNode(node.type);
            if (!executor) {
                return {
                    success: false,
                    nodeResults,
                    executedNodes: Array.from(executedNodes),
                    error: new Error(`No executor found for node type: ${node.type}`)
                };
            }

            const validation = executor.validate(node.parameters);
            console.log('Validation', validation);
            if (!validation.isValid) {
                return {
                    success: false,
                    nodeResults,
                    executedNodes: Array.from(executedNodes),
                    error: new Error(`Invalid parameters for node ${node.id}: ${validation.errors?.join(', ')}`)
                };
            }

            try {

                const parser = new Parser({ context, secretResolver: async (key) => await this.secretManager.getSecret(context.workflow.id, key) });
                const parsedParameters = parser.parse(node.parameters) as NodeParameters;
                const secrets = await parser.resolveSecrets();
                
                const { result, next } = await executor.execute({ ...node, parameters: parsedParameters }, { ...context, secrets });
                context.nodeResults[node.id] = result;
                nodeResults[node.id] = result;
                executedNodes.add(node.id);

                const dynamicNext = next ?? outgoingMap.get(node.id) ?? [];
                for (const nextNodeId of dynamicNext) {
                    if (!visitedNodes.has(nextNodeId)) {
                        queue.push(nextNodeId);
                    }
                }
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                context.nodeResults[node.id] = err;
                return {
                    success: false,
                    nodeResults,
                    error: err,
                    executedNodes: Array.from(executedNodes)
                };
            }
        }

        return {
            success: true,
            nodeResults,
            executedNodes: Array.from(executedNodes)
        };
    }
}