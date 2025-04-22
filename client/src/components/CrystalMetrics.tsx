import React from "react";
import { useSimulation } from "@/context/SimulationContext";

const CrystalMetrics: React.FC = () => {
  const { metrics } = useSimulation();

  return (
    <div className="mt-auto border-t border-quantum-muted">
      <div className="p-4">
        <h3 className="text-sm text-gray-400 mb-2">System Metrics</h3>
        <div className="font-mono text-xs space-y-1.5">
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{metrics.time.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phase:</span>
            <span>{metrics.phase.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Energy:</span>
            <span>{metrics.energy.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Entropy:</span>
            <span>{metrics.entropy.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Resonance:</span>
            <span>{metrics.resonance.toFixed(2)} Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrystalMetrics;
