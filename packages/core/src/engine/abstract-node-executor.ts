import { IExecutionContext, INodeExecutor } from '../interfaces/engine.interface';
import { NodeDefinition, NodeParameters, NodeValidationResult } from '@/types/nodes';

export abstract class AbstractNodeExecutor<T extends NodeParameters = NodeParameters> implements INodeExecutor {
  abstract readonly type: string;

  abstract validateParameters(parameters: T): NodeValidationResult;

  protected abstract getRequiredParameters(): string[];

  abstract execute(
    node: NodeDefinition<T>,
    context: IExecutionContext
  ): Promise<any>;

  protected validateRequiredParameters(
    parameters: T,
    required: string[]
  ): NodeValidationResult {
    const errors: string[] = [];
    for (const param of required) {
      if (parameters[param] === undefined || parameters[param] === null) {
        errors.push(`Missing required parameter: ${param}`);
      }
    }
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
