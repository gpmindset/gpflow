import { ISecretProvider } from "@/interfaces/secrets.interface";

export class SecretsManager {
    constructor(private secretProvider: ISecretProvider) {}

    async getSecret(workflowId: string, key: string): Promise<string | undefined> {
        return this.secretProvider.get(workflowId, key);
    }

    async setSecret(workflowId: string, key: string, value: string): Promise<void> {
        return this.secretProvider.set(workflowId, key, value);
    }

    async deleteSecret(workflowId: string, key: string): Promise<void> {
        return this.secretProvider.delete(workflowId, key);
    }

    async listSecrets(workflowId: string): Promise<string[]> {
        return this.secretProvider.list(workflowId);
    }

    async syncSecret(workflowId: string, key: string): Promise<void> {
        if(!await this.secretProvider.get(workflowId, key)) {
            
        }
    }
}