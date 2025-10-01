import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, ArrowRight, Clock, Users, BarChart3, Zap } from 'lucide-react';

const CustomerJourney3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  const [hoveredStage, setHoveredStage] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Journey stages data
  const journeyStages = [
    {
      id: 1,
      title: "Initial Contact",
      description: "Customer reaches out via preferred channel",
      details: "Multi-channel intake system captures customer intent and context across phone, email, chat, and social media. AI instantly analyzes sentiment and urgency.",
      icon: Users,
      color: 0x00FF41,
      metrics: ["<5s", "Response Time", "99.9%", "Channel Uptime"],
      position: { x: -6, y: 0, z: 0 }
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Sub-50ms intent classification and routing",
      details: "Advanced NLP and machine learning models analyze customer intent, historical context, and emotional state to determine optimal routing and response strategy.",
      icon: BarChart3,
      color: 0x00DDFF,
      metrics: ["47ms", "Avg Analysis Time", "94%", "Intent Accuracy"],
      position: { x: -2, y: 1, z: 0 }
    },
    {
      id: 3,
      title: "Smart Routing",
      description: "Optimal agent matching or automation",
      details: "Intelligent routing engine matches customers to the best-suited agent based on expertise, availability, and customer profile. 70% of interactions are fully automated.",
      icon: Zap,
      color: 0xFFFF00,
      metrics: ["70%", "Automation Rate", "15%", "Routing Time"],
      position: { x: 2, y: 1, z: 0 }
    },
    {
      id: 4,
      title: "Resolution",
      description: "Efficient problem solving with AI assistance",
      details: "Agents are empowered with real-time AI insights, suggested responses, and knowledge base integration. Continuous learning improves resolution quality.",
      icon: Clock,
      color: 0x00FF41,
      metrics: ["4.2 min", "Avg Handle Time", "96%", "First Call Resolution"],
      position: { x: 6, y: 0, z: 0 }
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create journey stages
    const stageObjects = [];
    const connectionLines = [];

    journeyStages.forEach((stage, index) => {
      // Create stage node
      const geometry = new THREE.SphereGeometry(0.3, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.8
      });
      
      const stageMesh = new THREE.Mesh(geometry, material);
      stageMesh.position.set(stage.position.x, stage.position.y, stage.position.z);
      stageMesh.userData = { stageId: stage.id, stage: stage };
      
      scene.add(stageMesh);
      stageObjects.push(stageMesh);

      // Create pulsing effect
      const pulseGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.2,
        wireframe: true
      });
      
      const pulseMesh = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulseMesh.position.copy(stageMesh.position);
      pulseMesh.userData = { isPulse: true, stageId: stage.id };
      
      scene.add(pulseMesh);

      // Create connection line to next stage
      if (index < journeyStages.length - 1) {
        const nextStage = journeyStages[index + 1];
        const points = [
          new THREE.Vector3(stage.position.x, stage.position.y, stage.position.z),
          new THREE.Vector3(nextStage.position.x, nextStage.position.y, nextStage.position.z)
        ];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x00FF41,
          transparent: true,
          opacity: 0.6
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        connectionLines.push(line);
      }
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00FF41, 1, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Mouse interaction
    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycasting for hover detection
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(stageObjects);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.userData.stageId) {
          setHoveredStage(intersected.userData.stageId);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredStage(null);
        document.body.style.cursor = 'default';
      }
    };

    const handleClick = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(stageObjects);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.userData.stageId) {
          setSelectedStage(intersected.userData.stage);
          setShowModal(true);
        }
      }
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleClick);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Animate stage nodes
      stageObjects.forEach((stageMesh, index) => {
        // Gentle floating animation
        stageMesh.position.y = journeyStages[index].position.y + Math.sin(elapsedTime + index) * 0.1;
        
        // Highlight hovered stage
        if (hoveredStage === stageMesh.userData.stageId) {
          stageMesh.scale.setScalar(1.2);
          stageMesh.material.opacity = 1;
        } else {
          stageMesh.scale.setScalar(1);
          stageMesh.material.opacity = 0.8;
        }
      });

      // Animate pulse effects
      scene.children.forEach(child => {
        if (child.userData.isPulse) {
          const scale = 1 + Math.sin(elapsedTime * 2) * 0.2;
          child.scale.setScalar(scale);
          child.material.opacity = 0.2 - Math.sin(elapsedTime * 2) * 0.1;
        }
      });

      // Rotate camera slightly for dynamic view
      camera.position.x = Math.sin(elapsedTime * 0.1) * 0.5;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('click', handleClick);
        
        if (renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      
      document.body.style.cursor = 'default';
      
      // Dispose of resources
      scene.children.forEach(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      renderer.dispose();
    };
  }, [hoveredStage]);

  return (
    <div className="relative">
      {/* 3D Timeline Container */}
      <div 
        ref={mountRef}
        className="w-full h-96 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(38,40,42)] overflow-hidden"
        style={{ cursor: hoveredStage ? 'pointer' : 'default' }}
      />

      {/* Hover Tooltip */}
      {hoveredStage && (
        <div className="absolute top-4 left-4 bg-[rgb(26,28,30)] border border-[#00FF41] rounded-xl p-4 max-w-xs z-10">
          {(() => {
            const stage = journeyStages.find(s => s.id === hoveredStage);
            return stage ? (
              <>
                <h3 className="text-[#00FF41] font-semibold mb-2">{stage.title}</h3>
                <p className="text-[rgb(218,218,218)] text-sm">{stage.description}</p>
                <p className="text-[rgb(161,161,170)] text-xs mt-2">Click for details</p>
              </>
            ) : null;
          })()}
        </div>
      )}

      {/* Stage Details Modal */}
      {showModal && selectedStage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <Card className="bg-[rgb(26,28,30)] border-2 border-[#00FF41] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#00FF41]/20 rounded-xl flex items-center justify-center border border-[#00FF41]/50">
                    <selectedStage.icon size={24} className="text-[#00FF41]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{selectedStage.title}</CardTitle>
                    <p className="text-[#00FF41]">Stage {selectedStage.id} of 4</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowModal(false)}
                  size="sm"
                  variant="ghost"
                  className="text-[rgb(161,161,170)] hover:text-white"
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Process Details</h4>
                <p className="text-[rgb(218,218,218)] leading-relaxed">
                  {selectedStage.details}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)]">
                    <div className="text-2xl font-bold text-[#00FF41] mb-1">{selectedStage.metrics[0]}</div>
                    <div className="text-[rgb(161,161,170)] text-sm">{selectedStage.metrics[1]}</div>
                  </div>
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)]">
                    <div className="text-2xl font-bold text-[#00DDFF] mb-1">{selectedStage.metrics[2]}</div>
                    <div className="text-[rgb(161,161,170)] text-sm">{selectedStage.metrics[3]}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgb(63,63,63)]">
                <Button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-[#00FF41] text-[rgb(17,17,19)] hover:bg-[#00e83a] rounded-xl"
                >
                  Continue Journey
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CustomerJourney3D;