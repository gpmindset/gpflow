import { RequestHandler } from "express";
import { Constructable } from "@gpflow/di"

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RateLimit {
	/**
	 * The maximum number of requests to allow during the `window` before rate limiting the client.
	 * @default 5
	 */
	limit?: number;
	/**
	 * How long we should remember the requests.
	 * @default 300_000 (5 minutes)
	 */
	windowMs?: number;
}

export type Arg = { type: 'body' | 'query' } | { type: 'param'; key: string };

export interface RouteMetaData {
    path: string;
    method: Method;
    propertyKey: string;
    middlewares: RequestHandler[];
    skipAuth: boolean;
	rateLimit?: boolean | RateLimit;
    args: Arg[];
}

export type HandlerName = string;

export interface ControllerMetaData {
    basePath: `/${string}`;
    middlewares: HandlerName[]
    routes: Map<HandlerName, RouteMetaData>;
}

export type Controller = Constructable<object> &
	Record<HandlerName, (...args: unknown[]) => Promise<unknown>>;