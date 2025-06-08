import {NodeDefinition, NodeType} from "@/types";
import {NodeParamsByType, NodeSecretsByType} from "@gpflow/nodes";
import { nanoid } from "nanoid"

export class NodeBuilder<T extends NodeType> {
    private readonly node: NodeDefinition<T>
    private static _lastNodeId: string | null = null;

    private constructor(id: string, type: T) {
        this.node = {
            id,
            type,
            name: id,
            parameters: {} as NodeParamsByType[T]
        }
    }

    static set lastNodeId(lastNodeId: string | null) {
        NodeBuilder._lastNodeId = lastNodeId;
    }

    static get lastNodeId(): string  | null{
        return NodeBuilder._lastNodeId
    }

    static create<T extends NodeType>(type: T): NodeBuilder<T> {
        let id = `node-${nanoid()}`
        return new NodeBuilder<T>(id, type)
    }

    name(name: string): this {
        this.node.name = name
        return this
    }

    parameters(parameters: NodeParamsByType[T]): this {
        this.node.parameters = parameters
        return this
    }

    secrets(secrets: NodeSecretsByType[T]): this {
        this.node.secrets = secrets
        return this
    }

    build(): NodeDefinition<T> {
        return this.node
    }

}