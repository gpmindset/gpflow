import {IExecutionContext} from "@/interfaces/engine.interface";
import {AxiosInstance} from "axios";

export class AgentClient {
    private readonly http: AxiosInstance;

    constructor() {
        this.http = axios.create({})
    }

    public sendToAgent(context: IExecutionContext) {}
}