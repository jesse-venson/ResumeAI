'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Moon, Sun, FileText, Mail, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useThemeStore } from '@/lib/store';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Gentle rotating torus
function FloatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2.2, 0.6, 16, 48]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

// Outer ring
function OuterRing() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.5, 0.015, 16, 100]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
    </mesh>
  );
}

// Scene with mouse follow
function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 0.3;
      targetRef.current.y = (e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Smooth interpolation
    mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.02;

    if (groupRef.current) {
      groupRef.current.rotation.y = mouseRef.current.x;
      groupRef.current.rotation.x = mouseRef.current.y;
    }
  });

  return (
    <group ref={groupRef}>
      <FloatingTorus />
      <OuterRing />
    </group>
  );
}

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { theme, toggleTheme } = useThemeStore();

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Navbar fades quickly as soon as scrolling starts
  const navOpacity = Math.max(0, 1 - Math.pow(scrollY / 150, 1.2));

  return (
    <div className="min-h-screen bg-[#0c0c12] text-white overflow-x-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={1}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient atmosphere */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c12] via-transparent to-[#0c0c12] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0c0c12_80%)]" />
        {/* Subtle blue glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
          style={{ opacity: navOpacity }}
        >
          <div className="mx-auto max-w-7xl px-8 lg:px-16">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="group">
                <span className="text-base tracking-[0.3em] text-white/60 group-hover:text-white/90 transition-colors duration-300">
                  RESUME<span className="text-blue-400/80">AI</span>
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-12">
                <a href="#tools" className="text-[11px] text-white/25 hover:text-white/60 transition-colors duration-300 tracking-[0.2em] uppercase">
                  Tools
                </a>
                <a href="#about" className="text-[11px] text-white/25 hover:text-white/60 transition-colors duration-300 tracking-[0.2em] uppercase">
                  About
                </a>
              </nav>

              <div className="flex items-center gap-3 sm:gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hidden sm:flex rounded-full text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-300"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
                <Link href="/login" className="hidden sm:block">
                  <span className="text-[11px] text-white/25 hover:text-white/60 transition-colors duration-300 tracking-[0.15em] uppercase cursor-pointer whitespace-nowrap">
                    Sign in
                  </span>
                </Link>
                <Link href="/signup">
                  <Button className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase rounded-full px-4 sm:px-6 h-8 sm:h-9 bg-white/10 text-white/70 border border-white/10 hover:bg-white/15 hover:text-white/90 hover:border-white/20 transition-all duration-300 whitespace-nowrap">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="text-center space-y-10 px-8">
            {/* Eyebrow */}
            <div
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] text-white/20 uppercase">
                <span className="w-6 h-px bg-white/15" />
                AI-Powered
                <span className="w-6 h-px bg-white/15" />
              </span>
            </div>

            {/* Main headline */}
            <h1>
              <span
                className="block font-serif text-[clamp(3rem,12vw,8rem)] font-normal tracking-[-0.02em] leading-[1] text-white/95"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                }}
              >
                Craft your
              </span>
              <span
                className="block font-serif text-[clamp(3rem,12vw,8rem)] font-normal tracking-[-0.02em] leading-[1] text-white/95"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
                }}
              >
                future<span className="text-blue-400/80">.</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-sm lg:text-base text-white/30 max-w-sm mx-auto font-light leading-relaxed"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
              }}
            >
              Resumes, cover letters, and SOPs — generated in seconds.
            </p>

            {/* CTA */}
            <div
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
              }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group h-12 px-8 text-[11px] tracking-[0.15em] uppercase rounded-full bg-white/10 text-white/80 border border-white/15 hover:bg-white/15 hover:text-white hover:border-white/25 transition-all duration-500 hover:scale-105"
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            style={{
              opacity: isLoaded ? Math.max(0, 0.5 - scrollY / 300) : 0,
              transform: `translateY(${isLoaded ? 0 : 20}px)`,
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 1s',
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] tracking-[0.3em] text-white/15 uppercase">Scroll</span>
              <div className="w-px h-10 bg-gradient-to-b from-white/15 to-transparent" />
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="relative py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-8 lg:px-16">
            {/* Section header */}
            <div
              className="text-center mb-12"
              style={{
                opacity: Math.min(1, Math.max(0, (scrollY - 200) / 300)),
                transform: `translateY(${Math.max(0, 30 - (scrollY - 200) / 10)}px)`,
              }}
            >
              <span className="text-[10px] tracking-[0.4em] text-white/15 uppercase">What we offer</span>
              <h2 className="mt-6 text-3xl lg:text-4xl font-extralight tracking-tight text-white/80">
                Three paths forward
              </h2>
            </div>

            {/* Tools grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Resume Card */}
              <Link href="/signup">
                <div
                  className="group relative p-8 lg:p-10 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-500 cursor-pointer"
                  style={{
                    opacity: Math.min(1, Math.max(0, (scrollY - 300) / 250)),
                    transform: `translateY(${Math.max(0, 30 - (scrollY - 300) / 8)}px)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <FileText className="w-5 h-5 transition-colors duration-500" style={{ color: 'rgba(96, 165, 250, 0.7)' }} />
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-white/20 group-hover:text-white/30 transition-colors duration-500">01</span>
                  <h3 className="mt-4 text-xl font-light tracking-tight text-white/80 group-hover:text-white transition-colors duration-500">Resume</h3>
                  <p className="mt-3 text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors duration-500">ATS-optimized resumes tailored to any role</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-white/25 group-hover:text-white/50 transition-colors duration-500 tracking-[0.15em] uppercase">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              {/* Cover Letter Card */}
              <Link href="/signup">
                <div
                  className="group relative p-8 lg:p-10 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-500 cursor-pointer"
                  style={{
                    opacity: Math.min(1, Math.max(0, (scrollY - 350) / 250)),
                    transform: `translateY(${Math.max(0, 30 - (scrollY - 350) / 8)}px)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <Mail className="w-5 h-5 transition-colors duration-500" style={{ color: 'rgba(167, 139, 250, 0.7)' }} />
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-white/20 group-hover:text-white/30 transition-colors duration-500">02</span>
                  <h3 className="mt-4 text-xl font-light tracking-tight text-white/80 group-hover:text-white transition-colors duration-500">Cover Letter</h3>
                  <p className="mt-3 text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors duration-500">Compelling narratives that capture attention</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-white/25 group-hover:text-white/50 transition-colors duration-500 tracking-[0.15em] uppercase">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              {/* Statement Card */}
              <Link href="/signup">
                <div
                  className="group relative p-8 lg:p-10 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-500 cursor-pointer"
                  style={{
                    opacity: Math.min(1, Math.max(0, (scrollY - 400) / 250)),
                    transform: `translateY(${Math.max(0, 30 - (scrollY - 400) / 8)}px)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                    <GraduationCap className="w-5 h-5 transition-colors duration-500" style={{ color: 'rgba(34, 211, 238, 0.7)' }} />
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-white/20 group-hover:text-white/30 transition-colors duration-500">03</span>
                  <h3 className="mt-4 text-xl font-light tracking-tight text-white/80 group-hover:text-white transition-colors duration-500">Statement</h3>
                  <p className="mt-3 text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors duration-500">Powerful SOPs for academic applications</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-white/25 group-hover:text-white/50 transition-colors duration-500 tracking-[0.15em] uppercase">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-8 lg:px-16 text-center">
            <div
              style={{
                opacity: Math.min(1, Math.max(0, (scrollY - 700) / 350)),
                transform: `translateY(${Math.max(0, 30 - (scrollY - 700) / 10)}px)`,
              }}
            >
              <p className="text-xl lg:text-2xl font-extralight leading-[1.7] text-white/35">
                Your career documents should be as{' '}
                <span className="text-white/70">exceptional</span> as you are.
                Let AI handle the details.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-8 lg:px-16 text-center">
            <div
              style={{
                opacity: Math.min(1, Math.max(0, (scrollY - 950) / 300)),
              }}
            >
              <h2 className="text-3xl lg:text-4xl font-extralight tracking-tight text-white/80 mb-10">
                Ready<span className="text-blue-400/60">?</span>
              </h2>
              <Link href="/signup" className="group inline-flex items-center justify-center gap-4 text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white/70 transition-colors duration-500">
                <span className="w-8 h-px bg-white/20 group-hover:w-12 group-hover:bg-white/40 transition-all duration-500" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-16 border-t border-white/[0.04]">
          <div className="mx-auto max-w-7xl px-8 lg:px-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-xs tracking-[0.25em] text-white/15">
                RESUME<span className="text-blue-400/40">AI</span>
              </span>
              <p className="text-[10px] text-white/10 tracking-wide">
                &copy; 2024 All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
