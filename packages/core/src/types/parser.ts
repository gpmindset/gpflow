import { IExecutionContext } from "@/interfaces/engine.interface";

export interface HandlebarsContext {
    node: Record<string, { output: any }>;
    secrets: Record<string, string>;
    variables: Record<string, any>;
}


export type ResolvableValue =
    | string
    | number
    | boolean
    | null
    | ResolvableValue[]
    | { [key: string]: ResolvableValue }
    | undefined;

export type ResolvedValue =
    | string
    | number
    | boolean
    | null
    | ResolvedValue[]
    | { [key: string]: ResolvedValue }
    | undefined;

    
export type ParserConstructorOptions = {
    context: IExecutionContext;
    secretResolver: (key: string) => Promise<string | undefined>;
};
    