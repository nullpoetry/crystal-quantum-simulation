import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { RiPlayCircleLine, RiPlayMiniFill, RiPauseMiniFill, RiRestartLine } from "react-icons/ri";

const SimulationControls: React.FC = () => {
  const { 
    simulationStatus, 
    startSimulation, 
    pauseSimulation, 
    resetSimulation 
  } = useSimulation();

  return (
    <div className="rounded-lg bg-quantum-dark/50 p-3">
      <h3 className="font-medium mb-2 flex items-center">
        <RiPlayCircleLine className="mr-1.5" /> Simulation
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Status:</span>
          <span 
            className={`text-sm px-2 py-0.5 rounded ${
              simulationStatus === "running" 
                ? "bg-green-600/20 text-green-400" 
                : simulationStatus === "paused" 
                ? "bg-yellow-600/20 text-yellow-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {simulationStatus === "running" 
              ? "Running" 
              : simulationStatus === "paused" 
              ? "Paused" 
              : "Stopped"}
          </span>
        </div>
        <div className="flex space-x-2">
          <button 
            className="flex-1 bg-quantum-muted hover:bg-opacity-80 rounded px-2 py-1 text-sm"
            onClick={pauseSimulation}
            disabled={simulationStatus !== "running"}
          >
            <RiPauseMiniFill />
          </button>
          <button 
            className="flex-1 bg-quantum-accent text-black hover:bg-opacity-80 rounded px-2 py-1 text-sm"
            onClick={startSimulation}
            disabled={simulationStatus === "running"}
          >
            <RiPlayMiniFill />
          </button>
          <button 
            className="flex-1 bg-quantum-muted hover:bg-opacity-80 rounded px-2 py-1 text-sm"
            onClick={resetSimulation}
          >
            <RiRestartLine />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
