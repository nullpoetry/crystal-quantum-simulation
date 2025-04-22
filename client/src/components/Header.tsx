import React from "react";
import { Button } from "@/components/ui/button";
import { RiBubbleChartFill, RiSettings4Line, RiSaveLine } from "react-icons/ri";
import { useSimulation } from "@/context/SimulationContext";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const { saveSimulationState } = useSimulation();
  const { toast } = useToast();

  const handleSaveState = () => {
    saveSimulationState();
    toast({
      title: "State Saved",
      description: "Simulation state saved successfully",
    });
  };

  const handleOpenSettings = () => {
    toast({
      title: "Settings",
      description: "Settings dialog will be implemented soon",
    });
  };

  return (
    <header className="bg-quantum-panel border-b border-quantum-muted py-2 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <RiBubbleChartFill className="text-quantum-accent text-2xl mr-2" />
        <h1 className="text-xl font-semibold">Quantum Crystal Simulation</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline"
          className="bg-quantum-muted hover:bg-opacity-80 rounded px-3 py-1.5 text-sm flex items-center"
          onClick={handleOpenSettings}
        >
          <RiSettings4Line className="mr-1.5" /> Settings
        </Button>
        <Button 
          className="bg-quantum-accent hover:bg-opacity-80 text-black rounded px-3 py-1.5 text-sm flex items-center"
          onClick={handleSaveState}
        >
          <RiSaveLine className="mr-1.5" /> Save State
        </Button>
      </div>
    </header>
  );
};

export default Header;
