"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ===========================================
// SKILLS DATA - Edit this to change your skills
// ===========================================
const skillsData = {
    "Programming Languages": {
        icon: "💻",
        skills: ["Python", "C/C++", "Java", "JavaScript", "TypeScript"],
    },
    "Systems & Security": {
        icon: "🔒",
        skills: [
            "Linux Kernel",
            "eBPF",
            "BCC",
            "Syscall Tracing",
            "Network Monitoring",
            "Runtime Security",
        ],
    },
    "Web Development": {
        icon: "🌐",
        skills: ["React.js", "Next.js", "REST APIs", "Tailwind CSS", "FastAPI"],
    },
    "DevOps & Tools": {
        icon: "🛠",
        skills: ["Docker", "Kubernetes", "Git/GitHub", "CI/CD"],
    },
    Languages: {
        icon: "🗣",
        skills: ["Arabic (Native)", "English (B2)", "French (B1)"],
    },
    "Soft Skills": {
        icon: "🤝",
        skills: ["Communication", "Problem Solving", "Adaptability", "Leadership"],
    },
};

function SkillCategory({
    category,
    data,
    index,
}: {
    category: string;
    data: { icon: string; skills: string[] };
    index: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
        >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{data.icon}</span>
                <h3 className="text-lg font-medium font-[family-name:var(--font-inter)]">
                    {category}
                </h3>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                    <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                        className="px-3 py-1.5 text-sm text-[var(--text-muted)] bg-white/5 rounded-full group-hover:bg-white/10 transition-colors"
                    >
                        {skill}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
}

export default function Skills() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="skills"
            ref={ref}
            className="relative py-32 bg-[var(--background-light)]"
        >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

            <div className="section max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-small text-[var(--accent-purple)] mb-4 block">
                        Technical Arsenal
                    </span>
                    <h2 className="heading-lg text-[var(--text-secondary)] font-[family-name:var(--font-playfair)]">
                        Skills & Technologies
                    </h2>
                </motion.div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(skillsData).map(([category, data], index) => (
                        <SkillCategory
                            key={category}
                            category={category}
                            data={data}
                            index={index}
                        />
                    ))}
                </div>

                {/* Certifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-6 font-[family-name:var(--font-inter)]">
                        Certifications
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://www.coursera.org/account/accomplishments/records/IY84IC4BEVLP"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 glass text-[var(--text-secondary)] rounded-full text-sm hover:bg-white/20 transition-colors"
                        >
                            Foundations of Cybersecurity - Google
                        </a>
                        <a
                            href="https://www.coursera.org/account/accomplishments/records/279U97HCWSL6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 glass text-[var(--text-secondary)] rounded-full text-sm hover:bg-white/20 transition-colors"
                        >
                            Play It Safe: Manage Security Risks - Google
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative gradient bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
