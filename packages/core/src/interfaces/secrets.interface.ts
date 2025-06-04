export interface ISecretProvider {
    get(workflowId: string, key: string): Promise<string | undefined>;
    set(workflowId: string, key: string, value: string): Promise<void>;
    delete(workflowId: string, key: string): Promise<void>;
    list(workflowId: string): Promise<string[]>;
}