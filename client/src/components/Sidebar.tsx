import React from "react";
import SimulationControls from "./SimulationControls";
import CrystalParameters from "./CrystalParameters";
import VisualizationOptions from "./VisualizationOptions";
import CrystalMetrics from "./CrystalMetrics";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-quantum-panel border-r border-quantum-muted flex flex-col overflow-y-auto">
      <div className="p-4">
        <h2 className="text-quantum-accent font-medium mb-3">Simulation Controls</h2>
        
        <div className="space-y-4">
          <SimulationControls />
          <CrystalParameters />
          <VisualizationOptions />
        </div>
      </div>
      
      <CrystalMetrics />
    </aside>
  );
};

export default Sidebar;
