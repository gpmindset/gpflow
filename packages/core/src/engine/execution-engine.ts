import { Parser } from "@/parser/parser";
import {IExecutionContext, INode, IWorkflow} from "@/interfaces/engine.interface";
import { NodeRegistry } from "./node-registry";
import { NodeParameters } from "@/types/nodes";
import { SecretsManager } from "@/secrets/secrets-manager";
import {AbstractExecutionEngine} from "@/engine/abstract-execution-engine";


export class ExecutionEngine extends AbstractExecutionEngine{
    constructor(private secretManager: SecretsManager) {
        super()
    }

    private isAgentNode(node: INode): boolean{
        const getNode = NodeRegistry.getNode(node.type);
        if (!getNode) throw new Error(`No executor for ${node.type}`);
        return getNode.target === "agent"
    }

    protected getConsecutiveAgentNodes(start: string,  workflow: IWorkflow): string[] {
        const visited = new Set<string>();
        const queue = [start];

        const outgoingMap = new Map<string, string[]>();
        for (const conn of workflow.connections) {
            if (!outgoingMap.has(conn.sourceNode)) {
                outgoingMap.set(conn.sourceNode, []);
            }
            outgoingMap.get(conn.sourceNode)!.push(conn.targetNode);
        }

        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            if (visited.has(nodeId)) continue;
            const node = workflow.nodes.find(n => n.id === nodeId);
            if (!node || !this.isAgentNode(node)) continue;

            visited.add(nodeId);
            const next = outgoingMap.get(nodeId) ?? [];
            queue.push(...next);
        }

        return Array.from(visited);
    }

    protected async run(node: INode, context: IExecutionContext): Promise<{ result: any,  next?: string[]}> {
        const executor = NodeRegistry.getNode(node.type);
        if (!executor) throw new Error(`No executor for ${node.type}`);

        const parser = new Parser({
            context,
            secretResolver: async (key) =>
                await this.secretManager.getSecret(context.workflow.id, key),
        });

        const secrets = await parser.resolveSecrets();

        const parsedContext = {
            ...context,
            secrets
        }


        if (this.isAgentNode(node)) {

            const { workflow } = context;

            const agentNodeIds = this.getConsecutiveAgentNodes(node.id, context.workflow);
            const agentNodes = workflow.nodes.filter(n => agentNodeIds.includes(n.id));
            const agentConnections = workflow.connections.filter(conn =>
                agentNodeIds.includes(conn.sourceNode) && agentNodeIds.includes(conn.targetNode))

            const agentSubworkflow: IWorkflow = {
                id: `agent-${context.workflow.id}`,
                name: context.workflow.name,
                nodes: agentNodes,
                connections: agentConnections,
            };

            const agentContext: IExecutionContext = {
                ...context,
                workflow: agentSubworkflow,
                nodeResults: {}, // isolated for agent results
                secrets: parsedContext.secrets,
            };

            // TODO: API call to agent
        }

        const parameters = parser.parse(node.parameters) as NodeParameters;

        const parsedNode = { ...node, parameters };

        const validation = executor.validate(parameters, secrets);
        if (!validation.isValid) {
            throw new Error(`Invalid parameters: ${validation.errors?.join(', ')}`);
        }

        return await executor.execute(parsedNode, parsedContext);
    }
}