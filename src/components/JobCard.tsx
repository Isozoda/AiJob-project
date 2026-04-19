import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { Job } from '../app/types/job';
import { clsx } from 'clsx';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 transition-all duration-700 hover:shadow-[0_40px_100px_rgba(37,99,235,0.2)] hover:border-blue-500/40 hover:-translate-y-2 overflow-hidden shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000"></div>
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative z-10">
        <div className="flex gap-8 items-start">
          <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/10 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/50 transition-all duration-700 shrink-0 shadow-3xl">
            <Building2 className="text-slate-600 group-hover:text-blue-400 transition-colors" size={32} />
          </div>
          <div className="pt-2">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-[0.4em] bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-lg shadow-blue-500/5 italic">Verified Signal v2</span>
              <ShieldCheck size={14} className="text-blue-500 animate-pulse" />
            </div>
            <Link href={`/pages/jobs/${job.id}`}>
              <h3 className="text-3xl font-extrabold text-white group-hover:text-blue-400 transition-all duration-500 italic uppercase tracking-tighter leading-tight">{job.title}</h3>
            </Link>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] opacity-80 italic">
              <span className="flex items-center gap-3 hover:text-white transition-colors cursor-default">
                <Building2 size={14} className="text-blue-500/50" /> Studio #{job.organizationId}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              <span className="flex items-center gap-3 hover:text-white transition-colors cursor-default">
                <MapPin size={14} className="text-blue-500/50" /> {job.location}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4 self-end md:self-start">
          <div className="flex items-center gap-4 text-emerald-400 font-extrabold bg-emerald-500/10 px-8 py-4 rounded-2xl border border-emerald-500/20 shadow-3xl">
            <DollarSign size={20} />
            <span className="text-2xl italic tracking-tighter">${job.salaryMin.toLocaleString()} — ${job.salaryMax.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-[0.5em] flex items-center gap-3 bg-white/5 px-5 py-2 rounded-full italic">
            <Calendar size={12} className="text-blue-500/50" />
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-5">
        <span className={clsx(
          "px-6 py-3 rounded-2xl border-2 text-[10px] font-extrabold uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl transition-all duration-500 italic",
          job.jobType === 'FullTime' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' :
          job.jobType === 'PartTime' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white' :
          'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white'
        )}>
          <Briefcase size={18} />
          {job.jobType}
        </span>
        <span className="px-6 py-3 bg-white/5 text-slate-500 border border-white/5 rounded-2xl text-[10px] font-extrabold uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-white/10 transition-all cursor-default italic">
          <Clock size={18} />
          {job.experienceLevel}
        </span>
        <span className="px-6 py-3 bg-white/5 text-slate-500 border border-white/5 rounded-2xl text-[10px] font-extrabold uppercase tracking-[0.3em] hover:bg-white/10 transition-all cursor-default italic">
          {job.experienceRequired}+ Years Exp
        </span>
      </div>

      <div className="mt-12 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-10">
        <p className="text-[13px] font-semibold text-slate-500 line-clamp-2 leading-relaxed max-w-xl italic opacity-90 uppercase tracking-tight">
          “{job.description}”
        </p>
        <Link
          href={`/pages/jobs/${job.id}`}
          className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 rounded-[2.2rem] font-extrabold text-[11px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl flex items-center justify-center gap-4 group/btn active:scale-95 italic"
        >
          SYNC DETAILS
          <ChevronRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
        </Link>
      </div>
    </div>
  );
};
