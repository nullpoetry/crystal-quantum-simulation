export class BytebeatSynthesizer {
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private oscillator: OscillatorNode | null = null;
  private analyser: AnalyserNode;
  private freqData: Uint8Array;
  private isPlaying: boolean = false;
  private currentFrequency: number = 440;
  private bytebeatFunction: (t: number) => number;
  private bytebeatTime: number = 0;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.3;
    this.gainNode.connect(this.audioContext.destination);
    
    // Create analyzer for visualization
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.connect(this.audioContext.destination);
    this.gainNode.connect(this.analyser);
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    
    // Default bytebeat algorithm
    this.bytebeatFunction = (t: number) => {
      return ((t * 5) & (t >> 7)) | (t * 3 & t >> 10);
    };
    
    // Start the processing
    this.startBytebeat();
  }

  private startBytebeat(): void {
    const bufferSize = 4096;
    const scriptNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    
    scriptNode.onaudioprocess = (audioProcessingEvent) => {
      const outputBuffer = audioProcessingEvent.outputBuffer;
      const outputData = outputBuffer.getChannelData(0);
      
      for (let i = 0; i < outputBuffer.length; i++) {
        // Generate bytebeat sample
        const sample = this.bytebeatFunction(this.bytebeatTime) / 255;
        
        // Apply frequency modulation
        const modulation = Math.sin(this.bytebeatTime * 0.01 * this.currentFrequency);
        
        // Combine bytebeat with frequency modulation
        outputData[i] = this.isPlaying ? (sample * 0.5 + modulation * 0.5) * 0.3 : 0;
        
        this.bytebeatTime++;
      }
    };
    
    scriptNode.connect(this.gainNode);
  }

  public playNote(frequency: number): void {
    this.currentFrequency = frequency;
    this.isPlaying = true;
    
    // Restart audio context if it was suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    // Create oscillator for the note
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }
    
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
  }

  public stopNote(): void {
    this.isPlaying = false;
    
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }

  public getAudioData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.freqData);
    return this.freqData;
  }

  public setBytebeat(algo: number): void {
    switch (algo) {
      case 1:
        this.bytebeatFunction = (t: number) => {
          return ((t * 5) & (t >> 7)) | (t * 3 & t >> 10);
        };
        break;
      case 2:
        this.bytebeatFunction = (t: number) => {
          return t * (t >> 8 | t >> 9) & 46 & t >> 8;
        };
        break;
      case 3:
        this.bytebeatFunction = (t: number) => {
          return t * ((t >> 9 | t >> 13) & 25 & t >> 6);
        };
        break;
      default:
        this.bytebeatFunction = (t: number) => {
          return ((t * 5) & (t >> 7)) | (t * 3 & t >> 10);
        };
    }
    
    // Reset time counter
    this.bytebeatTime = 0;
  }
}

export default BytebeatSynthesizer;
