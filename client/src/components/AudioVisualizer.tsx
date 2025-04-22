import React, { useRef, useEffect } from "react";
import { useSimulation } from "@/context/SimulationContext";

const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { bytebeatSynthesizer } = useSimulation();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const visualize = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get audio data from bytebeatSynthesizer
      const audioData = bytebeatSynthesizer.getAudioData();
      
      // Draw visualization
      const barWidth = canvas.width / audioData.length;
      const baseColor = "hsl(163, 95%, 43%)"; // quantum-accent
      
      ctx.fillStyle = baseColor;
      
      for (let i = 0; i < audioData.length; i++) {
        const value = audioData[i];
        const percent = value / 255;
        const height = canvas.height * percent;
        const x = i * barWidth;
        const y = canvas.height - height;
        
        ctx.fillRect(x, y, barWidth - 1, height);
      }
      
      animationFrameId = requestAnimationFrame(visualize);
    };
    
    visualize();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [bytebeatSynthesizer]);
  
  return (
    <div className="h-12 bg-quantum-dark rounded overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={48} 
        className="w-full h-full"
      />
    </div>
  );
};

export default AudioVisualizer;
