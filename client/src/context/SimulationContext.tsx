import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import OrbitXniner from "@/lib/OrbitXniner";
import WLQuantumBTree from "@/lib/WLQuantumBTree";
import BytebeatSynthesizer from "@/lib/BytebeatSynthesizer";
import TreeVortex from "@/lib/TreeVortex";
import { CRYSTAL_DEFAULTS, TREE_VORTEX_DEFAULTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";

interface SimulationContextType {
  // Simulation state
  simulationStatus: "running" | "paused" | "stopped";
  displayMode: "3d" | "2d" | "tree";
  crystalParams: {
    nodes: number;
    couplingStrength: number;
    oscillationPeriod: number;
  };
  visualOptions: {
    showConnections: boolean;
    showParticles: boolean;
    showLabels: boolean;
  };
  metrics: {
    time: number;
    phase: number;
    energy: number;
    entropy: number;
    resonance: number;
  };
  crystalData: {
    nodes: any[];
    lightClusters: any[];
  };
  treeVortexVisible: boolean;
  
  // Main objects
  orbitXniner: OrbitXniner;
  quantumBTree: WLQuantumBTree;
  bytebeatSynthesizer: BytebeatSynthesizer;
  treeVortex: TreeVortex;
  
  // Methods
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  updateNodeCount: (count: number) => void;
  updateCouplingStrength: (strength: number) => void;
  updateOscillationPeriod: (period: number) => void;
  updateDisplayMode: (mode: "3d" | "2d" | "tree") => void;
  toggleConnections: (show: boolean) => void;
  toggleParticles: (show: boolean) => void;
  toggleLabels: (show: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  setTreeVortexVisible: (visible: boolean) => void;
  updateTreeVortexParams: (params: Partial<TreeVortexParams>) => void;
  saveSimulationState: () => void;
}

interface TreeVortexParams {
  particleCount: number;
  rotationSpeed: number;
  branchComplexity: number;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

interface SimulationProviderProps {
  children: ReactNode;
}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({ children }) => {
  // Initialize main objects
  const [orbitXniner] = useState<OrbitXniner>(() => new OrbitXniner({
    maxNodes: CRYSTAL_DEFAULTS.NODES,
    couplingStrength: CRYSTAL_DEFAULTS.COUPLING_STRENGTH,
    oscillationPeriod: CRYSTAL_DEFAULTS.OSCILLATION_PERIOD,
    disorderStrength: CRYSTAL_DEFAULTS.DISORDER_STRENGTH,
  }));
  
  const [quantumBTree] = useState<WLQuantumBTree>(() => new WLQuantumBTree(3));
  
  const [bytebeatSynthesizer] = useState<BytebeatSynthesizer>(() => new BytebeatSynthesizer());
  
  const [treeVortex] = useState<TreeVortex>(() => new TreeVortex({
    particleCount: TREE_VORTEX_DEFAULTS.PARTICLE_COUNT,
    rotationSpeed: TREE_VORTEX_DEFAULTS.ROTATION_SPEED,
    branchComplexity: TREE_VORTEX_DEFAULTS.BRANCH_COMPLEXITY,
  }));
  
  // State
  const [simulationStatus, setSimulationStatus] = useState<"running" | "paused" | "stopped">("running");
  const [displayMode, setDisplayMode] = useState<"3d" | "2d" | "tree">("3d");
  const [crystalParams, setCrystalParams] = useState({
    nodes: CRYSTAL_DEFAULTS.NODES,
    couplingStrength: CRYSTAL_DEFAULTS.COUPLING_STRENGTH,
    oscillationPeriod: CRYSTAL_DEFAULTS.OSCILLATION_PERIOD,
  });
  const [visualOptions, setVisualOptions] = useState({
    showConnections: true,
    showParticles: true,
    showLabels: false,
  });
  const [metrics, setMetrics] = useState({
    time: 0,
    phase: 0,
    energy: 0,
    entropy: 0,
    resonance: 0,
  });
  const [crystalData, setCrystalData] = useState({
    nodes: [],
    lightClusters: [],
  });
  const [treeVortexVisible, setTreeVortexVisible] = useState(false);
  
  // Simulation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    
    const updateSimulation = (time: number) => {
      // Calculate delta time
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      
      if (simulationStatus === "running") {
        // Update crystal simulation
        orbitXniner.update(dt);
        
        // Update quantum tree
        quantumBTree.evolve(dt);
        
        // Update metrics
        setMetrics(orbitXniner.getMetrics());
        
        // Update crystal data
        setCrystalData(orbitXniner.getCrystalData());
      }
      
      animationFrameId = requestAnimationFrame(updateSimulation);
    };
    
    animationFrameId = requestAnimationFrame(updateSimulation);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [orbitXniner, quantumBTree, simulationStatus]);
  
  // Methods
  const startSimulation = () => {
    setSimulationStatus("running");
  };
  
  const pauseSimulation = () => {
    setSimulationStatus("paused");
  };
  
  const resetSimulation = () => {
    setSimulationStatus("stopped");
    
    // Reset orbitXniner
    orbitXniner.setNodeCount(crystalParams.nodes);
    orbitXniner.setCouplingStrength(crystalParams.couplingStrength);
    orbitXniner.setOscillationPeriod(crystalParams.oscillationPeriod);
    
    // Reset metrics
    setMetrics({
      time: 0,
      phase: 0,
      energy: 0,
      entropy: 0,
      resonance: 0,
    });
    
    // Start again
    setTimeout(() => {
      setSimulationStatus("running");
    }, 100);
  };
  
  const updateNodeCount = (count: number) => {
    setCrystalParams(prev => ({
      ...prev,
      nodes: count,
    }));
    
    orbitXniner.setNodeCount(count);
  };
  
  const updateCouplingStrength = (strength: number) => {
    setCrystalParams(prev => ({
      ...prev,
      couplingStrength: strength,
    }));
    
    orbitXniner.setCouplingStrength(strength);
    quantumBTree.setEntanglementStrength(strength);
  };
  
  const updateOscillationPeriod = (period: number) => {
    setCrystalParams(prev => ({
      ...prev,
      oscillationPeriod: period,
    }));
    
    orbitXniner.setOscillationPeriod(period);
  };
  
  const updateDisplayMode = (mode: "3d" | "2d" | "tree") => {
    setDisplayMode(mode);
  };
  
  const toggleConnections = (show: boolean) => {
    setVisualOptions(prev => ({
      ...prev,
      showConnections: show,
    }));
  };
  
  const toggleParticles = (show: boolean) => {
    setVisualOptions(prev => ({
      ...prev,
      showParticles: show,
    }));
  };
  
  const toggleLabels = (show: boolean) => {
    setVisualOptions(prev => ({
      ...prev,
      showLabels: show,
    }));
  };
  
  const zoomIn = () => {
    // To be implemented in visualization component
    console.log("Zoom in");
  };
  
  const zoomOut = () => {
    // To be implemented in visualization component
    console.log("Zoom out");
  };
  
  const resetView = () => {
    // To be implemented in visualization component
    console.log("Reset view");
  };
  
  const updateTreeVortexParams = (params: Partial<TreeVortexParams>) => {
    treeVortex.updateParams(params);
  };
  
  const saveSimulationState = async () => {
    try {
      // Save the simulation state to the server
      await apiRequest("POST", "/api/simulation/save", {
        crystalParams,
        metrics,
        status: simulationStatus,
      });
    } catch (error) {
      console.error("Failed to save simulation state:", error);
    }
  };
  
  return (
    <SimulationContext.Provider
      value={{
        simulationStatus,
        displayMode,
        crystalParams,
        visualOptions,
        metrics,
        crystalData,
        treeVortexVisible,
        orbitXniner,
        quantumBTree,
        bytebeatSynthesizer,
        treeVortex,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        updateNodeCount,
        updateCouplingStrength,
        updateOscillationPeriod,
        updateDisplayMode,
        toggleConnections,
        toggleParticles,
        toggleLabels,
        zoomIn,
        zoomOut,
        resetView,
        setTreeVortexVisible,
        updateTreeVortexParams,
        saveSimulationState,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  
  return context;
};
