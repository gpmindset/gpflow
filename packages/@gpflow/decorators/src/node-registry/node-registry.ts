import {NodeConstructor} from "@gpflow/core";
import { NodeRegistry } from "@gpflow/core";

export const RegisterNode = (): ClassDecorator => (target) => {
    const node = target as unknown as NodeConstructor
    NodeRegistry.registerNode(node);
}