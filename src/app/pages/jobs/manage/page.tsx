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
  AlertCircle
} from 'lucide-react';
import { getMyJobs, deleteJob } from '@/src/app/services/jobService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold">Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <Toaster position="top-right" />
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Manage Vacancies</h1>
            <p className="text-slate-500 font-medium">Create, edit, and track your active job listings.</p>
          </div>
          <button 
            onClick={() => router.push('/pages/jobs/create')}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} /> Post New Job
          </button>
        </div>

        {/* Jobs Table/Grid */}
        {isError ? (
          <div className="bg-white rounded-[2.5rem] p-20 border border-slate-100 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Failed to load jobs</h3>
            <p className="text-slate-500">Please make sure you are logged in as an organization.</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 border border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-slate-300" size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No active jobs found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't posted any jobs yet. Start hiring by creating your first vacancy.</p>
            <button 
              onClick={() => router.push('/pages/jobs/create')}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Post First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-blue-100 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium">
                      <span>{job.jobType}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{job.location}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link 
                    href={`/pages/jobs/${job.id}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all"
                  >
                    <Eye size={16} /> View
                  </Link>
                  <Link 
                    href={`/pages/jobs/manage/${job.id}/applications`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-all font-sans"
                  >
                    <BarChart3 size={16} /> Applications
                  </Link>
                  <Link 
                    href={`/pages/jobs/edit/${job.id}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all"
                  >
                    <Edit3 size={16} /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard icon={<BarChart3 className="text-blue-500"/>} label="Total Views" value="1,284" />
          <StatCard icon={<Briefcase className="text-emerald-500"/>} label="Total Applications" value="42" />
          <StatCard icon={<Settings className="text-purple-500"/>} label="Active Vacancies" value={jobs?.length.toString() || '0'} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}
