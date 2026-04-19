"use client"
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit3, 
  Eye, 
  BarChart3, 
  Briefcase,
  Loader2,
  AlertCircle,
  Activity,
  Zap,
  ChevronRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { getMyJobs, deleteJob } from '@/src/app/services/jobService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { clsx } from "clsx";

export default function ManageJobsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, isError } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: getMyJobs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete job');
    }
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
        <p className="text-blue-500 font-extrabold uppercase tracking-[0.4em] text-xs animate-pulse italic">Retrieving Node Logs...</p>
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

      <div className="container mx-auto px-6 relative z-10 pt-32">
        
        {/* ── HEADER HUD ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl group">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-extrabold uppercase tracking-[0.4em] mb-6 border border-blue-500/20 italic">
               <Activity size={12} className="animate-pulse" /> Command Center v1.2
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4 italic uppercase leading-none">Manage Vacancies<span className="text-blue-600">.</span></h1>
            <p className="text-slate-500 font-semibold italic uppercase tracking-tight text-lg">Architect, Synchronize, and Trace your active neural job listings.</p>
          </div>
          <button 
            onClick={() => router.push('/pages/jobs/create')}
            className="flex items-center gap-4 px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-extrabold text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-blue-600/30 active:scale-95 italic group/btn"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Deploy New Node
          </button>
        </div>

        {/* ── JOBS GRID ── */} 
        {isError ? (
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-32 border border-white/10 text-center shadow-3xl">
            <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
               <AlertCircle className="text-red-500" size={48} />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-4 uppercase italic tracking-tighter">Transmission Failure</h3>
            <p className="text-slate-500 font-semibold italic uppercase tracking-tight text-lg">Failed to establish secure link with account repositories.</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-32 border-2 border-dashed border-white/10 text-center shadow-3xl group">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white/10 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-700">
              <Briefcase className="text-slate-600 group-hover:text-blue-500 transition-colors" size={48} />
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-6 uppercase italic tracking-tighter">Zero Nodes Found</h3>
            <p className="text-slate-500 mb-12 max-w-sm mx-auto font-semibold uppercase italic tracking-tight opacity-80 leading-relaxed">No active job signals detected in your sector. Start hiring to initialize grid presence.</p>
            <button 
              onClick={() => router.push('/pages/jobs/create')}
              className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-extrabold text-xs uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl italic"
            >
              Post First Vacancy
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-10 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 group hover:border-blue-500/30 transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-10 w-full lg:w-auto">
                  <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-[2rem] flex items-center justify-center text-slate-600 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all duration-700 shadow-3xl">
                    <Briefcase size={32} />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                       <span className="text-[9px] font-extrabold text-blue-500 uppercase tracking-[0.3em] bg-blue-600/10 px-3 py-1 rounded-full italic">ACTIVE_SIGNAL</span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-white italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest italic opacity-80">
                      <span className="flex items-center gap-3"><Activity size={14} className="text-blue-500/60" /> {job.jobType}</span>
                      <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                      <span className="flex items-center gap-3"><MapPin size={14} className="text-blue-500/60" /> {job.location}</span>
                      <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                      <span className="flex items-center gap-3"><Sparkles size={14} className="text-indigo-400/60" /> LOGGED: {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                  <Link 
                    href={`/pages/jobs/${job.id}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-slate-400 border border-white/5 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all italic"
                  >
                    <Eye size={18} /> View Signal
                  </Link>
                  <Link 
                    href={`/pages/jobs/manage/${job.id}/applications`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all italic shadow-lg shadow-emerald-500/5 group/app"
                  >
                    <BarChart3 size={18} className="group-hover/app:scale-110 transition-transform" /> Applications
                  </Link>
                  <Link 
                    href={`/pages/jobs/edit/${job.id}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all italic shadow-lg shadow-blue-500/5"
                  >
                    <Edit3 size={18} /> Edit Node
                  </Link>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-red-500/60 border border-white/5 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all italic"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STATS HUB ── */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
          <StatCard icon={<BarChart3 className="text-blue-500"/>} label="Neural Pulse Views" value="1,284" />
          <StatCard icon={<Activity className="text-emerald-500"/>} label="Response Signals" value="42" />
          <StatCard icon={<Zap className="text-indigo-400"/>} label="Active Frequency" value={jobs?.length.toString() || '0'} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl group hover:border-blue-500/20 transition-all duration-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-600/10 shadow-2xl">
        {icon}
      </div>
      <p className="text-[10px] font-extrabold text-slate-600 uppercase tracking-[0.6em] mb-4 italic leading-none">{label}</p>
      <p className="text-5xl font-extrabold text-white tracking-tighter italic drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)]">{value}</p>
    </div>
  );
}
