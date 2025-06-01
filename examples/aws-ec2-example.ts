import { Workflow, WorkflowDefinition } from "@gpflow/workflow";


const workflow: WorkflowDefinition = {
    id: 'restart-ec2',
    name: 'Restart EC2 Instance on Failure',
    description: 'Sample workflow',
    secrets: {
      aws_key_id: '@secret:my_key_id',
      aws_secret: '@secret:my_secret_key'
    },
    nodes: [
      {
        id: 'check',
        type: 'aws.ec2.createInstance',
        name: 'Check Instance',
        parameters: {
          instanceId: 'i-1234567890abcdef0'
        },
        secrets: {
          accessKeyId: '@secret:my_key_id',
          secretAccessKey: '@secret:my_secret_key'
        },
        next: []
      },
    ]
};

const engine = new Workflow();
let result = await engine.execute(workflow);
console.log(result);

    