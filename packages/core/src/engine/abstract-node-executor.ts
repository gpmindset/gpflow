import { IExecutionContext, INodeExecutor } from '../interfaces/engine.interface';
import { NodeDefinition, NodeParameters, NodeValidationResult } from '@/types/nodes';

export abstract class AbstractNodeExecutor<T extends NodeParameters = NodeParameters> implements INodeExecutor {
  abstract readonly type: string;

  validateParameters(parameters: T): NodeValidationResult {
    return { isValid: true };
  }

  validate(parameters: T, secrets: Record<string, string>): NodeValidationResult {
    const validation = this.validateRequiredParameters(parameters);
    if (!validation.isValid) {
      return validation;
    }

    const secretsValidation = this.validateRequiredSecrets(secrets);
    if (!secretsValidation.isValid) {
      return secretsValidation;
    }

    return this.validateParameters(parameters);
  }

  protected getRequiredSecrets(): string[] {
    return [];
  }

  protected getRequiredParameters(): string[] {
    return [];
  }

  getNext(
    node: NodeDefinition<T>,
    result: any,
  ): string | undefined {
    return undefined;
  }

  abstract run(
    node: NodeDefinition<T>,
    context: IExecutionContext
  ): Promise<any>;

  async execute(
    node: NodeDefinition<T>,
    context: IExecutionContext
  ): Promise<any> {
    const result = await this.run(node, context);
    const next = this.getNext(node, result);
    return { result, next };
  }

  private validateRequiredParameters(
    parameters: T,
  ): NodeValidationResult {
    const requiredParams = this.getRequiredParameters();
    const missingParams = requiredParams.filter(param => !parameters[param]);

    if (missingParams.length > 0) {
      return {
        isValid: false,
        errors: missingParams.map(param => `Missing required parameter: ${param}`)
      };
    }

    return { isValid: true };
  }

  private validateRequiredSecrets(
    secrets: Record<string, string>,
  ): NodeValidationResult {
    const requiredSecrets = this.getRequiredSecrets();
    const missingSecrets = requiredSecrets.filter(secret => !secrets[secret]);

    if (missingSecrets.length > 0) {
      return {
        isValid: false,
        errors: missingSecrets.map(secret => `Missing required secret: ${secret}`)
      };
    }

    return { isValid: true };
  }
}
