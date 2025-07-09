import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import styles from '../styles/GearCalculator.module.css';

export default function GearCalculator() {
  const [kv, setKv] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [spur, setSpur] = useState(0);
  const [pinion, setPinion] = useState(0);
  const [tireSize, setTireSize] = useState('');
  const [customTire, setCustomTire] = useState('');
  const [usedTireSize, setUsedTireSize] = useState(0);
  const [estimatedSpeed, setEstimatedSpeed] = useState(0);

  const [serverResult, setServerResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonTireSizes = {
    'Touring (63mm)': 63,
    'Monster Truck (130mm)': 130,
    'SCT (109mm)': 109,
    '1/8 Buggy (110mm)': 110,
    'Custom': -1,
  };

  useEffect(() => {
    const ratio = spur / pinion;
    const wheelCircumference = Math.PI * (usedTireSize / 25.4); // inches
    const rpm = kv * voltage;
    const wheelRpm = rpm / ratio;
    const mph = (wheelRpm * wheelCircumference * 60) / 63360;
    setEstimatedSpeed(isFinite(mph) ? Math.round(mph * 100) / 100 : 0);
  }, [kv, voltage, spur, pinion, usedTireSize]);

  const handleRunWorkflow = async () => {
    setLoading(true);
    setError(null);
    setServerResult(null);
    try {
      const response = await fetch('/start-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motorKv: kv,
          voltage,
          gearRatio: spur / pinion,
          wheelDiameter: usedTireSize / 25.4, // convert mm to inches
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unknown error');
      setServerResult(`Top Speed (from workflow): ${data.result} mph`);
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>RC Gear Calculator</h2>
      <div className={styles.inputs}>
        <div>
          <Label htmlFor="kv">Motor KV</Label>
          <Input
            type="number"
            id="kv"
            value={kv}
            onChange={(e) => setKv(Number(e.target.value))}
          />
        </div>
        <div>
  <Label htmlFor="voltage">Voltage (2S–6S)</Label>
  <Select
    onValueChange={(value) => setVoltage(parseFloat(value))}
    value={voltage.toString()}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select battery type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="7.4">2S (7.4V)</SelectItem>
      <SelectItem value="11.1">3S (11.1V)</SelectItem>
      <SelectItem value="14.8">4S (14.8V)</SelectItem>
      <SelectItem value="22.2">6S (22.2V)</SelectItem>
    </SelectContent>
  </Select>
</div>

        <div>
          <Label htmlFor="spur">Spur Gear</Label>
          <Input
            type="number"
            id="spur"
            value={spur}
            onChange={(e) => setSpur(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="pinion">Pinion Gear</Label>
          <Input
            type="number"
            id="pinion"
            value={pinion}
            onChange={(e) => setPinion(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="tireSize">Tire Size</Label>
          <Select
            value={tireSize}
            onValueChange={(value) => {
              setTireSize(value);
              if (value === 'Custom') {
                setUsedTireSize(Number(customTire) || 0);
              } else {
                setUsedTireSize(commonTireSizes[value]);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tire size" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(commonTireSizes).map((label) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {tireSize === 'Custom' && (
            <Input
              className="mt-2"
              type="number"
              placeholder="Enter custom tire size (mm)"
              value={customTire}
              onChange={(e) => {
                setCustomTire(e.target.value);
                setUsedTireSize(Number(e.target.value));
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.results}>
        <h3>Estimated Top Speed: {estimatedSpeed} mph</h3>
      </div>

      <div className="space-y-2 mt-4">
        <button
          onClick={handleRunWorkflow}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit to Temporal'}
        </button>
        {serverResult && <p className="text-green-600">{serverResult}</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
      </div>
    </div>
  );
}
