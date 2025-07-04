export async function calculateTopSpeed({
  motorKv,
  voltage,
  gearRatio,
  wheelDiameter,
}: {
  motorKv: number;
  voltage: number;
  gearRatio: number;
  wheelDiameter: number; // in inches
}): Promise<number> {
  const rpm = motorKv * voltage;
  const wheelCircumference = Math.PI * wheelDiameter; // inches
  const wheelRPM = rpm / gearRatio;
  const speedMph = (wheelRPM * wheelCircumference * 60) / 63360; // inches/min → miles/hr
  return Math.round(speedMph * 100) / 100;
}
