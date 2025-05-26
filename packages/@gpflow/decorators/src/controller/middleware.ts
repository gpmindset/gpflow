import { Container } from '@gpflow/di';

import { ControllerRegistryMetaData } from './controller-registry-metadata';
import type { Controller } from './types';

export const Middleware = (): MethodDecorator => (target, handlerName) => {
	const metadata = Container.resolve(ControllerRegistryMetaData).getControllerMetaData(
		target.constructor as Controller,
	);
	metadata.middlewares.push(String(handlerName));
};
