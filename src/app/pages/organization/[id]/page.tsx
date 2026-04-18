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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
             <Sparkles className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={24} />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Identity...</p>
        </div>
      </div>
    );
  }

  if (isError || (!org && !isOrgLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 mb-8">
           <Building className="text-red-500/30" size={48} />
        </div>
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Record Not Found</h2>
        <p className="text-slate-500 mb-12 max-w-sm font-medium leading-relaxed italic">The entity signature could not be verified in our current data stream. It may have been relocated or archived.</p>
        <button 
          onClick={() => router.push('/pages/organization')}
          className="px-12 py-5 bg-slate-900 text-white rounded-[2.5rem] font-black text-lg hover:shadow-2xl transition-all flex items-center gap-3 active:scale-95"
        >
          <ArrowLeft size={20} strokeWidth={3} /> Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* HUD NAV */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 pointer-events-none">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="group pointer-events-auto flex items-center gap-4 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 px-8 py-4 rounded-[2.5rem] text-sm font-black text-slate-900 hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform font-black" />
            DISCOVER
          </button>
          
          <div className="pointer-events-auto flex items-center gap-3 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 px-6 py-3 rounded-full">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recruiting Protocol Active</span>
          </div>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <header className="relative pt-48 pb-32 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-50 blur-[100px] rounded-full translate-x-1/2 -z-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="relative group shrink-0">
               <div className="absolute -inset-4 bg-blue-500/5 rounded-[4rem] blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative w-56 h-56 md:w-72 md:h-72 bg-white border border-slate-100 rounded-[4rem] p-2 overflow-hidden flex items-center justify-center transform group-hover:scale-[1.02] transition-all duration-700 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
                  {org?.logoUrl ? (
                    <img src={org?.logoUrl} alt={org?.name} className="w-full h-full object-cover rounded-[3.5rem]" />
                  ) : (
                    <Building2 size={80} className="text-slate-100" />
                  )}
               </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                 <Monitor size={14} /> Technology Architecture
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 uppercase italic transition-all duration-1000 cursor-default text-balance">
                {org?.name}.
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-12">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Base</p>
                   <p className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                     <MapPin size={18} className="text-blue-600" /> {org?.location || 'Distributed'}
                   </p>
                 </div>
                 <div className="w-px h-10 bg-slate-100 hidden md:block"></div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Type</p>
                   <p className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                     <Zap size={18} className="text-amber-500" /> {org?.type}
                   </p>
                 </div>
                 <div className="w-px h-10 bg-slate-100 hidden md:block"></div>
                 <div className="flex items-center gap-2">
                    <SocialBtn icon={<Globe size={20}/>} />
                    <SocialBtn icon={<Link2 size={20}/>} />
                    <SocialBtn icon={<Mail size={20}/>} />
                 </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CORE CONTENT */}
      <main className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32">
          
          <div className="lg:col-span-12 space-y-40">
            
            {/* Vision Section */}
            <section className="relative max-w-5xl">
              <div className="absolute -left-16 top-0 text-[20vw] font-black text-slate-100 leading-none pointer-events-none select-none -z-10 uppercase italic opacity-20">CONCEPT</div>
              <div className="flex items-center gap-4 mb-16">
                 <div className="w-16 h-1.5 bg-blue-600 rounded-full"></div> 
                 <h2 className="text-2xl font-black text-slate-900 tracking-widest uppercase">The Manifesto.</h2>
              </div>
              <div className="text-3xl md:text-5xl text-slate-600 font-bold leading-[1.2] italic tracking-tight opacity-95 text-balance">
                “{org?.description || `Design is not just what it looks like and feels like. Design is how it works. At ${org?.name}, we architect the mechanisms of future utility and human connection across ${org?.location}.`}”
              </div>
              
              <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12">
                 <Metric label="Studio Age" value="12Y+" />
                 <Metric label="Innovation" value="Peak" />
                 <Metric label="Ethos" value="Human" />
                 <Metric label="Scale" value="Global" />
              </div>
            </section>

            {/* Opportunity Engine */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-100 pb-12">
                <div>
                   <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Cycles.</h2>
                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.5em] mt-4">{jobs?.length || 0} Open Recruitment Slots</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm text-xs font-black uppercase tracking-widest cursor-pointer hover:border-blue-600 transition-colors">
                  Full Archive <MoveRight size={16} />
                </div>
              </div>

              {isJobsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm"></div>)}
                </div>
              ) : !jobs || jobs.length === 0 ? (
                <div className="bg-white p-24 rounded-[4rem] text-center border border-dashed border-slate-100 group overflow-hidden relative shadow-sm">
                   <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm relative z-10 italic">Quiet Period: No Active Cycles.</p>
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
            <section className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full translate-x-1/3 p-4"></div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10 pt-4">
                  <div>
                     <h3 className="text-3xl font-black mb-10 tracking-tight flex items-center gap-4 uppercase italic">
                        <Users size={32} className="text-blue-500" /> Pulse.
                     </h3>
                     <div className="space-y-10">
                        <Progress label="Innovation Index" value="96%" />
                        <Progress label="Culture Weight" value="Elite" />
                        <Progress label="Growth Core" value="94%" />
                     </div>
                  </div>
                  <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 flex flex-col justify-center">
                     <p className="text-xl md:text-2xl text-slate-300 font-bold italic leading-relaxed">
                       "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
                     </p>
                     <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mt-8">— STUDIO PHILOSOPHY</p>
                  </div>
               </div>
            </section>

          </div>
        </div>
      </main>

      <footer className="py-32 flex justify-center opacity-10 select-none bg-white border-t border-slate-100">
         <h1 className="text-[12vw] font-black tracking-tighter leading-none uppercase italic text-slate-900">{org?.name?.slice(0, 8)}</h1>
      </footer>
    </div>
  );
}

function SocialBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-600 transition-all active:scale-95">
      {icon}
    </button>
  );
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{label}</p>
      <p className="text-2xl font-black text-slate-900 italic">{value}.</p>
    </div>
  );
}

function Progress({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
        <span className="text-slate-400">{label}</span>
        <span className="text-blue-500">{value}</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: value.includes('%') ? value : '90%' }}></div>
      </div>
    </div>
  );
}
