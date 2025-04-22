import React, { useRef, useEffect } from "react";
import { useSimulation } from "@/context/SimulationContext";
import * as THREE from "three";

const QuantumCrystalVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  
  const { 
    displayMode,
    simulationStatus,
    crystalData,
    visualOptions,
    metrics,
    crystalParams
  } = useSimulation();

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Setup Three.js
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 400;
    cameraRef.current = camera;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (canvasRef.current && rendererRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (sceneRef.current) {
        // Clean up scene objects
        while(sceneRef.current.children.length > 0) { 
          const object = sceneRef.current.children[0];
          sceneRef.current.remove(object);
        }
      }
    };
  }, []);

  // Update crystal visualization when crystal data changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear previous nodes and lines
    nodesRef.current.forEach(node => {
      if (sceneRef.current) sceneRef.current.remove(node);
    });
    
    linesRef.current.forEach(line => {
      if (sceneRef.current) sceneRef.current.remove(line);
    });
    
    nodesRef.current = [];
    linesRef.current = [];
    
    // Create materials
    const positiveMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x06D6A0,
      emissive: 0x06D6A0,
      emissiveIntensity: 0.3,
      shininess: 100
    });
    
    const negativeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFFFFF,
      emissive: 0xAAAAAA,
      emissiveIntensity: 0.2,
      shininess: 90
    });
    
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x06D6A0,
      transparent: true,
      opacity: 0.3
    });
    
    // Create geometry
    const nodeGeometry = new THREE.SphereGeometry(6, 16, 16);
    
    // Add nodes
    crystalData.nodes.forEach(node => {
      const material = node.spin > 0 ? positiveMaterial : negativeMaterial;
      const mesh = new THREE.Mesh(nodeGeometry, material);
      
      mesh.position.set(node.position.x, node.position.y, node.position.z);
      
      sceneRef.current?.add(mesh);
      nodesRef.current.push(mesh);
    });
    
    // Add connections if showConnections is true
    if (visualOptions.showConnections) {
      crystalData.nodes.forEach((node, nodeIndex) => {
        node.connections.forEach(connIndex => {
          if (connIndex > nodeIndex) { // avoid duplicating lines
            const connectedNode = crystalData.nodes[connIndex];
            
            const points = [
              new THREE.Vector3(node.position.x, node.position.y, node.position.z),
              new THREE.Vector3(connectedNode.position.x, connectedNode.position.y, connectedNode.position.z)
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            
            sceneRef.current?.add(line);
            linesRef.current.push(line);
          }
        });
      });
    }
    
    // Add light clusters
    crystalData.lightClusters.forEach(cluster => {
      // Create light cluster as a point light
      const color = new THREE.Color(
        cluster.color.r,
        cluster.color.g,
        cluster.color.b
      );
      
      const pointLight = new THREE.PointLight(color, cluster.intensity, cluster.radius);
      pointLight.position.set(cluster.position.x, cluster.position.y, 0);
      
      sceneRef.current?.add(pointLight);
      
      // Add a visual indicator for the light cluster
      const sphereGeometry = new THREE.SphereGeometry(cluster.radius * 0.1, 8, 8);
      const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color,
        transparent: true,
        opacity: 0.3
      });
      
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.position.set(cluster.position.x, cluster.position.y, 0);
      
      sceneRef.current?.add(mesh);
    });
    
  }, [crystalData, visualOptions.showConnections]);

  // Update camera based on display mode
  useEffect(() => {
    if (!cameraRef.current) return;
    
    switch(displayMode) {
      case "3d":
        cameraRef.current.position.set(0, 0, 400);
        break;
      case "2d":
        cameraRef.current.position.set(0, 0, 500);
        break;
      default:
        cameraRef.current.position.set(0, 0, 400);
    }
    
    cameraRef.current.lookAt(0, 0, 0);
  }, [displayMode]);

  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 bg-gradient-to-br from-quantum-dark to-black"
    />
  );
};

export default QuantumCrystalVisualization;
