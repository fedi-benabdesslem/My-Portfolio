"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Planet() {
    const meshRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.001;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += 0.0015;
        }
    });

    return (
        <group>
            {/* Main Planet Body */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color="#2d1b4e" // Deeper purple/black
                    roughness={0.7}
                    metalness={0.2}
                    emissive="#1a0b2e"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Cloud Layer (Simulated) */}
            <mesh ref={atmosphereRef} scale={[1.02, 1.02, 1.02]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color="#d8b4fe"
                    transparent
                    opacity={0.3}
                    roughness={0.9}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Atmospheric Glow (Outer) */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial
                    color="#a855f7" // Purple atmosphere
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Atmospheric Glow (Inner/Rim) */}
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial
                    color="#ec4899" // Pinkish rim
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}
