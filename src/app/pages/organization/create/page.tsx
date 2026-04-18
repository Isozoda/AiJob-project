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
  Fingerprint
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-organizations'] });
      toast.success('Entity Identity Established');
      router.push(`/pages/organization/${data.id}`);
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 pt-32 pb-40 relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-4 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 px-8 py-4 rounded-[2.5rem] text-sm font-black text-slate-900 hover:bg-slate-50 transition-all active:scale-95 mb-20"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform font-black" />
          NEXUS DIRECTORY
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100 relative">
            
            <div className="mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Fingerprint size={12} /> Entity Onboarding
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter italic uppercase leading-[0.85] text-balance">
                Establish <br/> <span className="text-blue-600 tracking-normal">Identity.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl italic opacity-80">
                Define the parameters and vision of your studio to begin your high-performance recruitment cycles on the network.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InputGroup label="Studio Designation" icon={<Type size={14}/>}>
                   <input 
                    {...register('name')}
                    placeholder="e.g. Aether Labs"
                    className={clsx(
                      "w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 placeholder:text-slate-300",
                      errors.name && "border-red-500/30 bg-red-50"
                    )}
                  />
                  {errors.name && <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-[0.2em]">{errors.name.message}</p>}
                </InputGroup>

                <InputGroup label="Category Slot" icon={<Rocket size={14}/>}>
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

              <InputGroup label="Coordinates (Location)" icon={<MapPin size={14}/>}>
                <input 
                  {...register('location')}
                  placeholder="e.g. Zurich, CH or Distributed"
                  className={clsx(
                    "w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 placeholder:text-slate-300",
                    errors.location && "border-red-500/30 bg-red-50"
                  )}
                />
              </InputGroup>

              <InputGroup label="Avatar Signature (URL)" icon={<Globe size={14}/>}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 w-full">
                    <input 
                      {...register('logoUrl')}
                      placeholder="https://assets.nexus/brand.png"
                      className={clsx(
                        "w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 placeholder:text-slate-300",
                        errors.logoUrl && "border-red-500/30 bg-red-50"
                      )}
                    />
                  </div>
                  <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex items-center justify-center shrink-0 overflow-hidden group/avatar shadow-sm">
                     {previewLogo ? (
                       <img src={previewLogo} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <Camera size={28} className="text-slate-200 group-hover/avatar:text-blue-500 transition-colors" />
                     )}
                  </div>
                </div>
              </InputGroup>

              <InputGroup label="The Manifesto" icon={<FileText size={14}/>}>
                <textarea 
                  {...register('description')}
                  placeholder="Articulate your studio philosophy, core directives, and mission..."
                  className={clsx(
                    "w-full h-48 px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-900 placeholder:text-slate-300 resize-none italic",
                    errors.description && "border-red-500/30 bg-red-50"
                  )}
                />
              </InputGroup>

              <div className="pt-16">
                <button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="group w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl hover:bg-slate-800 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {mutation.isPending ? <Loader2 className="animate-spin text-white" /> : <>Initiate Registration <ChevronRight size={24} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
                <p className="text-[9px] text-center mt-10 text-slate-300 font-black uppercase tracking-[0.5em]">CERTIFIED REGISTRATION ACCESS ONLY.</p>
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
        <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
           {icon}
        </div>
        {label}
      </label>
      {children}
    </div>
  );
}
