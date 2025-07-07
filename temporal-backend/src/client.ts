import { Connection, Client } from '@temporalio/client';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { rcCalculatorWorkflow } from './workflows/rcCalculator.workflow';

const argv = yargs(hideBin(process.argv))
  .option('motorKv', {
    type: 'number',
    demandOption: true,
    describe: 'Motor KV rating',
  })
  .option('voltage', {
    type: 'number',
    demandOption: true,
    describe: 'Battery voltage',
  })
  .option('gearRatio', {
    type: 'number',
    demandOption: true,
    describe: 'Final drive gear ratio',
  })
  .option('wheelDiameter', {
    type: 'number',
    demandOption: true,
    describe: 'Wheel diameter in inches',
  })
  .parseSync();

async function run() {
  const connection = await Connection.connect(); // default: localhost:7233
  const client = new Client({ connection });

  const result = await client.workflow.execute(rcCalculatorWorkflow, {
    taskQueue: 'rc-task-queue',
    args: [{
      motorKv: argv.motorKv,
      voltage: argv.voltage,
      gearRatio: argv.gearRatio,
      wheelDiameter: argv.wheelDiameter,
    }],
    workflowId: `rc-calc-${Date.now()}`,
  });

  console.log('🚀 Workflow result:', result);
}

run().catch((err) => {
  console.error('❌ Workflow failed:', err);
  process.exit(1);
});
