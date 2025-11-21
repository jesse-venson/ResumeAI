'use client';

import { Card } from '@/components/ui/card';
import { FileText, Mail, GraduationCap, Sparkles, ArrowRight } from 'lucide-react';
import type { ServiceType } from '@/types';

interface ServiceCardsProps {
  onSelectService: (service: ServiceType) => void;
}

export function ServiceCards({ onSelectService }: ServiceCardsProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/80 dark:bg-purple-900/30 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
            AI-Powered Document Generation
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          What would you like to create?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Choose a service and let AI craft your perfect document in minutes
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Resume Card */}
        <Card
          className="group relative p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border-2 border-purple-100 dark:border-purple-900 hover:border-purple-400 dark:hover:border-purple-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden"
          onClick={() => onSelectService('resume')}
        >
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-0 group-hover:opacity-10 transition duration-500" />

          <div className="relative z-10 space-y-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FileText className="w-10 h-10 text-white" />
              </div>
              {/* Icon glow */}
              <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                Resume Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Transform your existing resume into a tailored masterpiece optimized for any job opportunity.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all">
              <span>Upload required</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>

        {/* Cover Letter Card */}
        <Card
          className="group relative p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border-2 border-pink-100 dark:border-pink-900 hover:border-pink-400 dark:hover:border-pink-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden"
          onClick={() => onSelectService('cover-letter')}
        >
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-pink-400 rounded-lg blur opacity-0 group-hover:opacity-10 transition duration-500" />

          <div className="relative z-10 space-y-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Mail className="w-10 h-10 text-white" />
              </div>
              {/* Icon glow */}
              <div className="absolute inset-0 bg-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-600 transition-colors">
                Cover Letter Writer
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Create personalized, compelling cover letters that capture attention and showcase your fit.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400 font-semibold group-hover:gap-3 transition-all">
              <span>Ready to start</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>

        {/* SOP Card */}
        <Card
          className="group relative p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border-2 border-purple-100 dark:border-purple-900 hover:border-purple-400 dark:hover:border-purple-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden"
          onClick={() => onSelectService('sop')}
        >
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-10 transition duration-500" />

          <div className="relative z-10 space-y-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              {/* Icon glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-colors">
                Statement of Purpose
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Stand out in graduate applications with a compelling SOP that showcases your passion and goals.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold group-hover:gap-3 transition-all">
              <span>Ready to start</span>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
