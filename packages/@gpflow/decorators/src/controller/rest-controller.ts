import { Container, Service } from "@gpflow/di";
import { ControllerRegistryMetaData } from "./controller-registry-metadata";
import { Controller } from "./types";

export const RestController =
	(basePath: `/${string}` = "/"): ClassDecorator =>
	(target) => {
		const metadata = Container.resolve(
			ControllerRegistryMetaData
		).getControllerMetaData(target as unknown as Controller);
        
        metadata.basePath = basePath

        return Service()(target as unknown as Controller)
	};
