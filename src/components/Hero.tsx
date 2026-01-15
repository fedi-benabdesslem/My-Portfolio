"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import("./3d/Scene3D"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-orange)] via-[var(--accent-purple)] to-[var(--accent-blue)] opacity-50 animate-pulse" />
        </div>
    ),
});

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
        >
            {/* Background gradient glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-purple)] rounded-full blur-[150px] opacity-20 animate-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-orange)] rounded-full blur-[150px] opacity-20 animate-glow" style={{ animationDelay: "1.5s" }} />
            </div>

            {/* 3D Scene Container */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div
                    style={{ y }}
                    className="w-full h-full"
                >
                    <Scene3D />
                </motion.div>
            </div>

            {/* Hero Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 w-full max-w-7xl mx-auto px-6"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left Text */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-left"
                    >
                        <h1 className="heading-xl">
                            <span className="font-[family-name:var(--font-playfair)] italic">
                                Engineering
                            </span>
                        </h1>
                        <h1 className="heading-xl text-[var(--text-muted)]">
                            <span className="font-[family-name:var(--font-playfair)]">
                                elegant
                            </span>
                        </h1>
                    </motion.div>

                    {/* Right Text */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-right"
                    >
                        <h1 className="heading-xl text-[var(--text-muted)]">
                            <span className="font-[family-name:var(--font-playfair)]">
                                solutions
                            </span>
                        </h1>
                        <h1 className="heading-xl">
                            <span className="font-[family-name:var(--font-playfair)] italic gradient-text">
                                through code
                            </span>
                        </h1>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-small text-[var(--text-muted)]">
                    Scroll to explore
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
                >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
                </motion.div>
            </motion.div>
        </section>
    );
}
