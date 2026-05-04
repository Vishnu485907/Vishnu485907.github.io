import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Calculator from "@/sections/Calculator";

export default function Hero() {
  return (
    <section
      id="hero"
      className="scroll-mt-28 bg-[#ededed] px-3 pb-4 pt-[88px] sm:px-4 sm:pb-6 sm:pt-[104px]"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-[#d9d9d9] shadow-sm sm:rounded-[36px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          webkit-playsinline="true"
          x5-playsinline="true"
          poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.72)_38%,rgba(255,255,255,0.92)_100%)]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8 lg:pb-12">
          <div className="lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-8">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-xl lg:pt-8 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm"
              style={{ fontSize: 13 }}
            >
              <span className="h-2 w-2 rounded-full bg-brand-orange" />
              Credfix Financial Planner
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-5 text-pitch-black sm:mt-6"
              style={{
                fontSize: "clamp(36px, 8vw, 72px)",
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              Shaping{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Financial
              </span>
              <br />
              Freedom of tomorrow
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-4 max-w-xl px-2 text-neutral-700 sm:mt-5 lg:mx-0 lg:px-0"
              style={{ fontSize: "clamp(13px, 3.5vw, 16px)" }}
            >
              The Smart Salary-to-Loan Optimizer Helping Indian Professionals
              Build Better Financial Futures
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => {
                const el = document.getElementById("calculator");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#0b0f1a] py-2 pl-6 pr-2 text-sm font-medium text-white transition-opacity hover:opacity-90 group sm:mt-7 sm:py-2.5 sm:pl-7"
            >
              Get Started
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:scale-110 sm:h-7 sm:w-7">
                <ChevronRight size={16} />
              </span>
            </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-8 sm:mt-10 lg:mt-0"
            >
              <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_rgba(11,15,26,0.12)] backdrop-blur-md sm:p-6 lg:p-7">
                <Calculator embedded showHeader={false} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
