"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Calendar, 
  Building2, 
  Share2, 
  Bookmark, 
  Send,
  ShieldCheck,
  BrainCircuit,
  Target,
  Rocket,
  Loader2,
  Lock,
  Zap,
  Activity,
  ChevronRight,
  Globe
} from 'lucide-react';
import { getJobById } from '@/src/app/services/jobService';
import { createApplication } from '@/src/app/services/jobApplicationService';
import { getSkillGap } from '@/src/app/services/aiService';
import { getToken } from '@/src/store/authStore';
import { clsx } from 'clsx';
import toast, { Toaster } from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const jobId = parseInt(id as string);

  const currentUserId = (() => {
    const token = getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.UserId || payload.sub || '0');
    } catch { return 0; }
  })();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId
  });

  const { data: skillGap, isLoading: isGapLoading } = useQuery({
    queryKey: ['skill-gap', currentUserId, jobId],
    queryFn: () => getSkillGap(currentUserId, jobId),
    enabled: !!currentUserId && !!jobId
  });

  const applyMutation = useMutation({
    mutationFn: () => createApplication({ jobId, userId: currentUserId }),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.description?.[0] || 'Failed to submit application';
      toast.error(msg);
    }
  });

  const handleApply = () => {
    if (!currentUserId) {
      toast.error('Please login to apply for this job');
      router.push('/pages/login');
      return;
    }
    applyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
        <p className="text-blue-500 font-extrabold uppercase tracking-[0.4em] text-xs animate-pulse italic">Connecting to Neural Signal...</p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <Briefcase className="text-red-500" size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-4 italic uppercase tracking-tighter">Node Not Identified</h2>
        <p className="text-slate-500 mb-12 max-w-md font-semibold italic uppercase tracking-tight">The job signal you are looking for has been terminated or relocated.</p>
        <button 
          onClick={() => router.push('/pages/jobs')}
          className="flex items-center gap-4 px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-extrabold text-xs uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl italic active:scale-95"
        >
          <ArrowLeft size={20} /> Return to Network
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 relative overflow-hidden text-white/90 selection:bg-blue-600/30">
      <Toaster position="top-right" />
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* ── TOP NAV HUD ── */}
      <div className="sticky top-0 z-[100] bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 shadow-2xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-4 text-[10px] font-extrabold text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-all group italic"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-500" />
            Abort & Return
          </button>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-500 transition-all hover:bg-white/10 shadow-2xl active:scale-90"><Share2 size={20}/></button>
            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-amber-500 transition-all hover:bg-white/10 shadow-2xl active:scale-90"><Bookmark size={20}/></button>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <header className="relative pt-24 pb-16 z-10">
        <div className="container mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-12 md:p-20 shadow-3xl relative overflow-hidden group/hero">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
              <div className="flex flex-col md:flex-row items-start gap-12">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 border border-white/10 flex items-center justify-center shadow-3xl group-hover/hero:border-blue-500/50 transition-colors duration-700 shrink-0">
                  <Building2 className="text-slate-600 group-hover/hero:text-blue-400" size={48} />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-[0.4em] bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-lg italic">Authorized Protocol</span>
                    <ShieldCheck size={18} className="text-blue-500 animate-pulse" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 italic uppercase leading-none">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-y-4 gap-x-10 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest italic opacity-80 backdrop-blur-sm">
                    <span className="flex items-center gap-3"><MapPin size={18} className="text-blue-500/60" /> {job.location || 'NEURAL_LINK_NULL'}</span>
                    <span className="flex items-center gap-3 text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10 shadow-lg">
                      <DollarSign size={18}/> 
                      {job.salaryMin?.toLocaleString() || '0'} — {job.salaryMax?.toLocaleString() || '0'} / CYC
                    </span>
                    <span className="flex items-center gap-3">
                      <Calendar size={18} className="text-indigo-400/60" /> 
                      LOGGED: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={handleApply}
                  disabled={applyMutation.isPending}
                  className="w-full lg:w-auto px-16 py-8 bg-blue-600 text-white rounded-[2.5rem] font-extrabold text-xl uppercase italic tracking-[0.2em] shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] hover:bg-white hover:text-slate-900 transition-all active:scale-95 flex items-center justify-center gap-4 group/apply"
                >
                  {applyMutation.isPending ? <Loader2 className="animate-spin" size={24} /> : <>INITIATE SYNC <Send size={24} className="group-hover/apply:translate-x-2 group-hover/apply:-translate-y-1 transition-transform" /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN HUD CONTENT ── */}
      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Description */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors"></div>
              
              <h2 className="text-2xl font-extrabold text-white mb-12 border-b border-white/5 pb-8 italic uppercase tracking-tighter flex items-center gap-4">
                <Activity size={24} className="text-blue-500" />
                Dossier Specification<span className="text-blue-500">.</span>
              </h2>
              <div className="text-slate-400 space-y-10">
                <p className="text-lg font-medium leading-[1.8] whitespace-pre-wrap italic uppercase tracking-tight opacity-90">
                  {job.description}
                </p>
                
                <h3 className="text-xl font-extrabold text-white pt-8 italic uppercase tracking-[0.2em] border-t border-white/5 flex items-center gap-4">
                  <Zap size={20} className="text-amber-500" />
                  Technical Directives
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RequirementItem icon={<Rocket size={18}/>} text={`${job.experienceRequired}+ CYCLES OF RELEVANT EXP`} />
                  <RequirementItem icon={<Target size={18}/>} text={`LEVEL: ${job.experienceLevel}`} />
                  <RequirementItem icon={<Briefcase size={18}/>} text={`PROTOCOL: ${job.jobType}`} />
                  <RequirementItem icon={<ShieldCheck size={18}/>} text={`AUTHORITY NODE: ${job.categoryId}`} />
                </ul>
              </div>
            </section>

            {/* About Organization */}
            <section className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 md:p-16 border border-white/10 shadow-2xl group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border border-white/10 flex items-center justify-center shadow-3xl group-hover:bg-blue-600/10 group-hover:border-blue-500/50 transition-all duration-700">
                  <Building2 className="text-slate-600 group-hover:text-blue-400" size={40} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-extrabold text-white italic uppercase tracking-tighter mb-2 leading-none">Organization_{job.organizationId}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-[0.4em] italic">Verified Partner</span>
                    <Globe size={14} className="text-slate-600" />
                  </div>
                </div>
              </div>
              <p className="text-lg text-slate-500 font-semibold italic mb-10 leading-relaxed uppercase tracking-tight">
                This organization is a verified member of our platform. They have a track record of hiring talented individuals and providing a great work environment in the neural grid.
              </p>
              <button className="flex items-center gap-3 text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.5em] hover:text-white transition-all italic underline decoration-2 underline-offset-8">
                Access_Studio_Profile.log <ChevronRight size={14} />
              </button>
            </section>
          </div>

          {/* Right Column: AI Insights & Sidebar */}
          <div className="lg:col-span-4 space-y-10 relative">
            
            {/* AI Insights Card */}
            <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[4rem] p-12 text-white border border-white/10 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-blue-500/20 shadow-2xl">
                    <BrainCircuit size={28} className="text-blue-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold uppercase italic tracking-tighter">Neural Insights<span className="text-blue-500">.</span></h3>
                </div>

                {isGapLoading ? (
                  <div className="flex flex-col items-center gap-6 py-12 text-blue-500/60">
                    <Loader2 size={40} className="animate-spin" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.5em] animate-pulse">Calculating Alignment...</span>
                  </div>
                ) : skillGap ? (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.5em] italic">Sync_Rating</span>
                      <span className="text-5xl font-extrabold text-blue-500 italic tracking-tighter drop-shadow-[0_10px_20px_rgba(37,99,235,0.3)]">{skillGap.matchScore}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" style={{ width: `${skillGap.matchScore}%` }}></div>
                    </div>
                    
                    <div>
                      <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-[0.4em] mb-6 italic">Optimized Strengths</h4>
                      <div className="flex flex-wrap gap-3">
                        {skillGap.strengths?.slice(0, 5).map((s: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-extrabold text-blue-400 uppercase italic tracking-wider transition-all hover:bg-white/10">{s}</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[15px] font-semibold text-slate-400 leading-[1.6] italic border-l-4 border-blue-600/40 pl-6 uppercase tracking-tight">
                      “{skillGap.fitSummary}”
                    </p>
                  </div>
                ) : (
                  <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-center backdrop-blur-md">
                    <Lock size={32} className="text-slate-700 mx-auto mb-6" />
                    <p className="text-xs text-slate-500 mb-10 font-bold uppercase tracking-widest italic">Complete profile for Neural Alignment data.</p>
                    <button 
                      onClick={() => router.push(`/pages/profile/${currentUserId}`)}
                      className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] font-extrabold text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl italic active:scale-95"
                    >
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Summary HUD */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 border border-white/10 shadow-3xl space-y-12">
              <h3 className="text-xl font-extrabold text-white mb-6 italic uppercase tracking-tighter">Node Telemetry<span className="text-blue-500">.</span></h3>
              
              <div className="space-y-8">
                <OverviewItem icon={<Briefcase className="text-blue-500" size={20}/>} label="TYPE" value={job.jobType} />
                <OverviewItem icon={<Clock className="text-amber-500" size={20}/>} label="EXP_LVL" value={job.experienceLevel} />
                <OverviewItem icon={<Target className="text-purple-500" size={20}/>} label="CAT_ID" value={job.categoryId?.toString() || 'N/A'} />
                <OverviewItem icon={<MapPin className="text-red-500" size={20}/>} label="LOC" value={job.location} />
                <OverviewItem icon={<Activity className="text-emerald-500" size={20}/>} label="CYC_SCHED" value="MON-FRI" />
              </div>

              <div className="pt-10 border-t border-white/5">
                <button className="w-full py-5 border-2 border-white/10 text-white/40 hover:text-white rounded-[2rem] font-extrabold text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-2xl italic">ARCHIVE SIGNAL</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function RequirementItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest italic group hover:bg-white/10 transition-all">
      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center shadow-2xl text-blue-500 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      {text}
    </li>
  );
}

function OverviewItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 shadow-3xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-[0.6em] mb-1 italic leading-none">{label}</p>
        <p className="text-sm font-extrabold text-white italic uppercase tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}
