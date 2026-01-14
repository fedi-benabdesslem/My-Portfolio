"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ===========================================
// PROJECTS DATA - Edit this to add/change projects
// ===========================================
const projectsData = [
    {
        id: 1,
        title: "Container Security Visualizer",
        subtitle: "Real-time Docker monitoring with eBPF",
        description:
            "Designed and implemented a container behavior monitoring system providing real-time syscall and network-level observability for Docker containers without modifying application code.",
        tags: ["eBPF", "C", "Python", "Docker", "Linux Kernel"],
        highlights: [
            "eBPF programs for syscall & TCP tracing",
            "Host-based monitoring via cgroups",
            "Zero app-code modifications",
        ],
        link: "https://github.com/fedi-benabdesslem/Container-Security-Visualizer",
        gradient: "from-[var(--accent-orange)] to-[var(--accent-purple)]",
    },
    {
        id: 2,
        title: "AI Writing Assistant",
        subtitle: "Professional content transformation platform",
        description:
            "Designed and developed a responsive frontend application for an AI-powered writing assistant that transforms draft emails and meeting minutes into professional content.",
        tags: ["React.js", "Tailwind CSS", "REST API", "TypeScript"],
        highlights: [
            "Authentication flows & session handling",
            "Modular React components",
            "Real-time AI feedback presentation",
        ],
        link: "#",
        gradient: "from-[var(--accent-purple)] to-[var(--accent-blue)]",
    },
];

function ProjectCard({
    project,
    index,
}: {
    project: (typeof projectsData)[0];
    index: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const isEven = index % 2 === 0;

    return (
        <motion.article
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`group relative grid md:grid-cols-2 gap-8 md:gap-12 items-center ${isEven ? "" : "md:direction-rtl"
                }`}
            style={{ direction: isEven ? "ltr" : "rtl" }}
        >
            {/* Project Visual */}
            <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                style={{ direction: "ltr" }}
            >
                {/* Gradient Background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                />

                {/* Glass Card Preview */}
                <div className="absolute inset-8 glass rounded-xl flex flex-col justify-center items-center p-8">
                    <div className="w-full max-w-xs">
                        {/* Mock terminal/code preview */}
                        <div className="bg-black/50 rounded-lg p-4 font-mono text-xs">
                            <div className="flex gap-2 mb-3">
                                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="text-[var(--accent-purple)]">
                                $ {project.id === 1 ? "sudo bpftrace" : "npm run dev"}
                            </div>
                            <div className="text-[var(--text-muted)] mt-1 truncate">
                                {project.id === 1
                                    ? "Tracing syscalls..."
                                    : "Starting development server..."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover Glow */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}
                />
            </div>

            {/* Project Info */}
            <div className="flex flex-col gap-6" style={{ direction: "ltr" }}>
                {/* Title */}
                <div>
                    <span className="text-small text-[var(--accent-purple)] mb-2 block">
                        Featured Project
                    </span>
                    <h3 className="heading-md text-white mb-2 font-[family-name:var(--font-playfair)]">
                        {project.title}
                    </h3>
                    <p className="text-[var(--text-muted)]">{project.subtitle}</p>
                </div>

                {/* Description */}
                <p className="body-text">{project.description}</p>

                {/* Highlights */}
                <ul className="space-y-2">
                    {project.highlights.map((highlight, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-3 text-sm text-[var(--text-muted)]"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-purple)]" />
                            {highlight}
                        </li>
                    ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium text-[var(--text-muted)] border border-white/10 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Link */}
                {project.link !== "#" && (
                    <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white group/link w-fit"
                        whileHover={{ x: 5 }}
                    >
                        View on GitHub
                        <svg
                            className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </motion.a>
                )}
            </div>
        </motion.article>
    );
}

export default function Projects() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="projects" ref={ref} className="relative py-32 bg-black">
            <div className="section max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <span className="text-small text-[var(--accent-purple)] mb-4 block">
                        Featured Work
                    </span>
                    <h2 className="heading-lg font-[family-name:var(--font-playfair)]">
                        Projects that define
                        <br />
                        <span className="italic gradient-text">my craft</span>
                    </h2>
                </motion.div>

                {/* Projects Grid */}
                <div className="space-y-24 md:space-y-32">
                    {projectsData.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
