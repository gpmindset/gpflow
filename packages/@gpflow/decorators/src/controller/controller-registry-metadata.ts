import { Service } from "@gpflow/di";
import { Controller } from "./types";
import { ControllerMetaData } from "./types";
import { HandlerName } from "./types";
import { RouteMetaData } from "./types";

@Service()
export class ControllerRegistryMetaData {
    private registry = new Map<Controller,ControllerMetaData>();

    getControllerMetaData(controllerClass: Controller) {
        let metadata = this.registry.get(controllerClass)
        if(!metadata) {
            metadata = {
                basePath: "/",
                middlewares: [],
                routes: new Map()
            }
            this.registry.set(controllerClass, metadata)
        }
        return metadata
    }

    getRoutemetaData(controllerClass: Controller, handlerName: HandlerName) {
        const metadata = this.getControllerMetaData(controllerClass)
        let route = metadata.routes.get(handlerName)
        if(!route) {
            route = {} as RouteMetaData
			route.args = [];
            metadata.routes.set(handlerName, route)
        }
        return route
    }

    get controllerClasses() {
        return this.registry.keys()
    }
}