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
// MAIN PAGE
export default function Home() {
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
        {/* Hero */}
        <Hero />

        {/* About */}
        <About />

        {/* Projects */}
        <Projects />

        {/* Education */}
        <Education />

        {/* Skills */}
        <Skills />

        {/* Contact */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}