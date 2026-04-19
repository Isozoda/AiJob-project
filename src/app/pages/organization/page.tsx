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
    <div className="min-h-screen bg-slate-900 selection:bg-blue-500/30 selection:text-blue-200 font-sans relative overflow-hidden">
      <Toaster position="top-right" />

      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      </div>


      {/* ── HERO SECTION ── */}
      <section className="relative pt-40 pb-24 z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.4em] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles size={14} className="animate-pulse" /> THE NEURAL ERA OF NETWORKED STUDIOS
            </div>
            <h1 className="text-7xl md:text-9xl font-black mb-12 tracking-tighter leading-[0.85] text-white italic uppercase animate-in fade-in slide-in-from-bottom-6 duration-1000">
              ARCHITECT <span className="text-blue-500">ELITE</span> <br className="hidden md:block" /> NETWORKS<span className="text-blue-500">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-bold leading-relaxed max-w-3xl mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 opacity-80 italic">
              Connect with extraordinary high-performance entities. Synchronize your career objective with the world's most innovative studios.
            </p>

            <form
              onSubmit={handleSearch}
              className="w-full max-w-4xl relative p-3 bg-slate-900/60 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl border border-white/10 transition-all duration-500 hover:border-blue-500/30 group"
            >
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="flex-1 flex items-center px-8 gap-4 w-full">
                  <Search className="text-blue-500 group-focus-within:scale-125 transition-transform" size={28} />
                  <input
                    type="text"
                    placeholder="Search studio name or Industry signal..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-full py-6 bg-transparent outline-none text-white font-black text-xl italic placeholder:text-slate-600 uppercase tracking-tight"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-16 py-6 bg-blue-600 text-white rounded-[2.8rem] font-black text-xl hover:bg-white hover:text-blue-600 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-blue-600/30 uppercase italic tracking-[0.1em]"
                >
                  Sync <ArrowRight size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-6 pb-40 relative z-10">
        <div className="lg:col-span-12">

          {/* My Studios - Premium Dark Pills */}
          {myOrgs && myOrgs.length > 0 && (
            <div className="mb-24">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-4 italic opacity-80">
                <Globe size={16} className="text-blue-500" /> Managed Node Registry
              </h3>
              <div className="flex flex-wrap gap-6">
                {myOrgs.map(org => (
                  <Link key={org.id} href={`/pages/organization/${org.id}`} className="group flex items-center gap-5 bg-white/5 border border-white/5 pl-5 pr-8 py-4 rounded-[2rem] hover:bg-blue-600/10 hover:border-blue-500/30 transition-all active:scale-95 shadow-2xl backdrop-blur-md">
                    <div className="w-12 h-12 rounded-[1.2rem] overflow-hidden bg-slate-800 border border-white/10 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {org.logoUrl ? <img src={org.logoUrl} className="w-full h-full object-cover" /> : <Building2 size={18} className="text-slate-600" />}
                    </div>
                    <span className="text-sm font-black text-white italic uppercase tracking-tight group-hover:text-blue-400">{org.name}</span>
                    <ArrowRight size={16} className="text-slate-600 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-6 uppercase italic">
                Active Entities<span className="text-blue-500">.</span>
              </h2>
              <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.5em] mt-4 italic opacity-60">Synchronized Directory // {pagedData?.totalCount || 0} nodes verified</p>
            </div>

            <div className="flex items-center gap-4 bg-blue-600 text-white rounded-2xl px-6 py-3 shadow-[0_10px_40px_rgba(37,99,235,0.4)] border border-blue-400/30">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_#fff]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Stream Live</span>
            </div>
          </div>

          {isPagedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-white/5 border border-white/5 rounded-[4rem] animate-pulse"></div>)}
            </div>
          ) : isError ? (
            <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] p-24 text-center border border-white/5 shadow-2xl">
              <AlertCircle className="text-red-500 mx-auto mb-8 animate-bounce" size={64} />
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Registry Sync Failed</h3>
              <p className="text-slate-500 mt-4 text-xl font-bold italic opacity-80">Encryption mismatch detected. Re-initializing terminal protocol.</p>
            </div>
          ) : pagedData?.items.length === 0 ? (
            <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] p-32 text-center border-2 border-dashed border-white/5">
              <Building className="text-slate-800 mx-auto mb-10" size={100} />
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Void Detected</h3>
              <p className="text-slate-500 mt-6 text-xl font-bold italic opacity-80">The networked stream has no entities matching this signal.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {pagedData?.items.map((org) => (
                  <OrganizationCard key={org.id} org={org} />
                ))}
              </div>

              {/* Advanced Pagination UI */}
              {pagedData && pagedData.totalPages > 1 && (
                <div className="mt-32 flex flex-col items-center gap-8">
                  <div className="flex items-center gap-6">
                    <button
                      disabled={!pagedData.hasPrevious}
                      onClick={() => setParams(p => ({ ...p, PageNumber: p.PageNumber - 1 }))}
                      className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.8rem] flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-10 active:scale-90 shadow-2xl backdrop-blur-xl"
                    >
                      <ChevronLeft size={28} />
                    </button>

                    <div className="flex items-center gap-3 px-3 py-3 bg-slate-950/60 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
                      {getPageNumbers().map((num, idx) => (
                        <React.Fragment key={idx}>
                          {num === '...' ? (
                            <span className="w-12 h-12 flex items-center justify-center text-slate-600 text-[10px] font-black tracking-widest leading-none mt-2">•••</span>
                          ) : (
                            <button
                              onClick={() => setParams(p => ({ ...p, PageNumber: num as number }))}
                              className={clsx(
                                "w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-xs font-black transition-all duration-300",
                                pagedData.page === num
                                  ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] scale-110"
                                  : "text-slate-500 hover:text-white hover:bg-white/10"
                              )}
                            >
                              {typeof num === 'number' && num < 10 ? `0${num}` : num}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      disabled={!pagedData.hasNext}
                      onClick={() => setParams(p => ({ ...p, PageNumber: p.PageNumber + 1 }))}
                      className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.8rem] flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-10 active:scale-90 shadow-2xl backdrop-blur-xl"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic opacity-60">REGISTRY INDEX {pagedData.page} / {pagedData.totalPages}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* BOTTOM CTA HUD */}
        <div className="mt-56 px-4">
          <div className="relative bg-slate-900/40 backdrop-blur-3xl rounded-[5rem] p-16 md:p-32 flex flex-col items-center text-center shadow-2xl overflow-hidden border border-white/10 group hover:border-blue-500/20 transition-all duration-700">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 blur-[150px] rounded-full translate-x-1/4 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-full bg-indigo-600/10 blur-[120px] rounded-full -translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="w-28 h-28 bg-blue-600/10 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center mb-12 border border-blue-500/20 shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-500">
                <Zap className="text-blue-400 fill-blue-400" size={48} />
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] mb-12 italic uppercase">ARCHITECT THE <br /> FUTURE<span className="text-blue-500">.</span></h2>
              <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-2xl mb-20 leading-relaxed italic opacity-80">
                Establish your enterprise node in the unified network and source world-class talent via our neural recruitment core.
              </p>
              <button
                onClick={() => router.push('/pages/organization/create')}
                className="px-20 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl hover:bg-white hover:text-blue-600 shadow-2xl shadow-blue-600/30 hover:shadow-white/20 transition-all active:scale-95 flex items-center justify-center gap-6 group/btn uppercase italic tracking-[0.05em]"
              >
                Register Node <Plus size={32} strokeWidth={4} className="group-hover/btn:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-32 border-t border-white/5 flex justify-center opacity-5 select-none bg-transparent">
        <h1 className="text-[14vw] font-black tracking-tighter leading-none uppercase text-white italic">STUDIOS</h1>
      </footer>
    </div>
  );
}

function OrganizationCard({ org }: { org: any }) {
  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] p-10 border border-white/5 hover:border-blue-500/30 shadow-2xl hover:shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] transition-all duration-700 flex flex-col h-full overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -translate-x-4 translate-y-4 group-hover:bg-blue-500/10 transition-all duration-700"></div>

      <div className="flex items-start justify-between gap-6 mb-12 relative z-10">
        <div className="w-24 h-24 bg-slate-800 rounded-[2rem] flex items-center justify-center border border-white/5 group-hover:border-blue-500/40 transition-all duration-500 shadow-2xl group-hover:scale-110 overflow-hidden backdrop-blur-md">
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={40} className="text-slate-600" />
          )}
        </div>
        <div className="px-6 py-2.5 bg-white/5 text-slate-500 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
          {org.type || 'Enterprise'}
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <Link href={`/pages/organization/${org.id}`}>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter hover:text-blue-500 transition-colors cursor-pointer leading-[0.85] text-balance italic uppercase line-clamp-2">
            {org.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-slate-500 text-[11px] font-black mb-10 uppercase tracking-[0.2em] italic">
          <MapPin size={16} className="text-blue-500" strokeWidth={3} />
          {org.location || 'Distributed Node'}
        </div>
        <div className="relative">
          <p className="text-slate-400 font-bold leading-[1.6] mb-12 line-clamp-3 text-lg italic opacity-80 group-hover:opacity-100 transition-opacity">
            “{org.description || 'Architecting the networked landscape of tomorrow through cognitive excellence and high-performance design.'}”
          </p>
          <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-blue-500/50 to-transparent rounded-full opacity-50"></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-10 border-t border-white/5 mt-auto relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-11 h-11 rounded-[1.2rem] border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900"></div>
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">Verified Registry</span>
        </div>
        <Link
          href={`/pages/organization/${org.id}`}
          className="w-16 h-16 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform group-hover:scale-110 active:scale-95 border border-white/5 hover:border-blue-600 shadow-2xl shadow-black/40"
        >
          <ArrowRight size={28} />
        </Link>
      </div>
    </div>
  );
}
