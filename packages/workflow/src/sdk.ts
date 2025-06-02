import { ExecutionEngine, NodeRegistry } from "@gpflow/core";
import { WorkflowContextManager } from "./context/workflow-context-manager";
import { WorkflowExecutor } from "./executor/workflow-executor";
import { EC2CreateInstanceNode, EC2EditInstanceNode } from "@gpflow/nodes";
import { WorkflowDefinition } from "./types";

export class Workflow {

    private registerNodeExecutor() {
        const registry = new NodeRegistry();
        registry.registerNode(new EC2CreateInstanceNode());
        registry.registerNode(new EC2EditInstanceNode());
        return registry;
    }

    async execute(workflow: WorkflowDefinition) {

        const registry = this.registerNodeExecutor();
        
        const contextManager = new WorkflowContextManager();
        const engine = new ExecutionEngine(registry);
        const executor = new WorkflowExecutor(contextManager, engine);

        return await executor.executeWorkflow(workflow);
    }
    
}