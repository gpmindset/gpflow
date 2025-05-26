import { RequestHandler } from "express";
import { Controller, Method, RateLimit } from "./types";
import { Container } from "@gpflow/di";
import { ControllerRegistryMetaData } from "./controller-registry-metadata";

interface RouteOptions {
	middlewares?: RequestHandler[];
	skipAuth?: boolean;
	rateLimit?: boolean | RateLimit;
}

const RouteFactory =
	(method: Method) =>
	(path: `/${string}`, options: RouteOptions = {}): MethodDecorator =>
	(target, handlerName) => {
		const routeMetadata = Container.resolve(
			ControllerRegistryMetaData
		).getRoutemetaData(
			target.constructor as Controller,
			String(handlerName)
		);
        routeMetadata.method = method;
		routeMetadata.path = path;
		routeMetadata.middlewares = options.middlewares ?? [];
		routeMetadata.skipAuth = options.skipAuth ?? false;
		routeMetadata.rateLimit = options.rateLimit;
	};

export const Get = RouteFactory('get');
export const Post = RouteFactory('post');
export const Put = RouteFactory('put');
export const Patch = RouteFactory('patch');
export const Delete = RouteFactory('delete');
