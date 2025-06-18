import * as process from "node:process";
import {postCall} from "@/api";
import {IExecutionContext} from "@gpflow/core";
import {AgentWorkflowRunner} from "@/agent/workflow-runner";

const AGENT_ID = process.env.AGENT_ID || "agent_dev"

export async function pollForTasks() {
    const { data } = await postCall<IExecutionContext>("/agent/poll", { agentId: AGENT_ID })

    const agentRunner = new AgentWorkflowRunner()
    const result = await agentRunner.execute(data)

    await postCall("/agent/result", {agentId: AGENT_ID, agentExecutionId: data.workflow.id, result: result})
}