"use client"
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  SearchX,
  Briefcase,
  Zap,
  Target,
  BrainCircuit,
  Activity,
  Layers
} from 'lucide-react';
import { getJobsPaged } from '@/src/app/services/jobService';
import { JobCard } from '@/src/components/JobCard';
import { JobType, ExperienceLevel, JobQueryParams } from '@/src/app/types/job';
import { clsx } from 'clsx';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function JobsPage() {
  const [params, setParams] = useState<JobQueryParams>({
    PageNumber: 1,
    PageSize: 6,
    Title: '',
    Location: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', params],
    queryFn: () => getJobsPaged(params),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(prev => ({
      ...prev,
      Title: searchInput,
      Location: locationInput,
      PageNumber: 1
    }));
  };

  const setTypeFilter = (type: JobType | undefined) => {
    setParams(prev => ({ ...prev, JobType: type, PageNumber: 1 }));
  };

  const setLevelFilter = (level: ExperienceLevel | undefined) => {
    setParams(prev => ({ ...prev, ExperienceLevel: level, PageNumber: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, PageNumber: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-32 relative overflow-hidden text-white/90 selection:bg-blue-600/30">
      <Toaster position="top-right" />

      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>


      {/* ── HERO & SEARCH ── */}
      <section className="relative pt-44 pb-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-3xl text-blue-400 text-[9px] font-extrabold uppercase tracking-[0.4em] border border-white/10 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000 italic">
              <Sparkles size={14} className="animate-pulse" />
              Ai-Powered Job Discovery Network v4.0.1
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-8 italic uppercase leading-[0.9] drop-shadow-2xl">
              SYNCHRONIZE <span className="text-blue-600 drop-shadow-[0_10px_30px_rgba(37,99,235,0.4)]">CAREER</span>_SIGNAL
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold italic opacity-90 uppercase tracking-tight">
              EXPLORE THE UNIFIED NEURAL STREAM OF GLOBAL OPPORTUNITIES AND ARCHITECT YOUR FUTURE.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto bg-white/5 backdrop-blur-3xl p-3 rounded-[3rem] shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-3 group/search hover:border-blue-500/30 transition-all duration-500"
          >
            <div className="flex-1 flex items-center px-8 gap-5 w-full md:border-r border-white/10 py-5 group/input">
              <Search className="text-blue-500 shrink-0 group-hover/input:scale-125 transition-transform duration-500" size={22} />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full bg-transparent outline-none text-white font-bold italic placeholder:text-slate-700 uppercase tracking-tight text-sm"
              />
            </div>
            <div className="flex-1 flex items-center px-8 gap-5 w-full py-5 group/input">
              <MapPin className="text-slate-600 shrink-0 group-hover/input:scale-125 transition-transform duration-500" size={22} />
              <input
                type="text"
                placeholder="Location or 'Remote'..."
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                className="w-full bg-transparent outline-none text-white font-bold italic placeholder:text-slate-700 uppercase tracking-tight text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-[2.2rem] px-14 py-6 font-extrabold uppercase italic tracking-[0.25em] hover:bg-white hover:text-blue-600 transition-all shadow-2xl shadow-blue-600/30 active:scale-95 w-full md:w-auto text-xs"
            >
              Sync Signal
            </button>
          </form>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8 relative z-10">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-3xl sticky top-32 group hover:border-blue-500/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
                <h2 className="font-extrabold text-lg text-white italic uppercase tracking-tighter flex items-center gap-4">
                  <Filter size={20} className="text-blue-500" />
                  Filters<span className="text-blue-500">.</span>
                </h2>
                <button
                  onClick={() => {
                    setParams({ PageNumber: 1, PageSize: 6, Title: '', Location: '' });
                    setSearchInput('');
                    setLocationInput('');
                  }}
                  className="text-[9px] font-extrabold text-blue-500 uppercase tracking-[0.3em] hover:text-white transition-colors italic"
                >
                  Reset
                </button>
              </div>

              {/* Job Type Filter */}
              <div className="mb-12">
                <label className="block text-[9px] font-extrabold text-slate-600 uppercase tracking-[0.5em] mb-8 italic">Employment Type</label>
                <div className="space-y-3">
                  {[undefined, 'FullTime', 'PartTime', 'Remote', 'Hybrid'].map((t) => (
                    <FilterButton
                      key={t || 'all'}
                      active={params.JobType === t}
                      onClick={() => setTypeFilter(t as JobType)}
                      label={t || 'All Types'}
                    />
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-12">
                <label className="block text-[9px] font-extrabold text-slate-600 uppercase tracking-[0.5em] mb-8 italic">Experience Level</label>
                <div className="space-y-3">
                  {[undefined, 'Junior', 'Middle', 'Senior'].map((l) => (
                    <FilterButton
                      key={l || 'all'}
                      active={params.ExperienceLevel === l}
                      onClick={() => setLevelFilter(l as ExperienceLevel)}
                      label={l || 'All Levels'}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-10">
                <div className="p-8 bg-blue-600/10 rounded-[2.2rem] border border-blue-500/20 group/note relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-[30px] rounded-full"></div>
                  <p className="text-[10px] font-semibold text-blue-400 italic leading-relaxed relative z-10 uppercase tracking-tight">
                    Neural optimization active. Suggestions are synchronized with your verified skills.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs List */}
          <div className="flex-1 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 px-6">
              <div>
                <h3 className="text-2xl font-extrabold text-white italic uppercase tracking-tighter flex items-center gap-4">
                  <Activity size={24} className="text-blue-500 animate-pulse" />
                  {isLoading ? 'Scanning Stream...' : `${data?.totalCount || 0} Nodes Identified`}
                </h3>
                <p className="text-slate-600 text-[9px] font-extrabold uppercase tracking-[0.5em] mt-4 italic opacity-80">
                   Filtered Broadcasts for {params.Title || 'Unified Network'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-extrabold uppercase tracking-[0.3em] bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                <span className="text-slate-500">SORT_ORDER:</span>
                <select className="bg-transparent text-blue-500 outline-none cursor-pointer font-extrabold italic uppercase">
                  <option>NEWEST_FIRST</option>
                  <option>ECONOMIC_HIGH</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-white/5 border border-white/5 rounded-[3.5rem] animate-pulse"></div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-32 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 backdrop-blur-xl">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                  <SearchX className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-4 uppercase italic">Transmission Error</h3>
                <p className="text-slate-500 mb-10 font-semibold italic">FAILED TO ESTABLISH CONNECTION WITH NEURAL GRID.</p>
                <button onClick={() => window.location.reload()} className="px-12 py-5 bg-white text-slate-900 rounded-[1.8rem] font-extrabold uppercase italic tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all">Retry Link</button>
              </div>
            ) : data?.items?.length === 0 ? (
              <div className="text-center py-32 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 backdrop-blur-xl">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <Briefcase className="text-slate-600" size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-4 uppercase italic">Zero Matches found</h3>
                <p className="text-slate-500 mb-10 font-semibold italic uppercase tracking-tight">ADJUST YOUR SIGNAL PROTOCOLS TO IDENTIFY NODES.</p>
                <button
                  onClick={() => setParams({ PageNumber: 1, PageSize: 6, Title: '', Location: '' })}
                  className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-[1.8rem] font-extrabold uppercase italic tracking-widest text-xs hover:bg-white/10 transition-all"
                >
                  Clear Protocols
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {data?.items.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}

                {/* Advanced Pagination UI */}
                {data?.totalPages && data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-8 mt-32">
                    <button
                      disabled={!data?.hasPrevious}
                      onClick={() => handlePageChange((data?.page || 1) - 1)}
                      className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-10 active:scale-90 shadow-2xl backdrop-blur-2xl group"
                    >
                      <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-3xl border border-white/5 p-2.5 rounded-[2.5rem] shadow-3xl">
                      {Array.from({ length: Math.min(5, data?.totalPages || 0) }, (_, i) => {
                        const page = i + 1;
                        const isActive = data?.page === page;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={clsx(
                              "w-14 h-14 rounded-[1.8rem] font-extrabold text-[10px] transition-all duration-500 uppercase italic",
                              isActive
                                ? "bg-blue-600 text-white shadow-[0_15px_40px_rgba(37,99,235,0.4)] scale-110"
                                : "text-slate-600 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {page < 10 ? `0${page}` : page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={!data?.hasNext}
                      onClick={() => handlePageChange((data?.page || 1) + 1)}
                      className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-10 active:scale-90 shadow-2xl backdrop-blur-2xl group"
                    >
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── CALL TO ACTION ── */}
      <section className="container mx-auto px-6 py-32 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[5rem] border border-white/10 p-16 md:p-32 text-center relative overflow-hidden group shadow-3xl">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4 animate-pulse duration-[5s]"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4"></div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-10 italic uppercase tracking-tighter leading-none">Expand Organization Signal<span className="text-blue-500">?</span></h2>
          <p className="text-slate-500 text-xl font-semibold italic mb-20 max-w-2xl mx-auto opacity-90 leading-relaxed uppercase tracking-tight">
            Reach thousands of qualified candidates and use our neural match engines to filter the optimal workforce for your enterprise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative z-10">
            <Link href="/pages/organization/create">
              <button className="px-16 py-7 bg-white text-slate-950 rounded-[2.8rem] font-extrabold uppercase italic tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-[0_30px_60px_-10px_rgba(255,255,255,0.2)] active:scale-95 text-xs">Deploy Node</button>
            </Link>
            <Link href="/pages/organization">
              <button className="px-16 py-7 bg-white/5 border border-white/10 text-white rounded-[2.8rem] font-extrabold uppercase italic tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95 backdrop-blur-xl text-xs">Manifesto Docs</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterButton({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left px-8 py-5 rounded-[1.8rem] text-[10px] font-extrabold uppercase tracking-[0.25em] transition-all italic border-2",
        active
          ? "bg-blue-600 text-white shadow-[0_15px_40px_rgba(37,99,235,0.3)] border-blue-500/50"
          : "bg-white/5 text-slate-600 hover:bg-white/10 hover:text-blue-500 border-white/5 hover:border-blue-500/20"
      )}
    >
      {label}
    </button>
  );
}
