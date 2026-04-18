"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Calendar, 
  Building2, 
  Share2, 
  Bookmark, 
  Send,
  ShieldCheck,
  BrainCircuit,
  Target,
  Rocket,
  Loader2
} from 'lucide-react';
import { getJobById } from '@/src/app/services/jobService';
import { createApplication } from '@/src/app/services/jobApplicationService';
import { getSkillGap } from '@/src/app/services/aiService';
import { getToken } from '@/src/store/authStore';
import { clsx } from 'clsx';
import toast, { Toaster } from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const jobId = parseInt(id as string);

  const currentUserId = (() => {
    const token = getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.UserId || payload.sub || '0');
    } catch { return 0; }
  })();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId
  });

  const { data: skillGap, isLoading: isGapLoading } = useQuery({
    queryKey: ['skill-gap', currentUserId, jobId],
    queryFn: () => getSkillGap(currentUserId, jobId),
    enabled: !!currentUserId && !!jobId
  });

  const applyMutation = useMutation({
    mutationFn: () => createApplication({ jobId, userId: currentUserId }),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.description?.[0] || 'Failed to submit application';
      toast.error(msg);
    }
  });

  const handleApply = () => {
    if (!currentUserId) {
      toast.error('Please login to apply for this job');
      router.push('/pages/login');
      return;
    }
    applyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">Loading job details...</p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <Briefcase className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Job Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">The job you are looking for might have been removed or the link is incorrect.</p>
        <button 
          onClick={() => router.push('/pages/jobs')}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          <ArrowLeft size={18} /> Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Toaster position="top-right" />
      
      {/* ── TOP NAV HEADER ── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Share2 size={20}/></button>
            <button className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"><Bookmark size={20}/></button>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <header className="bg-white border-b border-slate-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                <Building2 className="text-slate-400" size={36} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">Verified Vacancy</span>
                  <ShieldCheck size={16} className="text-blue-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-600 font-medium">
                  <span className="flex items-center gap-2"><MapPin size={18} className="text-slate-400" /> {job.location || 'Location not specified'}</span>
                  <span className="flex items-center gap-2 font-bold text-emerald-600">
                    <DollarSign size={18}/> 
                    {job.salaryMin?.toLocaleString() || '0'} - {job.salaryMax?.toLocaleString() || '0'} / year
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" /> 
                    Posted on {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={handleApply}
                disabled={applyMutation.isPending}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/25 active:scale-95 flex items-center justify-center gap-2"
              >
                {applyMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <>Apply Now <Send size={20} /></>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Description */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm leading-relaxed">
              <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4">Job Description</h2>
              <div className="text-slate-700 space-y-6">
                <p className="whitespace-pre-wrap">{job.description}</p>
                
                <h3 className="text-xl font-bold text-slate-900 pt-4">Technical Requirements</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RequirementItem icon={<Rocket size={16}/>} text={`${job.experienceRequired}+ years of relevant experience`} />
                  <RequirementItem icon={<Target size={16}/>} text={`Level: ${job.experienceLevel}`} />
                  <RequirementItem icon={<Briefcase size={16}/>} text={`Employment: ${job.jobType}`} />
                  <RequirementItem icon={<ShieldCheck size={16}/>} text={`Category ID: ${job.categoryId}`} />
                </ul>
              </div>
            </section>

            {/* About Organization */}
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Building2 className="text-slate-400" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Organization #{job.organizationId}</h3>
                  <p className="text-slate-500 font-medium">Verified AiJob Partner</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                This organization is a verified member of our platform. They have a track record of hiring talented individuals and providing a great work environment.
              </p>
              <button className="text-blue-600 font-bold hover:underline">View Company Profile</button>
            </section>
          </div>

          {/* Right Column: AI Insights & Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* AI Insights Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/30 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <BrainCircuit size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight">AI Matching Insights</h3>
                </div>

                {isGapLoading ? (
                  <div className="flex items-center gap-3 text-slate-400 animate-pulse">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm font-bold">Calculating match score...</span>
                  </div>
                ) : skillGap ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Match Score</span>
                      <span className="text-4xl font-black text-blue-400">{skillGap.matchScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500" style={{ width: `${skillGap.matchScore}%` }}></div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Key Matches</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.strengths?.slice(0, 5).map((s: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/80">{s}</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-blue-500/40 pl-4">
                      "{skillGap.fitSummary}"
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-sm text-slate-400 mb-4">Complete your profile to see AI matching insights for this job.</p>
                    <button 
                      onClick={() => router.push(`/pages/profile/${currentUserId}`)}
                      className="w-full py-2 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-blue-50 transition-all"
                    >
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Summary Sidebar */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Job Overview</h3>
              
              <div className="space-y-6">
                <OverviewItem icon={<Briefcase className="text-blue-500" size={20}/>} label="Job Type" value={job.jobType} />
                <OverviewItem icon={<Clock className="text-orange-500" size={20}/>} label="Experience" value={job.experienceLevel} />
                <OverviewItem icon={<Target className="text-purple-500" size={20}/>} label="Category ID" value={job.categoryId?.toString() || 'N/A'} />
                <OverviewItem icon={<MapPin className="text-red-500" size={20}/>} label="Location" value={job.location} />
                <OverviewItem icon={<Calendar className="text-emerald-500" size={20}/>} label="Work Days" value="Mon - Fri" />
              </div>

              <div className="pt-8 border-t border-slate-50">
                <button className="w-full py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">Save this Job</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function RequirementItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600">
        {icon}
      </div>
      {text}
    </li>
  );
}

function OverviewItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
