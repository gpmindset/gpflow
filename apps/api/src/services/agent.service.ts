import { Service } from "@gpflow/di";
import {AgentPollDto, AgentResultDto} from "@/dto/poll.dto";
import { AgentQueue } from "@gpflow/workflow"

@Service()
export class AgentService {
    async agentPoll(poll: AgentPollDto): Promise<any> {
        const { agentId } = poll;
        if (!AgentQueue.hasAgent(agentId)) {

        }
        return AgentQueue
    }

    async agentResult(poll: AgentResultDto) {
        return { status: "Okay" };
    }
}