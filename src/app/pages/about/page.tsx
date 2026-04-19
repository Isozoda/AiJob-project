"use client"
import React from 'react';
import {
   Sparkles,
   BrainCircuit,
   Fingerprint,
   Zap,
   ShieldCheck,
   Rocket,
   ArrowRight,
   Target,
   Globe,
   TrendingUp,
   Cpu,
   Layers,
   Cpu as Chip,
   Eye,
   Shield,
   Activity
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function AboutPage() {
   return (
      <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600/30 selection:text-white font-sans overflow-x-hidden relative">

         {/* ── BACKGROUND AMBIENCE ── */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[180px] rounded-full animate-pulse opacity-60"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full opacity-40"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
         </div>

         {/* ── HERO SECTION ── */}
         <section className="relative pt-44 pb-48 overflow-hidden z-10">
            <div className="container mx-auto px-6 relative">
               <div className="max-w-5xl">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-2xl text-blue-400 text-[10px] font-extrabold uppercase tracking-[0.4em] mb-12 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000 italic">
                     <Sparkles size={14} /> SYSTEM MANIFESTO v2.0.4
                  </div>
                  <h1 className="text-8xl md:text-[11rem] font-extrabold tracking-tighter leading-[0.8] mb-12 italic uppercase text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                     Beyond <br /> <span className="text-blue-600 tracking-normal drop-shadow-[0_20px_40px_rgba(37,99,235,0.3)]">Code.</span>
                  </h1>
                  <p className="text-3xl md:text-5xl text-slate-400 font-semibold leading-[1.05] max-w-4xl italic tracking-tight opacity-90 animate-in fade-in slide-in-from-bottom-12 duration-1000 uppercase">
                     Empowering the global workforce through <span className="text-white">Cognitive Neural Matching</span> and Architectural Integrity.
                  </p>
               </div>
            </div>
         </section>

         {/* ── CORE PROTOCOLS ── */}
         <section className="py-48 relative z-10">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                  <div className="relative group">
                     <div className="absolute -inset-20 bg-blue-600/5 blur-[120px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000"></div>
                     <h2 className="text-7xl font-extrabold tracking-tighter uppercase italic leading-[0.85] mb-16 text-white">
                        The <br /> <span className="text-blue-500 underline decoration-8 underline-offset-8 decoration-blue-500/20">Protocols.</span>
                     </h2>
                     <div className="space-y-12 text-2xl text-slate-400 font-semibold leading-relaxed italic uppercase tracking-tight">
                        <p className="border-l-8 border-blue-600 pl-10 py-6 bg-white/5 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] hover:bg-white/10 transition-all border border-white/5">
                           Recruitment is no longer a search. It is a <br /> <span className="text-white tracking-tighter">Synchronized Alignment.</span>
                        </p>
                        <p className="pl-12 opacity-60">
                           We analyze the DNA of companies and the aspirations of talent to create the perfect professional symphony in real-time.
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                     <GlassyCard 
                        icon={<BrainCircuit className="text-blue-500" size={40} />}
                        title="Neural Core"
                        desc="High-fidelity matching algorithms."
                     />
                     <GlassyCard 
                        icon={<Fingerprint className="text-indigo-400" size={40} />}
                        title="Verified ID"
                        desc="Biometric-grade trust layers."
                     />
                     <GlassyCard 
                        icon={<Zap className="text-amber-500" size={40} />}
                        title="Instant Sync"
                        desc="Zero-latency recruitment cycles."
                     />
                     <GlassyCard 
                        icon={<ShieldCheck className="text-emerald-400" size={40} />}
                        title="Vault Spec"
                        desc="Enterprise data protection."
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* ── METRICS HUB ── */}
         <section className="py-48 bg-slate-900/60 backdrop-blur-3xl border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
            <div className="container mx-auto px-6 relative z-10 text-center mb-24">
               <h3 className="text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.8em] italic mb-4">Operational Telemetry</h3>
               <h2 className="text-5xl font-extrabold italic uppercase tracking-tighter">Network Vital Signs<span className="text-blue-600">.</span></h2>
            </div>
            <div className="container mx-auto px-6 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  <StatItem label="Match Accuracy" value="99.2%" icon={<Target size={24} className="text-blue-500"/>} />
                  <StatItem label="Active Studios" value="2.8k+" icon={<Chip size={24} className="text-indigo-400"/>} />
                  <StatItem label="Talent Nodes" value="15M" icon={<Globe size={24} className="text-emerald-400"/>} />
                  <StatItem label="AI Integrity" value="S-Tier" icon={<Shield size={24} className="text-amber-400"/>} />
               </div>
            </div>
         </section>

         {/* ── CORE VALUES ── */}
         <section className="py-60 relative z-10">
            <div className="container mx-auto px-6">
               <div className="text-center max-w-4xl mx-auto mb-40">
                  <h2 className="text-8xl font-extrabold tracking-tighter uppercase italic text-white mb-10 leading-none">Architectural <br /> <span className="text-blue-600">Integrity.</span></h2>
                  <p className="text-xl text-slate-500 font-extrabold uppercase tracking-[0.5em] italic">The Foundation of our Network</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                  <ValueBox 
                     number="01" 
                     title="AUTONOMY" 
                     desc="Freedom to choose, freedom to innovate, and freedom to lead your own career path."
                     icon={<Activity size={24} />}
                  />
                  <ValueBox 
                     number="02" 
                     title="PRECISION" 
                     desc="Eliminating noise from the recruitment stream to focus purely on high-impact signals."
                     icon={<Eye size={24} />}
                  />
                  <ValueBox 
                     number="03" 
                     title="VELOCITY" 
                     desc="Moving at the speed of thought. Reducing the gap between dream and reality."
                     icon={<TrendingUp size={24} />}
                  />
               </div>
            </div>
         </section>

         {/* ── CALL TO ACTION ── */}
         <section className="py-60 px-6 relative overflow-hidden">
            <div className="container mx-auto relative group">
               <div className="absolute -inset-20 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 blur-[150px] rounded-[10rem] group-hover:scale-125 transition-transform duration-1000 opacity-60"></div>
               <div className="relative bg-slate-900/60 backdrop-blur-3xl rounded-[6rem] p-16 md:p-32 flex flex-col items-center text-center shadow-[0_100px_150px_-30px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden group/box">
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.03] -z-10"></div>
                  <div className="w-32 h-32 bg-blue-600 rounded-[3rem] flex items-center justify-center mb-16 shadow-[0_30px_80px_rgba(37,99,235,0.4)] group-hover/box:rotate-12 transition-transform duration-700">
                     <Rocket className="text-white fill-white" size={56} />
                  </div>
                  <h2 className="text-7xl md:text-[9.5rem] font-extrabold text-white tracking-tighter leading-[0.8] mb-16 italic uppercase drop-shadow-2xl">
                     Step into <br /> <span className="text-blue-500 tracking-normal">The Future.</span>
                  </h2>
                  <div className="flex flex-col md:flex-row gap-10 mt-8 relative z-10 w-full max-w-2xl">
                     <Link href="/pages/register" className="flex-1 px-16 py-8 bg-white text-slate-950 rounded-[2.5rem] font-extrabold text-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4 group/btn italic uppercase tracking-tighter">
                        JOIN ALPHA <ArrowRight size={28} strokeWidth={4} className="group-hover/btn:translate-x-2 transition-transform" />
                     </Link>
                     <Link href="/pages/login" className="flex-1 px-16 py-8 bg-white/5 text-white border-2 border-white/10 rounded-[2.5rem] font-extrabold text-2xl hover:bg-white/10 transition-all active:scale-95 backdrop-blur-xl italic uppercase tracking-tighter">
                        SECURE LOG
                     </Link>
                  </div>

                  <p className="mt-20 text-[10px] font-extrabold text-white/20 uppercase tracking-[0.8em] italic">AUTHORIZED NETWORK ACCESS ONLY • GLOBAL HUB v4.0</p>
               </div>
            </div>
         </section>

         {/* ── FOOTER DECOR ── */}
         <div className="py-40 flex justify-center opacity-[0.03] select-none pointer-events-none">
            <h1 className="text-[20vw] font-extrabold tracking-tighter leading-none uppercase text-white italic">ARCHITECT</h1>
         </div>

      </div>
   );
}

function GlassyCard({ icon, title, desc }: any) {
   return (
      <div className="p-12 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-3xl hover:bg-white/10 hover:-translate-y-4 transition-all duration-700 group cursor-default relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-2xl group-hover:shadow-blue-500/40 group-hover:scale-110">
            {icon}
         </div>
         <h3 className="text-3xl font-extrabold text-white mb-6 tracking-tight italic uppercase">{title}</h3>
         <p className="text-lg text-slate-400 font-semibold leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-tight">“{desc}”</p>
      </div>
   );
}

function StatItem({ label, value, icon }: any) {
   return (
      <div className="flex flex-col items-center text-center group bg-white/5 border border-white/5 p-12 rounded-[4rem] backdrop-blur-md hover:border-blue-500/20 transition-all">
         <div className="mb-6 opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
         <span className="text-7xl font-extrabold italic text-white tracking-widest drop-shadow-[0_10px_10px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">{value}</span>
         <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.5em] mt-6 bg-white/5 px-4 py-2 rounded-full border border-white/5 italic">{label}</span>
      </div>
   );
}

function ValueBox({ number, title, desc, icon }: any) {
   return (
      <div className="group space-y-8 relative">
         <div className="text-[12rem] font-extrabold text-white/[0.02] leading-none absolute -top-24 -left-8 group-hover:text-blue-500/5 transition-colors duration-700 select-none italic">{number}</div>
         <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-500 mb-8">
            {icon}
         </div>
         <h3 className="text-4xl font-extrabold text-white mb-4 italic tracking-tight uppercase leading-none">{title}</h3>
         <div className="text-xl text-slate-400 font-semibold leading-relaxed border-l-[12px] border-blue-600 pl-10 py-8 bg-white/5 backdrop-blur-3xl rounded-r-[3.5rem] shadow-2xl border border-white/5 group-hover:bg-white/10 transition-all uppercase italic tracking-tight">
            {desc}
         </div>
      </div>
   );
}
