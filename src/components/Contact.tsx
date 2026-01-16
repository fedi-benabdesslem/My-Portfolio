"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ===========================================
// CONTACT INFO - Edit this to change your links
// ===========================================
const contactInfo = {
    email: "fedi.benabdesslem@eniso.u-sousse.tn",
    phone: "+216 58 752 756",
    linkedin: "https://www.linkedin.com/in/fedi-ben-abdesslem/",
    github: "https://github.com/fedi-benabdesslem",
};

export default function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="contact" ref={ref} className="relative py-32 bg-black">
            {/* Background glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--accent-purple)] rounded-full blur-[200px] opacity-10" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[var(--accent-orange)] rounded-full blur-[200px] opacity-10" />
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
                        Get In Touch
                    </span>
                    <h2 className="heading-lg font-[family-name:var(--font-playfair)] mb-6">
                        Let&apos;s build something
                        <br />
                        <span className="italic gradient-text">amazing together .</span>
                    </h2>
                    <p className="body-text max-w-lg mx-auto">
                        I&apos;m always interested in new opportunities, collaborations, and
                        challenging projects. Feel free to reach out!
                    </p>
                </motion.div>

                {/* Contact Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass rounded-3xl p-8 md:p-12"
                >
                    {/* Email - Primary CTA */}
                    <div className="text-center mb-12">
                        <span className="text-small text-[var(--text-muted)] mb-4 block">
                            Email me at
                        </span>
                        <motion.a
                            href={`mailto:${contactInfo.email}`}
                            className="heading-md font-[family-name:var(--font-playfair)] hover:gradient-text transition-all duration-300 inline-block"
                            whileHover={{ scale: 1.02 }}
                        >
                            {contactInfo.email}
                        </motion.a>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/10 mb-12" />

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Phone */}
                        <motion.a
                            href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-[var(--accent-orange)]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm text-[var(--text-muted)]">Phone</span>
                        </motion.a>

                        {/* LinkedIn */}
                        <motion.a
                            href={contactInfo.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-[var(--accent-purple)]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </div>
                            <span className="text-sm text-[var(--text-muted)]">LinkedIn</span>
                        </motion.a>

                        {/* GitHub */}
                        <motion.a
                            href={contactInfo.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors col-span-2 md:col-span-1"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-[var(--accent-blue)]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </div>
                            <span className="text-sm text-[var(--text-muted)]">GitHub</span>
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
