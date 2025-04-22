import React from "react";
import MainLayout from "@/components/MainLayout";
import { SimulationProvider } from "@/context/SimulationContext";

const Home: React.FC = () => {
  return (
    <SimulationProvider>
      <MainLayout />
    </SimulationProvider>
  );
};

export default Home;
