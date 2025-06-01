import express from "express";
import type { Server as HTTPServer } from "http";
import "./controllers/check.controller";
import { HttpLogger } from "pino-http";
export declare class Server {
    readonly app: express.Application;
    protected server: HTTPServer;
    protected httpLogger: HttpLogger;
    constructor();
    get isDev(): boolean;
    private setupRequestLoggerMiddleware;
    private setupCommonMiddlewares;
    private configure;
    start(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map