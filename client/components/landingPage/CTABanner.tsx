"use client";

import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link"
export default function CTABanner() {
  return (
    <section className="relative w-full bg-[#0b1120] py-12 px-4">
      {/* Outer rounded card */}
      <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-700/60 bg-[#0d1730] overflow-hidden px-6 py-12 flex flex-col items-center text-center gap-6">

        {/* Animated grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(#a0c4ff 1px, transparent 1px), linear-gradient(90deg, #a0c4ff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Blue radial glow in center */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(37,99,235,0.18),transparent)]" />

        {/* Left lightning bolt */}
        <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 select-none">
          <div className="relative">
            <Zap
              className="w-16 h-16 text-blue-600/40 drop-shadow-[0_0_18px_rgba(37,99,235,0.7)]"
              fill="currentColor"
              strokeWidth={0}
            />
            <Zap
              className="absolute inset-0 w-16 h-16 text-blue-400/20 blur-md"
              fill="currentColor"
              strokeWidth={0}
            />
          </div>
        </div>

        {/* Right lightning bolt */}
        <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none">
          <div className="relative">
            <Zap
              className="w-16 h-16 text-blue-600/40 drop-shadow-[0_0_18px_rgba(37,99,235,0.7)]"
              fill="currentColor"
              strokeWidth={0}
            />
            <Zap
              className="absolute inset-0 w-16 h-16 text-blue-400/20 blur-md"
              fill="currentColor"
              strokeWidth={0}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built for developers who move fast
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
            Join thousands of developers already using ChatSpark to communicate
            and build better.
          </p>
        </div>

        {/* Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/sign-in">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:shadow-[0_0_28px_rgba(37,99,235,0.65)] active:scale-95">
              Join Beta
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-600 hover:border-slate-400 bg-transparent text-white text-sm font-semibold transition-all duration-200 hover:bg-slate-700/40 active:scale-95">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}