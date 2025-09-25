import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const SpaceBackground = ({ intensity = 0.3, particles = 150 }) => {
  const mountRef = useRef(null);
  const frameId = useRef(null);
  const scene = useRef(null);
  const camera = useRef(null);
  const renderer = useRef(null);
  const particleSystem = useRef(null);
  const lastTime = useRef(0);
  const isActive = useRef(true);

  // Optimized particle configuration
  const particleConfig = useMemo(() => ({
    count: Math.min(particles, 150), // Limit max particles for performance
    intensity: Math.max(0.1, Math.min(intensity, 0.5)), // Clamp intensity
    updateInterval: 16.67, // 60fps target
    cullingDistance: 1000,
    frustumCulling: true
  }), [intensity, particles]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene with performance optimizations
    const initScene = () => {
      // Scene setup
      scene.current = new THREE.Scene();
      scene.current.fog = new THREE.Fog(0x000000, 1, 1000);

      // Camera setup with optimized settings
      camera.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.current.position.z = 5;

      // Renderer setup with performance optimizations
      renderer.current = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false, // Disable for better performance
        powerPreference: "high-performance",
        stencil: false,
        depth: false
      });
      
      renderer.current.setSize(window.innerWidth, window.innerHeight);
      renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
      renderer.current.setClearColor(0x000000, 0);
      
      // Performance optimizations
      renderer.current.shadowMap.enabled = false;
      renderer.current.physicallyCorrectLights = false;
      renderer.current.outputColorSpace = THREE.SRGBColorSpace;
      
      mountRef.current.appendChild(renderer.current.domElement);

      // Create optimized particle system
      createParticles();
    };

    const createParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleConfig.count * 3);
      const velocities = new Float32Array(particleConfig.count * 3);
      const colors = new Float32Array(particleConfig.count * 3);

      // Initialize particles with better distribution
      for (let i = 0; i < particleConfig.count; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;

        // Velocity
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

        // Colors (green matrix theme)
        colors[i3] = 0; // R
        colors[i3 + 1] = Math.random() * 0.5 + 0.5; // G (0.5-1.0)
        colors[i3 + 2] = Math.random() * 0.3; // B (0-0.3)
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Optimized material
      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: particleConfig.intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false
      });

      particleSystem.current = new THREE.Points(geometry, material);
      scene.current.add(particleSystem.current);
    };

    // Optimized animation loop with frame limiting
    const animate = (currentTime) => {
      if (!isActive.current || !scene.current || !renderer.current) return;

      // Frame rate limiting for better performance
      if (currentTime - lastTime.current < particleConfig.updateInterval) {
        frameId.current = requestAnimationFrame(animate);
        return;
      }

      lastTime.current = currentTime;

      // Update particles efficiently
      if (particleSystem.current) {
        const positions = particleSystem.current.geometry.attributes.position.array;
        const velocities = particleSystem.current.geometry.attributes.velocity.array;

        // Batch update particles
        for (let i = 0; i < particleConfig.count * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Boundary wrapping
          if (Math.abs(positions[i]) > 10) positions[i] *= -1;
          if (Math.abs(positions[i + 1]) > 10) positions[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 10) positions[i + 2] *= -1;
        }

        particleSystem.current.geometry.attributes.position.needsUpdate = true;
      }

      // Render with try-catch for stability
      try {
        renderer.current.render(scene.current, camera.current);
      } catch (error) {
        console.warn('WebGL rendering error:', error);
        isActive.current = false;
      }

      frameId.current = requestAnimationFrame(animate);
    };

    // Handle resize with debouncing
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (camera.current && renderer.current) {
          camera.current.aspect = window.innerWidth / window.innerHeight;
          camera.current.updateProjectionMatrix();
          renderer.current.setSize(window.innerWidth, window.innerHeight);
        }
      }, 100);
    };

    // Visibility change handling for performance
    const handleVisibilityChange = () => {
      isActive.current = !document.hidden;
      if (isActive.current && scene.current) {
        animate(performance.now());
      }
    };

    // Initialize and start
    initScene();
    animate(performance.now());
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      isActive.current = false;
      
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(resizeTimeout);
      
      if (renderer.current && mountRef.current && mountRef.current.contains(renderer.current.domElement)) {
        mountRef.current.removeChild(renderer.current.domElement);
      }
      
      // Dispose of Three.js resources
      if (particleSystem.current) {
        if (particleSystem.current.geometry) particleSystem.current.geometry.dispose();
        if (particleSystem.current.material) particleSystem.current.material.dispose();
      }
      
      if (renderer.current) {
        renderer.current.dispose();
      }
      
      scene.current = null;
      camera.current = null;
      renderer.current = null;
      particleSystem.current = null;
    };
  }, [particleConfig]);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: particleConfig.intensity
      }}
      aria-hidden="true"
    />
  );
};

export default SpaceBackground;