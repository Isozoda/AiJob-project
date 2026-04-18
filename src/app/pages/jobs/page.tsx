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
  Briefcase
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-right" />

      {/* ── HERO & SEARCH ── */}
      <section className="relative overflow-hidden bg-white pt-24 pb-20 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-indigo-50/40 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles size={14} className="animate-pulse" />
              Ai-Powered Job Discovery
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">dream career</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore thousands of job opportunities tailored specifically to your skills and career goals. Let AiJob guide you to success.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto bg-white p-2 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] border border-slate-100 flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center px-6 gap-3 w-full border-r border-slate-100 last:border-0 py-4">
              <Search className="text-blue-500 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="flex-1 flex items-center px-6 gap-3 w-full border-r border-slate-100 last:border-0 py-4">
              <MapPin className="text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Location or 'Remote'..."
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 font-medium placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-[2rem] px-10 py-4 font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 w-full md:w-auto"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Filter size={18} className="text-blue-600" />
                  Filters
                </h2>
                <button
                  onClick={() => {
                    setParams({ PageNumber: 1, PageSize: 6, Title: '', Location: '' });
                    setSearchInput('');
                    setLocationInput('');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              </div>

              {/* Job Type Filter */}
              <div className="mb-8">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Employment Type</label>
                <div className="space-y-2">
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
              <div className="mb-8">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Experience Level</label>
                <div className="space-y-2">
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

              <div className="pt-6 border-t border-slate-50 mt-10">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 leading-relaxed">
                    AI recommendation is active. Suggestions are based on your profile.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isLoading ? 'Searching...' : `${data?.totalCount || 0} Jobs Found`}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Showing results for {params.Title || 'All Jobs'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Sort by:</span>
                <select className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer">
                  <option>Newest First</option>
                  <option>Salary: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>)}
              </div>
            ) : isError ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchX className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Failed to load jobs</h3>
                <p className="text-slate-500 mb-6">There was an error connecting to the server.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Try Again</button>
              </div>
            ) : data?.items?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs matched your search</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => setParams({ PageNumber: 1, PageSize: 6, Title: '', Location: '' })}
                  className="px-6 py-2 border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {data?.items.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}

                {/* Pagination */}
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    disabled={!data?.hasPrevious}
                    onClick={() => handlePageChange((data?.page || 1) - 1)}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, data?.totalPages || 0) }, (_, i) => {
                      const page = i + 1; // Simplistic pagination logic
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={clsx(
                            "w-12 h-12 rounded-2xl font-black text-sm transition-all",
                            data?.page === page
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={!data?.hasNext}
                    onClick={() => handlePageChange((data?.page || 1) + 1)}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Call to Action */}
      <section className="bg-slate-900 py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Want to post a vacancy?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Reach thousands of qualified candidates and use our AI to filter the best matches for your company.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pages/organization/create">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Create Organization</button>
            </Link>
            <Link href="/pages/organization">
              <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all">Learn More</button>
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
        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
      )}
    >
      {label}
    </button>
  );
}
