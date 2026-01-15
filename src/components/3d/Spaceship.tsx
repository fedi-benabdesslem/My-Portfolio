"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import * as THREE from "three";

export default function Spaceship() {
    const groupRef = useRef<THREE.Group>(null);
    const shipRef = useRef<THREE.Group>(null);

    // Orbit parameters
    const [randomOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Orbit logic - Slower, more majestic
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.15 + randomOffset;
            groupRef.current.rotation.z = Math.sin(time * 0.05) * 0.05;
        }

        // Ship movement logic
        if (shipRef.current) {
            shipRef.current.rotation.z = Math.PI / 2; // Orient forward
            shipRef.current.rotation.x = -Math.PI / 2; // Flat

            // Banking effect
            shipRef.current.rotation.y = Math.sin(time * 1) * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Position the ship at a distance from the center (orbit radius) */}
            <group position={[3.5, 0, 0]} ref={shipRef} scale={0.25}>
                <Trail
                    width={1.5}
                    length={8}
                    color={new THREE.Color("#60a5fa")}
                    attenuation={(t) => t * t}
                >
                    {/* Ship Body - Main Hull */}
                    <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.5, 2.5, 8]} />
                        <meshStandardMaterial color="#e0e7ff" roughness={0.3} metalness={0.8} />
                    </mesh>

                    {/* Cockpit */}
                    <mesh position={[0.2, 0.5, 0]}>
                        <boxGeometry args={[0.3, 1, 0.5]} />
                        <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.9} />
                    </mesh>

                    {/* Wings - Angular */}
                    <mesh position={[-0.4, -0.5, 0]} rotation={[0, 0, 0]}>
                        <cylinderGeometry args={[0.1, 1, 0.1, 4]} />
                        <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.7} />
                    </mesh>
                    <mesh position={[-0.4, -0.5, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.1, 4]}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
                    </mesh>

                    {/* Engine Glows */}
                    <pointLight position={[-1.2, 0, 0.5]} distance={1.5} intensity={3} color="#60a5fa" />
                    <pointLight position={[-1.2, 0, -0.5]} distance={1.5} intensity={3} color="#60a5fa" />
                </Trail>
            </group>
        </group>
    );
}
