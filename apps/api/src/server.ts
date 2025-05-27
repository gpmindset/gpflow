import { Container, Service } from "@gpflow/di";
import { ControllerRegistry } from "@/registry/controller.registry";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import type { Server as HTTPServer } from "http";

import "./controllers/check.controller";
import { HttpLogger, pinoHttp } from "pino-http";

@Service()
export class Server {
	readonly app: express.Application;
	protected server!: HTTPServer;
	protected httpLogger!: HttpLogger;

	constructor() {
		this.app = express();
	}

	get isDev() {
		return process.env.NODE_ENV !== "production";
	}

	private setupRequestLoggerMiddleware() {
		const { isDev } = this;

		this.httpLogger = pinoHttp({
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

	private setupCommonMiddlewares() {
		this.app.set("trust proxy", true);

		this.app.use(cors());

		this.app.use(helmet());

		this.app.use(compression());

		this.app.use(this.httpLogger);

		this.app.use(express.json({ limit: "1mb" }));
		this.app.use(express.urlencoded({ extended: true }));

		this.app.use(cookieParser());
	}

	private configure() {
		const { app } = this;

		this.setupRequestLoggerMiddleware();
		this.setupCommonMiddlewares();

		// Activate registered controllers
		Container.resolve(ControllerRegistry).activate(app);
	}

	async start() {
		const { app } = this;

		const { PORT } = process.env;

		this.configure();

		const http = await import("http");
		this.server = http.createServer(app);

		this.server.on("error", (error: Error & { code: string }) => {
			if (error.code === "EADDRINUSE") {
				console.info(
					`gpflow's port ${PORT} is already in use. Do you have another instance of n8n running already?`
				);
				process.exit(1);
			}
		});

		await new Promise<void>((resolve) =>
			this.server.listen(PORT, () => resolve())
		);

		console.info(`gpflow ready on port ${PORT}`);
	}
}
