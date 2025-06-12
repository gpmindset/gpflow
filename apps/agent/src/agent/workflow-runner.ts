import { IExecutionContext, IExecutionResult, INode, NodeRegistry} from "@gpflow/core";
import {AbstractExecutionEngine} from "@gpflow/core";

export class AgentWorkflowRunner extends AbstractExecutionEngine {
    protected async run(node: INode, context: IExecutionContext): Promise<{ result: any; next?: string[]; }> {
        const executor = NodeRegistry.getNode(node.type);
        if (!executor) throw new Error(`No executor for ${node.type}`);

        const { parameters } = node
        const { secrets } = context;

        const validation = executor.validate(parameters, secrets);
        if (!validation.isValid) {
            throw new Error(`Invalid parameters: ${validation.errors?.join(', ')}`);
        }

        return await executor.execute(node, {
            ...context,
            secrets,
        });
    }
}