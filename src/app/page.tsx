'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Mail, GraduationCap, Sparkles, Zap, Shield, ArrowRight, Check, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useThemeStore } from '@/lib/store';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-pink-950/20 overflow-hidden relative">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div
          className="absolute w-[1000px] h-[1000px] bg-gradient-to-r from-purple-300/40 via-pink-300/40 to-blue-300/40 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-r from-pink-300/30 via-purple-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${-mousePosition.x * 0.015}px`,
            bottom: `${-mousePosition.y * 0.015}px`,
            transition: 'all 0.3s ease-out',
            animationDuration: '10s',
          }}
        />
        {/* Additional accent orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-violet-300/25 to-fuchsia-300/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '9s', animationDelay: '4s' }}
        />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0
                ? 'rgba(168, 85, 247, 0.4)'
                : i % 3 === 1
                ? 'rgba(236, 72, 153, 0.4)'
                : 'rgba(96, 165, 250, 0.4)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
              boxShadow: i % 2 === 0 ? '0 0 20px rgba(168, 85, 247, 0.3)' : '0 0 20px rgba(236, 72, 153, 0.3)',
            }}
          />
        ))}
      </div>

      {/* Header with glass morphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-transparent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-purple-500/50">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-purple-50 dark:hover:bg-purple-900/30">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium */}
      <section className="relative container mx-auto px-4 pt-20 pb-32">
        <div
          className="max-w-5xl mx-auto text-center space-y-8 relative z-10 transition-all duration-500 ease-out"
          style={{
            opacity: Math.max(0, Math.min(1, 1 - scrollY / 400)),
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              Craft Perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-pink-900 to-gray-900 dark:from-white dark:via-pink-200 dark:to-white bg-clip-text text-transparent">
              Career Docs
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Generate professional resumes, compelling cover letters, and standout SOPs in minutes.
            <span className="text-purple-600 dark:text-purple-400 font-semibold"> Powered by advanced AI</span> to help you land your dream opportunity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/signup">
              <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Unlimited revisions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - With Cards */}
      <section id="features" className="relative container mx-auto px-4 py-20">
        <div
          className="text-center mb-16 transition-all duration-700 ease-out"
          style={{
            opacity: Math.min(1, Math.max(0, (scrollY - 200) / 300)),
            transform: `translateY(${Math.max(0, 50 - (scrollY - 200) / 4)}px)`,
          }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Three Powerful Tools
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to advance your career
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Resume Card */}
          <Card
            className="group relative p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 300) / 300)),
              transform: `translateY(${Math.max(0, 80 - (scrollY - 300) / 3)}px)`,
              transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors">Resume Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Transform your existing resume into a tailored masterpiece. Upload and let AI optimize it for any job.
              </p>
              <ul className="space-y-3">
                {['ATS-optimized formatting', 'Keyword optimization', 'Industry-specific styling'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Cover Letter Card */}
          <Card
            className="group relative p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-pink-100 dark:border-pink-900 hover:border-pink-300 dark:hover:border-pink-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 350) / 300)),
              transform: `translateY(${Math.max(0, 80 - (scrollY - 350) / 3)}px)`,
              transition: 'opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-pink-600 transition-colors">Cover Letter Writer</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Create personalized, compelling cover letters that capture attention. Just provide job details.
              </p>
              <ul className="space-y-3">
                {['Personalized to each role', 'Engaging storytelling', 'Professional tone matching'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-pink-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* SOP Card */}
          <Card
            className="group relative p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 400) / 300)),
              transform: `translateY(${Math.max(0, 80 - (scrollY - 400) / 3)}px)`,
              transition: 'opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors">SOP Creator</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Stand out in graduate applications with a compelling Statement of Purpose that showcases your passion.
              </p>
              <ul className="space-y-3">
                {['Academic excellence focus', 'Goal-oriented narrative', 'Program-specific tailoring'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section - Redesigned */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group space-y-4 animate-fade-in-up" style={{ animationDelay: '0s' }}>
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Generate professional documents in minutes. Real-time streaming as AI creates your content.
              </p>
            </div>

            <div className="text-center group space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced AI understands context and crafts compelling narratives tailored to your goals.
              </p>
            </div>

            <div className="text-center group space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Always Improving</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Regenerate and refine your documents until perfect. Iterate with simple prompts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="relative p-16 text-center overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 border-none shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals who have landed their dream jobs with ResumeAI
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 text-lg px-12 py-7 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 font-semibold">
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl bg-white/30 dark:bg-gray-950/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">&copy; 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 30s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
