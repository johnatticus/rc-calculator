import GearCalculator from "./components/GearCalculator";

export default function App() {
  return (
    <main className="min-h-screen p-4 bg-background text-foreground">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          RC Gear Ratio & Speed Calculator
        </h1>
        <GearCalculator />
      </div>
    </main>
  );
}