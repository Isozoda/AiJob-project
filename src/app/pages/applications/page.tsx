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
  ArrowLeft
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-6 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
          <Briefcase className="text-blue-500" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Login Required</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Please login to view your job applications and track your career progress.</p>
        <button
          onClick={() => router.push('/pages/login')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => router.push('/pages/jobs')}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Jobs
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Applications</h1>
            <p className="text-slate-500 font-medium">Tracking {applications?.length || 0} active job submissions.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-500 font-bold">Fetching your applications...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-[2.5rem] p-20 border border-slate-100 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-slate-500">Failed to load your applications. Please try again later.</p>
          </div>
        ) : applications?.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 border border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileSearch className="text-slate-300" size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No applications yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't applied to any jobs yet. Browse our job listings to find your next opportunity.</p>
            <button
              onClick={() => router.push('/pages/jobs')}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
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
      case 'Accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100 ring-red-500/10';
      case 'Interview': return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10';
      default: return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted': return <CheckCircle2 size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      case 'Interview': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (isLoading) {
    return <div className="h-40 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group">
      <div className="flex items-center gap-6 w-full">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
          <Briefcase size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-black text-slate-900 truncate">
              {job?.title || `Job #${application.jobId}`}
            </h3>
            <span className={clsx(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ring-4 transition-all",
              getStatusStyle(application.status)
            )}>
              {getStatusIcon(application.status)}
              {application.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {job?.location || 'Remote'}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
        <Link
          href={`/pages/jobs/${application.jobId}`}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all text-sm"
        >
          View Job
        </Link>
        <button className="flex-1 md:flex-none p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
