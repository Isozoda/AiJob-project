"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreVertical,
  ChevronDown,
  Briefcase,
  AlertCircle,
  Activity,
  Zap,
  BrainCircuit,
  Globe,
  Activity as Pulse
} from 'lucide-react';
import { getApplicationsByJob, updateApplicationStatus } from '@/src/app/services/jobApplicationService';
import { getJobById } from '@/src/app/services/jobService';
import { getProfileByUserId } from '@/src/app/services/profileService';
import { clsx } from 'clsx';
import toast, { Toaster } from 'react-hot-toast';
import { ApplicationStatus } from '@/src/app/types/jobApplication';

export default function JobApplicationsPage() {
  const { id } = useParams();
  const jobId = parseInt(id as string);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: job, isLoading: isJobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId
  });

  const { data: applications, isLoading: isAppsLoading, isError } = useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => getApplicationsByJob(jobId),
    enabled: !!jobId
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: ApplicationStatus }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications', jobId] });
      toast.success('Status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  if (isJobLoading || isAppsLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
        <p className="text-blue-500 font-extrabold uppercase tracking-[0.4em] text-xs animate-pulse italic">Scanning Signal Applicants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 relative overflow-hidden text-white/90 selection:bg-blue-600/30 font-sans">
      <Toaster position="top-right" />

      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-32">

        {/* ── HEADER HUD ── */}
        <div className="mb-16">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-4 text-[10px] font-extrabold text-slate-500 hover:text-white uppercase tracking-[0.3em] mb-10 transition-all italic group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform duration-500" /> Back to Base Management
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-400 text-[9px] font-extrabold uppercase tracking-[0.3em] mb-6 border border-blue-500/20 italic">
                <Pulse size={12} className="animate-pulse" /> Neural Response Log
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4 italic uppercase leading-none">Applicants<span className="text-blue-500">.</span></h1>
              <p className="text-xl text-slate-500 font-semibold italic uppercase tracking-tight">
                IDENTIFIED SIGNALS FOR: <span className="text-blue-500">{job?.title}</span>
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 shadow-3xl flex items-center gap-10">
              <StatItem label="TOTAL_LOG" value={applications?.length || 0} color="blue" />
              <div className="w-px h-12 bg-white/5"></div>
              <StatItem label="PENDING_SYNC" value={applications?.filter(a => a.status === 'Pending').length || 0} color="amber" />
              <div className="w-px h-12 bg-white/5"></div>
              <StatItem label="COMM_LINK" value={applications?.filter(a => a.status === 'Interview').length || 0} color="indigo" />
            </div>
          </div>
        </div>

        {/* ── LISTINGS ── */}
        {isError ? (
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-32 border border-white/10 text-center shadow-3xl">
            <AlertCircle className="text-red-500 mx-auto mb-6 shadow-2xl shadow-red-500/20" size={64} />
            <h3 className="text-3xl font-extrabold text-white uppercase italic tracking-tighter">Access Denied</h3>
            <p className="text-slate-500 mt-4 font-semibold italic uppercase tracking-tight">Failed to authenticate applicant stream. Verify security credentials.</p>
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-32 border-2 border-dashed border-white/10 text-center shadow-3xl group">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white/10 group-hover:border-blue-500/30 transition-all duration-700">
              <User className="text-slate-700 group-hover:text-blue-500" size={48} />
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-6 uppercase italic tracking-tighter">Zero Responses</h3>
            <p className="text-slate-500 font-semibold uppercase italic tracking-tight opacity-80 leading-relaxed max-w-sm mx-auto">Neural net currently quiet. New applications will synchronize here upon broadcast.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications?.map((app) => (
              <ApplicantRow
                key={app.id}
                application={app}
                onStatusChange={(status: ApplicationStatus) => statusMutation.mutate({ id: app.id, status })}
                isUpdating={statusMutation.isPending && statusMutation.variables?.id === app.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicantRow({ application, onStatusChange, isUpdating }: any) {
  const { data: profile } = useQuery({
    queryKey: ['profile', application.userId],
    queryFn: () => getProfileByUserId(application.userId),
  });
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Interview': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-blue-500/30 transition-all duration-700 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000"></div>

      <div className="flex items-center gap-10 w-full lg:w-auto">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center text-slate-700 overflow-hidden shadow-2xl group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-700">
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={28} />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-extrabold text-white italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{profile?.firstName ? `${profile.firstName} ${profile.lastName}` : `OPERATOR_${application.userId}`}</h3>
          <p className="text-[10px] font-extrabold text-slate-600 flex items-center justify-center md:justify-start gap-3 mt-3 uppercase tracking-widest italic">
            <Globe size={14} className="text-blue-500/50" />
            {profile?.location || 'NODE_NULL'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full lg:w-auto text-center md:text-left">
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-[0.4em] italic leading-none">SYNC_DATE</span>
          <span className="text-xs font-extrabold text-slate-400 uppercase italic tracking-widest">{new Date(application.appliedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-[0.4em] italic leading-none">ALIGN_SCORE</span>
          <span className="text-xs font-extrabold text-blue-500 uppercase italic tracking-widest flex items-center gap-2">
            <BrainCircuit size={12} /> 82%
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-[0.4em] italic leading-none">STATUS</span>
          <span className={clsx(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-extrabold uppercase tracking-widest border italic",
            getStatusColor(application.status)
          )}>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
            {application.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto shrink-0 justify-center">
        <button
          onClick={() => router.push(`/pages/profile/${application.userId}`)}
          className="flex-1 lg:flex-none px-8 py-4 bg-white/5 border border-white/5 text-slate-400 rounded-xl font-extrabold text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all italic active:scale-95"
        >
          View Bio
        </button>

        <div className="relative group/menu flex-1 lg:flex-none">
          <button
            disabled={isUpdating}
            className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-[0.3em] hover:scale-[1.05] transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 active:scale-95 italic"
          >
            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <>COMMANDS <ChevronDown size={14} /></>}
          </button>

          <div className="absolute right-0 top-full mt-4 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50 overflow-hidden backdrop-blur-2xl">
            <StatusOption label="Set Interview Loop" status="Interview" onClick={() => onStatusChange('Interview')} icon={<Clock size={14} />} />
            <StatusOption label="Authorize Accept" status="Accepted" onClick={() => onStatusChange('Accepted')} icon={<CheckCircle2 size={14} />} color="text-emerald-400" />
            <StatusOption label="Terminate Link" status="Rejected" onClick={() => onStatusChange('Rejected')} icon={<XCircle size={14} />} color="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusOption({ label, status, onClick, icon, color = "text-slate-400" }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left px-5 py-4 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-4 hover:bg-white/5 transition-all italic",
        color
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatItem({ label, value, color }: any) {
  const colors: any = {
    blue: "text-blue-500",
    amber: "text-amber-500",
    indigo: "text-indigo-500",
  };
  return (
    <div className="text-center">
      <p className="text-[9px] font-extrabold text-slate-700 uppercase tracking-[0.4em] mb-3 italic leading-none">{label}</p>
      <p className={clsx("text-4xl font-extrabold italic tracking-tighter drop-shadow-2xl", colors[color])}>{value}</p>
    </div>
  );
}
