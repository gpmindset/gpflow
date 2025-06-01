"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const di_1 = require("@gpflow/di");
const controller_registry_1 = require("@/registry/controller.registry");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("./controllers/check.controller");
const pino_http_1 = require("pino-http");
let Server = class Server {
    app;
    server;
    httpLogger;
    constructor() {
        this.app = (0, express_1.default)();
    }
    get isDev() {
        return process.env.NODE_ENV !== "production";
    }
    setupRequestLoggerMiddleware() {
        const { isDev } = this;
        this.httpLogger = (0, pino_http_1.pinoHttp)({
            transport: isDev
                ? {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        singleLine: false,
                        ignore: 'pid,hostname'
                    },
                }
                : undefined,
            redact: {
                paths: ["req.headers.authorization", "req.body.password"],
                censor: "[REDACTED]",
            },
            serializers: {
                req(req) {
                    return {
                        method: req.method,
                        url: req.url,
                        params: req.params,
                        query: req.query,
                        body: req.body,
                    };
                },
                res(res) {
                    return {
                        statusCode: res.statusCode,
                    };
                },
            },
            customSuccessMessage(_, res) {
                return `✔️\u00A0${res.req.method} ${res.req.url} - ${res.statusCode}`;
            },
            customErrorMessage(_, res, error) {
                return `❌\u00A0${res.req.method} ${res.req.url} - ${error.message}`;
            },
        });
    }
    setupCommonMiddlewares() {
        this.app.set("trust proxy", true);
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use(this.httpLogger);
        this.app.use(express_1.default.json({ limit: "1mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
    }
    configure() {
        const { app } = this;
        this.setupRequestLoggerMiddleware();
        this.setupCommonMiddlewares();
        // Activate registered controllers
        di_1.Container.resolve(controller_registry_1.ControllerRegistry).activate(app);
    }
    async start() {
        const { app } = this;
        const { PORT } = process.env;
        this.configure();
        const http = await import("http");
        this.server = http.createServer(app);
        this.server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                console.info(`gpflow's port ${PORT} is already in use. Do you have another instance of n8n running already?`);
                process.exit(1);
            }
        });
        await new Promise((resolve) => this.server.listen(PORT, () => resolve()));
        console.info(`gpflow ready on port ${PORT}`);
    }
};
exports.Server = Server;
exports.Server = Server = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [])
], Server);
