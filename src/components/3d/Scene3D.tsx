"use client";
import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles, Environment } from "@react-three/drei";
import Planet from "./Planet";
import Spaceship from "./Spaceship";
// NO MAN'S SKY INSPIRED SCENE
export default function Scene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            {/* Background Atmosphere/Fog */}
            <color attach="background" args={["#000000"]} />
            {/* Note: I use transparent in canvas style, but adding a fog helps blend */}
            <fog attach="fog" args={['#2d0a3d', 5, 20]} />
            {/* Space Background */}
            <Stars
                radius={300}
                depth={50}
                count={7000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
            />
            {/* Nebula / Dust Particles */}
            <Sparkles
                color="#a855f7"
                count={500}
                scale={12}
                size={8}
                speed={0.2}
                opacity={0.4}
                noise={0.5}
            />
            <Sparkles
                color="#ec4899"
                count={300}
                scale={15}
                size={10}
                speed={0.3}
                opacity={0.2}
            />
            {/* Lighting */}
            <ambientLight intensity={0.4} color="#581c87" /> {/* Brighter, rich purple ambient */}

            {/* Main "Sun" Light */}
            <directionalLight
                position={[10, 5, 5]}
                intensity={2}
                color="#ffedd5"
            />
            {/* Rim Light for Dramatic Edge */}
            <spotLight
                position={[-10, 0, -5]}
                intensity={5}
                color="#d946ef"
                angle={0.5}
                penumbra={1}
            />
            {/* Fill Light */}
            <pointLight position={[0, -10, 5]} intensity={0.5} color="#4338ca" />
            {/* Scene Objects */}
            <Planet />
            <Spaceship />
            {/* Blank Space for Adding another object like a spacship further in the project */}
        </Canvas>
    );
}