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
   Layers
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
   return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-950 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">

         {/* ── BACKGROUND AMBIENCE ── */}
         <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
         </div>

         {/* ── HERO HUD ── */}
         <section className="relative pt-44 pb-40 overflow-hidden bg-white border-b border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="container mx-auto px-6 relative z-10">
               <div className="max-w-5xl">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl shadow-slate-900/20 animate-in fade-in slide-in-from-top-4 duration-1000">
                     <Sparkles size={14} className="text-blue-400" /> SYSTEM MANIFESTO 2.0
                  </div>
                  <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 italic uppercase text-slate-900 drop-shadow-[0_15px_15px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-bottom-8 duration-700">
                     Beyond <br /> <span className="text-blue-600 tracking-normal drop-shadow-[0_20px_30px_rgba(37,99,235,0.2)]">Code.</span>
                  </h1>
                  <p className="text-3xl md:text-5xl text-slate-400 font-extrabold leading-[1.1] max-w-4xl italic tracking-tight opacity-90 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                     Empowering the global workforce through <span className="text-slate-900">Cognitive Neural Matching</span> and Architectural Integrity.
                  </p>
               </div>
            </div>
         </section>

         {/* ── THE ECOSYSTEM (Deep Shadows) ── */}
         <section className="py-48 relative z-10">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                  <div className="relative group">
                     <div className="absolute -inset-20 bg-blue-600/5 blur-[120px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000"></div>
                     <h2 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.85] mb-16 text-slate-900">
                        The <br /> <span className="text-blue-600 underline decoration-8 underline-offset-8 decoration-blue-500/20">Protocols.</span>
                     </h2>
                     <div className="space-y-12 text-2xl text-slate-500 font-bold leading-relaxed italic">
                        <p className="border-l-8 border-blue-600 pl-10 py-4 bg-white shadow-[30px_30px_80px_-20px_rgba(0,0,0,0.05)] rounded-[2.5rem] hover:shadow-[30px_50px_100px_-20px_rgba(37,99,235,0.1)] transition-all">
                           Recruitment is no longer a search. It is a <br /> <span className="text-slate-900 tracking-tighter">Synchronized Alignment.</span>
                        </p>
                        <p className="pl-12 opacity-80">
                           We analyze the DNA of companies and the aspirations of talent to create the perfect professional symphony.
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                     <DeepShadowCard
                        icon={<BrainCircuit size={40} />}
                        title="Neural Core"
                        desc="High-fidelity matching algorithms."
                        shadowColor="shadow-blue-500/10"
                     />
                     <DeepShadowCard
                        icon={<Fingerprint size={40} />}
                        title="Verified ID"
                        desc="Biometric-grade trust layers."
                        shadowColor="shadow-purple-500/10"
                     />
                     <DeepShadowCard
                        icon={<Zap size={40} />}
                        title="Instant Sync"
                        desc="Zero-latency recruitment cycles."
                        shadowColor="shadow-amber-500/10"
                     />
                     <DeepShadowCard
                        icon={<ShieldCheck size={40} />}
                        title="Vault Spec"
                        desc="Enterprise data protection."
                        shadowColor="shadow-emerald-500/10"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* ── METRICS (Glassmorphism) ── */}
         <section className="py-40 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
            <div className="container mx-auto px-6 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
                  <StatItem label="Match Accuracy" value="99.2%" />
                  <StatItem label="Global Studios" value="1.4k+" />
                  <StatItem label="Talent Pool" value="12M" />
                  <StatItem label="AI Operations" value="Peak" />
               </div>
            </div>
         </section>

         {/* ── CORE DNA (Big Shadows) ── */}
         <section className="py-48 relative bg-white border-y border-slate-100 shadow-[0_-20px_100px_rgba(0,0,0,0.03)]">
            <div className="container mx-auto px-6">
               <div className="text-center max-w-4xl mx-auto mb-40">
                  <h2 className="text-8xl font-black tracking-tighter uppercase italic text-slate-900 mb-10 leading-none">Architectural <br /> <span className="text-blue-600">Integrity.</span></h2>
                  <p className="text-xl text-slate-400 font-black uppercase tracking-[0.5em] italic">The Foundation of our Network</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                  <ValueBox
                     number="100"
                     title="AUTONOMY"
                     desc="Freedom to choose, freedom to innovate, and freedom to lead your own career path."
                  />
                  <ValueBox
                     number="200"
                     title="PRECISION"
                     desc="Eliminating noise from the recruitment stream to focus purely on high-impact signals."
                  />
                  <ValueBox
                     number="300"
                     title="VELOCITY"
                     desc="Moving at the speed of thought. Reducing the gap between dream and reality."
                  />
               </div>
            </div>
         </section>

         {/* ── CALL TO ACTION (Explosive Design) ── */}
         <section className="py-60 px-6 relative overflow-hidden">
            <div className="container mx-auto relative group">
               <div className="absolute -inset-20 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-indigo-600/30 blur-[150px] rounded-[10rem] group-hover:scale-125 transition-transform duration-1000 opacity-60"></div>
               <div className="relative bg-slate-950 rounded-[5rem] p-16 md:p-32 flex flex-col items-center text-center shadow-[0_100px_150px_-30px_rgba(15,23,42,0.5)] border border-white/5 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.03] -z-10"></div>
                  <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center mb-16 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:rotate-12 transition-transform duration-700">
                     <Rocket className="text-white fill-white" size={56} />
                  </div>
                  <h2 className="text-7xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.8] mb-16 italic uppercase drop-shadow-2xl">
                     Step into <br /> <span className="text-blue-500 tracking-normal">The Future.</span>
                  </h2>
                  <div className="flex flex-col md:flex-row gap-10 mt-8 relative z-10 w-full max-w-2xl">
                     <Link href="/pages/register" className="flex-1 px-16 py-8 bg-white text-slate-950 rounded-[3rem] font-black text-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)] hover:shadow-blue-600/40 flex items-center justify-center gap-4 group/btn">
                        SIGN UP <ArrowRight size={28} strokeWidth={4} className="group-hover/btn:translate-x-2 transition-transform" />
                     </Link>
                     <Link href="/pages/login" className="flex-1 px-16 py-8 bg-white/5 text-white border-2 border-white/10 rounded-[3rem] font-black text-2xl hover:bg-white/10 transition-all active:scale-95 backdrop-blur-xl">
                        LOG IN
                     </Link>
                  </div>

                  <p className="mt-20 text-[10px] font-black text-white/30 uppercase tracking-[0.6em]">AUTHORIZED NETWORK ACCESS ONLY • GLOBAL STUDIOS HUB</p>
               </div>
            </div>
         </section>

         {/* ── FOOTER DECOR ── */}
         <div className="py-40 bg-white border-t border-slate-50 flex justify-center opacity-[0.05] select-none pointer-events-none">
            <h1 className="text-[18vw] font-black tracking-tighter leading-none uppercase text-slate-900 italic">SYNERGY</h1>
         </div>

      </div>
   );
}

function DeepShadowCard({ icon, title, desc, shadowColor }: any) {
   return (
      <div className={`p-12 bg-white border border-slate-50 rounded-[4rem] shadow-[20px_40px_80px_-15px_rgba(0,0,0,0.05)] hover:shadow-[30px_60px_100px_-15px_rgba(37,99,235,0.15)] hover:-translate-y-4 transition-all duration-700 group cursor-default relative overflow-hidden ${shadowColor}`}>
         <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-slate-900 group-hover:text-white transition-all duration-700 shadow-xl shadow-slate-200/50 group-hover:shadow-blue-500/20 group-hover:scale-110">
            {icon}
         </div>
         <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight italic uppercase">{title}</h3>
         <p className="text-lg text-slate-400 font-bold leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">“{desc}”</p>
      </div>
   );
}

function StatItem({ label, value }: any) {
   return (
      <div className="flex flex-col items-center text-center group">
         <span className="text-7xl font-black italic text-white tracking-widest drop-shadow-[0_10px_10px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">{value}</span>
         <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] mt-6 bg-white/5 px-4 py-2 rounded-full border border-white/5">{label}</span>
      </div>
   );
}

function ValueBox({ number, title, desc }: any) {
   return (
      <div className="group p-4">
         <div className="text-[10rem] font-black text-slate-50 leading-none mb-4 group-hover:text-blue-500/10 transition-colors duration-700 select-none">{number}</div>
         <h3 className="text-4xl font-black text-slate-900 mb-8 italic tracking-tight">{title}</h3>
         <div className="text-xl text-slate-500 font-bold leading-relaxed border-l-[12px] border-blue-600 pl-10 py-6 bg-slate-50 rounded-r-[3rem] shadow-[20px_20px_60px_-20px_rgba(0,0,0,0.05)] group-hover:bg-white transition-all group-hover:shadow-[30px_40px_100px_-20px_rgba(37,99,235,0.1)]">
            {desc}
         </div>
      </div>
   );
}
