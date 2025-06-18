import {IExecutionContext} from "@/interfaces/engine.interface";

export interface IAgentTaskQueue {
    add(agentId: string, task: IExecutionContext): void
    get(agentId: string): IExecutionContext | undefined
    has(agentId: string): boolean
    clear(agentId: string): void
}