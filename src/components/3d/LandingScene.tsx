/* eslint-disable prefer-const */
/* eslint-disable react-hooks/purity */
"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

const PARTICLE_COUNT = 15000;

const vertexShader = `
attribute vec3 posFabric;
attribute vec3 posAI;
// color and position are automatically injected by Three.js when vertexColors=true

uniform float uProgress;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScale;

varying vec3 vColor;
varying float vDistanceToMouse;

void main() {
  vColor = color;
  
  float phase1Weight = 0.0;
  float phase2Weight = 0.0;
  float phase3Weight = 0.0;
  
  if (uProgress < 0.15) {
    phase1Weight = 1.0;
  } else if (uProgress < 0.35) {
    float t = (uProgress - 0.15) / 0.20;
    float ease = t * t * (3.0 - 2.0 * t);
    phase1Weight = 1.0 - ease;
    phase2Weight = ease;
  } else if (uProgress < 0.65) {
    phase2Weight = 1.0;
  } else if (uProgress < 0.85) {
    float t = (uProgress - 0.65) / 0.20;
    float ease = t * t * (3.0 - 2.0 * t);
    phase2Weight = 1.0 - ease;
    phase3Weight = ease;
  } else {
    phase3Weight = 1.0;
  }
  
  vec3 currentPos = position * phase1Weight + posFabric * phase2Weight + posAI * phase3Weight;
  
  // Ambient noise based on original position as a seed
  currentPos.x += sin(uTime * 2.0 + position.y * 5.0) * 0.05;
  currentPos.y += cos(uTime * 2.0 + position.x * 5.0) * 0.05;
  
  vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
  vec4 projPos = projectionMatrix * mvPosition;
  
  // --- INTERACTIVE HOVER (Color Only) ---
  vec2 ndcPos = projPos.xy / projPos.w;
  float dist = distance(ndcPos, uMouse);
  // Optional: correct for aspect ratio if needed, but simple distance is fine
  vDistanceToMouse = dist;
  
  // Exact size math used by original PointsMaterial
  gl_PointSize = 0.12 * (uScale / -mvPosition.z);
  gl_Position = projPos;
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vDistanceToMouse;

void main() {
  // We remove the circle discard and smoothstep to restore the original crisp square particles
  vec3 finalColor = vColor;
  
  // Reveal another dimension: particles turn bright white/gold when hovered
  if (vDistanceToMouse < 0.25) {
    float hoverIntensity = (0.25 - vDistanceToMouse) / 0.25;
    finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), hoverIntensity);
  }
  
  // Flat 0.8 opacity exactly like the original PointsMaterial
  gl_FragColor = vec4(finalColor, 0.8);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function LandingScene({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { camera, size, viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate the 3 target shapes once
  const { posThread, posFabric, posAI, colors } = useMemo(() => {
    const pThread = new Float32Array(PARTICLE_COUNT * 3);
    const pFabric = new Float32Array(PARTICLE_COUNT * 3);
    const pAI = new Float32Array(PARTICLE_COUNT * 3);
    const c = new Float32Array(PARTICLE_COUNT * 3);

    const color1 = new THREE.Color("#8b5cf6"); // Purple
    const color2 = new THREE.Color("#06b6d4"); // Cyan
    const color3 = new THREE.Color("#3b82f6"); // Blue

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // 1. Thread Shape (Twisted Vertical Tube)
      const yThread = (Math.random() - 0.5) * 40; // -20 to 20
      const radiusThread = Math.random() * 0.5 + 0.1;
      const angleThread = Math.random() * Math.PI * 2;
      const twist = yThread * 0.8;
      pThread[idx] = Math.cos(angleThread + twist) * radiusThread;
      pThread[idx + 1] = yThread;
      pThread[idx + 2] = Math.sin(angleThread + twist) * radiusThread;

      // 2. Fabric Shape (Woven Grid)
      const isHorizontal = i < PARTICLE_COUNT / 2;
      if (isHorizontal) {
        const x = (Math.random() - 0.5) * 40;
        const zLine = Math.floor((Math.random() - 0.5) * 20);
        const z = zLine * 1.5 + (Math.random() - 0.5) * 0.2;
        const y = Math.sin(x * 0.5) * 0.3; // weave up and down
        pFabric[idx] = x;
        pFabric[idx + 1] = y - 2; // lowered slightly
        pFabric[idx + 2] = z;
      } else {
        const z = (Math.random() - 0.5) * 40;
        const xLine = Math.floor((Math.random() - 0.5) * 20);
        const x = xLine * 1.5 + (Math.random() - 0.5) * 0.2;
        const y = Math.cos(z * 0.5) * 0.3;
        pFabric[idx] = x;
        pFabric[idx + 1] = y - 2;
        pFabric[idx + 2] = z;
      }

      // 3. AI Brain Shape (Concentric Spheres)
      const shell = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, 4
      const radiusAI = shell * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      // Add some noise to the sphere
      const noise = (Math.random() - 0.5) * 0.2;
      pAI[idx] = (radiusAI + noise) * Math.sin(phi) * Math.cos(theta);
      pAI[idx + 1] = (radiusAI + noise) * Math.sin(phi) * Math.sin(theta);
      pAI[idx + 2] = (radiusAI + noise) * Math.cos(phi);

      // Colors
      const mixedColor = [color1, color2, color3][Math.floor(Math.random() * 3)];
      c[idx] = mixedColor.r;
      c[idx + 1] = mixedColor.g;
      c[idx + 2] = mixedColor.b;
    }

    return { posThread: pThread, posFabric: pFabric, posAI: pAI, colors: c };
  }, []);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-999, -999) },
      uScale: { value: 500 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;

    const progress = scrollYProgress.get();
    const time = state.clock.elapsedTime;

    // Update GPU Uniforms instead of CPU calculations
    materialRef.current.uniforms.uProgress.value = progress;
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uScale.value = size.height / 2.0;

    // Smoothly interpolate mouse position for fluid interaction
    materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.x,
      state.pointer.x,
      delta * 5
    );
    materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.y,
      state.pointer.y,
      delta * 5
    );

    // Determine phase1Weight for rotation logic
    let phase1Weight = 0;
    if (progress < 0.15) phase1Weight = 1;
    else if (progress < 0.35) {
      const t = (progress - 0.15) / 0.20;
      phase1Weight = 1 - (t * t * (3 - 2 * t));
    }

    // --- Camera & Group Animation ---

    // Base rotation of the entire cloud
    const targetRotY = time * 0.1;
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, delta * 3);

    if (phase1Weight > 0.5) {
      const targetRotX = time * 0.05;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, delta * 3);
    } else {
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, 0, delta * 2);
    }

    // Camera movement
    const currentCameraZ = camera.position.z;
    const currentCameraX = camera.position.x;
    const currentCameraY = camera.position.y;

    let targetCameraZ = 12;
    let targetCameraX = 0;
    let targetCameraY = 0;

    if (progress > 0.45 && progress < 0.75) {
      const diveProgress = (progress - 0.45) / 0.3; // 0 to 1
      targetCameraZ = THREE.MathUtils.lerp(12, -10, diveProgress);
      targetCameraX = Math.sin(diveProgress * Math.PI) * 2;
      targetCameraY = Math.sin(diveProgress * Math.PI * 2) * 1;
    } else if (progress >= 0.75) {
      targetCameraZ = 15;
    }

    camera.position.set(
      THREE.MathUtils.lerp(currentCameraX, targetCameraX, delta * 3),
      THREE.MathUtils.lerp(currentCameraY, targetCameraY, delta * 3),
      THREE.MathUtils.lerp(currentCameraZ, targetCameraZ, delta * 3)
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#030014"]} />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[posThread, 3]}
          />
          <bufferAttribute
            attach="attributes-posFabric"
            args={[posFabric, 3]}
          />
          <bufferAttribute
            attach="attributes-posAI"
            args={[posAI, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors={true}
        />
      </points>
    </>
  );
}
