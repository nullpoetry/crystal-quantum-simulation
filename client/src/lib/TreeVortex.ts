import * as THREE from 'three';

interface TreeVortexParams {
  particleCount: number;
  rotationSpeed: number;
  branchComplexity: number;
}

export class TreeVortex {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private particles: THREE.Points | null = null;
  private branches: THREE.Line[] = [];
  private centerNode: THREE.Mesh | null = null;
  private orbitRings: THREE.Line[] = [];
  private animationFrameId: number = 0;
  private time: number = 0;

  public params: TreeVortexParams = {
    particleCount: 50,
    rotationSpeed: 10,
    branchComplexity: 5,
  };

  constructor(params?: Partial<TreeVortexParams>) {
    if (params) {
      this.params = { ...this.params, ...params };
    }
  }

  public initializeVisualization(container: HTMLElement): () => void {
    // Setup Three.js
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 400;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Create tree vortex visualization
    this.createVortexVisualization();
    
    // Animation loop
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      this.updateVortex();
      
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!container || !this.camera || !this.renderer) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(this.animationFrameId);
      
      if (container && this.renderer) {
        container.removeChild(this.renderer.domElement);
      }
      
      if (this.scene) {
        // Clean up scene objects
        while(this.scene.children.length > 0) { 
          const object = this.scene.children[0];
          this.scene.remove(object);
        }
      }
      
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.particles = null;
      this.branches = [];
      this.centerNode = null;
      this.orbitRings = [];
    };
  }

  private createVortexVisualization(): void {
    if (!this.scene) return;
    
    // Create center node
    const centerGeometry = new THREE.SphereGeometry(10, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFFFFF,
      emissive: 0xFFFFFF,
      emissiveIntensity: 0.3,
      shininess: 100
    });
    
    this.centerNode = new THREE.Mesh(centerGeometry, centerMaterial);
    this.scene.add(this.centerNode);
    
    // Create orbit rings
    const ringRadii = [100, 150, 200];
    
    for (const radius of ringRadii) {
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2, true).getPoints(64)
      );
      
      const ringMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3A86FF,
        transparent: true,
        opacity: 0.3
      });
      
      const ring = new THREE.Line(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      
      this.scene.add(ring);
      this.orbitRings.push(ring);
    }
    
    // Create particles
    this.createParticles();
    
    // Create branches
    this.createBranches();
  }

  private createParticles(): void {
    if (!this.scene) return;
    
    // Clean up existing particles
    if (this.particles) {
      this.scene.remove(this.particles);
    }
    
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(this.params.particleCount * 3);
    const particleColors = new Float32Array(this.params.particleCount * 3);
    
    for (let i = 0; i < this.params.particleCount; i++) {
      const i3 = i * 3;
      
      // Polar coordinates for more uniform distribution
      const radius = Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // Convert to Cartesian coordinates
      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);
      
      // Assign colors based on position
      const colorScheme = Math.floor(Math.random() * 3);
      
      if (colorScheme === 0) {
        // Blue
        particleColors[i3] = 0.2;
        particleColors[i3 + 1] = 0.5;
        particleColors[i3 + 2] = 1.0;
      } else if (colorScheme === 1) {
        // Purple
        particleColors[i3] = 0.6;
        particleColors[i3 + 1] = 0.3;
        particleColors[i3 + 2] = 0.9;
      } else {
        // Green
        particleColors[i3] = 0.0;
        particleColors[i3 + 1] = 0.8;
        particleColors[i3 + 2] = 0.6;
      }
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    // Create particle system
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);
  }

  private createBranches(): void {
    if (!this.scene) return;
    
    // Clean up existing branches
    for (const branch of this.branches) {
      this.scene.remove(branch);
    }
    
    this.branches = [];
    
    // Create tree branches
    const branchCount = this.params.branchComplexity * 2;
    const center = new THREE.Vector3(0, 0, 0);
    
    for (let i = 0; i < branchCount; i++) {
      // Create a branch extending from the center
      const angle = (i / branchCount) * Math.PI * 2;
      const radius = 150 + Math.random() * 50;
      
      const endPoint = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 100
      );
      
      // Create branch line
      const points = [center, endPoint];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const colorScheme = i % 3;
      let color: THREE.Color;
      
      if (colorScheme === 0) {
        color = new THREE.Color(0x3A86FF); // Blue
      } else if (colorScheme === 1) {
        color = new THREE.Color(0x9D4EDD); // Purple
      } else {
        color = new THREE.Color(0x06D6A0); // Green
      }
      
      const material = new THREE.LineBasicMaterial({ 
        color,
        transparent: true,
        opacity: 0.3
      });
      
      const branch = new THREE.Line(geometry, material);
      this.scene.add(branch);
      this.branches.push(branch);
      
      // Add sub-branches if complexity is high enough
      if (this.params.branchComplexity > 3) {
        const subBranchCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < subBranchCount; j++) {
          const subEndPoint = new THREE.Vector3(
            endPoint.x + (Math.random() - 0.5) * 50,
            endPoint.y + (Math.random() - 0.5) * 50,
            endPoint.z + (Math.random() - 0.5) * 50
          );
          
          const subPoints = [endPoint, subEndPoint];
          const subGeometry = new THREE.BufferGeometry().setFromPoints(subPoints);
          const subMaterial = new THREE.LineBasicMaterial({ 
            color,
            transparent: true,
            opacity: 0.2
          });
          
          const subBranch = new THREE.Line(subGeometry, subMaterial);
          this.scene.add(subBranch);
          this.branches.push(subBranch);
        }
      }
    }
  }

  private updateVortex(): void {
    this.time += 0.01;
    
    // Rotate orbit rings
    for (let i = 0; i < this.orbitRings.length; i++) {
      const ring = this.orbitRings[i];
      const speed = (this.params.rotationSpeed / 10) * (i + 1) * 0.1;
      
      ring.rotation.z += speed * 0.01;
      ring.rotation.x = Math.PI / 2 + Math.sin(this.time * 0.2) * 0.1;
    }
    
    // Update particles
    if (this.particles) {
      const positions = (this.particles.geometry as THREE.BufferGeometry).attributes.position.array as Float32Array;
      
      for (let i = 0; i < this.params.particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y + z * z);
        
        // Rotate around center
        const rotationSpeed = (this.params.rotationSpeed / 10) * (1 - distance / 300);
        const angle = rotationSpeed * 0.02;
        
        const newX = x * Math.cos(angle) - y * Math.sin(angle);
        const newY = x * Math.sin(angle) + y * Math.cos(angle);
        
        positions[i3] = newX;
        positions[i3 + 1] = newY;
        
        // Add some vertical movement
        positions[i3 + 2] = z + Math.sin(this.time + i * 0.1) * 0.5;
      }
      
      (this.particles.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    }
    
    // Update branches
    for (let i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i];
      
      // Rotate branches slightly
      branch.rotation.z += 0.001 * (this.params.rotationSpeed / 10);
      branch.rotation.y += 0.0005 * (this.params.rotationSpeed / 10);
    }
  }

  public updateParams(newParams: Partial<TreeVortexParams>): void {
    this.params = { ...this.params, ...newParams };
    
    // Update visualization based on new parameters
    if (this.scene) {
      if (newParams.particleCount !== undefined) {
        this.createParticles();
      }
      
      if (newParams.branchComplexity !== undefined) {
        this.createBranches();
      }
    }
  }
}

export default TreeVortex;
