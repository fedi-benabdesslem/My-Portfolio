"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

// ===========================================
// 3D CRYSTAL COMPONENT
// Edit geometry and material props to change look
// ===========================================

function Crystal() {
    const meshRef = useRef<THREE.Mesh>(null);
    const mesh2Ref = useRef<THREE.Mesh>(null);
    const mesh3Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (meshRef.current) {
            meshRef.current.rotation.x = time * 0.15;
            meshRef.current.rotation.y = time * 0.2;
        }
        if (mesh2Ref.current) {
            mesh2Ref.current.rotation.x = time * 0.1;
            mesh2Ref.current.rotation.z = time * 0.15;
        }
        if (mesh3Ref.current) {
            mesh3Ref.current.rotation.y = time * 0.12;
            mesh3Ref.current.rotation.z = time * 0.1;
        }
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
        >
            <group>
                {/* Main crystal - Orange glow */}
                <mesh ref={meshRef} position={[0, 0, 0]}>
                    <octahedronGeometry args={[1.2, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={0.3}
                        thickness={0.5}
                        anisotropicBlur={0.5}
                        chromaticAberration={0.5}
                        distortion={0.5}
                        distortionScale={0.5}
                        temporalDistortion={0.1}
                        transmission={0.95}
                        roughness={0.1}
                        color="#FF6B35"
                    />
                </mesh>

                {/* Second shape - Purple glow */}
                <mesh ref={mesh2Ref} position={[0.8, 0.5, -0.5]} scale={0.6}>
                    <octahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={0.2}
                        thickness={0.3}
                        chromaticAberration={0.3}
                        transmission={0.9}
                        roughness={0.15}
                        color="#D448FF"
                    />
                </mesh>

                {/* Third shape - Blue glow */}
                <mesh ref={mesh3Ref} position={[-0.6, -0.4, 0.3]} scale={0.5}>
                    <octahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={0.2}
                        thickness={0.3}
                        chromaticAberration={0.3}
                        transmission={0.9}
                        roughness={0.15}
                        color="#6366F1"
                    />
                </mesh>
            </group>
        </Float>
    );
}

// ===========================================
// 3D SCENE - Main export
// ===========================================

export default function Scene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#D448FF" />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#FF6B35" />
            <pointLight position={[-5, -5, 5]} intensity={0.8} color="#6366F1" />

            {/* 3D Crystal */}
            <Crystal />
        </Canvas>
    );
}
