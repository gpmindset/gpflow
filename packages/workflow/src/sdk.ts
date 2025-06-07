import { ExecutionEngine, LocalEncryptProvider, NodeRegistry, SecretsManager } from "@gpflow/core";
import { WorkflowContextManager } from "./context/workflow-context-manager";
import { WorkflowExecutor } from "./executor/workflow-executor";
import { EC2CreateInstanceNode, EC2EditInstanceNode } from "@gpflow/nodes";
import { RunWorkflowParams, WorkflowDefinition } from "./types";

export class Workflow {

    private readonly secretsManager: SecretsManager;
    private readonly engine: ExecutionEngine;

    constructor() {
        this.secretsManager = new SecretsManager(new LocalEncryptProvider('test'));
        this.engine = new ExecutionEngine(this.registerNodeExecutor(), this.secretsManager);
    }

    private registerNodeExecutor() {
        const registry = new NodeRegistry();
        registry.registerNode(new EC2CreateInstanceNode());
        registry.registerNode(new EC2EditInstanceNode());
        return registry;
    }

    async execute(workflow: WorkflowDefinition, params?: RunWorkflowParams) {

        const contextManager = new WorkflowContextManager();
        const executor = new WorkflowExecutor(contextManager, this.engine);

        await this.secretsManager.syncSecrets(workflow.id)

        for (const [key, val] of Object.entries(params?.secrets || {})) {
            await this.secretsManager.setSecret(workflow.id, key, val);
        }

        return await executor.executeWorkflow(workflow);
    }

}