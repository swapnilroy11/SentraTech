import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SpaceBackground = ({ intensity = 0.8, particles = 200 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Add renderer to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Galaxy Nodes - Central rotating system
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyMaterial = new THREE.PointsMaterial({
      color: 0x00FF41,
      size: 0.02,
      transparent: true,
      opacity: intensity * 0.8,
      blending: THREE.AdditiveBlending
    });

    // Create galaxy spiral pattern
    const galaxyVertices = [];
    const galaxyColors = [];
    
    for (let i = 0; i < particles; i++) {
      const radius = Math.random() * 3;
      const spinAngle = radius * 5;
      const branchAngle = (i % 3) * (Math.PI * 2) / 3;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      
      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      galaxyVertices.push(x, y, z);
      
      // Color mixing - matrix green with cyan accents
      const mixedColor = new THREE.Color();
      const innerColor = new THREE.Color(0x00FF41); // Matrix green
      const outerColor = new THREE.Color(0x00DDFF); // Cyan
      
      mixedColor.lerpColors(innerColor, outerColor, radius / 3);
      galaxyColors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }

    galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyVertices, 3));
    galaxyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors, 3));

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxy);

    // Particle Streaks - Moving background particles
    const streakGeometry = new THREE.BufferGeometry();
    const streakMaterial = new THREE.PointsMaterial({
      color: 0x00FF41,
      size: 0.01,
      transparent: true,
      opacity: intensity * 0.3,
      blending: THREE.AdditiveBlending
    });

    const streakVertices = [];
    const streakVelocities = [];
    
    for (let i = 0; i < particles * 2; i++) {
      streakVertices.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      streakVelocities.push(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
    }

    streakGeometry.setAttribute('position', new THREE.Float32BufferAttribute(streakVertices, 3));
    
    const streaks = new THREE.Points(streakGeometry, streakMaterial);
    scene.add(streaks);

    // Twinkling Stars - Static background elements
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.005,
      transparent: true,
      opacity: intensity * 0.6,
      blending: THREE.AdditiveBlending
    });

    const starVertices = [];
    for (let i = 0; i < particles / 2; i++) {
      starVertices.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate galaxy
      galaxy.rotation.y = elapsedTime * 0.05;
      galaxy.rotation.z = elapsedTime * 0.02;
      
      // Animate particle streaks
      const positions = streaks.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += streakVelocities[i / 3 * 3];
        positions[i + 1] += streakVelocities[i / 3 * 3 + 1];
        positions[i + 2] += streakVelocities[i / 3 * 3 + 2];
        
        // Reset particles that move too far
        if (Math.abs(positions[i]) > 5) {
          positions[i] = (Math.random() - 0.5) * 10;
          positions[i + 1] = (Math.random() - 0.5) * 10;
          positions[i + 2] = (Math.random() - 0.5) * 10;
        }
      }
      
      streaks.geometry.attributes.position.needsUpdate = true;
      
      // Subtle camera movement for depth
      camera.position.x = Math.sin(elapsedTime * 0.1) * 0.1;
      camera.position.y = Math.cos(elapsedTime * 0.15) * 0.1;
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      streakGeometry.dispose();
      streakMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [intensity, particles]);

  return (
    <div 
      ref={mountRef}
      className="fixed inset-0 -z-10"
      style={{
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

export default SpaceBackground;