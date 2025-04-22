import React from "react";
import { 
  RiZoomInLine, 
  RiZoomOutLine, 
  RiCompass3Line 
} from "react-icons/ri";
import { useSimulation } from "@/context/SimulationContext";

const FloatingControls: React.FC = () => {
  const { zoomIn, zoomOut, resetView } = useSimulation();

  return (
    <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
      <button 
        className="w-10 h-10 rounded-full bg-quantum-panel border border-quantum-muted flex items-center justify-center text-quantum-accent hover:bg-quantum-muted"
        onClick={zoomIn}
        title="Zoom In"
      >
        <RiZoomInLine />
      </button>
      <button 
        className="w-10 h-10 rounded-full bg-quantum-panel border border-quantum-muted flex items-center justify-center text-quantum-accent hover:bg-quantum-muted"
        onClick={zoomOut}
        title="Zoom Out"
      >
        <RiZoomOutLine />
      </button>
      <button 
        className="w-10 h-10 rounded-full bg-quantum-panel border border-quantum-muted flex items-center justify-center text-quantum-accent hover:bg-quantum-muted"
        onClick={resetView}
        title="Reset View"
      >
        <RiCompass3Line />
      </button>
    </div>
  );
};

export default FloatingControls;
