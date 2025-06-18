import {IAgentTaskQueue} from "@/interfaces/agent-task-queue.interface";
import {IExecutionContext} from "@/interfaces/engine.interface";
import {InMemoryAgentTaskQueue} from "@/agent-task-queue/providers/inmemory-task-queue.provider";

class AgentTaskQueue {
    constructor(private readonly agentTaskQueue: IAgentTaskQueue) {}

    addToQueue(agentId: string, task: IExecutionContext): void {
        this.agentTaskQueue.add(agentId, task);
    }

    getFromQueue(agentId: string): IExecutionContext | undefined {
        return this.agentTaskQueue.get(agentId);
    }

    hasAgent(agentId: string): boolean {
        return this.agentTaskQueue.has(agentId)
    }

    clearFromQueue(agentId: string): void {
        this.agentTaskQueue.clear(agentId);
    }
}

export const AgentQueue = new AgentTaskQueue(new InMemoryAgentTaskQueue());