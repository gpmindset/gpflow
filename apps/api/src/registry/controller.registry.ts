import { Controller, ControllerRegistryMetaData } from "@gpflow/decorators";
import { Container, Service } from "@gpflow/di";
import { Application, Request, RequestHandler, Response, Router } from "express";
import { send } from "@/utils/response.helper";
import { ZodClass } from "zod-class"

@Service()
export class ControllerRegistry {
	constructor(private readonly metadata: ControllerRegistryMetaData) {}

	activate(app: Application) {
		for (const controllerClass of this.metadata.controllerClasses) {
            this.activateController(app, controllerClass)
		}
	}

	private activateController(app: Application, controllerClass: Controller) {
		const metadata = this.metadata.getControllerMetaData(controllerClass);

		const router = Router({ mergeParams: true });

		const prefix = `/${metadata.basePath}`
			.replace(/\/+/g, "/")
			.replace(/\/$/, "");

		app.use(prefix, router);

		const controller = Container.resolve(controllerClass) as Controller;
		const controllerMiddlewares = metadata.middlewares.map(
			(handlerName) =>
				controller[handlerName]?.bind(controller) as RequestHandler
		);

        for(const [handlerName, route] of metadata.routes) {
            const argTypes = Reflect.getMetadata(
				'design:paramtypes',
				controller,
				handlerName,
			) as unknown[];

			const handler = async (req: Request, res: Response) => {
				const args: unknown[] = [req, res];
				for (let index = 0; index < route.args.length; index++) {
                    const arg = route.args[index];
					if (!arg) continue;
					if (arg.type === 'param') args.push(req.params[arg.key]);
					else if (['body', 'query'].includes(arg.type)) {
						const paramType = argTypes[index] as ZodClass;
						if (paramType && 'safeParse' in paramType) {
							const output = paramType.safeParse(req[arg.type]);
							if (output.success) args.push(output.data);
							else {
								return res.status(400).json(output.error.errors[0]);
							}
						}
					} else throw new Error('Unknown arg type: ' + arg.type);
				}
				return await controller[handlerName]?.(...args);
			};

			router[route.method](
				route.path,
                // TODO: Implement Production Environment
				// ...(inProduction && route.rateLimit
				// 	? [this.createRateLimitMiddleware(route.rateLimit)]
				// 	: []),

                // TODO: Implement Auth
				// ...(route.skipAuth ? [] : [this.authService.authMiddleware]),

				...controllerMiddlewares,
				...route.middlewares,
				send(handler),
			);
        }


	}
}
