import { Worker } from '@temporalio/worker';
import * as activities from './activities/calculateTopSpeed';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/rcCalculator.workflow'),
    activities,
    taskQueue: 'rc-task-queue',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
