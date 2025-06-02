import { IExecutionContext } from "@/interfaces/engine.interface";
import Handlebars from "handlebars";
import { HandlebarsContext, ResolvableValue, ResolvedValue } from "./types";

export class Parser {
    private context: IExecutionContext;
    private handleBarsContext: HandlebarsContext;

    constructor(context: IExecutionContext) {
        this.context = context;
        this.handleBarsContext = this.buildHandleBarsContext();
    }

    private buildHandleBarsContext() {

        const { nodeResults, secrets, variables } = this.context;

        const node: Record<string, { output: ResolvedValue }> = {};

        Object.entries(nodeResults).forEach(([id, result]) => {
            node[id] = { output: result };
        });

        const resolvedSecrets: Record<string, string> = {};
        Object.entries(secrets).forEach(([key, value]) => {
            if (typeof value === 'string' && value.startsWith('@secret:')) {
                const refKey = value.slice(8); // remove '@secret:'
                resolvedSecrets[key] = secrets[refKey] || '';
            } else {
                resolvedSecrets[key] = value;
            }
        });

        return {
            node,
            secrets: resolvedSecrets,
            variables
        };
    }

    parse(parameters: ResolvableValue): ResolvedValue {
        if (typeof parameters === 'string' && parameters.includes('{{')) {
            try {
                const template = Handlebars.compile(parameters);
                return template(this.handleBarsContext);
            } catch {
                return parameters;
            }
        } else if (Array.isArray(parameters)) {
            return parameters.map(item => this.parse(item));
        } else if (typeof parameters === 'object' && parameters !== null) {
            const resolved: Record<string, ResolvedValue> = {};
            for (const [key, value] of Object.entries(parameters)) {
                resolved[key] = this.parse(value);
            }
            return resolved;
        } else {
            return parameters;
        }
    }
}
