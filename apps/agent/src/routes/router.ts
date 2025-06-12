import { Router, Response, Request } from "express"
import validateToken from "@/middleware";
import { hostname } from "os"
import packageJson from "package.json"
import {IExecutionContext} from "@gpflow/core/src/interfaces/engine.interface";
import {AgentWorkflowRunner} from "@/agent/workflow-runner";

const START_TIME = Date.now() / 1000;

const router = Router();

/*
* Check health of the agent
* */
router.get("/health", (req: Request, res: Response) => {
    try {
        const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000)
        res.status(200).send({
            status: "ok",
            agent: "gpflow-agent",
            version: packageJson.version,
            hostname: hostname(),
            timeStamp: new Date().toISOString(),
            uptime: uptimeSeconds,
            memory: process.memoryUsage().rss,
        })
    } catch (e) {
        res.status(500).send({ error: "Health checking failed" })
    }
})

/*
* Execute nodes in agent
* */
router.post("/execute", validateToken ,async (req: Request, res: Response) => {
    try {
        const { workflow, ctx } = req.body

        const context: IExecutionContext = {
            ...ctx,
            workflow,
        }

        const agentRunner = new AgentWorkflowRunner()
        const result = await agentRunner.execute(context)
        res.status(200).send(result)

    } catch (e) {

    }
})