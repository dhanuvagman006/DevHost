"use client";
import { ChartCard } from "@/components/ui/ChartCard";
import WeatherWidget from "@/components/widgets/WeatherWidget";
//import InventoryTable from "@/features/Inventory/InventoryTable";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Retail Dashboard</h1>
      <WeatherWidget />
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* <InventoryTable /> */}
      </div>
    </div>
  );
}
