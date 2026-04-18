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
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'FullTime': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PartTime': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Remote': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Hybrid': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-blue-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white group-hover:border-blue-100 transition-colors shrink-0">
            <Building2 className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">AiJob Verified</span>
              <ShieldCheck size={14} className="text-blue-500" />
            </div>
            <Link href={`/pages/jobs/${job.id}`}>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
            </Link>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Organization #{job.organizationId}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2">
          <div className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <DollarSign size={14} />
            <span className="text-sm">{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <Calendar size={12} />
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className={clsx("px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5", getBadgeColor(job.jobType))}>
          <Briefcase size={14} />
          {job.jobType}
        </span>
        <span className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Clock size={14} />
          {job.experienceLevel}
        </span>
        <span className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl text-xs font-bold">
          {job.experienceRequired}+ Years Exp
        </span>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed max-w-lg">
          {job.description}
        </p>
        <Link 
          href={`/pages/jobs/${job.id}`}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all group/btn"
        >
          View Details 
          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
