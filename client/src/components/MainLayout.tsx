import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import AIHelperPanel from "./AIHelperPanel";
import TreeVortexModal from "./TreeVortexModal";
import { useSimulation } from "@/context/SimulationContext";

const MainLayout: React.FC = () => {
  const { treeVortexVisible } = useSimulation();

  return (
    <div className="flex flex-col h-screen bg-quantum-dark text-gray-200 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
        <AIHelperPanel />
      </div>
      
      {treeVortexVisible && <TreeVortexModal />}
    </div>
  );
};

export default MainLayout;
