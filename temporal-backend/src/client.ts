import { Connection, Client } from '@temporalio/client';
import { rcCalculatorWorkflow } from './workflows/rcCalculator.workflow';

async function run() {
  const connection = await Connection.connect(); // defaults to localhost:7233

  const client = new Client({ connection });

  const result = await client.workflow.execute(rcCalculatorWorkflow, {
    taskQueue: 'rc-task-queue',
    args: [{ voltage: 11.1, motorKv: 3200, gearRatio: 3.11, wheelDiameter: 4 }],
    workflowId: 'rc-calc-001',
  });

  console.log('Workflow result:', result);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
