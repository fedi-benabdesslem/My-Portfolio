"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ===========================================
// NAVIGATION LINKS - Edit these to change menu
// ===========================================
const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? "py-4"
                    : "py-6"
                    }`}
            >
                <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <motion.a
                        href="#"
                        className="text-xl font-medium tracking-tight"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="font-[family-name:var(--font-playfair)] italic">
                            Fedi Ben Abdesslem
                        </span>
                        <span className="text-[var(--text-muted)] ml-1">.</span>
                    </motion.a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <div
                            className={`flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300 ${isScrolled ? "glass" : ""
                                }`}
                        >
                            {navLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-[family-name:var(--font-inter)] text-[var(--text-muted)] hover:text-white transition-colors rounded-full hover:bg-white/5"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <motion.a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 text-sm font-medium rounded-full gradient-border bg-transparent hover:bg-white/5 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            My Resume
                        </motion.a>
                        <motion.a
                            href="#contact"
                            className="px-6 py-2.5 text-sm font-medium rounded-full gradient-border bg-transparent hover:bg-white/5 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Let&apos;s Talk
                        </motion.a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden relative w-10 h-10 flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-1.5">
                            <motion.span
                                animate={{
                                    rotate: isMobileMenuOpen ? 45 : 0,
                                    y: isMobileMenuOpen ? 6 : 0,
                                }}
                                className="w-6 h-0.5 bg-white block origin-center"
                            />
                            <motion.span
                                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                                className="w-6 h-0.5 bg-white block"
                            />
                            <motion.span
                                animate={{
                                    rotate: isMobileMenuOpen ? -45 : 0,
                                    y: isMobileMenuOpen ? -6 : 0,
                                }}
                                className="w-6 h-0.5 bg-white block origin-center"
                            />
                        </div>
                    </button>
                </nav>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 glass-dark md:hidden"
                    >
                        <motion.nav
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center justify-center h-full gap-8"
                        >
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl font-[family-name:var(--font-playfair)] hover:text-[var(--accent-purple)] transition-colors"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                            <motion.a
                                href="#contact"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-4 px-8 py-3 text-lg rounded-full gradient-border"
                            >
                                Let&apos;s Talk
                            </motion.a>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
