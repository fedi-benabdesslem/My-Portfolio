"use client";

import { motion } from "framer-motion";

// ===========================================
// FOOTER LINKS - Edit these to change footer content
// ===========================================
const footerLinks = {
    social: [
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/fedi-ben-abdesslem/",
        },
        { name: "GitHub", href: "https://github.com/fedi-benabdesslem" },
    ],
    navigation: [
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Skills", href: "#skills" },
        { name: "Contact", href: "#contact" },
    ],
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 bg-black border-t border-white/5">
            <div className="section max-w-6xl">
                <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                    {/* Brand */}
                    <div>
                        <motion.a
                            href="#"
                            className="text-2xl font-medium tracking-tight inline-block mb-4"
                            whileHover={{ scale: 1.02 }}
                        >
                            <span className="font-[family-name:var(--font-playfair)] italic">
                                Fedi Ben Abdesslem
                            </span>
                            <span className="text-[var(--text-muted)]">.</span>
                        </motion.a>
                        <p className="text-sm text-[var(--text-muted)] max-w-xs">
                            Engineering elegant solutions through code. Applied Computer Science
                            student @ ENISO.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-sm font-medium mb-4 text-[var(--text-muted)]">
                            Navigation
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm font-medium mb-4 text-[var(--text-muted)]">
                            Connect
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.social.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-2"
                                    >
                                        {link.name}
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--text-muted)]">
                        © {currentYear} Fedi Ben Abdesslem. All rights reserved.
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                        Inspired by{" "}
                        <span className="gradient-text font-medium">No Man's Sky</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
