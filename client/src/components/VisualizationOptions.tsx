import React from "react";
import { RiEyeLine } from "react-icons/ri";
import { useSimulation } from "@/context/SimulationContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const VisualizationOptions: React.FC = () => {
  const { 
    displayMode, 
    updateDisplayMode, 
    visualOptions, 
    toggleConnections, 
    toggleParticles, 
    toggleLabels,
    setTreeVortexVisible
  } = useSimulation();

  const handleDisplayModeChange = (value: string) => {
    updateDisplayMode(value as "3d" | "2d" | "tree");
    
    if (value === "tree") {
      setTreeVortexVisible(true);
    }
  };

  return (
    <div className="rounded-lg bg-quantum-dark/50 p-3">
      <h3 className="font-medium mb-2 flex items-center">
        <RiEyeLine className="mr-1.5" /> Visualization
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Display Mode:</span>
          <Select value={displayMode} onValueChange={handleDisplayModeChange}>
            <SelectTrigger className="text-sm bg-quantum-muted border border-quantum-muted rounded w-32 h-8">
              <SelectValue placeholder="3D Crystal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3d">3D Crystal</SelectItem>
              <SelectItem value="2d">2D Layout</SelectItem>
              <SelectItem value="tree">Tree Vortex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showConnections" 
            checked={visualOptions.showConnections} 
            onCheckedChange={toggleConnections} 
          />
          <Label htmlFor="showConnections" className="text-sm">Show Connections</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showParticles" 
            checked={visualOptions.showParticles} 
            onCheckedChange={toggleParticles} 
          />
          <Label htmlFor="showParticles" className="text-sm">Show Particles</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showLabels" 
            checked={visualOptions.showLabels} 
            onCheckedChange={toggleLabels} 
          />
          <Label htmlFor="showLabels" className="text-sm">Show Node Labels</Label>
        </div>
      </div>
    </div>
  );
};

export default VisualizationOptions;
