import { IExecutionContext, IExecutionResult, IWorkflow } from '@/interfaces/engine.interface';

export abstract class AbstractWorkflowExecutor<T> {
  abstract executeWorkflow(workflow: T): Promise<IExecutionResult>;
  
  protected abstract validateWorkflow(workflow: IWorkflow): void;
  
  protected abstract transformWorkflow(workflow: T): IExecutionContext
}
