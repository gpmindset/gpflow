import { IExecutionContext } from "@/interfaces/engine.interface";

/**
 * Generic type for context value validation
 */
export interface ContextValidator<T> {
    validate(value: T): boolean;
}

/**
 * Base context entry structure
 */
export interface ContextEntry<T> {
    value: T;
    timestamp: number;
    validator?: ContextValidator<T>;
}

/**
 * Base workflow context structure
 */
export interface BaseWorkflowContext extends IExecutionContext {}

