import { AbstractNodeExecutor, NodeParameters, NodeDefinition } from '@gpflow/core';
import { IExecutionContext } from '@gpflow/core';

export interface EC2CreateInstanceParameters extends NodeParameters {
  instanceType: string;
  imageId?: string;
  subnetId?: string;
  securityGroupIds?: string[];
  keyName?: string;
  tags?: Record<string, string>;
}

export class EC2CreateInstanceNode extends AbstractNodeExecutor<EC2CreateInstanceParameters> {
  readonly type = 'aws.ec2.createInstance';
  
  protected getRequiredSecrets(): string[] {
    return ['accessKeyId', 'secretAccessKey'];
  }

  async run(
    node: NodeDefinition<EC2CreateInstanceParameters>,
    context: IExecutionContext
  ): Promise<any> {
    // This would use AWS SDK to create the instance
    // For now, return mock data

    

    const instanceId = `i-${Math.random().toString(36).slice(2, 9)}`;
    
    return {
      instanceId,
      instanceState: 'pending',
      instanceType: node.parameters.instanceType,
      tags: node.parameters.tags || {}      
    };
  }
}

declare module "@/index" {
  interface NodeParamsByType {
      "aws.ec2.createInstance": EC2CreateInstanceParameters
  }
}
