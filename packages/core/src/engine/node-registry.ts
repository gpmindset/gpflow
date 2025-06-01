import { AbstractNodeExecutor } from "./abstract-node-executor";

export class NodeRegistry {
    private nodes = new Map<string, AbstractNodeExecutor>();
  
    registerNode(node: AbstractNodeExecutor): void {
      if (this.nodes.has(node.type)) {
        throw new Error(`Node type ${node.type} is already registered`);
      }
      this.nodes.set(node.type, node);
    }
  
    getNode(type: string): AbstractNodeExecutor | undefined {
      return this.nodes.get(type);
    }
  
    hasNode(type: string): boolean {
      return this.nodes.has(type);
    }
  
    clear(): void {
      this.nodes.clear();
    }
  }
  