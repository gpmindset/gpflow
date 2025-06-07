import {NodeDefinition, NodeType, WorkflowDefinition} from "@/types";
import {nanoid} from "nanoid";
import {NodeBuilder} from "@/builder/node-builder";

export class WorkflowBuilder {
    private readonly workflow: WorkflowDefinition;
    private nodeMap: Map<string, NodeDefinition> = new Map();

    private constructor(id: string, name: string) {
        this.workflow = {
            id,
            name,
            description: '',
            nodes: []
        };
    }

    static create(name: string): WorkflowBuilder {
        let id = `workflow-${nanoid()}`
        return new WorkflowBuilder(id, name);
    }

    addNode<T extends NodeType>(nodeBuilder: NodeBuilder<T>): this {
        const node = nodeBuilder.build()
        this.workflow.nodes.push(node)
        this.nodeMap.set(node.id, node)

        const lastId = NodeBuilder.lastNodeId;
        if (lastId && lastId !== node.id) {
            this.linkNodes(lastId, node.id);
        }

        NodeBuilder.lastNodeId = node.id;

        return this
    }

    description(description: string): this {
        this.workflow.description = description
        return this
    }

    globalSecrets(secrets: Record<string, string>): this {
        this.workflow.secrets = secrets
        return this
    }

    private linkNodes(from: string, to: string) {
        const fromNode = this.nodeMap.get(from)
        if (fromNode && !fromNode.next) {
            fromNode.next = [to]
        }
    }

    static createWithTracking(name: string): WorkflowBuilder {
        let id = `workflow-${nanoid()}`
        let builder: WorkflowBuilder;
        builder = new WorkflowBuilder(id, name);
        NodeBuilder.lastNodeId = null;
        return builder
    }

    build(): WorkflowDefinition {
        NodeBuilder.lastNodeId = null;
        return this.workflow
    }
}