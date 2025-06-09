import { AbstractNodeExecutor, NodeParameters, NodeDefinition } from '@gpflow/core';
import { IExecutionContext } from '@gpflow/core';
import {RegisterNode} from "@gpflow/decorators";

export interface GitCloneParameters extends NodeParameters {
   
}

export interface GitCloneSecrets {
    
}

@RegisterNode()
export class GitCloneNode extends AbstractNodeExecutor<GitCloneParameters> {
    readonly type = 'git.clone';

    protected getRequiredSecrets(): string[] {
        return [];
    }

    async run(
        node: NodeDefinition<GitCloneParameters>,
        context: IExecutionContext
    ): Promise<any> {
        // This would use AWS SDK to create the instance
        // For now, return mock data



       
    }
}

declare module "@/index" {

    interface NodeParamsByType {
        "git.clone": GitCloneParameters
    }

    interface NodeSecretsByType {
        "git.clone": GitCloneSecrets
    }
}
