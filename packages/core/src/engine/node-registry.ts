import { AbstractNodeExecutor } from "./abstract-node-executor";
import {NodeConstructor} from "@/types/nodes";

export class NodeRegistry {
    private static nodes = new Map<string, AbstractNodeExecutor>();
  
    static registerNode(NodeClass: NodeConstructor): void {
        const node = new NodeClass()
      if (this.nodes.has(node.type)) {
        throw new Error(`Node type ${node.type} is already registered`);
      }
      this.nodes.set(node.type, node);
    }
  
    static getNode(type: string): AbstractNodeExecutor | undefined {
      return this.nodes.get(type);
    }
  
    static hasNode(type: string): boolean {
      return this.nodes.has(type);
    }
  
    static clear(): void {
      this.nodes.clear();
    }
  }
  