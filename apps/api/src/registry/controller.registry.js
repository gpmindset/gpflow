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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerRegistry = void 0;
const decorators_1 = require("@gpflow/decorators");
const di_1 = require("@gpflow/di");
const express_1 = require("express");
const response_helper_1 = require("@/utils/response.helper");
let ControllerRegistry = class ControllerRegistry {
    metadata;
    constructor(metadata) {
        this.metadata = metadata;
    }
    activate(app) {
        for (const controllerClass of this.metadata.controllerClasses) {
            this.activateController(app, controllerClass);
        }
    }
    activateController(app, controllerClass) {
        const metadata = this.metadata.getControllerMetaData(controllerClass);
        const router = (0, express_1.Router)({ mergeParams: true });
        const prefix = `/${metadata.basePath}`
            .replace(/\/+/g, "/")
            .replace(/\/$/, "");
        app.use(prefix, router);
        const controller = di_1.Container.resolve(controllerClass);
        const controllerMiddlewares = metadata.middlewares.map((handlerName) => controller[handlerName]?.bind(controller));
        for (const [handlerName, route] of metadata.routes) {
            const argTypes = Reflect.getMetadata('design:paramtypes', controller, handlerName);
            const handler = async (req, res) => {
                const args = [req, res];
                for (let index = 0; index < route.args.length; index++) {
                    const arg = route.args[index];
                    if (!arg)
                        continue;
                    if (arg.type === 'param')
                        args.push(req.params[arg.key]);
                    else if (['body', 'query'].includes(arg.type)) {
                        const paramType = argTypes[index];
                        if (paramType && 'safeParse' in paramType) {
                            const output = paramType.safeParse(req[arg.type]);
                            if (output.success)
                                args.push(output.data);
                            else {
                                return res.status(400).json(output.error.errors[0]);
                            }
                        }
                    }
                    else
                        throw new Error('Unknown arg type: ' + arg.type);
                }
                return await controller[handlerName]?.(...args);
            };
            router[route.method](route.path, 
            // TODO: Implement Production Environment
            // ...(inProduction && route.rateLimit
            // 	? [this.createRateLimitMiddleware(route.rateLimit)]
            // 	: []),
            // TODO: Implement Auth
            // ...(route.skipAuth ? [] : [this.authService.authMiddleware]),
            ...controllerMiddlewares, ...route.middlewares, (0, response_helper_1.send)(handler));
        }
    }
};
exports.ControllerRegistry = ControllerRegistry;
exports.ControllerRegistry = ControllerRegistry = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [decorators_1.ControllerRegistryMetaData])
], ControllerRegistry);
