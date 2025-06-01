import { NodeResult, WorkflowContext, WorkflowState } from "@/types";
import { AbstractWorkflowContextManager, INode, IWorkflow } from "@gpflow/core";



export class WorkflowContextManager extends AbstractWorkflowContextManager<WorkflowContext> {

    setWorkflowId(id: string): void {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        this.setValue("id", id);
    }

    getWorkflowId(): string {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        return this.getValue("id") as string;
    }

    registerNodes(nodes: INode[]): void {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        this.setValue("workflow", {
            ...this.getValue("workflow") as IWorkflow,
            nodes,
        });
    }

    getNodes(): INode[] {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        return this.getValue("workflow")?.nodes as INode[];
    }

    setNodeResult(id: string, result: any): void {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }

        const node = this.getValue("workflow")?.nodes.find((n: INode) => n.id === id);
        if (!node) {
            throw new Error(`Node ${id} not found in workflow`);
        }

        const nodeResult: NodeResult = {
            id,
            type: node.type,
            status: 'success',
            endTime: new Date(),
            output: result,
            metadata: {}
        };


        this.setValue("state", {
            ...this.getValue("state") as WorkflowState,
            nodeResults: {
                ...this.getValue("state")?.nodeResults,
                [id]: nodeResult
            }
        });

        const allNodes = this.getValue("workflow")?.nodes;
        const completedNodes = Object.keys(this.getValue("state")?.nodeResults || {});

        if (completedNodes.length === allNodes?.length) {
            this.setValue("state", {
                ...this.getValue("state") as WorkflowState,
                status: 'completed',
                endTime: new Date()
            });
        }
    }

    getNodeResult(id: string): any {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        return this.getValue("state")?.nodeResults[id];
    }

    hasNodeExecuted(id: string): boolean {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        return this.getValue("state")?.nodeResults[id] !== undefined;
    }

    resetWorkflow(): void {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        this.clearContext();
    }

    initContext(definition: IWorkflow): void {
        if (this.isInitialized()) {
            throw new Error("Context is already initialized");
        }
        this.init();
        this.setValue("id", definition.id);
        this.setValue("workflow", definition);
        this.setValue("state", {
            status: "pending",
            startTime: new Date(),
            endTime: undefined,
            currentNode: undefined,
            nodeResults: {},
            metadata: {}
        });
    }

    getState(): WorkflowState {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        return this.getValue("state") as WorkflowState;
    }

    getWorkflow(): IWorkflow {
        if (!this.isInitialized()) {
            throw new Error("Context is not initialized");
        }
        return this.getValue("workflow") as IWorkflow;
    }

    toJSON(): Record<string, any> {
        return {
            id: this.getValue("id"),
            workflow: this.getValue("workflow"),
            state: this.getValue("state")
        };
    }
}
