"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// ===========================================
// ABOUT CONTENT - Edit this to change your bio
// ===========================================
const aboutContent = {
    tagline: "Who I Am",
    headline: "Synthesizing first principles with pragmatic engineering to build scalable systems.",
    description: `A Computer Science engineering student with a deep interest in bridging the gap 
  between rigorous mathematical theory and practical engineering. I transform complex low-level 
  mechanics into intuitive, artistic solutions that solve modern engineering challenges.`,
    highlights: [
        {
            label: "Profession",
            value: "Software Engineering",
        },
        {
            label: "Current Status",
            value: "Engineering Student @ ENISo",
        },
        {
            label: "Passion",
            value: "Kernel & Security",
        },
    ],
};

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="about"
            ref={ref}
            className="relative py-32 bg-[var(--background-light)]"
        >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

            <div className="section max-w-6xl">
                {/* Section Tag */}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-small text-[var(--accent-purple)] mb-8 block"
                >
                    {aboutContent.tagline}
                </motion.span>

                <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                    {/* Left - Headline */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h2 className="heading-lg text-[var(--text-secondary)] leading-tight">
                            <span className="font-[family-name:var(--font-playfair)]">
                                {aboutContent.headline}
                            </span>
                        </h2>
                    </motion.div>

                    {/* Right - Description */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-8"
                    >
                        <p className="body-text text-[var(--text-secondary)]/70 leading-relaxed">
                            {aboutContent.description}
                        </p>

                        {/* Highlights Grid */}
                        <div className="grid grid-cols-3 gap-6 pt-4">
                            {aboutContent.highlights.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    className="text-center md:text-left"
                                >
                                    <span className="text-small text-[var(--text-secondary)]/50 block mb-2">
                                        {item.label}
                                    </span>
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                                        {item.value}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative gradient bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
