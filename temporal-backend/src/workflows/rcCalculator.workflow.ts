import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/calculateTopSpeed';

const { calculateTopSpeed } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
});

export async function rcCalculatorWorkflow(input: {
  motorKv: number;
  voltage: number;
  gearRatio: number;
  wheelDiameter: number;
}) {
  const speed = await calculateTopSpeed(input);
  return speed;
}
