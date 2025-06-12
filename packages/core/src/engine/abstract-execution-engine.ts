import {IExecutionContext, IExecutionEngine, IExecutionResult, INode} from "@/interfaces/engine.interface";

export abstract class AbstractExecutionEngine implements IExecutionEngine {
    async execute(context: IExecutionContext): Promise<IExecutionResult> {
        const nodeResults: Record<string, any> = {};
        const executedNodes = new Set<string>();
        const visitedNodes = new Set<string>();
        const queue: string[] = [];

        const { nodes, connections } = context.workflow;

        // Build outgoing connection map
        const outgoingMap = new Map<string, string[]>();
        for (const conn of connections) {
            if (!outgoingMap.has(conn.sourceNode)) {
                outgoingMap.set(conn.sourceNode, []);
            }
            outgoingMap.get(conn.sourceNode)!.push(conn.targetNode);
        }

        // Build in-degree map
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
                    error: new Error(`Node not found: ${currentNodeId}`),
                };
            }

            try {
                const { result, next } = await this.run(node, context);
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
                    executedNodes: Array.from(executedNodes),
                };
            }
        }

        return {
            success: true,
            nodeResults,
            executedNodes: Array.from(executedNodes),
        };
    }

    protected abstract run(node: INode, context: IExecutionContext): Promise<{ result: any; next?: string[] }>;
}