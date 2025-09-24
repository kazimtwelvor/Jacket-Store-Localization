"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  story: string;
  mission: string;
  values: string;
  ctaText: string;
  ctaLink: string;
}

interface AboutUsClientProps {
  aboutData: AboutData;
}

export default function AboutUsClient({ aboutData }: AboutUsClientProps) {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B01E23' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 tracking-tight" style={{ fontFamily: 'AvertaPe, sans-serif' }}>
            {aboutData.title.split(' ').map((word, index) => (
              <span key={index}>
                {word === 'FINEYST' ? (
                  <span className="text-[#2b2b2b] relative">
                    {word}
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#2b2b2b]"></div>
                  </span>
                ) : (
                  word
                )}
                {index < aboutData.title.split(' ').length - 1 && ' '}
              </span>
            ))}
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {aboutData.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-2 bg-[#2b2b2b] rounded-full"></div>
                <span className="text-sm font-semibold text-[#2b2b2b] tracking-wider uppercase">Our Story</span>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {aboutData.description}
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                {aboutData.story}
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                {aboutData.mission}
              </p>

              <Link href={aboutData.ctaLink} className="inline-flex items-center space-x-2 text-[#2b2b2b] hover:text-[#2b2b2b] font-semibold text-lg group transition-colors duration-300">
                <span>{aboutData.ctaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
