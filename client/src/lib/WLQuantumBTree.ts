// Quantum Binary Tree for crystal structure modeling
export class WLQuantumBTree {
  private root: TreeNode | null = null;
  private nodes: TreeNode[] = [];
  private superpositionProbability: number = 0.3;
  private entanglementStrength: number = 0.5;
  private waveFunction: number[] = [];

  constructor(depth: number = 3) {
    this.initialize(depth);
  }

  private initialize(depth: number): void {
    // Create a balanced quantum binary tree
    this.root = this.createNode(0);
    this.nodes = [this.root];
    
    // Build tree to the specified depth
    this.buildTree(this.root, 1, depth);
    
    // Initialize wave function
    this.waveFunction = Array(this.nodes.length).fill(0).map(() => Math.random());
    
    // Create quantum entanglements between nodes
    this.createEntanglements();
  }

  private createNode(id: number): TreeNode {
    return {
      id,
      state: Math.random() > 0.5 ? 1 : -1,
      superposition: Math.random() < this.superpositionProbability,
      probability: Math.random(),
      left: null,
      right: null,
      entangled: [],
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 200,
      },
    };
  }

  private buildTree(node: TreeNode, level: number, maxDepth: number): void {
    if (level >= maxDepth) return;
    
    // Create left child
    node.left = this.createNode(this.nodes.length);
    this.nodes.push(node.left);
    this.buildTree(node.left, level + 1, maxDepth);
    
    // Create right child
    node.right = this.createNode(this.nodes.length);
    this.nodes.push(node.right);
    this.buildTree(node.right, level + 1, maxDepth);
  }

  private createEntanglements(): void {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        if (Math.random() < this.entanglementStrength) {
          this.nodes[i].entangled.push(j);
          this.nodes[j].entangled.push(i);
        }
      }
    }
  }

  public evolve(dt: number): void {
    // Update wave function
    for (let i = 0; i < this.waveFunction.length; i++) {
      this.waveFunction[i] += (Math.random() - 0.5) * dt;
      
      // Normalize
      if (this.waveFunction[i] > 1) this.waveFunction[i] = 1;
      if (this.waveFunction[i] < 0) this.waveFunction[i] = 0;
    }
    
    // Update node states based on wave function and entanglements
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      
      // Calculate entanglement influence
      let entanglementInfluence = 0;
      for (const entangledId of node.entangled) {
        entanglementInfluence += this.nodes[entangledId].state * 0.1;
      }
      
      // Update node state
      if (node.superposition) {
        // Nodes in superposition have probabilistic behavior
        if (Math.random() < node.probability + entanglementInfluence) {
          node.state = 1;
        } else {
          node.state = -1;
        }
      } else {
        // Deterministic state change based on wave function
        if (this.waveFunction[i] > 0.5 + entanglementInfluence) {
          node.state = 1;
        } else {
          node.state = -1;
        }
      }
      
      // Random chance to flip superposition state
      if (Math.random() < 0.01) {
        node.superposition = !node.superposition;
      }
    }
  }

  public getTreeData() {
    // Convert the tree to a flat structure for visualization
    return {
      nodes: this.nodes.map(node => ({
        id: node.id,
        state: node.state,
        superposition: node.superposition,
        position: node.position,
        entangled: node.entangled,
        connections: this.getNodeConnections(node),
      })),
      waveFunction: this.waveFunction,
    };
  }

  private getNodeConnections(node: TreeNode): number[] {
    const connections: number[] = [];
    
    // Add parent-child connections
    if (node.left) {
      connections.push(node.left.id);
    }
    
    if (node.right) {
      connections.push(node.right.id);
    }
    
    // Add entanglement connections
    connections.push(...node.entangled);
    
    return [...new Set(connections)]; // Remove duplicates
  }

  public setEntanglementStrength(strength: number): void {
    this.entanglementStrength = strength;
    
    // Rebuild entanglements based on new strength
    for (const node of this.nodes) {
      node.entangled = [];
    }
    
    this.createEntanglements();
  }

  public setSuperpositionProbability(probability: number): void {
    this.superpositionProbability = probability;
    
    // Update node superposition states
    for (const node of this.nodes) {
      node.superposition = Math.random() < this.superpositionProbability;
    }
  }
}

interface TreeNode {
  id: number;
  state: number; // 1 or -1, quantum spin
  superposition: boolean;
  probability: number;
  left: TreeNode | null;
  right: TreeNode | null;
  entangled: number[]; // IDs of entangled nodes
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export default WLQuantumBTree;
