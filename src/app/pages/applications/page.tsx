"use client"
import { useQuery } from '@tanstack/react-query';
import {
  FileSearch,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  Activity,
  Zap,
  Sparkles,
  Target,
  BrainCircuit
} from 'lucide-react';
import { getApplicationsByUser } from '@/src/app/services/jobApplicationService';
import { getJobById } from '@/src/app/services/jobService';
import { getToken } from '@/src/store/authStore';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function MyApplicationsPage() {
  const router = useRouter();

  const currentUserId = (() => {
    const token = getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.UserId || payload.sub || '0');
    } catch { return 0; }
  })();

  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ['my-applications', currentUserId],
    queryFn: () => getApplicationsByUser(currentUserId),
    enabled: !!currentUserId
  });

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
        <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mb-10 border border-blue-500/20 shadow-3xl">
          <Lock className="text-blue-500" size={48} />
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-6 italic uppercase tracking-tighter">Authorization Required</h2>
        <p className="text-slate-500 mb-12 max-w-sm font-semibold italic uppercase tracking-tight">Please login to synchronize your career trajectory and track active signals.</p>
        <button
          onClick={() => router.push('/pages/login')}
          className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-extrabold uppercase italic tracking-[0.3em] hover:bg-white hover:text-slate-950 transition-all shadow-3xl active:scale-95 text-xs"
        >
          Initialize Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 relative overflow-hidden text-white/90 selection:bg-blue-600/30">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-32">

        {/* ── HEADER HUD ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl group">
          <div className="flex-1">
             <button
              onClick={() => router.push('/pages/jobs')}
              className="flex items-center gap-4 text-[10px] font-extrabold text-slate-500 hover:text-white uppercase tracking-[0.3em] mb-10 transition-all italic group/back"
            >
              <ArrowLeft size={18} className="group-hover/back:-translate-x-2 transition-transform duration-500" /> Back to Global Networks
            </button>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-extrabold uppercase tracking-[0.4em] mb-6 border border-blue-500/20 italic">
               <Activity size={12} className="animate-pulse" /> Telemetry Stream v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4 italic uppercase leading-none">My Applications<span className="text-blue-600">.</span></h1>
            <p className="text-slate-500 font-semibold italic uppercase tracking-tight text-lg">Tracking <span className="text-blue-500">{applications?.length || 0}</span> ACTIVE NEURAL SUBMISSIONS IN THE GLOBAL GRID.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-blue-600 mb-8" size={64} />
            <p className="text-blue-500 font-extrabold uppercase tracking-[0.5em] text-xs animate-pulse italic">Synchronizing Application Nodes...</p>
          </div>
        ) : isError ? (
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-32 border border-white/10 text-center shadow-3xl">
            <AlertCircle className="text-red-500 mx-auto mb-8 shadow-2xl shadow-red-500/20" size={64} />
            <h3 className="text-3xl font-extrabold text-white uppercase italic tracking-tighter">Signal Interrupted</h3>
            <p className="text-slate-500 font-semibold italic uppercase tracking-tight text-lg">Failed to establish secure link with your application logs.</p>
          </div>
        ) : applications?.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-32 border-2 border-dashed border-white/10 text-center shadow-3xl group">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white/10 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-700">
              <FileSearch className="text-slate-700 group-hover:text-blue-500 transition-colors" size={48} />
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-6 uppercase italic tracking-tighter">Zero Signals Found</h3>
            <p className="text-slate-500 mb-12 max-w-sm mx-auto font-semibold uppercase italic tracking-tight opacity-80 leading-relaxed">You haven't initialized any job applications yet. Browse the network to find your frequency.</p>
            <button
              onClick={() => router.push('/pages/jobs')}
              className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-extrabold text-xs uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl italic"
            >
              Explore Network
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {applications?.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ application }: any) {
  const { data: job, isLoading } = useQuery({
    queryKey: ['job', application.jobId],
    queryFn: () => getJobById(application.jobId),
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5';
      case 'Interview': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5';
    }
  };

  if (isLoading) {
    return <div className="h-48 bg-white/5 rounded-[3.5rem] border border-white/5 animate-pulse"></div>;
  }

  return (
    <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-10 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-blue-500/30 transition-all duration-700 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000"></div>

      <div className="flex items-center gap-10 w-full">
        <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-[2rem] flex items-center justify-center text-slate-700 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all duration-700 shadow-3xl shrink-0">
          <Briefcase size={32} />
        </div>
        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
            <h3 className="text-3xl font-extrabold text-white italic uppercase tracking-tighter truncate group-hover:text-blue-400 transition-colors">
              {job?.title || `NODE_SIGNAL #${application.jobId}`}
            </h3>
            <span className={clsx(
              "inline-flex items-center justify-center gap-3 px-5 py-2 rounded-full text-[9px] font-extrabold uppercase tracking-widest border transition-all italic",
              getStatusStyle(application.status)
            )}>
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse shadow-[0_0_10px_currentColor]"></div>
              {application.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-4 gap-x-8 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest italic opacity-80">
            <span className="flex items-center gap-3"><MapPin size={16} className="text-blue-500/60" /> {job?.location || 'NEURAL_REMOTE'}</span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
            <span className="flex items-center gap-3"><Calendar size={16} className="text-indigo-400/60" /> SYNCED: {new Date(application.appliedAt).toLocaleDateString()}</span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
            <span className="flex items-center gap-3 text-blue-500/80"><BrainCircuit size={16} /> ALIGN: 85%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full lg:w-auto shrink-0 justify-center">
        <Link
          href={`/pages/jobs/${application.jobId}`}
          className="flex-1 lg:flex-none flex items-center justify-center gap-4 px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-extrabold text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl italic active:scale-95"
        >
          Access Dossier
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}

function Lock({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
