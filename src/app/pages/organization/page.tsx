"use client"
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  Search, 
  MapPin, 
  Plus, 
  Globe, 
  Users, 
  ChevronRight, 
  Loader2,
  AlertCircle,
  Building,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { getOrganizationsPaged, getMyOrganizations } from '@/src/app/services/organizationService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Toaster } from 'react-hot-toast';

export default function CompaniesPage() {
  const router = useRouter();
  const [params, setParams] = useState({ PageNumber: 1, PageSize: 8, Name: '' });
  const [searchInput, setSearchInput] = useState('');

  const { data: pagedData, isLoading: isPagedLoading, isError } = useQuery({
    queryKey: ['organizations', params],
    queryFn: () => getOrganizationsPaged(params),
  });

  const { data: myOrgs, isLoading: isMyOrgsLoading } = useQuery({
    queryKey: ['my-organizations'],
    queryFn: getMyOrganizations,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(prev => ({ ...prev, Name: searchInput, PageNumber: 1 }));
  };

  // Implement search-as-you-type with a 500ms debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setParams(prev => ({ ...prev, Name: searchInput, PageNumber: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const getPageNumbers = () => {
    if (!pagedData) return [];
    const total = pagedData.totalPages;
    const current = pagedData.page;
    const pages = [];
    
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans">
      <Toaster position="top-right" />
      
      {/* ── AMBIENT DECOR ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={12} /> The New Era of Talent
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900 animate-in fade-in slide-in-from-bottom-6 duration-700">
              Discover <span className="text-blue-600 italic">Elite</span> <br className="hidden md:block"/> Studios.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Connect with extraordinary organizations pushing the boundaries of innovation. Your next chapter begins at a high-performance workspace.
            </p>

            <form 
              onSubmit={handleSearch}
              className="w-full max-w-3xl relative p-2 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] group"
            >
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex-1 flex items-center px-6 gap-3 w-full">
                  <Search className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                  <input 
                    type="text" 
                    placeholder="Search by studio name or industry..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-full py-5 bg-transparent outline-none text-slate-900 font-bold text-lg placeholder:text-slate-300"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                >
                  Explore <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-6 pb-40 relative z-10">
        <div className="lg:col-span-12">
          
          {/* My Studios - Clean horizontal pill */}
          {myOrgs && myOrgs.length > 0 && (
            <div className="mb-20">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                 <Globe size={14} className="text-blue-600" /> Your Managed Studios
               </h3>
               <div className="flex flex-wrap gap-4">
                  {myOrgs.map(org => (
                     <Link key={org.id} href={`/pages/organization/${org.id}`} className="group flex items-center gap-4 bg-white border border-slate-100 pl-4 pr-6 py-3 rounded-2xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all active:scale-95">
                        <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 flex items-center justify-center">
                           {org.logoUrl ? <img src={org.logoUrl} className="w-full h-full object-cover" /> : <Building2 size={14} className="text-slate-300" />}
                        </div>
                        <span className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors">{org.name}</span>
                        <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 group-hover:text-blue-500 transition-all font-black" />
                     </Link>
                  ))}
               </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
             <div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4 uppercase italic">
                 Active Entities.
               </h2>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">Showing {pagedData?.totalCount || 0} organizations in registry</p>
             </div>
             
             <div className="flex items-center gap-2 bg-blue-600 text-white rounded-2xl px-5 py-2.5 shadow-lg shadow-blue-600/10">
               <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-widest">LIVE DIRECTORY</span>
             </div>
          </div>

          {isPagedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse"></div>)}
            </div>
          ) : isError ? (
            <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
              <AlertCircle className="text-red-500 mx-auto mb-4" size={56} />
              <h3 className="text-2xl font-black text-slate-900">Registry Disruption</h3>
              <p className="text-slate-500 mt-2 font-medium">Internal data sync failed. Protocol restart recommended.</p>
            </div>
          ) : pagedData?.items.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-100">
              <Building className="text-slate-200 mx-auto mb-8" size={80} />
              <h3 className="text-3xl font-black text-slate-900">No Entities Found</h3>
              <p className="text-slate-500 mt-4 text-lg font-medium">The deep registry returned no matches for this signal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {pagedData?.items.map((org) => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagedData && pagedData.totalPages > 1 && (
            <div className="mt-28 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <button 
                  disabled={!pagedData.hasPrevious}
                  onClick={() => setParams(p => ({ ...p, PageNumber: p.PageNumber - 1 }))}
                  className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-300 shadow-sm disabled:shadow-none active:scale-90"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                  {getPageNumbers().map((num, idx) => (
                    <React.Fragment key={idx}>
                      {num === '...' ? (
                        <span className="w-10 h-10 flex items-center justify-center text-slate-300 text-xs font-black">•••</span>
                      ) : (
                        <button
                          onClick={() => setParams(p => ({ ...p, PageNumber: num as number }))}
                          className={clsx(
                            "w-12 h-12 rounded-full flex items-center justify-center text-xs font-black transition-all",
                            pagedData.page === num 
                              ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-110" 
                              : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          {num}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button 
                  disabled={!pagedData.hasNext}
                  onClick={() => setParams(p => ({ ...p, PageNumber: p.PageNumber + 1 }))}
                  className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all disabled:opacity-30 shadow-sm active:scale-90"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">REGISTRY INDEX {pagedData.page} / {pagedData.totalPages}</p>
            </div>
          )}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-48 px-4">
           <div className="relative bg-slate-900 rounded-[4rem] p-12 md:p-24 flex flex-col items-center text-center shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] overflow-hidden">
              <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-500/10 blur-[100px] rounded-full translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10 shadow-2xl mx-auto">
                   <Zap className="text-white fill-white" size={40} />
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-10 italic uppercase">Shape the <br/> Future.</h2>
                <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mb-14 leading-relaxed">
                  Establish your studio presence and attract world-class talent using our proprietary AI recruitment core.
                </p>
                <button 
                  onClick={() => router.push('/pages/organization/create')}
                  className="px-16 py-7 bg-white text-slate-900 rounded-[2.5rem] font-black text-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-4 group/btn"
                >
                  Register Studio <Plus size={28} strokeWidth={4} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                </button>
              </div>
           </div>
        </div>
      </main>

      <footer className="py-24 border-t border-slate-100 flex justify-center opacity-10 select-none bg-white">
         <h1 className="text-[14vw] font-black tracking-tighter leading-none uppercase text-slate-900">STUDIOS</h1>
      </footer>
    </div>
  );
}

function OrganizationCard({ org }: { org: any }) {
  return (
    <div className="group relative bg-white rounded-[3.5rem] p-10 border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col h-full">
      <div className="flex items-start justify-between gap-6 mb-10 relative z-10">
        <div className="w-20 h-20 bg-slate-50 rounded-[1.8rem] flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all duration-500 shadow-sm group-hover:scale-110 overflow-hidden">
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={36} className="text-slate-200" />
          )}
        </div>
        <div className="px-5 py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-[0.2em] group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
          {org.type}
        </div>
      </div>
      
      <div className="flex-1">
        <Link href={`/pages/organization/${org.id}`}>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter hover:text-blue-600 transition-colors cursor-pointer leading-[0.9] text-balance">
            {org.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black mb-6 uppercase tracking-widest">
          <MapPin size={14} className="text-blue-600" strokeWidth={3} />
          {org.location || 'Distributed'}
        </div>
        <p className="text-slate-500 font-medium leading-[1.6] mb-10 line-clamp-3 text-lg italic opacity-80 group-hover:opacity-100 transition-opacity">
          “{org.description || 'Shaping the landscape of tomorrow through architectural excellence and human-centric design philosophies.'}”
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-10 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-3">
           <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-2xl border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-slate-200"></div>
                </div>
              ))}
           </div>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trusted Entity</span>
        </div>
        <Link 
          href={`/pages/organization/${org.id}`}
          className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform group-hover:scale-110 active:scale-95 border border-slate-100 hover:border-blue-600"
        >
          <ArrowRight size={24} />
        </Link>
      </div>
    </div>
  );
}
