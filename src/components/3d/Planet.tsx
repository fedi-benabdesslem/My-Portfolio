"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// CINEMATIC PLANET - PHYSICALLY ACCURATE 3D
// Enhanced with realistic Fresnel atmospheric scattering

// ----- PLANET SURFACE SHADER -----
const planetVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const planetFragmentShader = `
  uniform float uTime;
  uniform vec3 uStarDirection;
  uniform vec3 uBaseColor;
  uniform vec3 uShadowColor;
  uniform vec3 uHighlightColor;
  uniform vec3 uEmissiveColor;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;
  
  // Noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 xv = x_ * ns.x + ns.yyyy;
    vec4 yv = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(xv) - abs(yv);
    vec4 b0 = vec4(xv.xy, yv.xy);
    vec4 b1 = vec4(xv.zw, yv.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 5; i++) {
      if(i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uStarDirection);
    vec3 V = normalize(vViewDirection);
    
    float NdotL = dot(N, L);
    
    // Terminator with soft transition
    float daylight = smoothstep(-0.15, 0.35, NdotL);
    float terminator = smoothstep(-0.05, 0.05, NdotL) * smoothstep(0.25, 0.05, NdotL);
    
    // Surface detail
    vec3 noisePos = vPosition * 2.0;
    float continents = fbm(noisePos * 0.5, 4) * 0.5 + 0.5;
    float albedoVariation = snoise(noisePos * 1.5 + vec3(uTime * 0.005, 0.0, 0.0)) * 0.15;
    float microNoise = snoise(noisePos * 8.0) * 0.05;
    float surfaceDetail = continents + albedoVariation + microNoise;
    
    // Clouds
    vec3 cloudPos = vPosition * 1.2 + vec3(uTime * 0.008, uTime * 0.004, 0.0);
    float cloudNoise = fbm(cloudPos, 4) * 0.5 + 0.5;
    float clouds = smoothstep(0.45, 0.7, cloudNoise);
    float wisps = snoise(cloudPos * vec3(3.0, 1.0, 3.0)) * 0.5 + 0.5;
    wisps = smoothstep(0.5, 0.8, wisps) * 0.3;
    
    // Aurora
    float auroraLat = abs(vPosition.y / 2.0);
    float auroraNoise = snoise(vec3(vPosition.x * 2.0, uTime * 0.03, vPosition.z * 2.0));
    float aurora = smoothstep(0.6, 0.9, auroraLat) * smoothstep(0.3, 0.7, auroraNoise) * 0.15;
    
    // Energy fissures
    float fissurePattern = snoise(noisePos * 4.0 + vec3(0.0, uTime * 0.01, 0.0));
    float fissures = smoothstep(0.65, 0.75, abs(fissurePattern)) * (1.0 - daylight) * 0.08;
    
    // Color composition
    vec3 surfaceColor = mix(uShadowColor, uBaseColor, surfaceDetail * 0.6 + 0.4);
    vec3 litSurface = mix(uShadowColor * 0.3, surfaceColor, daylight);
    vec3 highlightArea = uHighlightColor * pow(max(NdotL, 0.0), 2.0) * 0.15;
    vec3 cloudColor = vec3(0.6, 0.5, 0.65) * (clouds + wisps) * daylight * 0.25;
    vec3 terminatorGlow = vec3(0.5, 0.2, 0.35) * terminator * 0.2;
    vec3 auroraColor = vec3(0.3, 0.8, 0.6) * aurora * (1.0 - daylight * 0.5);
    vec3 fissureGlow = uEmissiveColor * fissures;
    
    // Subsurface scattering
    float sss = pow(max(0.0, -NdotL + 0.3), 2.0) * 0.08;
    vec3 subsurface = uEmissiveColor * sss;
    
    vec3 finalColor = litSurface + highlightArea + cloudColor + terminatorGlow + auroraColor + fissureGlow + subsurface;
    finalColor += uShadowColor * 0.02 * (1.0 - daylight);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
// ENHANCED FRESNEL ATMOSPHERE SHADER
// Realistic atmospheric scattering with depth and luminosity
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying float vFresnel;
  varying float vAtmosphereDepth;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = normalize(-mvPosition.xyz);
    
    // Calculate Fresnel at vertex level for smooth interpolation
    float NdotV = dot(vNormal, vViewDirection);
    vFresnel = pow(1.0 - abs(NdotV), 2.5);
    
    // Atmosphere depth - how deep into atmosphere we're looking
    vAtmosphereDepth = 1.0 - abs(NdotV);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragmentShader = `
  uniform float uTime;
  uniform vec3 uStarDirection;
  uniform vec3 uInnerColor;   // Near-white/pink
  uniform vec3 uMidColor;     // Magenta
  uniform vec3 uOuterColor;   // Deep violet
  uniform float uIntensity;
  uniform float uScatterPower;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying float vFresnel;
  varying float vAtmosphereDepth;
  
  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uStarDirection);
    vec3 V = normalize(vViewDirection);
    
    // Light-facing calculation
    float NdotL = dot(vWorldNormal, L);
    float lightFacing = max(NdotL, 0.0);
    float shadowSide = max(-NdotL, 0.0);
    
    // ----- REALISTIC FRESNEL SCATTERING -----
    // Fresnel intensity increases where surface curves away from camera
    float fresnel = pow(1.0 - abs(dot(N, V)), uScatterPower);
    
    // Enhanced edge glow using multiple Fresnel terms
    float fresnelSoft = pow(1.0 - abs(dot(N, V)), 2.0);  // Wider, softer glow
    float fresnelSharp = pow(1.0 - abs(dot(N, V)), 5.0); // Sharp edge highlight
    
    // Combine for realistic depth
    float rimGlow = fresnelSoft * 0.6 + fresnelSharp * 0.4;
    
    // ----- LIGHT-DEPENDENT SCATTERING -----
    // Strong glow on light-facing limb
    float lightRim = rimGlow * (0.25 + lightFacing * 0.75);
    
    // Subtle scatter on shadow side (atmospheric bleed)
    float shadowRim = fresnelSoft * shadowSide * 0.15;
    
    // Forward scattering simulation (light passing through atmosphere)
    float forwardScatter = pow(max(dot(V, L), 0.0), 4.0) * fresnel * 0.3;
    
    float totalRim = lightRim + shadowRim + forwardScatter;
    
    // ----- LAYERED COLOR GRADIENT -----
    // Simulate looking through varying atmosphere density
    // Inner (close to surface) = brightest, warmest
    // Outer (edge of atmosphere) = cooler, deeper
    
    float depthGradient = pow(vAtmosphereDepth, 1.2);
    
    // Three-way color blend based on depth
    vec3 color1 = mix(uInnerColor, uMidColor, smoothstep(0.0, 0.4, depthGradient));
    vec3 color2 = mix(color1, uOuterColor, smoothstep(0.3, 0.9, depthGradient));
    
    // Light-side color enhancement (warmer, brighter)
    vec3 litColor = mix(color2, uInnerColor * 1.2, lightFacing * 0.35);
    
    // ----- ATMOSPHERIC MOTION -----
    // Subtle turbulence suggesting atmospheric dynamics
    float turbulence = sin(vPosition.x * 4.0 + uTime * 0.12) * 
                       sin(vPosition.y * 3.0 + uTime * 0.08) * 
                       sin(vPosition.z * 4.0 + uTime * 0.1) * 0.06;
    
    // Uneven density (suggests clouds, storms)
    float unevenness = 0.9 + sin(atan(vPosition.z, vPosition.x) * 5.0 + uTime * 0.1) * 0.1;
    unevenness *= 0.95 + sin(vPosition.y * 8.0 + uTime * 0.15) * 0.05;
    
    totalRim *= unevenness;
    totalRim += turbulence * totalRim * 0.5;
    
    // Final alpha with gradient opacity
    float alpha = totalRim * uIntensity;
    alpha = clamp(alpha, 0.0, 1.0);
    
    // Apply subtle color shift at very edge
    vec3 finalColor = mix(litColor, uOuterColor, pow(fresnel, 3.0) * 0.3);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
// INNER GLOW SHADER (surface-hugging atmospheric glow)
const innerGlowFragmentShader = `
  uniform float uTime;
  uniform vec3 uStarDirection;
  uniform vec3 uGlowColor;
  uniform float uIntensity;
  
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying float vFresnel;
  
  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uStarDirection);
    vec3 V = normalize(vViewDirection);
    
    float NdotL = dot(vWorldNormal, L);
    float lightFacing = max(NdotL, 0.0);
    
    // Very tight Fresnel for surface glow
    float fresnel = pow(1.0 - abs(dot(N, V)), 4.5);
    
    // Concentrated on light side with soft falloff
    float glow = fresnel * (0.15 + lightFacing * 0.85);
    
    // Subtle pulsing for life
    glow *= 0.92 + sin(uTime * 0.5) * 0.08;
    
    float alpha = glow * uIntensity;
    
    gl_FragColor = vec4(uGlowColor, alpha);
  }
`;

// BLOOM HIGHLIGHT (only the brightest rim)
const bloomFragmentShader = `
  uniform vec3 uStarDirection;
  uniform vec3 uBloomColor;
  uniform float uIntensity;
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying float vFresnel;
  
  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uStarDirection);
    vec3 V = normalize(vViewDirection);
    
    float NdotL = dot(vWorldNormal, L);
    float lightFacing = max(NdotL, 0.0);
    
    // Very sharp Fresnel for bloom only at extreme edge
    float fresnel = pow(1.0 - abs(dot(N, V)), 6.0);
    
    // Only bloom where light is strongest
    float bloom = fresnel * pow(lightFacing, 2.5);
    
    // Slight flicker
    bloom *= 0.95 + sin(uTime * 1.5) * 0.05;
    
    float alpha = bloom * uIntensity;
    
    gl_FragColor = vec4(uBloomColor, alpha);
  }
`;

// OUTER HAZE (depth separation)
const outerHazeFragmentShader = `
  uniform float uTime;
  uniform vec3 uHazeColor;
  uniform float uIntensity;
  
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying float vFresnel;
  
  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDirection);
    
    // Very soft wide glow for depth separation
    float fresnel = pow(1.0 - abs(dot(N, V)), 1.8);
    
    // Gentle breathing
    float alpha = fresnel * uIntensity * (0.88 + sin(uTime * 0.25) * 0.12);
    
    gl_FragColor = vec4(uHazeColor, alpha * 0.35);
  }
`;

export default function Planet() {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const outerHazeRef = useRef<THREE.Mesh>(null);
  const bloomRef = useRef<THREE.Mesh>(null);
  // Custom scroll tracking refs
  const scrollRef = useRef({ offset: 0, delta: 0, velocity: 0 });
  // native scroll listener
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const offset = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);

      const deltaY = scrollY - lastScrollY;
      // Normalize delta roughly to 0-1 range based on viewport
      const delta = deltaY / window.innerHeight;

      scrollRef.current.offset = offset;
      scrollRef.current.delta = delta;

      lastScrollY = scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Star light source direction
  const starDirection = useMemo(() => new THREE.Vector3(1.5, 0.6, 0.8).normalize(), []);
  const initialStarDir = useRef(starDirection.clone());

  // MATERIALS
  const planetMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uStarDirection: { value: starDirection },
      uBaseColor: { value: new THREE.Color("#2d1b4e") },
      uShadowColor: { value: new THREE.Color("#0a0612") },
      uHighlightColor: { value: new THREE.Color("#6b3fa0") },
      uEmissiveColor: { value: new THREE.Color("#9f1239") },
    },
    vertexShader: planetVertexShader,
    fragmentShader: planetFragmentShader,
  }), [starDirection]);
  const atmosphereMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uStarDirection: { value: starDirection },
      uInnerColor: { value: new THREE.Color("#fce7f3") },
      uMidColor: { value: new THREE.Color("#e879f9") },
      uOuterColor: { value: new THREE.Color("#7c3aed") },
      uIntensity: { value: 1.2 },
      uScatterPower: { value: 3.5 },
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  }), [starDirection]);
  const innerGlowMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uStarDirection: { value: starDirection },
      uGlowColor: { value: new THREE.Color("#f5d0fe") },
      uIntensity: { value: 0.8 },
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: innerGlowFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  }), [starDirection]);
  const bloomMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uStarDirection: { value: starDirection },
      uBloomColor: { value: new THREE.Color("#fdf4ff") },
      uIntensity: { value: 0.9 },
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: bloomFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  }), [starDirection]);
  const outerHazeMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uHazeColor: { value: new THREE.Color("#8b5cf6") },
      uIntensity: { value: 0.5 },
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: outerHazeFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  }), []);
  // Animation Loop - Physics & Scroll Reactivity
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { offset, delta } = scrollRef.current;
    // 1. INERTIAL ROTATION (Mass simulation)
    if (planetRef.current) {
      // Base rotation (slow drift)
      planetRef.current.rotation.y += 0.0003;
      // Scroll-based rotation (target max 18 degrees = ~0.3 radians)
      const targetRotationY = offset * 0.3;
      // Smooth interpolation for heavy feel
      planetRef.current.rotation.x = THREE.MathUtils.lerp(
        planetRef.current.rotation.x,
        targetRotationY * 0.2, // Slight tilt
        0.05
      );
      // Add scroll velocity to Y rotation (spin faster when scrolling)
      planetRef.current.rotation.y += delta * 5.0; // Scaled for effect
      (planetRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    }
    // 2. ATMOSPHERIC BREATHING (Life cue)
    const breathing = Math.sin(time * 0.8) * 0.04;
    const scrollExcitement = offset * 0.15;
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
      mat.uniforms.uIntensity.value = 1.2 + breathing + scrollExcitement;
    }
    if (innerGlowRef.current) {
      (innerGlowRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    }
    if (bloomRef.current) {
      const mat = bloomRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
      // Dim bloom slightly during fast motion
      mat.uniforms.uIntensity.value = 0.9 - Math.min(Math.abs(delta) * 10, 0.3);
    }
    if (outerHazeRef.current) {
      (outerHazeRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    }
    // 3. LIGHT ANGLE DRIFT (Scale cue)
    // Max rotation 6 degrees (~0.1 radians)
    const lightRot = offset * 0.1;
    const newDir = initialStarDir.current.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), lightRot);
    // Update uniforms
    if (planetRef.current) (planetRef.current.material as THREE.ShaderMaterial).uniforms.uStarDirection.value.copy(newDir);
    if (atmosphereRef.current) (atmosphereRef.current.material as THREE.ShaderMaterial).uniforms.uStarDirection.value.copy(newDir);
    if (innerGlowRef.current) (innerGlowRef.current.material as THREE.ShaderMaterial).uniforms.uStarDirection.value.copy(newDir);
    if (bloomRef.current) (bloomRef.current.material as THREE.ShaderMaterial).uniforms.uStarDirection.value.copy(newDir);
  });
  return (
    <group>
      {/* Planet Surface */}
      <mesh ref={planetRef} material={planetMaterial}>
        <sphereGeometry args={[2, 128, 128]} />
      </mesh>

      {/* Inner Atmospheric Glow (surface-hugging) */}
      <mesh ref={innerGlowRef} material={innerGlowMaterial} scale={[1.018, 1.018, 1.018]}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
      {/* Bloom Highlight (brightest rim only) */}
      <mesh ref={bloomRef} material={bloomMaterial} scale={[1.035, 1.035, 1.035]}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
      {/* Main Volumetric Atmosphere */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial} scale={[1.07, 1.07, 1.07]}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
      {/* Outer Atmospheric Haze (depth separation) */}
      <mesh ref={outerHazeRef} material={outerHazeMaterial} scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[2, 48, 48]} />
      </mesh>
      {/* Depth Separation Haze */}
      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#6d28d9"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}