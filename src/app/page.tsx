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
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl shadow-slate-900/20">
                <Sparkles size={14} className="text-blue-400" /> AI OPERATING SYSTEM 2.0
              </div>

              <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.8] mb-10 italic uppercase text-slate-900 drop-shadow-sm">
                Jobs that <br /> <span className="text-blue-600 tracking-normal drop-shadow-[0_20px_30px_rgba(37,99,235,0.15)]">Sense you.</span>
              </h1>

              <p className="text-2xl md:text-3xl text-slate-500 font-extrabold leading-[1.2] max-w-2xl mb-16 italic tracking-tight opacity-90">
                Forget searching. Our <span className="text-slate-900">Neural Core</span> architects the intersection of your potential and the world's leading innovation studios.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Link href="/pages/register" className="w-full sm:w-auto px-16 py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] flex items-center justify-center gap-4 group">
                  EXPLORE <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/pages/organization" className="w-full sm:w-auto text-xl font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors border-b-4 border-transparent hover:border-blue-600 pb-2">
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
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Perfect Match ID</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Google • Lead Architect</p>
                      </div>
                    </div>

                    <div className="absolute bottom-12 right-12 px-6 py-4 bg-slate-900 text-white border border-white/10 rounded-[1.5rem] shadow-2xl flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Zap size={24} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-tighter">New Cycle Active</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Verified Signal</p>
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
          <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[1em] mb-16">INTEGRATED WITH GLOBAL ARCHITECTS</p>
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
      <span className="text-5xl font-black italic text-slate-900 tracking-tighter drop-shadow-sm">{value}</span>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{label}</span>
    </div>
  );
}

function CompanyLogo({ name }: { name: string }) {
  return <span className="text-3xl font-black italic tracking-tighter text-slate-900">{name}</span>;
}

// ─── FEED VIEW (SOPHISTICATED SOCIAL HUB) ────────────────────────────
function FeedView() {
  const { data: posts, isLoading } = useAllPosts();
  const createPostMutation = useCreatePost();
  const likeMutation = useLikePost();
  const repostMutation = useRepost();

  const { showCreateModal, openCreateModal, closeCreateModal } = usePostStore();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

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

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPostMutation.mutateAsync({
      content: newPostContent,
      imageUrl: newPostImage || null,
    });
    setNewPostContent('');
    setNewPostImage('');
    closeCreateModal();
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
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-10 items-start relative z-10">

        {/* ── LEFT SIDEBAR (Studio ID) ── */}
        <aside className="hidden lg:block sticky top-32 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden group">
            <div className="h-28 relative">
              {myProfile?.backgroundPhotoUrl ? (
                <img src={myProfile.backgroundPhotoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-slate-900">
                  <div className="absolute inset-0 bg-grid-white/5"></div>
                </div>
              )}
            </div>

            <div className="px-6 pb-8 text-center relative mt-[-3.5rem]">
              <Link href="/pages/profile" className="inline-block relative">
                <div className="w-28 h-28 rounded-[2.4rem] bg-white p-1 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {myProfile?.photoUrl ? (
                    <img src={myProfile.photoUrl} alt={myName} className="w-full h-full object-cover rounded-[1.8rem]" />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-[1.8rem]">
                      <span className="text-2xl font-black text-white italic">{myInitials}</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full animate-pulse"></div>
              </Link>

              <div className="mt-6">
                <Link href="/pages/profile" className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors italic uppercase tracking-tighter leading-none">{myName}</Link>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-3 leading-snug line-clamp-2 px-2">{myProfile?.headline || 'Studio Member'}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex flex-col divide-y divide-slate-50">
              <SidebarLink icon={<Users size={16} />} label="Neural Network" count="0" />
              <SidebarLink icon={<Briefcase size={16} />} label="Active Cycles" count="0" />
              <SidebarLink icon={<LayoutGrid size={16} />} label="Manifestos" count="0" />
            </div>

            <div className="p-6 bg-slate-900 text-white">
              <Link href="/pages/profile" className="flex items-center justify-between group/btn">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Access Analytics</span>
                <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>

          <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">AiJob Hub Protocols v2.0</p>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className="space-y-10">
          {/* Create Post Box - ElegantHUD */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-10 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full translate-x-12 -translate-y-12"></div>

            <div className="flex gap-6 items-center mb-8 relative z-10">
              <Link href="/pages/profile" className="w-16 h-16 rounded-[1.6rem] border border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50 shadow-sm transition-transform hover:scale-110">
                {myProfile?.photoUrl ? (
                  <img src={myProfile.photoUrl} alt={myName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-black text-blue-600 italic">M</span>
                )}
              </Link>
              <button
                onClick={openCreateModal}
                className="flex-1 h-16 bg-slate-50 border border-slate-100 rounded-[1.6rem] text-left px-8 text-sm text-slate-400 font-black uppercase tracking-widest hover:bg-white hover:border-blue-600/30 transition-all active:scale-95 shadow-inner"
              >
                Broadcast a thought...
              </button>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <PostTypeBtn onClick={openCreateModal} icon={<ImageIcon size={18} className="text-blue-600" />} label="Visuals" />
              <PostTypeBtn onClick={openCreateModal} icon={<VideoIcon size={18} className="text-emerald-600" />} label="Continuity" />
              <PostTypeBtn onClick={openCreateModal} icon={<Newspaper size={18} className="text-amber-500" />} label="Directive" />
            </div>
          </div>

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
              <button onClick={openCreateModal} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all flex items-center gap-3 mx-auto shadow-2xl">
                INITIALIZE SIGNAL <Plus size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post: Post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  timeAgo={timeAgo}
                  onLike={(id) => likeMutation.mutate(id)}
                  onRepost={(id) => repostMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </main>

        {/* ── RIGHT SIDEBAR (Network Pulse) ── */}
        <aside className="hidden lg:flex flex-col gap-10 sticky top-32">
          {/* News Block */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">AiPulse.</h2>
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <TrendingUp size={16} />
              </div>
            </div>

            <ul className="space-y-10">
              {[
                { title: "OpenAI v5.0 Cycle Initialized", readers: "7.6k" },
                { title: "Nvidia Market Saturation Peak", readers: "7.2k" },
                { title: "Remote Studio Standards 2026", readers: "5.4k" },
                { title: "Meta VR Workspace Deployment", readers: "4.7k" },
              ].map((news, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">News Protocol</span>
                    <span className="text-[8px] font-black text-slate-300 uppercase leading-none">{news.readers} READS</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight italic uppercase">{news.title}</h4>
                </li>
              ))}
            </ul>

            <button className="w-full mt-12 py-4 border border-slate-100 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:bg-slate-50 transition-colors">
              Full Archives <MoveRight size={12} className="inline ml-2" />
            </button>
          </div>

          {/* Puzzle/Ad Block */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full translate-x-12 -translate-y-12"></div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Target size={20} className="text-blue-500" /> Objective.
            </h3>
            <p className="text-slate-400 text-sm font-medium italic mb-8">Refine your cognitive score with daily neural challenges.</p>
            <button className="w-full py-4 bg-white text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">
              ENTER SIMULATION
            </button>
          </div>
        </aside>
      </div>

      {/* ── CREATE POST MODAL (Studio Grid Style) ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={closeCreateModal}>
          <div className="bg-white rounded-[4rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] w-full max-w-[640px] mx-4 relative overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-12 py-10 flex items-center justify-between border-b border-slate-50 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white italic font-black shadow-xl">
                  {myInitials}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 italic uppercase">Broadcast.</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal targeting Everyone</p>
                </div>
              </div>
              <button onClick={closeCreateModal} className="w-14 h-14 rounded-2xl hover:bg-slate-50 flex items-center justify-center transition-all bg-white border border-slate-100 shadow-sm active:scale-90">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-12">
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="Synchronize your signal with the network..."
                className="w-full h-48 resize-none outline-none text-2xl font-bold text-slate-900 placeholder:text-slate-200 italic leading-snug"
                autoFocus
              />
              <div className="mt-8 relative group">
                <input
                  type="text"
                  value={newPostImage}
                  onChange={e => setNewPostImage(e.target.value)}
                  placeholder="Insert asset URL (Visual/Continuity)"
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none text-sm font-black text-slate-900 placeholder:text-slate-300 focus:border-blue-600 transition-all font-sans"
                />
              </div>
            </div>

            <div className="px-12 py-10 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                  <ImageIcon size={18} /> ASSET
                </button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
                  <VideoIcon size={18} /> CONTINUITY
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending || !newPostContent.trim()}
                className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all disabled:opacity-20 active:scale-95 shadow-2xl flex items-center gap-3"
              >
                {createPostMutation.isPending ? 'SYNCING...' : 'INITIATE SYNC'} <SendHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ icon, label, count }: { icon: React.ReactNode, label: string, count: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors group">
      <div className="flex items-center gap-4">
        <span className="text-slate-300 group-hover:text-blue-600 transition-colors">{icon}</span>
        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-300">{count}</span>
    </div>
  );
}

function PostTypeBtn({ onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
      {icon}
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
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
  const displayHeadline = userProfile?.headline || 'Studio Member';
  const displayInitial = userProfile?.firstName?.[0]?.toUpperCase() || 'U';

  return (
    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden group/card hover:border-blue-500/20 transition-all duration-700">
      {/* Header */}
      <div className="flex items-start gap-5 p-10 pb-0 relative">
        <Link href={`/pages/profile/${post.userId}`} className="w-16 h-16 rounded-[1.6rem] bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-110 transition-transform overflow-hidden shadow-sm">
          {userProfile?.photoUrl ? (
            <img src={userProfile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="font-black text-blue-600 text-lg italic">{displayInitial}</span>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link href={`/pages/profile/${post.userId}`} className="font-black text-xl text-slate-900 hover:text-blue-600 transition-colors cursor-pointer italic uppercase tracking-tighter">
              {displayName}
            </Link>
            <button className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              FOLLOW
            </button>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-80">{displayHeadline}</p>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 mt-2">
            {timeAgo(post.createdAt)} • Verified Stream
          </p>
        </div>
        <button className="text-slate-300 hover:text-slate-900 transition-colors pt-2">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-10 pt-8 pb-10">
        <p className="text-xl text-slate-700 font-bold leading-[1.4] whitespace-pre-wrap italic opacity-90">“{post.content}”</p>
      </div>

      {/* Image Asset */}
      {post.imageUrl && (
        <div className="mx-10 rounded-[3rem] overflow-hidden border border-slate-50 shadow-2xl group/img relative">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none"></div>
          <img src={post.imageUrl} alt="Post media" className="w-full max-h-[600px] object-cover transition-transform duration-1000 group-hover/card:scale-105" />
        </div>
      )}

      {/* Repost Context */}
      {post.repostOfPostId && (
        <div className="mx-10 my-6 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-3">
          <Repeat size={14} className="text-blue-600" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bridged from Sync Protocol #{post.repostOfPostId}</span>
        </div>
      )}

      {/* Social Interactions */}
      <div className="px-10 py-8 mt-10 border-t border-slate-50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black">
              <Heart size={14} fill={post.likedByMe ? 'currentColor' : 'none'} className={clsx(post.likedByMe && "animate-pulse")} />
              {post.likeCount ?? 0}
            </div>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-slate-500 text-[10px] font-black hover:bg-white hover:border-blue-600/30 transition-all"
            >
              <MessageSquare size={14} />
              {post.commentCount ?? 0}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-slate-500 text-[10px] font-black">
              <Repeat size={14} />
              {post.repostCount ?? 0}
            </div>
          </div>

          <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-slate-900 hover:text-white transition-all active:scale-90">
            <Share2 size={18} />
          </button>
        </div>

        {/* HUD Action Grid */}
        <div className="grid grid-cols-4 gap-4">
          <PostActionBtn onClick={() => onLike(post.id)} active={post.likedByMe} icon={<Heart size={20} />} label="SIGNAL" />
          <PostActionBtn onClick={() => toggleComments(post.id)} icon={<MessageSquare size={20} />} label="ECHO" />
          <PostActionBtn onClick={() => onRepost(post.id)} icon={<Repeat size={20} />} label="BRIDGE" />
          <PostActionBtn icon={<SendHorizontal size={20} />} label="SEND" />
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
        "flex flex-col items-center gap-3 py-6 rounded-[2rem] transition-all relative overflow-hidden group/btn",
        active
          ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
          : "bg-slate-50 text-slate-400 hover:bg-white hover:shadow-2xl hover:text-blue-600 border border-transparent hover:border-blue-500/10"
      )}
    >
      <span className="scale-100 group-hover/btn:scale-125 transition-transform duration-500">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest opacity-60 group-hover/btn:opacity-100">{label}</span>
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
    <div className="border-t border-slate-50 px-10 py-12 bg-slate-50/30">
      {/* HUD Input */}
      <div className="flex gap-6 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
          {myProfile?.photoUrl ? (
            <img src={myProfile.photoUrl} alt="Me" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-black text-blue-600 italic">M</span>
          )}
        </div>
        <div className="flex-1 flex items-center bg-white rounded-[1.5rem] border border-slate-100 shadow-xl overflow-hidden focus-within:border-blue-500/50 transition-all pr-4">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Log an echo to this transmission..."
            className="flex-1 px-8 py-5 text-sm font-bold outline-none bg-transparent placeholder:text-slate-300 font-sans"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || addCommentMutation.isPending}
            className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-20 transition-all active:scale-90"
          >
            <SendHorizontal size={18} />
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
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] text-center italic">SILENT NODE.</p>
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
      <Link href={`/pages/profile/${comment.userId}`} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm hover:scale-110 transition-transform">
        {profile?.photoUrl ? (
          <img src={profile.photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-black text-slate-400 italic">{initial}</span>
        )}
      </Link>
      <div className="bg-white border border-slate-100 shadow-xl rounded-[2rem] rounded-tl-none px-8 py-6 flex-1 relative">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/pages/profile/${comment.userId}`} className="text-xs font-black text-slate-900 hover:text-blue-600 uppercase italic tracking-tighter">
            {name}
          </Link>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm font-bold text-slate-500 leading-normal italic opacity-90">“{comment.content}”</p>
      </div>
    </div>
  );
}
