import {config} from "dotenv";
import { homedir } from "os"
import {pollForTasks} from "@/poller";

const isDev = process.env.NODE_ENV !== "production"

const envPath = isDev ? ".env" : `${homedir()}/.gpflow/.gpflow.env`;

config({ path: envPath })

async function startPolling(): Promise<void> {
    console.log(`${process.env.AGENT_ID} [Agent] starting...`)
    while (true) {
        try {
            await pollForTasks()
        } catch (e) {
            throw new Error("[Agent] Polling error", e as Error);
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

startPolling().then(() => {
    console.log(`${process.env.AGENT_ID} [Agent] started polling...`)
}).catch((e => {
    console.error(`${process.env.AGENT_ID} [Agent] failed to start polling...`, e)
}));