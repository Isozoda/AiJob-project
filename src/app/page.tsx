"use client"

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getToken } from '@/src/store/authStore';
import { usePostStore } from '@/src/store/postStore';
import {
  useAllPosts,
  useCreatePost,
  useLikePost,
  useRepost,
  usePostComments,
  useAddComment,
} from '@/src/app/hooks/usePost';
import {
  Sparkles,
  Search,
  Zap,
  Briefcase,
  TrendingUp,
  BrainCircuit,
  Rocket,
  ArrowRight,
  MoveRight,
  Fingerprint,
  Target,
  Users,
  MessageSquare,
  Repeat,
  Share2,
  Heart,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Newspaper,
  LayoutGrid,
  ChevronDown,
  Building2,
  User,
  ShieldCheck,
  SendHorizontal,
  X
} from 'lucide-react';
import type { Post } from '@/src/app/types/post';
import image1 from "./images/Container.svg";
import { useProfileByUserId } from './hooks/useProfile';
import { clsx } from 'clsx';
import ImagePickerModal from '../components/ImagePickerModal';

// ─── MAIN SMART PAGE ────────────────────────────────────────
export default function Homepage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isAuthenticated) {
    return <FeedView />;
  }

  return <LandingView />;
}

// ─── LANDING VIEW (PREMIUM STUDIO CONCEPT) ────────────────────────
function LandingView() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 pt-32 lg:pt-48 pb-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24 xl:gap-32">

            {/* Left Content */}
            <div className="flex-1 max-w-3xl">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-[0.4em] mb-12 shadow-2xl shadow-slate-900/20">
                <Sparkles size={14} className="text-blue-400" /> AI OPERATING SYSTEM 2.0
              </div>

              <h1 className="text-7xl md:text-[8rem] font-extrabold tracking-tighter leading-[0.8] mb-10 italic uppercase text-slate-900 drop-shadow-sm">
                Jobs that <br /> <span className="text-blue-600 tracking-normal drop-shadow-[0_20px_30px_rgba(37,99,235,0.15)]">Sense you.</span>
              </h1>

              <p className="text-2xl md:text-3xl text-slate-500 font-extrabold leading-[1.2] max-w-2xl mb-16 italic tracking-tight opacity-90">
                Forget searching. Our <span className="text-slate-900">Neural Core</span> architects the intersection of your potential and the world's leading innovation studios.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Link href="/pages/register" className="w-full sm:w-auto px-16 py-8 bg-slate-900 text-white rounded-[2.5rem] font-extrabold text-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] flex items-center justify-center gap-4 group">
                  EXPLORE <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/pages/organization" className="w-full sm:w-auto text-xl font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors border-b-4 border-transparent hover:border-blue-600 pb-2">
                  FOR STUDIOS
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="mt-32 pt-16 border-t border-slate-200 flex flex-wrap gap-16 md:gap-24">
                <LandingMetric label="ACTIVE CYCLES" value="45k+" />
                <LandingMetric label="NEURAL ACCURACY" value="98%" />
                <LandingMetric label="TIER-1 STUDIOS" value="2k+" />
              </div>
            </div>

            {/* Right Visual (Interactive HUD) */}
            <div className="flex-1 relative w-full flex justify-center lg:justify-end py-12">
              <div className="relative w-full max-w-[650px] group">
                {/* Floating Glows */}
                <div className="absolute -inset-10 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000 opacity-60"></div>

                {/* The Device Frame */}
                <div className="relative bg-white border border-slate-100 rounded-[4rem] p-4 shadow-[30px_60px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
                  <div className="bg-slate-50 rounded-[3.2rem] overflow-hidden border border-slate-100 aspect-[4/4] relative">
                    {/* Static preview image */}
                    <Image className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" src={image1} alt="AI Interface" priority />

                    {/* Dynamic HUD Overlays */}
                    <div className="absolute top-12 left-12 px-6 py-4 bg-white/90 backdrop-blur-xl border border-white rounded-[1.5rem] shadow-2xl flex items-center gap-4 animate-bounce duration-[3s]">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 uppercase tracking-tighter">Perfect Match ID</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Google • Lead Architect</p>
                      </div>
                    </div>

                    <div className="absolute bottom-12 right-12 px-6 py-4 bg-slate-900 text-white border border-white/10 rounded-[1.5rem] shadow-2xl flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Zap size={24} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-tighter">New Cycle Active</p>
                        <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest">Verified Signal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Floating Deco */}
                <div className="absolute -top-10 -right-10 w-32 h-32 border-4 border-slate-900/5 rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 border-4 border-blue-600/5 rounded-[4rem] pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGO WALL */}
        <div className="container mx-auto px-6 mt-48 py-20 border-y border-slate-100">
          <p className="text-[10px] font-extrabold text-slate-400 text-center uppercase tracking-[1em] mb-16">INTEGRATED WITH GLOBAL ARCHITECTS</p>
          <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-20 filter grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
            <CompanyLogo name="MICROSOFT" />
            <CompanyLogo name="OPENAI" />
            <CompanyLogo name="META" />
            <CompanyLogo name="NVIDIA" />
            <CompanyLogo name="GOOGLE" />
          </div>
        </div>
      </main>
    </div>
  );
}

function LandingMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-5xl font-extrabold italic text-slate-900 tracking-tighter drop-shadow-sm">{value}</span>
      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em]">{label}</span>
    </div>
  );
}

function CompanyLogo({ name }: { name: string }) {
  return <span className="text-3xl font-extrabold italic tracking-tighter text-slate-900">{name}</span>;
}

// ─── FEED VIEW (SOPHISTICATED SOCIAL HUB) ────────────────────────────
function FeedView() {
  const { data: posts, isLoading } = useAllPosts();
  const createPostMutation = useCreatePost();
  const likeMutation = useLikePost();
  const repostMutation = useRepost();

  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  // ── PAGINATION LOGIC ──
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 12;
  const totalPages = posts ? Math.ceil(posts.length / POSTS_PER_PAGE) : 0;
  const paginatedPosts = posts ? posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE) : [];

  const currentUserId = (() => {
    const token = getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.UserId || payload.sub || '0');
    } catch { return 0; }
  })();
  const { data: myProfile } = useProfileByUserId(currentUserId);

  const myName = myProfile?.firstName && myProfile?.lastName
    ? `${myProfile.firstName} ${myProfile.lastName}`
    : 'Your Name';
  const myInitials = myProfile?.firstName && myProfile?.lastName
    ? `${myProfile.firstName[0]}${myProfile.lastName[0]}`.toUpperCase()
    : 'ME';

  const handleCreatePost = async (content: string, imageUrl: string) => {
    await createPostMutation.mutateAsync({
      content: content,
      imageUrl: imageUrl || null,
    });
    setIsImagePickerOpen(false);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-10 items-start relative z-10">

        {/* ── LEFT SIDEBAR (Studio ID) ── */}
        <aside className="hidden lg:block sticky top-32 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden group transition-all duration-500 hover:border-blue-500/30">
            <div className="h-32 relative">
              {myProfile?.backgroundPhotoUrl ? (
                <img src={myProfile.backgroundPhotoUrl} alt="" className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40">
                  <div className="absolute inset-0 bg-grid-white/5"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            <div className="px-6 pb-8 text-center relative mt-[-4rem]">
              <Link href="/pages/profile" className="inline-block relative">
                <div className="w-32 h-32 rounded-[2.8rem] bg-slate-900 p-1.5 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-white/10">
                  {myProfile?.photoUrl ? (
                    <img src={myProfile.photoUrl} alt={myName} className="w-full h-full object-cover rounded-[2.2rem]" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center rounded-[2.2rem]">
                      <span className="text-3xl font-extrabold text-white italic tracking-tighter">{myInitials}</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
              </Link>

              <div className="mt-6">
                <Link href="/pages/profile" className="text-2xl font-extrabold text-white group-hover:text-blue-400 transition-colors italic uppercase tracking-tighter leading-none block">{myName}</Link>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mt-3 leading-snug line-clamp-2 px-4 opacity-80">{myProfile?.headline || 'Neural Architect'}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col divide-y divide-white/5">
              <SidebarLink icon={<Users size={16} />} label="Neural Network" count="428" />
              <SidebarLink icon={<Briefcase size={16} />} label="Active Cycles" count="12" />
              <SidebarLink icon={<LayoutGrid size={16} />} label="Manifestos" count="5" />
            </div>

            <div className="p-2">
              <Link href="/pages/profile" className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 rounded-[2rem] transition-all group/btn">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Access Analytics</span>
                <ArrowUpRight size={14} className="text-blue-400 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>

          <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.6em] opacity-40">AiJob Hub v2.0 // Core</p>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className="space-y-10">
          {/* Create Post Box - ElegantHUD */}
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 shadow-2xl p-10 group overflow-hidden relative transition-all duration-500 hover:border-blue-500/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full translate-x-12 -translate-y-12 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/10 blur-[60px] rounded-full -translate-x-12 translate-y-12"></div>

            <div className="flex gap-8 items-center mb-10 relative z-10">
              <Link href="/pages/profile" className="w-20 h-20 rounded-[2rem] border border-white/10 flex items-center justify-center overflow-hidden bg-slate-900 shadow-2xl transition-all hover:scale-110 hover:border-blue-500/50">
                {myProfile?.photoUrl ? (
                  <img src={myProfile.photoUrl} alt={myName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                    <span className="text-xl font-black text-white italic">M</span>
                  </div>
                )}
              </Link>
              <button
                onClick={() => setIsImagePickerOpen(true)}
                className="flex-1 h-20 bg-white/5 border border-white/5 rounded-[2.2rem] text-left px-10 text-sm text-slate-400 font-extrabold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-blue-500/30 transition-all active:scale-[0.98] shadow-inner backdrop-blur-sm"
              >
                Broadcast a thought...
              </button>
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <PostTypeBtn onClick={() => setIsImagePickerOpen(true)} icon={<ImageIcon size={20} className="text-blue-400" />} label="Visuals" bg="bg-blue-400/10" />
              <PostTypeBtn onClick={() => setIsImagePickerOpen(true)} icon={<VideoIcon size={20} className="text-emerald-400" />} label="Continuity" bg="bg-emerald-400/10" />
              <PostTypeBtn onClick={() => setIsImagePickerOpen(true)} icon={<Newspaper size={20} className="text-amber-400" />} label="Directive" bg="bg-amber-400/10" />
            </div>
          </div>

          <ImagePickerModal 
            isOpen={isImagePickerOpen}
            onClose={() => setIsImagePickerOpen(false)}
            onPost={handleCreatePost}
            isPosting={createPostMutation.isPending}
          />

          {/* Advanced Pagination UI */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              {/* <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-10 active:scale-90"
              >
                <MoveRight size={20} className="rotate-180" />
              </button> */}

              <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-2 rounded-3xl">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={clsx(
                        "w-12 h-12 rounded-2xl font-black text-xs transition-all duration-300",
                        isActive
                          ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] scale-110"
                          : "text-slate-500 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {pageNum < 10 ? `0${pageNum}` : pageNum}
                    </button>
                  );
                })}
              </div>

              {/* <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-10 active:scale-90"
              >
                <MoveRight size={20} />
              </button> */}
            </div>
          )}
          {/* Sort & Status Feed */}
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Real-time Neural Stream</span>
            </div>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-1">
              TOP SORT <ChevronDown size={12} />
            </button>
          </div>

          {/* Posts List */}
          {isLoading ? (
            <div className="space-y-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-white border border-slate-100 rounded-[4rem] animate-pulse shadow-sm"></div>
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-32 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid-slate-900/[0.02] -z-10"></div>
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform">
                <LayoutGrid className="text-slate-200" size={64} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 italic uppercase mb-4 tracking-tighter">Zero Broadcasts.</h3>
              <p className="text-slate-400 font-bold max-w-sm mx-auto mb-12">The neural stream is currently silent. Be the first to synchronize your signal.</p>
              <button onClick={() => setIsImagePickerOpen(true)} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all flex items-center gap-3 mx-auto shadow-2xl">
                INITIALIZE SIGNAL <Plus size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-12">
                {paginatedPosts.map((post: Post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    timeAgo={timeAgo}
                    onLike={(id) => likeMutation.mutate(id)}
                    onRepost={(id) => repostMutation.mutate(id)}
                  />
                ))}
              </div>

            </>
          )}
        </main>

        {/* ── RIGHT SIDEBAR (Network Pulse) ── */}
        <aside className="hidden lg:flex flex-col gap-10 sticky top-32">
          {/* News Block */}
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl p-10 transition-all duration-500 hover:border-blue-500/20">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                AiPulse<span className="text-blue-500">.</span>
              </h2>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <TrendingUp size={18} />
              </div>
            </div>

            <ul className="space-y-10">
              {[
                { title: "OpenAI v5.0 Cycle Initialized", readers: "7.6k", tag: "SYSTEM" },
                { title: "Nvidia Market Saturation Peak", readers: "7.2k", tag: "MARKET" },
                { title: "Remote Studio Standards 2026", readers: "5.4k", tag: "POLICY" },
                { title: "Meta VR Workspace Deployment", readers: "4.7k", tag: "TECH" },
              ].map((news, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] font-black text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase tracking-[0.2em] leading-none">{news.tag}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase leading-none">{news.readers} READS</span>
                  </div>
                  <h4 className="text-[13px] font-extrabold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight italic uppercase tracking-tight">{news.title}</h4>
                </li>
              ))}
            </ul>

            <button className="w-full mt-12 py-5 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all">
              Full Archives <MoveRight size={12} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Objective Block */}
          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5 transition-all duration-500 hover:border-blue-500/30">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full translate-x-12 -translate-y-12 animate-pulse"></div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
              <Target size={24} className="text-blue-500" /> Objective<span className="text-blue-500">.</span>
            </h3>
            <p className="text-slate-400 text-[13px] font-bold italic mb-10 leading-relaxed opacity-80">Refine your cognitive score with daily neural challenges and synchronized simulations.</p>
            <button className="w-full py-5 bg-white text-slate-900 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
              ENTER SIMULATION
            </button>
          </div>
        </aside>
      </div>

    </div>
  );
}

function SidebarLink({ icon, label, count }: { icon: React.ReactNode, label: string, count: string }) {
  return (
    <div className="flex items-center justify-between px-8 py-5 hover:bg-white/5 cursor-pointer transition-all group">
      <div className="flex items-center gap-5">
        <span className="text-slate-500 group-hover:text-blue-400 transition-colors group-hover:scale-110 duration-300">{icon}</span>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] group-hover:text-white transition-colors">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-500 group-hover:text-blue-400 transition-colors bg-white/5 px-2 py-1 rounded-md">{count}</span>
    </div>
  );
}

function PostTypeBtn({ onClick, icon, label, bg }: any) {
  return (
    <button onClick={onClick} className={clsx("flex-1 flex items-center justify-center gap-4 py-5 rounded-[1.8rem] hover:bg-white/10 border border-white/5 transition-all group", bg)}>
      <span className="group-hover:scale-125 transition-transform duration-500">{icon}</span>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

// ─── POST CARD COMPONENT ────────────────────────────────────
function PostCard({ post, timeAgo, onLike, onRepost }: {
  post: Post;
  timeAgo: (d: string) => string;
  onLike: (id: number) => void;
  onRepost: (id: number) => void;
}) {
  const { activeCommentPostId, toggleComments } = usePostStore();
  const showComments = activeCommentPostId === post.id;

  const { data: userProfile } = useProfileByUserId(post.userId);

  const displayName = userProfile?.firstName && userProfile?.lastName
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : `User #${post.userId}`;
  const displayHeadline = userProfile?.headline || 'Neural Architect';
  const displayInitial = userProfile?.firstName?.[0]?.toUpperCase() || 'U';

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden group/card hover:border-blue-500/30 transition-all duration-700 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -z-10 group-hover/card:bg-blue-600/10 transition-colors"></div>

      {/* Header */}
      <div className="flex items-start gap-6 p-10 pb-0 relative">
        <Link href={`/pages/profile/${post.userId}`} className="w-20 h-20 rounded-[2.2rem] bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-110 transition-all duration-500 overflow-hidden shadow-2xl hover:border-blue-500/50">
          {userProfile?.photoUrl ? (
            <img src={userProfile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <span className="font-black text-blue-400 text-2xl italic tracking-tighter">{displayInitial}</span>
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0 pt-2">
          <div className="flex items-center justify-between">
            <Link href={`/pages/profile/${post.userId}`} className="font-black text-2xl text-white hover:text-blue-400 transition-all cursor-pointer italic uppercase tracking-tighter group/name">
              {displayName}
              <div className="h-0.5 w-0 group-hover/name:w-full bg-blue-500 transition-all duration-500 mt-0.5"></div>
            </Link>
            <button className="px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95">
              FOLLOW
            </button>
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-3 opacity-80 flex items-center gap-2">
            <BrainCircuit size={12} className="text-blue-500/50" /> {displayHeadline}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {timeAgo(post.createdAt)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Verified Stream</span>
          </div>
        </div>
        <button className="text-slate-600 hover:text-white transition-colors pt-2 h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-12 pt-10 pb-10">
        <p className="text-2xl text-slate-200 font-extrabold leading-[1.4] whitespace-pre-wrap italic opacity-90 tracking-tight">
          “{post.content}”
        </p>
      </div>

      {/* Image Asset */}
      {post.imageUrl && (
        <div className="mx-10 rounded-[3.5rem] overflow-hidden border border-white/10 shadow-3xl group/img relative">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none duration-700 z-10"></div>
          <img src={post.imageUrl} alt="Post media" className="w-full max-h-[700px] object-cover transition-transform duration-[1.5s] ease-out group-hover/card:scale-105" />
          <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-2 z-20">
            <ImageIcon size={14} className="text-blue-400" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Neural Asset V1</span>
          </div>
        </div>
      )}

      {/* Repost Context */}
      {post.repostOfPostId && (
        <div className="mx-10 my-8 px-8 py-5 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-4 group/bridge cursor-pointer hover:bg-white/10 transition-colors">
          <Repeat size={16} className="text-blue-400" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover/bridge:text-white transition-colors">Bridged from Sync Protocol <span className="text-blue-500">#{post.repostOfPostId}</span></span>
        </div>
      )}

      {/* Social Interactions */}
      <div className="px-10 py-10 mt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-[11px] font-black shadow-lg shadow-blue-500/5">
              <Heart size={16} fill={post.likedByMe ? 'currentColor' : 'none'} className={clsx(post.likedByMe && "animate-pulse")} />
              {post.likeCount ?? 0}
            </div>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-slate-400 text-[11px] font-black hover:bg-white/10 hover:border-blue-500/30 transition-all"
            >
              <MessageSquare size={16} />
              {post.commentCount ?? 0}
            </button>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-slate-400 text-[11px] font-black">
              <Repeat size={16} />
              {post.repostCount ?? 0}
            </div>
          </div>

          <button className="w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-2xl">
            <Share2 size={20} />
          </button>
        </div>

        {/* HUD Action Grid */}
        <div className="grid grid-cols-4 gap-5">
          <PostActionBtn onClick={() => onLike(post.id)} active={post.likedByMe} icon={<Heart size={22} />} label="SIGNAL" />
          <PostActionBtn onClick={() => toggleComments(post.id)} icon={<MessageSquare size={22} />} label="ECHO" />
          <PostActionBtn onClick={() => onRepost(post.id)} icon={<Repeat size={22} />} label="BRIDGE" />
          <PostActionBtn icon={<SendHorizontal size={22} />} label="SEND" />
        </div>
      </div>

      {/* Comments Hub */}
      {showComments && <CommentSection postId={post.id} timeAgo={timeAgo} />}
    </div>
  );
}

function PostActionBtn({ onClick, active, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-3 py-3 px-0 rounded-[2rem] transition-all relative overflow-hidden group/btn",
        active
          ? "bg-blue-600 text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)]"
          : "bg-white/5 text-slate-500 hover:bg-white/10 hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] hover:text-blue-400 border border-white/5 hover:border-blue-500/30"
      )}
    >
      <div className="relative">
        <span className="scale-100 group-hover/btn:scale-125 transition-transform duration-500 block">{icon}</span>
        {active && <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 group-hover/btn:opacity-100 transition-opacity">{label}</span>
      {active && <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>}
    </button>
  );
}

// ─── COMMENT SECTION ────────────────────────────────────────
function CommentSection({ postId, timeAgo }: { postId: number; timeAgo: (d: string) => string }) {
  const { data: comments, isLoading } = usePostComments(postId);
  const addCommentMutation = useAddComment(postId);
  const [text, setText] = useState('');

  const currentUserId = (() => {
    const token = getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.UserId || payload.sub || '0');
    } catch { return 0; }
  })();
  const { data: myProfile } = useProfileByUserId(currentUserId);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await addCommentMutation.mutateAsync({ content: text });
    setText('');
  };

  return (
    <div className="border-t border-white/5 px-10 py-12 bg-slate-950/40 backdrop-blur-xl">
      {/* HUD Input */}
      <div className="flex gap-6 mb-12">
        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-2xl hover:border-blue-500/50 transition-all">
          {myProfile?.photoUrl ? (
            <img src={myProfile.photoUrl} alt="Me" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <span className="text-xl font-black text-white italic">M</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center bg-white/5 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden focus-within:border-blue-500/50 transition-all pr-4 backdrop-blur-md group/input">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Log an echo to this transmission..."
            className="flex-1 px-8 py-6 text-sm font-bold outline-none bg-transparent placeholder:text-slate-600 text-white font-sans italic"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || addCommentMutation.isPending}
            className="w-14 h-14 bg-white text-slate-900 rounded-[1.2rem] flex items-center justify-center hover:bg-blue-600 hover:text-white disabled:opacity-10 transition-all active:scale-90 shadow-2xl group-hover/input:scale-105"
          >
            <SendHorizontal size={22} />
          </button>
        </div>
      </div>

      {/* Comments Stream */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-16 bg-slate-100 rounded-3xl"></div>
          <div className="h-16 bg-slate-100 rounded-3xl"></div>
        </div>
      ) : !comments || comments.length === 0 ? (
        <div className="py-10 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-32 h-32 border-4 border-slate-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic relative z-10 animate-pulse">
            SILENT NODE<span className="text-blue-500">.</span>
          </p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-800 to-transparent mx-auto mt-6"></div>
        </div>
      ) : (
        <div className="space-y-10">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} timeAgo={timeAgo} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment, timeAgo }: { comment: any; timeAgo: (d: string) => string }) {
  const { data: profile } = useProfileByUserId(comment.userId);
  const name = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : `User #${comment.userId}`;
  const initial = profile?.firstName?.[0] || 'U';

  return (
    <div className="flex gap-6 group">
      <Link href={`/pages/profile/${comment.userId}`} className="w-14 h-14 rounded-[1.2rem] bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-2xl hover:scale-110 transition-all hover:border-blue-500/50">
        {profile?.photoUrl ? (
          <img src={profile.photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-black text-slate-500 italic tracking-tighter">{initial}</span>
        )}
      </Link>
      <div className="bg-white/5 border border-white/5 shadow-2xl rounded-[2.5rem] rounded-tl-none px-10 py-8 flex-1 relative group-hover:border-blue-500/20 transition-all duration-500">
        <div className="flex justify-between items-start mb-4">
          <Link href={`/pages/profile/${comment.userId}`} className="text-[11px] font-black text-white hover:text-blue-400 uppercase italic tracking-[0.1em] transition-colors">
            {name}
          </Link>
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-md font-bold text-slate-400 leading-relaxed italic opacity-90">“{comment.content}”</p>
      </div>
    </div>
  );
}
