import { AbstractNodeExecutor, NodeParameters, NodeValidationResult, NodeDefinition } from '@gpflow/core';
import { IExecutionContext } from '@gpflow/core';

export interface EC2CreateInstanceParameters extends NodeParameters {
  instanceType: string;
  imageId: string;
  subnetId: string;
  securityGroupIds: string[];
  keyName?: string;
  tags?: Record<string, string>;
}

export class EC2CreateInstanceNode extends AbstractNodeExecutor<EC2CreateInstanceParameters> {
  readonly type = 'aws.ec2.createInstance';

  getRequiredParameters(): string[] {
    return [];
  }

  validateParameters(parameters: EC2CreateInstanceParameters): NodeValidationResult {
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

  async execute(
    node: NodeDefinition<EC2CreateInstanceParameters>,
    context: IExecutionContext
  ): Promise<any> {
    // This would use AWS SDK to create the instance
    // For now, return mock data

    console.log(context, "Context");
    const instanceId = `i-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      instanceId,
      instanceState: 'pending',
      instanceType: node.parameters.instanceType,
      tags: node.parameters.tags || {}
    };
  }
}
