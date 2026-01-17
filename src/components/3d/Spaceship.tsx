"use client";
import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// Built with Three.js primitives only

// EXHAUST PARTICLE SHADER
const exhaustVertexShader = `
  attribute float size;
  attribute float alpha;
  attribute float life;
  
  varying float vAlpha;
  varying float vLife;
  
  void main() {
    vAlpha = alpha;
    vLife = life;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const exhaustFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uCoreColor;
  
  varying float vAlpha;
  varying float vLife;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float strength = 1.0 - smoothstep(0.0, 0.5, dist);
    strength = pow(strength, 1.5);
    vec3 color = mix(uColor, uCoreColor, pow(1.0 - dist * 2.0, 2.0));
    color = mix(color, uCoreColor, vLife * 0.5);
    float alpha = strength * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;
// ENGINE GLOW SHADER
const engineGlowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const engineGlowFragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.0);
    float pulse = 0.85 + sin(uTime * 8.0) * 0.15;
    float alpha = fresnel * uIntensity * pulse;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
// Particle exhaust system
function ExhaustParticles({ position, direction, count = 100, spread = 0.1, speed = 2.0, color = "#a855f7" }: {
    position: [number, number, number];
    direction: [number, number, number];
    count?: number;
    spread?: number;
    speed?: number;
    color?: string;
}) {
    const pointsRef = useRef<THREE.Points>(null);
    const { positions, sizes, alphas, lives, velocities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const alphas = new Float32Array(count);
        const lives = new Float32Array(count);
        const velocities: THREE.Vector3[] = [];

        const dir = new THREE.Vector3(...direction).normalize();

        for (let i = 0; i < count; i++) {
            positions[i * 3] = position[0];
            positions[i * 3 + 1] = position[1];
            positions[i * 3 + 2] = position[2];
            sizes[i] = Math.random() * 0.06 + 0.02;
            alphas[i] = Math.random();
            lives[i] = Math.random();
            const vel = dir.clone();
            vel.x += (Math.random() - 0.5) * spread;
            vel.y += (Math.random() - 0.5) * spread;
            vel.z += (Math.random() - 0.5) * spread;
            vel.multiplyScalar(speed * (0.5 + Math.random() * 0.5));
            velocities.push(vel);
        }

        return { positions, sizes, alphas, lives, velocities };
    }, [count, position, direction, spread, speed]);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uCoreColor: { value: new THREE.Color("#ffffff") },
        },
        vertexShader: exhaustVertexShader,
        fragmentShader: exhaustFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }), [color]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        const geometry = pointsRef.current.geometry;
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const alphaAttr = geometry.attributes.alpha as THREE.BufferAttribute;
        const lifeAttr = geometry.attributes.life as THREE.BufferAttribute;

        const dir = new THREE.Vector3(...direction).normalize();

        for (let i = 0; i < count; i++) {
            let life = lifeAttr.getX(i);
            life -= delta * 1.8;

            if (life <= 0) {
                life = 1.0;
                posAttr.setXYZ(i, position[0], position[1], position[2]);
                velocities[i] = dir.clone();
                velocities[i].x += (Math.random() - 0.5) * spread;
                velocities[i].y += (Math.random() - 0.5) * spread;
                velocities[i].z += (Math.random() - 0.5) * spread;
                velocities[i].multiplyScalar(speed * (0.5 + Math.random() * 0.5));
            }

            const x = posAttr.getX(i) + velocities[i].x * delta;
            const y = posAttr.getY(i) + velocities[i].y * delta;
            const z = posAttr.getZ(i) + velocities[i].z * delta;
            posAttr.setXYZ(i, x, y, z);

            velocities[i].x += (Math.random() - 0.5) * 0.08 * delta;
            velocities[i].y += (Math.random() - 0.5) * 0.08 * delta;

            alphaAttr.setX(i, life * 0.75);
            lifeAttr.setX(i, life);
        }

        posAttr.needsUpdate = true;
        alphaAttr.needsUpdate = true;
        lifeAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} material={material}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
                <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} args={[sizes, 1]} />
                <bufferAttribute attach="attributes-alpha" count={count} array={alphas} itemSize={1} args={[alphas, 1]} />
                <bufferAttribute attach="attributes-life" count={count} array={lives} itemSize={1} args={[lives, 1]} />
            </bufferGeometry>
        </points>
    );
}

// Engine glow component
function EngineGlow({ position, color = "#a855f7", intensity = 1.0, scale = 1 }: {
    position: [number, number, number];
    color?: string;
    intensity?: number;
    scale?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uIntensity: { value: intensity },
            uTime: { value: 0 },
        },
        vertexShader: engineGlowVertexShader,
        fragmentShader: engineGlowFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
    }), [color, intensity]);

    useFrame((state) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} position={position} material={material} scale={scale}>
            <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
    );
}

// Material definitions matching the reference model
const navyBlueMaterial = { color: "#2a4a6b", roughness: 0.4, metalness: 0.8 };
const lightGreyMaterial = { color: "#8899aa", roughness: 0.45, metalness: 0.7 };
const darkGreyMaterial = { color: "#3a4550", roughness: 0.5, metalness: 0.6 };
const cockpitMaterial = { color: "#1a2530", roughness: 0.1, metalness: 0.95 };
const engineCasingMaterial = { color: "#4a6a8a", roughness: 0.35, metalness: 0.85 };

export default function Spaceship() {
    const orbitRef = useRef<THREE.Group>(null);
    const shipRef = useRef<THREE.Group>(null);
    const [randomOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Orbit around planet
        if (orbitRef.current) {
            orbitRef.current.rotation.y = time * 0.1 + randomOffset;
            orbitRef.current.position.y = Math.sin(time * 0.25) * 0.2;
        }

        // Ship banking and movement
        if (shipRef.current) {
            shipRef.current.rotation.z = Math.sin(time * 0.6) * 0.12;
            shipRef.current.rotation.x = Math.sin(time * 0.4) * 0.04;
        }
    });

    return (
        <group ref={orbitRef}>
            {/* Position ship at orbit radius */}
            <group position={[4.2, 0.4, 0]}>
                {/* Ship body with orientation (nose forward in orbit direction) */}
                <group ref={shipRef} rotation={[0, -Math.PI / 2, 0]} scale={0.22}>

                    {/* ========== MAIN FUSELAGE ========== */}

                    {/* Nose Section - Long tapered front */}
                    <mesh position={[2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <coneGeometry args={[0.25, 1.8, 6]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>

                    {/* Nose probes - dual prongs */}
                    <mesh position={[3.3, 0.05, 0.08]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.03, 0.02, 0.8, 6]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>
                    <mesh position={[3.3, 0.05, -0.08]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.03, 0.02, 0.8, 6]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>

                    {/* Mid fuselage - main body */}
                    <mesh position={[0.8, 0, 0]}>
                        <boxGeometry args={[2.0, 0.4, 0.6]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>

                    {/* Hull panel details */}
                    <mesh position={[0.6, 0.22, 0]}>
                        <boxGeometry args={[1.6, 0.03, 0.5]} />
                        <meshStandardMaterial {...lightGreyMaterial} />
                    </mesh>

                    {/* Rear fuselage - blocky section */}
                    <mesh position={[-0.8, 0, 0]}>
                        <boxGeometry args={[1.4, 0.5, 0.7]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>

                    {/* Top grill/vent details */}
                    <mesh position={[-0.8, 0.28, 0]}>
                        <boxGeometry args={[1.0, 0.06, 0.5]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>
                    {/* Grill lines */}
                    {[-0.15, 0, 0.15].map((z, i) => (
                        <mesh key={i} position={[-0.8, 0.32, z]}>
                            <boxGeometry args={[0.9, 0.02, 0.06]} />
                            <meshStandardMaterial color="#1a2530" roughness={0.6} metalness={0.5} />
                        </mesh>
                    ))}

                    {/* ========== COCKPIT ========== */}

                    {/* Cockpit bubble - teardrop shape */}
                    <mesh position={[1.2, 0.35, 0]} scale={[1.2, 0.8, 0.7]}>
                        <sphereGeometry args={[0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial
                            {...cockpitMaterial}
                            transparent
                            opacity={0.85}
                        />
                    </mesh>

                    {/* Cockpit base frame */}
                    <mesh position={[1.2, 0.22, 0]}>
                        <cylinderGeometry args={[0.28, 0.3, 0.1, 8]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>

                    {/* ========== WINGS - STEPPED ANGULAR DESIGN ========== */}

                    {/* Main wing plates - Left */}
                    <mesh position={[0.2, -0.08, 1.0]} rotation={[0.08, 0, 0.05]}>
                        <boxGeometry args={[1.8, 0.08, 1.2]} />
                        <meshStandardMaterial {...lightGreyMaterial} />
                    </mesh>

                    {/* Wing stepped edge - Left */}
                    <mesh position={[-0.2, -0.04, 1.5]} rotation={[0.1, 0, 0.08]}>
                        <boxGeometry args={[1.0, 0.06, 0.5]} />
                        <meshStandardMaterial {...lightGreyMaterial} />
                    </mesh>

                    {/* Wing accent stripe - Left */}
                    <mesh position={[0.3, 0.02, 0.9]}>
                        <boxGeometry args={[1.4, 0.03, 0.15]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>

                    {/* Main wing plates - Right */}
                    <mesh position={[0.2, -0.08, -1.0]} rotation={[-0.08, 0, 0.05]}>
                        <boxGeometry args={[1.8, 0.08, 1.2]} />
                        <meshStandardMaterial {...lightGreyMaterial} />
                    </mesh>

                    {/* Wing stepped edge - Right */}
                    <mesh position={[-0.2, -0.04, -1.5]} rotation={[-0.1, 0, 0.08]}>
                        <boxGeometry args={[1.0, 0.06, 0.5]} />
                        <meshStandardMaterial {...lightGreyMaterial} />
                    </mesh>

                    {/* Wing accent stripe - Right */}
                    <mesh position={[0.3, 0.02, -0.9]}>
                        <boxGeometry args={[1.4, 0.03, 0.15]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>

                    {/* Vertical stabilizers - Left */}
                    <mesh position={[-0.6, 0.15, 1.4]} rotation={[0.15, 0, 0]}>
                        <boxGeometry args={[0.3, 0.35, 0.06]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>

                    {/* Vertical stabilizers - Right */}
                    <mesh position={[-0.6, 0.15, -1.4]} rotation={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.3, 0.35, 0.06]} />
                        <meshStandardMaterial {...navyBlueMaterial} />
                    </mesh>

                    {/* ========== ENGINE PODS ========== */}

                    {/* Left main engine housing */}
                    <mesh position={[-1.0, 0.1, 0.7]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.32, 0.35, 1.0, 12]} />
                        <meshStandardMaterial {...engineCasingMaterial} />
                    </mesh>

                    {/* Left engine intake ring */}
                    <mesh position={[-0.45, 0.1, 0.7]} rotation={[0, 0, Math.PI / 2]}>
                        <torusGeometry args={[0.28, 0.05, 8, 16]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>

                    {/* Left engine exhaust cone */}
                    <mesh position={[-1.55, 0.1, 0.7]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.25, 0.3, 12]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>

                    {/* Left engine inner glow */}
                    <mesh position={[-1.5, 0.1, 0.7]}>
                        <sphereGeometry args={[0.15, 12, 12]} />
                        <meshBasicMaterial color="#d946ef" />
                    </mesh>

                    {/* Right main engine housing */}
                    <mesh position={[-1.0, 0.1, -0.7]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.32, 0.35, 1.0, 12]} />
                        <meshStandardMaterial {...engineCasingMaterial} />
                    </mesh>

                    {/* Right engine intake ring */}
                    <mesh position={[-0.45, 0.1, -0.7]} rotation={[0, 0, Math.PI / 2]}>
                        <torusGeometry args={[0.28, 0.05, 8, 16]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>

                    {/* Right engine exhaust cone */}
                    <mesh position={[-1.55, 0.1, -0.7]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.25, 0.3, 12]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>

                    {/* Right engine inner glow */}
                    <mesh position={[-1.5, 0.1, -0.7]}>
                        <sphereGeometry args={[0.15, 12, 12]} />
                        <meshBasicMaterial color="#d946ef" />
                    </mesh>

                    {/* ========== SECONDARY THRUSTERS ========== */}

                    {/* Aux thrusters - inner left */}
                    <mesh position={[-1.2, 0, 0.28]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>
                    <mesh position={[-1.35, 0, 0.28]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        <meshBasicMaterial color="#c084fc" />
                    </mesh>

                    {/* Aux thrusters - inner right */}
                    <mesh position={[-1.2, 0, -0.28]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>
                    <mesh position={[-1.35, 0, -0.28]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        <meshBasicMaterial color="#c084fc" />
                    </mesh>

                    {/* ========== FORWARD DETAILS ========== */}

                    {/* Sensor/cannon tubes on nose */}
                    <mesh position={[1.8, -0.1, 0.2]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>
                    <mesh position={[1.8, -0.1, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
                        <meshStandardMaterial {...darkGreyMaterial} />
                    </mesh>

                    {/* ========== ENGINE GLOW EFFECTS ========== */}
                    <EngineGlow position={[-1.6, 0.1, 0.7]} color="#d946ef" intensity={1.5} scale={2} />
                    <EngineGlow position={[-1.6, 0.1, -0.7]} color="#d946ef" intensity={1.5} scale={2} />
                    <EngineGlow position={[-1.4, 0, 0.28]} color="#c084fc" intensity={1.0} scale={1} />
                    <EngineGlow position={[-1.4, 0, -0.28]} color="#c084fc" intensity={1.0} scale={1} />

                    {/* ========== POINT LIGHTS ========== */}
                    <pointLight position={[-1.6, 0.1, 0.7]} distance={3} intensity={5} color="#d946ef" />
                    <pointLight position={[-1.6, 0.1, -0.7]} distance={3} intensity={5} color="#d946ef" />
                    <pointLight position={[-1.4, 0, 0.28]} distance={1.5} intensity={2} color="#c084fc" />
                    <pointLight position={[-1.4, 0, -0.28]} distance={1.5} intensity={2} color="#c084fc" />

                    {/* ========== EXHAUST PARTICLES ========== */}
                    {/* Main engines */}
                    <ExhaustParticles
                        position={[-1.7, 0.1, 0.7]}
                        direction={[-1, 0, 0]}
                        count={100}
                        spread={0.12}
                        speed={2.0}
                        color="#d946ef"
                    />
                    <ExhaustParticles
                        position={[-1.7, 0.1, -0.7]}
                        direction={[-1, 0, 0]}
                        count={100}
                        spread={0.12}
                        speed={2.0}
                        color="#d946ef"
                    />

                    {/* Aux thrusters */}
                    <ExhaustParticles
                        position={[-1.45, 0, 0.28]}
                        direction={[-1, 0, 0]}
                        count={40}
                        spread={0.08}
                        speed={1.2}
                        color="#c084fc"
                    />
                    <ExhaustParticles
                        position={[-1.45, 0, -0.28]}
                        direction={[-1, 0, 0]}
                        count={40}
                        spread={0.08}
                        speed={1.2}
                        color="#c084fc"
                    />
                </group>
            </group>
        </group>
    );
}
