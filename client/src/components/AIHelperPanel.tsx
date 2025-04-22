import React, { useState } from "react";
import { RiRobotLine, RiUserLine, RiSendPlaneFill } from "react-icons/ri";
import { useSimulation } from "@/context/SimulationContext";

interface Message {
  id: string;
  type: "assistant" | "user";
  text: string;
}

const AIHelperPanel: React.FC = () => {
  const { crystalParams } = useSimulation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      text: "Welcome to the Crystal Mod AI Helper. I can assist you with crystal modifications and optimizations. How can I help you today?"
    }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputText
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response based on user input and current crystal parameters
    const aiResponse = generateAIResponse(inputText, crystalParams);
    
    // Add AI message
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        text: aiResponse
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
    
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Generate AI response based on user input and crystal parameters
  const generateAIResponse = (
    userInput: string, 
    params: { nodes: number; couplingStrength: number; oscillationPeriod: number }
  ): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("node") || input.includes("nodes")) {
      if (params.nodes < 20) {
        return `Your crystal structure has ${params.nodes} nodes, which is relatively small. Adding more nodes would increase complexity and lead to more interesting quantum interactions. I recommend at least 20-30 nodes for rich behaviors.`;
      } else if (params.nodes > 50) {
        return `Your crystal has ${params.nodes} nodes, which is quite complex. This will produce intricate quantum behaviors but might require more computational resources. Consider reducing if performance becomes an issue.`;
      } else {
        return `Your crystal has ${params.nodes} nodes, which is a good balance between complexity and performance. This should produce interesting quantum behaviors.`;
      }
    }
    
    if (input.includes("coupling") || input.includes("strength")) {
      if (params.couplingStrength < 0.3) {
        return `Your coupling strength is set to ${params.couplingStrength.toFixed(1)}, which is relatively weak. This will result in more independent nodes with less interaction. Consider increasing for more complex emergent behaviors.`;
      } else if (params.couplingStrength > 0.7) {
        return `Your coupling strength is set to ${params.couplingStrength.toFixed(1)}, which is quite strong. This will lead to tightly coupled nodes and potentially synchronized behavior. Reduce if you want more diversity in node states.`;
      } else {
        return `Your coupling strength is set to ${params.couplingStrength.toFixed(1)}, which provides a good balance of interaction between nodes while maintaining some independence.`;
      }
    }
    
    if (input.includes("oscillation") || input.includes("period")) {
      if (params.oscillationPeriod < 1.5) {
        return `Your oscillation period is ${params.oscillationPeriod.toFixed(1)}, which is quite fast. This will create rapid state changes in your crystal. Interesting for studying quick transitions but may appear chaotic.`;
      } else if (params.oscillationPeriod > 3.5) {
        return `Your oscillation period is ${params.oscillationPeriod.toFixed(1)}, which is relatively slow. This allows for more predictable and observable state changes. Good for studying detailed interactions.`;
      } else {
        return `Your oscillation period of ${params.oscillationPeriod.toFixed(1)} provides a moderate pace of state changes, allowing for both stability and dynamism in the crystal structure.`;
      }
    }
    
    if (input.includes("optimize") || input.includes("recommendation") || input.includes("suggest")) {
      return `Based on your current configuration (${params.nodes} nodes, ${params.couplingStrength.toFixed(1)} coupling strength, ${params.oscillationPeriod.toFixed(1)} oscillation period), I would suggest: 
      1. ${params.nodes < 25 ? "Increase node count to 25-30 for more complex interactions" : "Your node count is good"}
      2. ${params.couplingStrength < 0.4 ? "Increase coupling strength to 0.4-0.5 for better node communication" : params.couplingStrength > 0.7 ? "Decrease coupling strength to 0.5-0.6 for more varied behavior" : "Your coupling strength is well balanced"}
      3. ${params.oscillationPeriod < 1.5 ? "Increase oscillation period to 2.0-2.5 for more stable patterns" : params.oscillationPeriod > 3.5 ? "Decrease oscillation period to 2.5-3.0 for more dynamic behavior" : "Your oscillation period is optimal"}`;
    }
    
    if (input.includes("entropy") || input.includes("energy")) {
      return "Higher node counts and coupling strengths generally increase system entropy. This leads to more complex light cluster formations and resonance patterns. Energy tends to fluctuate more dramatically with stronger coupling but can stabilize into interesting patterns with the right oscillation period.";
    }
    
    return "I'm analyzing your crystal structure based on current parameters. Is there a specific aspect you'd like me to help optimize? I can provide insights on node count, coupling strength, oscillation period, or quantum resonance effects.";
  };

  return (
    <div className="w-64 bg-quantum-panel border-l border-quantum-muted flex flex-col">
      <div className="p-4 border-b border-quantum-muted">
        <h2 className="text-quantum-purple font-medium mb-1 flex items-center">
          <RiRobotLine className="mr-1.5" /> Crystal Mod AI Helper
        </h2>
        <p className="text-xs text-gray-400">AI-powered assistance for crystal modifications and optimizations</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : ""}`}>
              {message.type === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-quantum-purple/20 flex items-center justify-center text-quantum-purple mr-2 flex-shrink-0">
                  <RiRobotLine />
                </div>
              )}
              
              <div className={`rounded-lg p-2 text-sm ${
                message.type === "assistant" 
                  ? "bg-quantum-dark/50" 
                  : "bg-quantum-blue/20"
              }`}>
                <p>{message.text}</p>
              </div>
              
              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-quantum-blue/20 flex items-center justify-center text-quantum-blue ml-2 flex-shrink-0">
                  <RiUserLine />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-quantum-muted">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask about crystal modifications..." 
            className="w-full bg-quantum-dark rounded-lg border border-quantum-muted px-3 py-2 text-sm focus:outline-none focus:border-quantum-purple"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="absolute right-2 top-2 text-quantum-purple hover:text-quantum-purple/80"
            onClick={handleSendMessage}
          >
            <RiSendPlaneFill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIHelperPanel;
