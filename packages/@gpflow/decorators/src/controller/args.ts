import { Container } from "@gpflow/di";
import { Arg, Controller } from "./types";
import { ControllerRegistryMetaData } from "./controller-registry-metadata";

const ArgDecorator =
	(arg: Arg): ParameterDecorator =>
	(target, handlerName, parameterIndex) => {
		const routeMetadata = Container.resolve(
			ControllerRegistryMetaData
		).getRoutemetaData(
			target.constructor as Controller,
			String(handlerName)
		);
        routeMetadata.args[parameterIndex] = arg
	};

export const Body = ArgDecorator({ type: 'body' });
export const Query = ArgDecorator({ type: 'query' });
export const Param = (key: string) => ArgDecorator({ type: 'param', key });


