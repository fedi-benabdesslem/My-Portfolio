"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ===========================================
// EDUCATION DATA - Edit this to change your education
// ===========================================
const educationData = [
    {
        id: 1,
        institution: "National School of Engineers in Sousse - ENISo",
        location: "Sousse, Tunisia",
        degree: "Master's-level degree in Applied Computer Science Engineering",
        period: "September 2025 - Present",
        highlights: [
            "Experience working on engineering and research-oriented projects",
            "Focus on practical, project-based learning and real-world problem solving",
            "Coursework covering algorithms, operating systems, networks, databases, and web technologies",
        ],
        gradient: "from-[var(--accent-purple)] to-[var(--accent-blue)]",
    },
    {
        id: 2,
        institution: "Monastir Preparatory Engineering Institute",
        location: "Monastir, Tunisia",
        degree: "Physics & Technology Pre-Engineering Studies",
        period: "September 2023 - June 2025",
        highlights: [
            "Intensive and highly selective two-year scientific program",
            "Rank: 99/769 in the national entrance exam for engineering schools",
            "Courses: Analysis, Calculus, Algebra, Physics, Chemistry, Computer Science, Engineering Science",
        ],
        gradient: "from-[var(--accent-orange)] to-[var(--accent-purple)]",
    },
];

function EducationCard({
    education,
    index,
}: {
    education: (typeof educationData)[0];
    index: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.article
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative group"
        >
            {/* Timeline line */}
            {index < educationData.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent hidden md:block" />
            )}

            <div className="flex gap-6 md:gap-8">
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${education.gradient} flex items-center justify-center shadow-lg`}
                    >
                        <span className="text-lg">🎓</span>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 glass rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300">
                    {/* Period Badge */}
                    <span className="inline-block px-3 py-1 text-xs font-medium text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 rounded-full mb-4">
                        {education.period}
                    </span>

                    {/* Institution */}
                    <h3 className="heading-md font-[family-name:var(--font-playfair)] text-white mb-2">
                        {education.institution}
                    </h3>

                    {/* Degree */}
                    <p className="text-[var(--text-muted)] mb-1">{education.degree}</p>

                    {/* Location */}
                    <p className="text-sm text-[var(--text-muted)]/70 mb-6 flex items-center gap-2">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        {education.location}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-2">
                        {education.highlights.map((highlight, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.4, delay: index * 0.15 + 0.3 + i * 0.1 }}
                                className="flex items-start gap-3 text-sm text-[var(--text-muted)]"
                            >
                                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${education.gradient} mt-2 flex-shrink-0`} />
                                {highlight}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.article>
    );
}

export default function Education() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="education"
            ref={ref}
            className="relative py-32 bg-black"
        >
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-purple)] rounded-full blur-[300px] opacity-5" />
            </div>

            <div className="section max-w-4xl relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-small text-[var(--accent-purple)] mb-4 block">
                        Academic Journey
                    </span>
                    <h2 className="heading-lg font-[family-name:var(--font-playfair)]">
                        Education &{" "}
                        <span className="italic gradient-text">Formation</span>
                    </h2>
                </motion.div>

                {/* Education Timeline */}
                <div className="space-y-8">
                    {educationData.map((education, index) => (
                        <EducationCard
                            key={education.id}
                            education={education}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
