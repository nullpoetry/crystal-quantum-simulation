import * as THREE from 'three';

interface OrbitNode {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  radius: number;
  spin: number;
  connections: number[];
  localField: number;
}

interface LightCluster {
  position: THREE.Vector2;
  intensity: number;
  radius: number;
  color: { r: number; g: number; b: number };
  evolution_rate: number;
}

interface OrbitXninerOptions {
  maxNodes: number;
  couplingStrength: number;
  oscillationPeriod: number;
  disorderStrength: number;
}

export class OrbitXniner {
  private nodes: OrbitNode[] = [];
  private lightClusters: LightCluster[] = [];
  private phase: number = 0;
  private time: number = 0;
  private energy: number = 0;
  private entropy: number = 0;
  private resonance: number = 0;
  private options: OrbitXninerOptions;

  constructor(options: Partial<OrbitXninerOptions> = {}) {
    this.options = {
      maxNodes: options.maxNodes || 20,
      couplingStrength: options.couplingStrength || 0.3,
      oscillationPeriod: options.oscillationPeriod || 2.0,
      disorderStrength: options.disorderStrength || 0.1,
    };
    
    this.initialize();
  }

  private initialize(): void {
    // Create nodes
    for (let i = 0; i < this.options.maxNodes; i++) {
      const angle = (i / this.options.maxNodes) * Math.PI * 2;
      const radius = 150;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.cos(angle * 2) * 50;
      
      this.nodes.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        mass: 1,
        radius: 5,
        spin: Math.random() > 0.5 ? 1 : -1,
        connections: [],
        localField: Math.random() * this.options.disorderStrength,
      });
    }
    
    // Create connections
    for (let i = 0; i < this.options.maxNodes; i++) {
      for (let j = i + 1; j < this.options.maxNodes; j++) {
        if (Math.random() < this.options.couplingStrength) {
          this.nodes[i].connections.push(j);
          this.nodes[j].connections.push(i);
        }
      }
    }
    
    // Initialize light clusters
    for (let i = 0; i < 3; i++) {
      this.addLightCluster();
    }
  }

  private addLightCluster(): void {
    this.lightClusters.push({
      position: new THREE.Vector2(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      ),
      intensity: Math.random() * 0.5 + 0.5,
      radius: Math.random() * 50 + 30,
      color: {
        r: Math.random() * 0.5 + 0.5,
        g: Math.random() * 0.5 + 0.5,
        b: Math.random() * 0.3 + 0.7,
      },
      evolution_rate: Math.random() * 0.4 + 0.1,
    });
  }

  public update(dt: number): void {
    this.time += dt;
    this.phase = (this.time / this.options.oscillationPeriod) * Math.PI * 2;
    
    // Update entropy
    this.entropy += dt * Math.abs(Math.sin(this.phase));
    
    // Manage light clusters
    if (this.lightClusters.length < 5 && Math.random() < 0.02) {
      this.addLightCluster();
    }
    
    // Update light clusters
    for (const cluster of this.lightClusters) {
      cluster.intensity += Math.sin(this.time * cluster.evolution_rate) * 0.1;
      cluster.radius += Math.cos(this.time * cluster.evolution_rate) * 0.5;
      
      // Affect nearby nodes
      for (const node of this.nodes) {
        const dx = node.position.x - cluster.position.x;
        const dy = node.position.y - cluster.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < cluster.radius) {
          node.localField += cluster.intensity * (1 - distance / cluster.radius);
          if (this.entropy > 10) {
            node.spin = -node.spin;
            this.entropy *= 0.9;
          }
        }
      }
    }
    
    // Update spins based on connections
    const newSpins: number[] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      let totalField = node.localField;
      
      for (const conn of node.connections) {
        totalField += this.nodes[conn].spin * this.options.couplingStrength;
      }
      
      newSpins[i] = Math.sin(this.phase + totalField) > 0 ? 1 : -1;
    }
    
    // Apply new spins
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].spin = newSpins[i];
    }
    
    // Calculate system energy
    this.energy = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      for (const conn of this.nodes[i].connections) {
        this.energy += this.nodes[i].spin * this.nodes[conn].spin;
      }
    }
    
    // Calculate system resonance
    this.resonance = 1 + Math.abs(Math.sin(this.phase) * Math.cos(this.time * 0.1) * 2);
  }

  public getCrystalData() {
    return {
      nodes: this.nodes.map(node => ({
        position: { x: node.position.x, y: node.position.y, z: node.position.z },
        spin: node.spin,
        connections: node.connections,
        localField: node.localField,
      })),
      lightClusters: this.lightClusters.map(cluster => ({
        position: { x: cluster.position.x, y: cluster.position.y },
        intensity: cluster.intensity,
        radius: cluster.radius,
        color: cluster.color,
        evolution_rate: cluster.evolution_rate,
      })),
    };
  }

  public getMetrics() {
    return {
      time: this.time,
      phase: this.phase,
      energy: this.energy,
      entropy: this.entropy,
      resonance: this.resonance,
    };
  }

  public setNodeCount(count: number): void {
    const oldNodes = this.nodes.length;
    this.options.maxNodes = count;
    
    if (count > oldNodes) {
      // Add more nodes
      for (let i = oldNodes; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 150;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = Math.cos(angle * 2) * 50;
        
        this.nodes.push({
          position: new THREE.Vector3(x, y, z),
          velocity: new THREE.Vector3(0, 0, 0),
          mass: 1,
          radius: 5,
          spin: Math.random() > 0.5 ? 1 : -1,
          connections: [],
          localField: Math.random() * this.options.disorderStrength,
        });
      }
      
      // Add new connections for new nodes
      for (let i = oldNodes; i < count; i++) {
        for (let j = 0; j < count; j++) {
          if (i !== j && Math.random() < this.options.couplingStrength) {
            this.nodes[i].connections.push(j);
            this.nodes[j].connections.push(i);
          }
        }
      }
    } else if (count < oldNodes) {
      // Remove nodes
      this.nodes = this.nodes.slice(0, count);
      
      // Update connections for remaining nodes
      for (const node of this.nodes) {
        node.connections = node.connections.filter(conn => conn < count);
      }
    }
  }

  public setCouplingStrength(strength: number): void {
    this.options.couplingStrength = strength;
    
    // Rebuild connections based on new coupling strength
    for (const node of this.nodes) {
      node.connections = [];
    }
    
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        if (Math.random() < this.options.couplingStrength) {
          this.nodes[i].connections.push(j);
          this.nodes[j].connections.push(i);
        }
      }
    }
  }

  public setOscillationPeriod(period: number): void {
    this.options.oscillationPeriod = period;
  }
}

export default OrbitXniner;
