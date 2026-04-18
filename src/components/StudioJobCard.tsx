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
    <div className="group relative bg-white border border-slate-100 rounded-[3rem] p-10 transition-all duration-700 hover:border-blue-200 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
             <div className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
               ACTIVE SIGNAL
             </div>
             <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{job.jobType}</span>
          </div>
          
          <Link href={`/pages/jobs/${job.id}`}>
            <h3 className="text-3xl font-black text-slate-900 hover:text-blue-600 transition-colors mb-4 tracking-tighter leading-[0.9] text-balance">
              {job.title}
            </h3>
          </Link>
          
          <div className="flex flex-wrap items-center gap-8 text-slate-400 font-black text-[11px] uppercase tracking-widest mt-8">
             <span className="flex items-center gap-2 text-blue-600 italic"><MapPin size={16} strokeWidth={3} /> {job.location}</span>
             <span className="flex items-center gap-2 italic"><Clock size={16} strokeWidth={3} /> {job.experienceLevel}</span>
             <span className="flex items-center gap-2 text-emerald-600 italic"><DollarSign size={16} strokeWidth={3} /> {job.salaryMax.toLocaleString()}k+</span>
          </div>
        </div>

        <Link 
          href={`/pages/jobs/${job.id}`}
          className="shrink-0 w-16 h-16 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all hover:scale-110 active:scale-95 shadow-sm"
        >
          <MoveRight size={28} />
        </Link>
      </div>

      <div className="mt-10 pt-10 border-t border-slate-50">
        <p className="text-slate-500 font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2 text-lg">
          “{job.description}”
        </p>
      </div>
    </div>
  );
};
