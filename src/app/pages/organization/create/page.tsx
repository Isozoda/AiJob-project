"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  ChevronRight,
  Sparkles,
  Zap,
  Fingerprint,
  ArrowRight
} from 'lucide-react';
import { createOrganization } from '@/src/app/services/organizationService';
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

export default function CreateOrganizationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'Startup',
      logoUrl: ''
    }
  });

  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-organizations'] });
      toast.success('Entity Identity Established Successfully!');
      router.push('/pages/organization');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.description?.[0] || 'onboarding Interrupted';
      toast.error(msg);
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const previewLogo = watch('logoUrl');

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30 pt-40 pb-56 relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-5 bg-slate-950/60 backdrop-blur-3xl border border-white/5 px-10 py-5 rounded-[2.8rem] text-xs font-black text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 mb-24 shadow-2xl"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform font-black" />
          REGISTRY ACCESS
        </button>

        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[5rem] p-16 md:p-32 shadow-2xl border border-white/5 relative overflow-hidden group/form">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -translate-x-10 translate-y-10 group-hover/form:bg-blue-600/10 transition-all duration-1000"></div>
            
            <div className="mb-24 relative z-10">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic">
                <Fingerprint size={14} /> Neural Entity Pipeline
              </div>
              <h1 className="text-7xl md:text-[10rem] font-black text-white mb-12 tracking-tighter italic uppercase leading-[0.8] text-balance">
                EXPAND <br/> <span className="text-blue-500">NETWORKS<span className="text-white">.</span></span>
              </h1>
              <p className="text-2xl text-slate-400 font-bold leading-relaxed max-w-2xl italic opacity-80 uppercase tracking-tight">
                Establish your studio's unique signature on the platform to begin sourcing high-performance units.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-20 relative z-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <InputGroup label="Studio Designation" icon={<Type size={16}/>}>
                   <input 
                    {...register('name')}
                    placeholder="e.g. CORE ARCHITECTS"
                    className={clsx(
                      "w-full px-10 py-7 bg-white/[0.03] border border-white/5 rounded-[2.5rem] outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all font-black text-white text-xl placeholder:text-slate-700 uppercase italic tracking-tight",
                      errors.name && "border-red-500/30 bg-red-500/5"
                    )}
                  />
                  {errors.name && <p className="text-[10px] font-black text-red-500 mt-4 uppercase tracking-[0.3em] italic">{errors.name.message}</p>}
                </InputGroup>

                <InputGroup label="Entity Category" icon={<Rocket size={16}/>}>
                   <div className="relative">
                     <select 
                      {...register('type')}
                      className="w-full px-10 py-7 bg-white/[0.03] border border-white/5 rounded-[2.5rem] outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all font-black text-white text-xl appearance-none cursor-pointer uppercase italic"
                    >
                      <option value="Startup" className="bg-slate-900">Startup</option>
                      <option value="Enterprise" className="bg-slate-900">Enterprise</option>
                      <option value="Agency" className="bg-slate-900">Agency</option>
                      <option value="NonProfit" className="bg-slate-900">Non-Profit</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ChevronRight size={24} className="rotate-90" />
                    </div>
                   </div>
                </InputGroup>
              </div>

              <InputGroup label="Neural Coordinates (Location)" icon={<MapPin size={16}/>}>
                <input 
                  {...register('location')}
                  placeholder="e.g. ZURICH // DISTRIBUTED"
                  className={clsx(
                    "w-full px-10 py-7 bg-white/[0.03] border border-white/5 rounded-[2.5rem] outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all font-black text-white text-xl placeholder:text-slate-700 uppercase italic tracking-tight",
                    errors.location && "border-red-500/30 bg-red-500/5"
                  )}
                />
              </InputGroup>

              <InputGroup label="Avatar Signature Protocol (URL)" icon={<Globe size={16}/>}>
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 w-full">
                    <input 
                      {...register('logoUrl')}
                      placeholder="HTTPS://ASSETS.STUDIO/BRAND.PNG"
                      className={clsx(
                        "w-full px-10 py-7 bg-white/[0.03] border border-white/5 rounded-[2.5rem] outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all font-black text-white text-xl placeholder:text-slate-700 uppercase italic tracking-tight",
                        errors.logoUrl && "border-red-500/30 bg-red-500/5"
                      )}
                    />
                  </div>
                  <div className="w-32 h-32 bg-slate-950/60 rounded-[3rem] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden group/avatar shadow-2xl backdrop-blur-3xl">
                     {previewLogo ? (
                       <img src={previewLogo} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <Camera size={36} className="text-slate-800 group-hover/avatar:text-blue-500 transition-colors" />
                     )}
                  </div>
                </div>
              </InputGroup>

              <InputGroup label="The Universal Manifesto" icon={<FileText size={16}/>}>
                <textarea 
                  {...register('description')}
                  placeholder="Articulate your studio philosophy, core directives, and mission objective..."
                  className={clsx(
                    "w-full h-64 px-10 py-8 bg-white/[0.03] border border-white/5 rounded-[3.5rem] outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all font-black text-white text-xl placeholder:text-slate-700 resize-none italic uppercase leading-relaxed",
                    errors.description && "border-red-500/30 bg-red-500/5"
                  )}
                />
              </InputGroup>

              <div className="pt-24 border-t border-white/5">
                <button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="group w-full py-10 bg-blue-600 text-white rounded-[3.5rem] font-black text-3xl hover:bg-white hover:text-blue-600 shadow-2xl shadow-blue-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-6 disabled:opacity-50 uppercase italic tracking-widest"
                >
                  {mutation.isPending ? <Loader2 className="animate-spin text-white" /> : <>ACTIVATE REGISTRY <ArrowRight size={32} strokeWidth={4} className="group-hover:translate-x-2 transition-transform duration-500" /></>}
                </button>
                <p className="text-[10px] text-center mt-12 text-slate-600 font-black uppercase tracking-[0.6em] italic opacity-60">BROADCASTING FROM UNIFIED NETWORK TERMINAL // ACCESS GRANTED</p>
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
    <div className="space-y-6">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4 italic ml-4">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-xl">
           {icon}
        </div>
        {label}
      </label>
      {children}
    </div>
  );
}
