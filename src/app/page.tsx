"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Components
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// ===========================================
// MAIN PAGE
// This is the entry point - all sections are composed here
// ===========================================

export default function Home() {
  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero - Dark background with 3D animation */}
        <Hero />

        {/* About - Light background */}
        <About />

        {/* Projects - Dark background */}
        <Projects />

        {/* Education - Dark background */}
        <Education />

        {/* Skills - Light background */}
        <Skills />

        {/* Contact - Dark background */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
