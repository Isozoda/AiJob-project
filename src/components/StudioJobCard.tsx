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
  Calendar,
  MoveRight
} from 'lucide-react';
import { Job } from '../app/types/job';
import { clsx } from 'clsx';

interface StudioJobCardProps {
  job: Job;
}

export const StudioJobCard: React.FC<StudioJobCardProps> = ({ job }) => {
  return (
    <div className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 transition-all duration-700 hover:border-blue-500/30 hover:shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] overflow-hidden">
      {/* Dynamic Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <div className="flex flex-col md:flex-row items-start justify-between gap-12 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-6 mb-8">
            <div className="px-5 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.4em] rounded-full italic">
              ACTIVE SIGNAL
            </div>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic opacity-60 underline decoration-blue-500/30 underline-offset-4">{job.jobType}</span>
          </div>

          <Link href={`/pages/jobs/${job.id}`}>
            <h3 className="text-4xl font-black text-white hover:text-blue-500 transition-colors mb-6 tracking-tight leading-[0.85] text-balance italic uppercase underline decoration-transparent group-hover:decoration-blue-500/10 decoration-4 transition-all duration-700">
              {job.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-10 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] mt-10 italic">
            <span className="flex items-center gap-3 text-blue-500"><MapPin size={18} strokeWidth={3} /> {job.location}</span>
            <span className="flex items-center gap-3"><Clock size={18} strokeWidth={3} /> {job.experienceLevel}</span>
            <span className="flex items-center gap-3 text-emerald-500/80"><DollarSign size={18} strokeWidth={3} /> {job.salaryMax.toLocaleString()}k+</span>
          </div>
        </div>

        <Link
          href={`/pages/jobs/${job.id}`}
          className="shrink-0 w-20 h-20 bg-white/5 border border-white/10 rounded-[1.8rem] flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-xl"
        >
          <MoveRight size={32} />
        </Link>
      </div>

      <div className="mt-12 pt-12 border-t border-white/5 relative">
        <div className="absolute left-0 top-12 w-1 h-full bg-gradient-to-b from-blue-500/30 to-transparent rounded-full opacity-50"></div>
        <p className="text-slate-400 font-bold leading-[1.6] italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3 text-xl md:pl-6 uppercase tracking-tight">
          “{job.description}”
        </p>
      </div>
    </div>
  );
};
