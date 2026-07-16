import React from "react";
import { Sparkles, Shield, ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function PageHero({
  title,
  subtitle,
  description,
  imageUrl,
  category,
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center px-4 sm:px-8 lg:px-12 shadow-xl mb-8 group border border-slate-200 bg-slate-50">
      {/* Full-bleed background image with subtle zoom transition on hover and high brightness */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105 filter brightness-125 contrast-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Soft elegant bright overlay to enhance depth while keeping the photo fully bright */}
        <div className="absolute inset-0 bg-white/10 z-10" />
      </div>

      {/* Overlaid high-contrast white glass panel to protect the text and guarantee perfect legibility without darkening the picture */}
      <div className="relative z-20 max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 my-8 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black tracking-widest text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            {category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full uppercase">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            Verified Elite
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono font-black tracking-[0.2em] text-red-600 uppercase">
            {subtitle}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black tracking-tight text-slate-950 leading-tight uppercase">
            {title.split(" ").map((word, i) => (
              <span key={i} className={i % 2 === 1 ? "text-[#D32F2F]" : "text-slate-900"}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[#D32F2F] to-amber-500 rounded-full" />
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed max-w-xl font-medium">
          {description}
        </p>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 font-mono pt-1">
          <span className="hover:text-slate-900 transition-colors cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[#D32F2F] font-black">{title}</span>
        </div>
      </div>
    </div>
  );
}
