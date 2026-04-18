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
  AlertCircle
} from 'lucide-react';
import { getApplicationsByJob, updateApplicationStatus } from '@/src/app/services/jobApplicationService';
import { getJobById } from '@/src/app/services/jobService';
// Assuming profileService exists based on earlier file list
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <Toaster position="top-right" />
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Management
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Applicants</h1>
              <p className="text-lg text-slate-500 font-medium">
                For position: <span className="text-blue-600 font-bold">{job?.title}</span>
              </p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-8">
              <StatItem label="TOTAL" value={applications?.length || 0} color="blue" />
              <div className="w-px h-10 bg-slate-100"></div>
              <StatItem label="PENDING" value={applications?.filter(a => a.status === 'Pending').length || 0} color="amber" />
              <div className="w-px h-10 bg-slate-100"></div>
              <StatItem label="INTERVIEW" value={applications?.filter(a => a.status === 'Interview').length || 0} color="indigo" />
            </div>
          </div>
        </div>

        {/* List of Applications */}
        {isError ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900">Failed to load applicants</h3>
            <p className="text-slate-500 mt-2">Make sure you have permission to view applicants for this job.</p>
          </div>
        ) : applications?.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="text-slate-300" size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No applicants yet</h3>
            <p className="text-slate-500 mt-2">New applications will appear here once candidates apply.</p>
          </div>
        ) : (
          <div className="space-y-4">
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
  // Fetch profile for the applicant
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', application.userId],
    queryFn: () => getProfileByUserId(application.userId),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      case 'Interview': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-blue-100 transition-all">
      <div className="flex items-center gap-6 w-full lg:w-auto">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden">
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-900">{profile?.firstName ? `${profile.firstName} ${profile.lastName}` : `User #${application.userId}`}</h3>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
            <Mail size={14} className="text-slate-400" />
            {profile?.location || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full lg:w-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applied Date</span>
          <span className="text-sm font-bold text-slate-700">{new Date(application.appliedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Match Score</span>
          <span className="text-sm font-black text-blue-600">82%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
          <span className={clsx(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border w-fit",
            getStatusColor(application.status)
          )}>
            {application.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
        <button 
          onClick={() => window.location.href = `/pages/profile/${application.userId}`}
          className="flex-1 lg:flex-none px-6 py-2.5 bg-slate-50 text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all text-xs"
        >
          View Profile
        </button>
        
        <div className="relative group/menu flex-1 lg:flex-none">
          <button 
            disabled={isUpdating}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-xs disabled:opacity-50"
          >
            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <>Actions <ChevronDown size={14} /></>}
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-20 overflow-hidden">
            <StatusOption label="Move to Interview" status="Interview" onClick={() => onStatusChange('Interview')} icon={<Clock size={14}/>} />
            <StatusOption label="Accept Candidate" status="Accepted" onClick={() => onStatusChange('Accepted')} icon={<CheckCircle2 size={14}/>} color="text-emerald-600" />
            <StatusOption label="Reject Candidate" status="Rejected" onClick={() => onStatusChange('Rejected')} icon={<XCircle size={14}/>} color="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusOption({ label, status, onClick, icon, color = "text-slate-700" }: any) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "w-full text-left px-4 py-3 text-xs font-bold flex items-center gap-3 hover:bg-slate-50 transition-colors",
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
    blue: "text-blue-600",
    amber: "text-amber-500",
    indigo: "text-indigo-600",
  };
  return (
    <div className="text-center px-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={clsx("text-2xl font-black", colors[color])}>{value}</p>
    </div>
  );
}
