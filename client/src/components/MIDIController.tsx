import React, { useState, useRef } from "react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import AudioVisualizer from "./AudioVisualizer";
import { useSimulation } from "@/context/SimulationContext";

interface MIDIKey {
  note: string;
  frequency: number;
}

const MIDIController: React.FC = () => {
  const { bytebeatSynthesizer } = useSimulation();
  const [expanded, setExpanded] = useState(true);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  
  // Define MIDI keys with note names and frequencies
  const midiKeys: MIDIKey[] = [
    { note: "C", frequency: 261.63 },
    { note: "D", frequency: 293.66 },
    { note: "E", frequency: 329.63 },
    { note: "F", frequency: 349.23 },
    { note: "G", frequency: 392.00 },
    { note: "A", frequency: 440.00 },
    { note: "B", frequency: 493.88 },
    { note: "C8", frequency: 523.25 }, // High C (Octave higher)
  ];

  const handlePlayNote = (note: string, frequency: number) => {
    bytebeatSynthesizer.playNote(frequency);
    setActiveNote(note);
  };
  
  const handleStopNote = () => {
    bytebeatSynthesizer.stopNote();
    setActiveNote(null);
  };

  const togglePanel = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="absolute bottom-4 left-4 flex">
      <div className="bg-quantum-panel border border-quantum-muted rounded-lg overflow-hidden w-80">
        <div className="flex items-center justify-between p-3 border-b border-quantum-muted">
          <h3 className="text-sm font-medium">Bytebeat MIDI Controller</h3>
          <button 
            className="text-sm text-quantum-accent hover:text-quantum-accent/80"
            onClick={togglePanel}
          >
            {expanded ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
          </button>
        </div>
        
        {expanded && (
          <div className="p-3">
            <div className="flex space-x-1 mb-3">
              {midiKeys.map((key) => (
                <div
                  key={key.note}
                  className={`flex-1 h-16 cursor-pointer rounded flex items-end justify-center pb-1 text-xs font-mono ${
                    activeNote === key.note
                      ? "bg-quantum-blue/30"
                      : "bg-quantum-muted hover:bg-quantum-blue/20"
                  }`}
                  onMouseDown={() => handlePlayNote(key.note, key.frequency)}
                  onMouseUp={handleStopNote}
                  onMouseLeave={handleStopNote}
                >
                  {key.note}
                </div>
              ))}
            </div>
            
            <AudioVisualizer />
          </div>
        )}
      </div>
    </div>
  );
};

export default MIDIController;
