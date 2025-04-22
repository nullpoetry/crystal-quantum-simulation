import React from "react";
import QuantumCrystalVisualization from "./QuantumCrystalVisualization";
import FloatingControls from "./FloatingControls";
import MIDIController from "./MIDIController";

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 relative">
      <QuantumCrystalVisualization />
      <FloatingControls />
      <MIDIController />
    </main>
  );
};

export default MainContent;
