import { ControllerRegistryMetaData } from "@gpflow/decorators";
import { Application } from "express";
export declare class ControllerRegistry {
    private readonly metadata;
    constructor(metadata: ControllerRegistryMetaData);
    activate(app: Application): void;
    private activateController;
}
//# sourceMappingURL=controller.registry.d.ts.map