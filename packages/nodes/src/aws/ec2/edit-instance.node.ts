import { AbstractNodeExecutor, NodeParameters, NodeValidationResult, NodeDefinition } from '@gpflow/core';
import { IExecutionContext } from '@gpflow/core';

export interface EC2EditInstanceParameters extends NodeParameters {
    instanceType: string;
    imageId?: string;
    subnetId?: string;
    securityGroupIds?: string[];
    keyName?: string;
    tags?: Record<string, string>;
}

export interface EC2EditInstanceSecrets {
    accessKeyId: string,
    secretAccessKey: string,
}

export class EC2EditInstanceNode extends AbstractNodeExecutor<EC2EditInstanceParameters> {
    readonly type = 'aws.ec2.editInstance';

    async run(
        node: NodeDefinition<EC2EditInstanceParameters>,
        context: IExecutionContext
    ): Promise<any> {
        // This would use AWS SDK to create the instance
        // For now, return mock data

        const instanceId = `i-${Math.random().toString(36).slice(2, 9)}`;

        return {
            instanceId: node.parameters.instanceId,
            instanceState: 'pending',
            instanceType: node.parameters.instanceType,
            tags: node.parameters.tags || {}
        };
    }
}

declare module "@/index" {
    interface NodeParamsByType {
        "aws.ec2.editInstance": EC2EditInstanceParameters
    }

    interface NodeSecretsByType {
        "aws.ec2.editInstance": EC2EditInstanceSecrets
    }
}
