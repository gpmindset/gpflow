import {Body, Post, RestController} from "@gpflow/decorators";
import type { Request, Response } from "express";
import {AgentService} from "@/services/agent.service";
import type {AgentPollDto, AgentResultDto} from "@/dto/poll.dto";

@RestController("/agent-task-queue")
export class AgentController {
    constructor(
        private agentService: AgentService
    ){}

    @Post("/poll")
    async agentPoll(_req: Request, _res: Response, @Body poll: AgentPollDto){
        return await this.agentService.agentPoll(poll)
    }

    @Post("/result")
    async agentResult(_req: Request, _res: Response, @Body poll: AgentResultDto){
       return await this.agentService.agentResult(poll)
    }
}