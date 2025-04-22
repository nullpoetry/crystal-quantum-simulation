import React from "react";
import { RiBubbleChartLine } from "react-icons/ri";
import { useSimulation } from "@/context/SimulationContext";
import { Slider } from "@/components/ui/slider";

const CrystalParameters: React.FC = () => {
  const { 
    crystalParams, 
    updateNodeCount, 
    updateCouplingStrength, 
    updateOscillationPeriod 
  } = useSimulation();

  return (
    <div className="rounded-lg bg-quantum-dark/50 p-3">
      <h3 className="font-medium mb-2 flex items-center">
        <RiBubbleChartLine className="mr-1.5" /> Crystal Parameters
      </h3>
      <div className="space-y-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Nodes</label>
          <Slider
            min={10}
            max={100}
            step={1}
            value={[crystalParams.nodes]}
            onValueChange={(value) => updateNodeCount(value[0])}
            className="w-full h-2"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>10</span>
            <span>{crystalParams.nodes}</span>
            <span>100</span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Coupling Strength</label>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[crystalParams.couplingStrength]}
            onValueChange={(value) => updateCouplingStrength(value[0])}
            className="w-full h-2"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>0.0</span>
            <span>{crystalParams.couplingStrength.toFixed(1)}</span>
            <span>1.0</span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Oscillation Period</label>
          <Slider
            min={0.5}
            max={5}
            step={0.5}
            value={[crystalParams.oscillationPeriod]}
            onValueChange={(value) => updateOscillationPeriod(value[0])}
            className="w-full h-2"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>0.5</span>
            <span>{crystalParams.oscillationPeriod.toFixed(1)}</span>
            <span>5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrystalParameters;
