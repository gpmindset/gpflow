import { Workflow, WorkflowDefinition } from "@gpflow/workflow";


const workflow: WorkflowDefinition = {
    id: 'restart-ec2',
    name: 'Restart EC2 Instance on Failure',
    description: 'Sample workflow',
    secrets: {
      accessKeyId: '@secret:accessKeyId',
      secretAccessKey: '@secret:secretAccessKey'
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
          accessKeyId: '@secret:accessKeyId',
          secretAccessKey: '@secret:secretAccessKey'
        },
        next: ["edit"]
      },
      {
        id: 'edit',
        type: 'aws.ec2.editInstance',
        name: 'Edit Instance',
        parameters: {
          instanceId: '{{node.check.output.instanceId}}',
          instanceType: 't2.micro'
        },
        secrets: {
          accessKeyId: '@secret:accessKeyId',
          secretAccessKey: '@secret:secretAccessKey'
        },
        next: []
      },
    ]
};

const engine = new Workflow();
let result = await engine.execute(workflow, {
  secrets: {
    accessKeyId: 'drcsvyghbu',
    secretAccessKey: 'hbhjdbhbdhudbb'
  }
});
console.log(result);

    