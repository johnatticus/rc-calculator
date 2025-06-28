import { useState } from "react";
import styles from "../styles/GearCalculator.module.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const tirePresets: Record<string, number> = {
  "Touring (63mm)": 63,
  "Stadium/SCT (90mm)": 90,
  "Monster (130mm)": 130,
  "Custom": 0,
};

export default function GearCalculator() {
  const [spur, setSpur] = useState(83);
  const [pinion, setPinion] = useState(25);
  const [kv, setKv] = useState(4000);
  const [voltage, setVoltage] = useState(7.4);
  const [tireSize, setTireSize] = useState(90);
  const [customTire, setCustomTire] = useState(90);

  const isCustom = tireSize === 0;
  const usedTireSize = isCustom ? customTire : tireSize;

  const gearRatio = spur / pinion;
  const motorRPM = kv * voltage;
  const wheelRPM = motorRPM / gearRatio;
  const tireCircumferenceMm = Math.PI * usedTireSize;
  const topSpeedKmh = (tireCircumferenceMm * wheelRPM * 60) / 1_000_000;
  const topSpeedMph = topSpeedKmh * 0.621371;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="spur">Spur Gear Teeth</Label>
        <Input id="spur" type="number" value={spur} onChange={(e) => setSpur(Number(e.target.value))} />
      </div>

      <div>
        <Label htmlFor="pinion">Pinion Gear Teeth</Label>
        <Input id="pinion" type="number" value={pinion} onChange={(e) => setPinion(Number(e.target.value))} />
      </div>

      <div>
        <Label htmlFor="kv">Motor kV</Label>
        <Input id="kv" type="number" value={kv} onChange={(e) => setKv(Number(e.target.value))} />
      </div>

      <div>
        <Label htmlFor="voltage">Battery Voltage (V)</Label>
        <Input id="voltage" type="number" step="0.1" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
      </div>

      <div>
        <Label htmlFor="tireSize">Tire Size</Label>
        <Select onValueChange={(val) => setTireSize(Number(tirePresets[val]))} defaultValue="Stadium/SCT (90mm)">
          <SelectTrigger>
            <SelectValue placeholder="Select Tire Size" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(tirePresets).map(([label, val]) => (
              <SelectItem key={label} value={label}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isCustom && (
          <div className="mt-2">
            <Label htmlFor="customTire">Custom Tire Diameter (mm)</Label>
            <Input id="customTire" type="number" value={customTire} onChange={(e) => setCustomTire(Number(e.target.value))} />
          </div>
        )}
      </div>

      <div className={styles.results}>
        <p><strong>Gear Ratio:</strong> {gearRatio.toFixed(2)}</p>
        <p><strong>Estimated Top Speed:</strong> {topSpeedKmh.toFixed(1)} km/h ({topSpeedMph.toFixed(1)} mph)</p>
      </div>
    </div>
  );
}
