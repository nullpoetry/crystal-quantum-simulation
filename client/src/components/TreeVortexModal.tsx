import React, { useRef, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useSimulation } from "@/context/SimulationContext";
import { Slider } from "@/components/ui/slider";

const TreeVortexModal: React.FC = () => {
  const { 
    setTreeVortexVisible, 
    treeVortex,
    updateTreeVortexParams
  } = useSimulation();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize tree vortex visualization
    const cleanup = treeVortex.initializeVisualization(canvasRef.current);
    
    return cleanup;
  }, [treeVortex]);
  
  const closeTreeVortex = () => {
    setTreeVortexVisible(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50">
      <div className="absolute top-4 right-4">
        <button 
          className="text-white hover:text-quantum-accent"
          onClick={closeTreeVortex}
        >
          <RiCloseLine className="text-2xl" />
        </button>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={canvasRef} className="relative" style={{ width: '600px', height: '600px' }} />
      </div>
      
      <div className="absolute bottom-4 left-4">
        <div className="bg-quantum-panel/80 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="text-quantum-accent font-medium mb-2">Tree Vortex Parameters</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Particle Count</label>
              <Slider
                min={10}
                max={200}
                step={1}
                value={[treeVortex.params.particleCount]}
                onValueChange={(value) => updateTreeVortexParams({ particleCount: value[0] })}
                className="w-full h-2"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rotation Speed</label>
              <Slider
                min={1}
                max={20}
                step={1}
                value={[treeVortex.params.rotationSpeed]}
                onValueChange={(value) => updateTreeVortexParams({ rotationSpeed: value[0] })}
                className="w-full h-2"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Branch Complexity</label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[treeVortex.params.branchComplexity]}
                onValueChange={(value) => updateTreeVortexParams({ branchComplexity: value[0] })}
                className="w-full h-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVortexModal;
