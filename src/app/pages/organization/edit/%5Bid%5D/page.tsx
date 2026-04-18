"use client"
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Globe, 
  Type, 
  FileText, 
  Rocket, 
  Loader2,
  Camera,
  Save,
  Trash2,
  Sparkles,
  Layout
} from 'lucide-react';
import { getOrganizationById, updateOrganization, deleteOrganization } from '@/src/app/services/organizationService';
import { clsx } from 'clsx';
import toast, { Toaster } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.string().min(1, 'Please select a company type'),
  location: z.string().min(2, 'Location is required'),
  logoUrl: z.string().url('Please enter a valid URL for the logo').or(z.string().length(0)),
});

type FormData = z.infer<typeof schema>;

export default function EditOrganizationPage() {
  const { id } = useParams();
  const orgId = parseInt(id as string);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: org, isLoading } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => getOrganizationById(orgId),
    enabled: !!orgId
  });

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (org) {
      reset({
        name: org.name,
        description: org.description,
        type: org.type,
        location: org.location,
        logoUrl: org.logoUrl || '',
      });
    }
  }, [org, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateOrganization(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', orgId] });
      toast.success('Studio Profile Updated');
      router.push(`/pages/organization/${orgId}`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.description?.[0] || 'Sync Failed';
      toast.error(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-organizations'] });
      toast.success('Studio Archive Deleted');
      router.push('/pages/organization');
    },
    onError: () => {
      toast.error('Deletion Protocl Failed');
    }
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('Permanently purge this studio from the registry? This action is absolute.')) {
      deleteMutation.mutate();
    }
  };

  const previewLogo = watch('logoUrl');

  if (isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
         <div className="flex flex-col items-center gap-6">
           <Loader2 className="animate-spin text-blue-600" size={48} />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Configuration...</p>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 pt-32 pb-40 relative font-sans">
      <Toaster position="top-right" />
      <div className="container mx-auto px-6 relative z-10">
        
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-4 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 px-8 py-4 rounded-[2.5rem] text-sm font-black text-slate-900 hover:bg-slate-50 transition-all active:scale-95 mb-16"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform font-black" />
          NEXUS
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl shadow-slate-200/50 border border-slate-100">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20 border-b border-slate-100 pb-16">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest mb-4">
                  <Sparkles size={12} /> Configuration Hub
                </div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.85] text-balance">Reconfigure <br/> <span className="text-blue-600 tracking-normal">Studio.</span></h1>
              </div>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-500 border border-red-100 rounded-[2rem] font-black hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase tracking-widest italic shadow-sm"
              >
                <Trash2 size={18} /> Purge Records
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InputGroup label="Studio Designation" icon={<Type size={14}/>}>
                  <input 
                    {...register('name')}
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 font-sans"
                  />
                  {errors.name && <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-widest">{errors.name.message}</p>}
                </InputGroup>

                <InputGroup label="Entity Slot" icon={<Rocket size={14}/>}>
                  <select 
                    {...register('type')}
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="Startup">Startup</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Agency">Agency</option>
                    <option value="NonProfit">Non-Profit</option>
                    <option value="Other">Other</option>
                  </select>
                </InputGroup>
              </div>

              <InputGroup label="Coordinates" icon={<MapPin size={14}/>}>
                <input 
                  {...register('location')}
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 italic font-sans"
                />
              </InputGroup>

              <InputGroup label="Avatar Proxy (URL)" icon={<Globe size={14}/>}>
                <div className="flex flex-col md:flex-row gap-8">
                  <input 
                    {...register('logoUrl')}
                    className="flex-1 px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 font-sans"
                  />
                  <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                     {previewLogo ? <img src={previewLogo} className="w-full h-full object-cover" /> : <Camera size={28} className="text-slate-100" />}
                  </div>
                </div>
              </InputGroup>

              <InputGroup label="Manifesto Update" icon={<FileText size={14}/>}>
                <textarea 
                  {...register('description')}
                  className="w-full h-48 px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 resize-none italic font-sans"
                />
              </InputGroup>

              <div className="pt-16">
                <button 
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl hover:bg-slate-800 hover:shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl"
                >
                  {updateMutation.isPending ? <Loader2 size={24} className="animate-spin text-white" /> : <>Upload New Configuration <Save size={24} strokeWidth={3} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
        <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
           {icon}
        </div>
        {label}
      </label>
      {children}
    </div>
  );
}
