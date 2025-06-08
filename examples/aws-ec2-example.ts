import { Workflow } from "@gpflow/workflow";
import {WorkflowBuilder, NodeBuilder} from "@gpflow/workflow";


const builder = WorkflowBuilder.createWithTracking("restart-ec2");

const createInstanceBuilder = NodeBuilder.create("aws.ec2.createInstance").parameters({
  instanceType: 't2-micro'
})

const editInstanceBuilder = NodeBuilder.create("aws.ec2.editInstance").parameters({
  instanceType: 't2-micro'
})

const workflow = builder
                  .addNode(createInstanceBuilder)
                  .addNode(editInstanceBuilder)
                  .globalSecrets({
                    accessKeyId: "@secret:my_key",
                    secretAccessKey: "@secret:my_secret",
                  })
                  .build();

const engine = new Workflow();
let result = await engine.execute(workflow, {
  secrets: {
    my_key: 'fsaf567jkdbk9jdbgt',
    my_secret: "5ghkskh538bkdjb"
  }
});
console.log(result);

    