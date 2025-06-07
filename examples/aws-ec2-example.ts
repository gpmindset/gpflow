import { Workflow } from "@gpflow/workflow";
import {WorkflowBuilder, NodeBuilder} from "@gpflow/workflow";


const builder = WorkflowBuilder.createWithTracking("restart-ec2");

const createInstanceBuilder = NodeBuilder.create("aws.ec2.createInstance").parameters({
  instanceType: 't2-micro'
}).secrets({
  accessKeyId: '@secret:accessKeyId',
  secretAccessKey: '@secret:secretAccessKey'
})

const editInstanceBuilder = NodeBuilder.create("aws.ec2.editInstance").parameters({
  instanceType: 't2-micro'
}).secrets({
  accessKeyId: '@secret:accessKeyId',
  secretAccessKey: '@secret:secretAccessKey'
})

const workflow = builder
                  .addNode(createInstanceBuilder)
                  .addNode(editInstanceBuilder)
                  .build();

const engine = new Workflow();
let result = await engine.execute(workflow, {
  secrets: {
    secretAccessKey: "cfvgbhnm,ujmjj"
  }
});
console.log(result);

    