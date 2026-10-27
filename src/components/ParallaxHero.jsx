import React from 'react';
import { Link } from 'react-router-dom';
import { useParallax } from '../hooks/useParallax.js';
import ParticlesCanvas from '../assets/ParticlesCanvas.jsx';
import CrowSilhouette from '../assets/CrowSilhouette.jsx';
import TreeBranches from '../assets/TreeBranches.jsx';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { ArrowRight, Film, Sparkles, Zap } from 'lucide-react';

export default function ParallaxHero({ onBookNowClick }) {
  const heroRef = useParallax();

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#05030f]"
    >
      {/* LAYER 1: Gojo Satoru Limitless Void Backdrop */}
      <div className="absolute inset-0 z-0 parallax-layer-bg pointer-events-none scale-105">
        <img
          src="/public/assets/bg-hero.jpg"
          alt="Limitless Void Horizon"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-75 filter contrast-125 brightness-105"
          onError={(e) => {
            e.currentTarget.src = '/src/assets/images/bg_hero_limitless_1793082495818.jpg';
          }}
        />
        {/* Dark anime gradient overlay with electric indigo-black depths */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05030f] via-[#05030f]/60 to-[#05030f]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#05030f_85%)]" />
      </div>

      {/* LAYER 2: Floating Cosmic Particles */}
      <div className="absolute inset-0 z-10 parallax-layer-particles pointer-events-none opacity-60">
        <ParticlesCanvas particleCount={40} />
      </div>

      {/* LAYER 3: Rotating & Scaling Glowing Infinity Void Ring */}
      <div className="absolute inset-0 z-12 parallax-layer-ring pointer-events-none flex items-center justify-center">
        <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] rounded-full border border-indigo-500/20 animate-spin-slow opacity-60">
          <div className="absolute inset-0 rounded-full border border-violet-500/30 blur-[2px]" />
          <div className="absolute inset-6 rounded-full border border-dashed border-cyan-400/25" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_#4f6bff]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-violet-400 rounded-full shadow-[0_0_20px_#8b5cf6]" />
        </div>
      </div>

      {/* Lightning Arc Overlay */}
      <div className="absolute inset-0 z-13 pointer-events-none animate-lightning">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl" />
      </div>

      {/* LAYER 4: Crows Flying Across Horizontally on Scroll */}
      <div className="absolute inset-0 z-15 parallax-layer-crows pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 text-slate-900 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <CrowSilhouette className="w-16 h-12 -rotate-12" />
        </div>
        <div className="absolute top-1/3 left-16 text-slate-900/90">
          <CrowSilhouette className="w-10 h-8 -rotate-6" />
        </div>
        <div className="absolute top-1/5 right-32 text-slate-900/70">
          <CrowSilhouette className="w-8 h-6 rotate-6" />
        </div>
      </div>

      {/* Central Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-20">
        {/* Animated Domain Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase bg-gradient-to-r from-cyan-300 via-indigo-200 to-violet-300 bg-clip-text text-transparent font-display">
            DOMAIN EXPANSION · UNLIMITED CINEMA
          </span>
          <Zap className="w-3.5 h-3.5 text-violet-400" />
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 uppercase [text-wrap:balance]">
          Infinity{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(79,107,255,0.6)]">
            Cinema
          </span>
        </h1>

        <p className="font-cinzel text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed mb-10 tracking-wide [text-wrap:balance]">
          Step into the limitless void of cinema. Where reality dissolves into pure immersion across 70mm Laser IMAX and 64-channel spatial object audio.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            to="/movies"
            onClick={onBookNowClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white btn-electric shadow-[0_0_30px_rgba(79,107,255,0.5)] cursor-pointer"
          >
            <Film className="w-4 h-4 text-cyan-200" />
            <span>Book Tickets Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/movies?tab=available"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-white glass-panel hover:border-indigo-400/60 transition-all hover:shadow-[0_0_25px_rgba(79,107,255,0.3)]"
          >
            <InfinitySymbol className="w-4 h-4" />
            <span>Now Showing</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-16 pt-8 border-t border-indigo-500/20 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold tracking-wider uppercase text-slate-300 font-display">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span>70mm IMAX Laser</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
            <span>Dolby Atmos Spatial Audio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />
            <span>VIP Zero-G Recliners</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_#f472b6]" />
            <span>Instant QR Void Pass</span>
          </div>
        </div>
      </div>

      {/* LAYER 5: Foreground Bare Tree Silhouettes at the edges */}
      <div className="absolute -bottom-2 left-0 w-64 md:w-84 z-25 pointer-events-none parallax-layer-foreground opacity-85">
        <TreeBranches position="bottom-left" />
      </div>
      <div className="absolute -bottom-2 right-0 w-64 md:w-84 z-25 pointer-events-none parallax-layer-foreground opacity-85">
        <TreeBranches position="bottom-right" />
      </div>
    </section>
  );
}

