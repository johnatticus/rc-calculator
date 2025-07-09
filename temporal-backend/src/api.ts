import express from 'express';
import { Connection, Client } from '@temporalio/client';
import { rcCalculatorWorkflow } from './workflows/rcCalculator.workflow';

const app = express();
app.use(express.json());

app.post('/start-workflow', async (req, res) => {
  try {
    const { motorKv, voltage, gearRatio, wheelDiameter } = req.body;

    const connection = await Connection.connect();
    const client = new Client({ connection });

    const result = await client.workflow.execute(rcCalculatorWorkflow, {
      taskQueue: 'rc-task-queue',
      args: [{ motorKv, voltage, gearRatio, wheelDiameter }],
      workflowId: `rc-calc-${Date.now()}`,
    });

    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Workflow failed to start' });
  }
});

app.listen(4000, () => {
  console.log('🚀 API server listening on http://localhost:4000');
});
