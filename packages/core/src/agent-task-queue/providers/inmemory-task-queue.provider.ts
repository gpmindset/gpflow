import {IAgentTaskQueue} from "@/interfaces/agent-task-queue.interface";
import { IExecutionContext } from "@/interfaces/engine.interface";

export class InMemoryAgentTaskQueue implements IAgentTaskQueue {
    private agents = new Map<string, IExecutionContext>();

    add(agentId: string, task: IExecutionContext): void {
        this.agents.set(agentId, task);
    }
    get(agentId: string): IExecutionContext | undefined {
        return this.agents.get(agentId)
    }
    has(agentId: string): boolean {
        return this.agents.has(agentId)
    }
    clear(agentId: string): void {
        this.agents.delete(agentId);
    }
}