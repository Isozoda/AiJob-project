"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  MapPin, 
  Globe, 
  ArrowLeft, 
  Briefcase, 
  ChevronRight, 
  Loader2, 
  Building,
  ShieldCheck,
  Mail,
  Users,
  Link2,
  Sparkles,
  Zap,
  MoveRight,
  Monitor,
  Layout
} from 'lucide-react';
import { getOrganizationById } from '@/src/app/services/organizationService';
import { getJobsByOrganization } from '@/src/app/services/jobService';
import { StudioJobCard } from '@/src/components/StudioJobCard';
import { clsx } from 'clsx';

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const orgId = parseInt(id as string);
  const router = useRouter();

  const { data: org, isLoading: isOrgLoading, isError } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => getOrganizationById(orgId),
    enabled: !!orgId
  });

  const { data: jobs, isLoading: isJobsLoading } = useQuery({
    queryKey: ['organization-jobs', orgId],
    queryFn: () => getJobsByOrganization(orgId),
    enabled: !!orgId
  });

  if (isOrgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
             <div className="w-24 h-24 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
             <Sparkles className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={28} />
          </div>
          <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse italic">Synchronizing Identity Stream...</p>
        </div>
      </div>
    );
  }

  if (isError || (!org && !isOrgLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[150px] rounded-full translate-x-1/2"></div>
        <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center shadow-2xl border border-white/10 mb-12 animate-in zoom-in duration-700">
           <Building className="text-red-500/40" size={64} />
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic">Signal Void.</h2>
        <p className="text-slate-400 mb-16 max-w-md font-bold text-xl leading-relaxed italic opacity-80 uppercase tracking-tight">The entity signature could not be verified in the current networked stream.</p>
        <button 
          onClick={() => router.push('/pages/organization')}
          className="px-16 py-7 bg-blue-600 text-white rounded-[3rem] font-black text-xl hover:bg-white hover:text-blue-600 transition-all flex items-center gap-4 active:scale-95 shadow-2xl shadow-blue-600/30 uppercase italic tracking-widest"
        >
          <ArrowLeft size={24} strokeWidth={4} /> Network Registry
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      </div>

      {/* HUD NAV */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-10 pointer-events-none">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="group pointer-events-auto flex items-center gap-5 bg-slate-950/60 backdrop-blur-3xl border border-white/5 px-10 py-5 rounded-[2.8rem] text-xs font-black text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 shadow-2xl"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform font-black" />
            BACK SIGNAL
          </button>
          
          <div className="pointer-events-auto flex items-center gap-4 bg-slate-950/60 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">Recruiting Core Active</span>
          </div>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <header className="relative pt-60 pb-40 overflow-hidden z-10">
        <div className="container mx-auto px-6 relative">
          
          <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
            <div className="relative group shrink-0">
               <div className="absolute -inset-8 bg-blue-600/10 rounded-[5rem] blur-[60px] opacity-40 group-hover:opacity-80 transition-all duration-1000"></div>
               <div className="relative w-64 h-64 md:w-80 md:h-80 bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[4.5rem] p-3 overflow-hidden flex items-center justify-center transform group-hover:scale-[1.05] group-hover:border-blue-500/30 transition-all duration-1000 shadow-2xl">
                  {org?.logoUrl ? (
                    <img src={org?.logoUrl} alt={org?.name} className="w-full h-full object-cover rounded-[3.8rem]" />
                  ) : (
                    <Building2 size={100} className="text-slate-800" />
                  )}
               </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic">
                 <Monitor size={14} /> Technology Architecture Slot
              </div>
              <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-[0.02em] leading-[0.8] mb-12 uppercase italic transition-all duration-1000 cursor-default">
                {org?.name}<span className="text-blue-500">.</span>
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-12 mt-16 mt-12 bg-white/5 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] inline-flex">
                 <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic mb-2">Deploy Coordinates</p>
                   <p className="text-2xl font-black text-white flex items-center gap-3 italic tracking-tight">
                     <MapPin size={22} className="text-blue-500" /> {org?.location || 'Distributed Node'}
                   </p>
                 </div>
                 <div className="w-px h-16 bg-white/5 hidden md:block"></div>
                 <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic mb-2">Stream Protocol</p>
                   <p className="text-2xl font-black text-white flex items-center gap-3 italic tracking-tight">
                     <Zap size={22} className="text-amber-500" /> {org?.type}
                   </p>
                 </div>
                 <div className="w-px h-16 bg-white/5 hidden md:block"></div>
                 <div className="flex items-center gap-4">
                    <SocialBtn icon={<Globe size={24}/>} />
                    <SocialBtn icon={<Link2 size={24}/>} />
                    <SocialBtn icon={<Mail size={24}/>} />
                 </div>
              </div>
            </div>
          </div>

        </div>
      </header>


      {/* CORE CONTENT */}
      <main className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32">
          
          <div className="lg:col-span-12 space-y-48">
            
            {/* Vision Section */}
            <section className="relative max-w-6xl">
              <div className="absolute -left-20 top-0 text-[20vw] font-black text-white leading-none pointer-events-none select-none -z-10 uppercase italic opacity-[0.03]">MANIFESTO</div>
              <div className="flex items-center gap-6 mb-20">
                 <div className="w-24 h-2 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)]"></div> 
                 <h2 className="text-3xl font-black text-white tracking-[0.3em] uppercase italic">THE PROTOCOL<span className="text-blue-500">.</span></h2>
              </div>
              <div className="text-4xl md:text-6xl text-slate-300 font-black leading-[1.1] italic tracking-tight opacity-95 text-balance md:pl-10 relative">
                <span className="absolute -left-4 top-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-transparent rounded-full"></span>
                “{org?.description || `Design is not just what it looks like and feels like. Design is how it works. At ${org?.name}, we architect the mechanisms of future utility and human connection across ${org?.location}.`}”
              </div>
              
              <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12">
                 <Metric label="Entity Age" value="12 CYCLES+" />
                 <Metric label="Neural Tier" value="PEAK" />
                 <Metric label="Core Philosophy" value="UNIT-01" />
                 <Metric label="Broadcast" value="GLOBAL" />
              </div>
            </section>

            {/* Opportunity Engine */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 border-b border-white/5 pb-16">
                <div>
                   <h2 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">CYCLES<span className="text-blue-500">.</span></h2>
                   <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.5em] mt-6 italic opacity-80">{jobs?.length || 0} NETWORK BROADCASTS VERIFIED</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-3xl px-10 py-5 rounded-[2.5rem] border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer hover:bg-white hover:text-slate-900 transition-all shadow-2xl italic">
                  FULL CHANNEL ARCHIVE <MoveRight size={20} />
                </div>
              </div>

              {isJobsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white/5 border border-white/5 rounded-[4rem] animate-pulse"></div>)}
                </div>
              ) : !jobs || jobs.length === 0 ? (
                <div className="bg-slate-900/40 backdrop-blur-3xl p-32 rounded-[5rem] text-center border-2 border-dashed border-white/5 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-sm relative z-10 italic">QUIET STREAM // NO ACTIVE NEURAL BROADCASTS DETECTED</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {jobs.map((job) => (
                    <StudioJobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </section>

            {/* Bottom Insight Bar */}
            <section className="bg-slate-950/60 backdrop-blur-3xl rounded-[5rem] p-16 md:p-32 text-white shadow-2xl relative overflow-hidden border border-white/5">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full translate-x-1/3 p-4"></div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
                  <div>
                     <h3 className="text-4xl font-black mb-16 tracking-tighter flex items-center gap-6 uppercase italic">
                        <Users size={36} className="text-blue-500" /> NEURAL PULSE<span className="text-blue-500">.</span>
                     </h3>
                     <div className="space-y-12">
                        <Progress label="NEURAL INNOVATION INDEX" value="96%" />
                        <Progress label="CULTURE WEIGHT (ELITE)" value="Elite" />
                        <Progress label="NETWORK GROWTH CORE" value="94%" />
                     </div>
                  </div>
                  <div className="bg-white/[0.03] rounded-[4rem] p-12 border border-white/5 flex flex-col justify-center">
                     <p className="text-2xl md:text-3xl text-slate-300 font-black italic leading-[1.3] uppercase tracking-tight">
                       "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
                     </p>
                     <p className="text-blue-500 font-black text-[11px] uppercase tracking-[0.6em] mt-12 italic opacity-80">— STUDIO MANIFESTO CORE</p>
                  </div>
               </div>
            </section>

          </div>
        </div>
      </main>

      <footer className="py-40 flex justify-center opacity-[0.03] select-none bg-transparent border-t border-white/5">
         <h1 className="text-[14vw] font-black tracking-tighter leading-none uppercase italic text-white">{org?.name?.slice(0, 8)}</h1>
      </footer>
    </div>
  );
}


function SocialBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 shadow-2xl flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/40 transition-all active:scale-95 backdrop-blur-xl">
      {icon}
    </button>
  );
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic opacity-60">{label}</p>
      <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{value}<span className="text-blue-500">.</span></p>
    </div>
  );
}

function Progress({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] italic mb-2">
        <span className="text-slate-500">{label}</span>
        <span className="text-blue-500">{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: value.includes('%') ? value : '90%' }}></div>
      </div>
    </div>
  );
}
