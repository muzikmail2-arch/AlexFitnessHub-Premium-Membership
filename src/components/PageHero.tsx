import React from "react";
import { motion } from "motion/react";
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
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80 mb-8 pt-6">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Column 1: Left Text & Badges (7/12 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black tracking-widest text-[#D32F2F] bg-red-50 border border-red-100/80 px-2.5 py-1 rounded-full uppercase">
                <Sparkles className="w-3 h-3 text-[#D32F2F] animate-pulse" />
                {category}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
                <Shield className="w-3 h-3 text-slate-400" />
                Verified Elite
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono font-bold tracking-widest text-amber-600 uppercase">
                {subtitle}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-slate-900 leading-tight uppercase">
                {title.split(" ").map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? "text-[#D32F2F]" : "text-slate-900"}>
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[#D32F2F] to-amber-500 rounded-full" />
            </div>

            <p className="text-sm text-slate-600 font-sans leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#D32F2F] font-bold">{title}</span>
            </div>
          </div>

          {/* Column 2: Right Portrait/Vertical Card Hero Image (5/12 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-3xl p-2 bg-gradient-to-tr from-[#D4AF37] to-[#D32F2F] shadow-xl group overflow-hidden border border-slate-200/80 cursor-pointer"
            >
              <div className="w-full h-full rounded-[1.3rem] overflow-hidden bg-slate-100 relative">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-all duration-[800ms] group-hover:scale-110 group-hover:rotate-1"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Accent overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                
                {/* Floating badge inside card */}
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className="text-[9px] font-mono font-extrabold tracking-widest text-amber-400 uppercase">
                    ALEX FITNESS HUB
                  </p>
                  <p className="text-xs font-sans font-black text-white uppercase leading-tight mt-0.5">
                    Premium Specialization Suite
                  </p>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[8px] font-mono tracking-widest text-white border border-white/10">
                  EST. 2026
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
