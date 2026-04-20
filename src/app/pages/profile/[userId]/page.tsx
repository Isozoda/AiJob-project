"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getToken, axiosRequest, getUserIdFromToken } from '@/src/store/authStore';
import { useSendConnection, useAllConnections } from '@/src/app/hooks/useConnection';
import type { Profile } from '@/src/app/types/profile';
import type { Post } from '@/src/app/types/post';
import type { Connection } from '@/src/app/types/connection';
import Link from 'next/link';
import {
  Camera,
  MapPin,
  Briefcase,
  Calendar,
  MessageSquare,
  Share2,
  UserPlus,
  UserCheck,
  Clock,
  MoreHorizontal,
  Mail,
  Award,
  Zap,
  Loader2,
  ChevronLeft,
  FileText,
  Heart,
  Globe,
  ExternalLink
} from 'lucide-react';
import { clsx } from "clsx";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.userId);
  const currentUserId = getUserIdFromToken();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const sendConnectionMutation = useSendConnection();
  const { data: allConnections } = useAllConnections();

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axiosRequest.get(`/Profile/by-user/${userId}`);
      setProfile(res.data.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axiosRequest.get('/Post');
      const all = res.data.data;
      if (Array.isArray(all)) {
        setPosts(all.filter((p: Post) => p.userId === userId));
      }
    } catch (err) {
      console.error("Failed to load user posts", err);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs">Accessing Neural Identity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pb-20 selection:bg-blue-500/30">

      {/* ── CINEMATIC HEADER ── */}
      <section className="relative h-[300px] md:h-[350px] overflow-hidden">
        <div className="absolute inset-0">
          {profile?.backgroundPhotoUrl ? (
            <img src={profile.backgroundPhotoUrl} className="w-full h-full object-cover opacity-60" alt="Banner" />
          ) : (
            <div className="w-full h-full bg-slate-900 bg-[radial-gradient(circle_at_50%_0%,rgba(30,58,138,0.25),transparent_70%)]"></div>
          )}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617]"></div>
        </div>

        <div className="container mx-auto px-6 h-full relative">
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all group px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/5"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Grid
          </button>
        </div>
      </section>

      {/* ── PROFILE CONTENT ── */}
      <main className="container mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-8 space-y-8">

            {/* Primary Profile Card */}
            <div className="bg-white/5 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-600/20 transition-all duration-1000"></div>

              <div className="flex flex-col md:flex-row items-end md:items-start gap-8 relative z-10">
                {/* Avatar */}
                <div className="relative group/avatar">
                  <div className="w-40 h-40 md:w-44 md:h-44 rounded-[2.5rem] p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                    <div className="w-full h-full rounded-[2rem] bg-slate-900 overflow-hidden relative">
                      {profile?.photoUrl ? (
                        <img src={profile.photoUrl} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" alt="Avatar" />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-5xl font-black text-white/20 uppercase tracking-tighter italic">
                          {(profile?.firstName?.[0] || 'U')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/40 border-4 border-slate-950">
                    <Zap size={18} />
                  </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 text-center md:text-left pt-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
                      {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : `Identity #${userId}`}
                    </h1>
                  </div>
                  <p className="text-lg text-white/60 font-medium mb-6 leading-tight max-w-xl italic">
                    {profile?.headline || 'Neural Grid Member'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> {profile?.location || 'Grid Sector Unknown'}</span>
                    <span className="flex items-center gap-2"><Calendar size={14} /> Synced Recently</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-4 mt-12 pt-10 border-t border-white/5">
                {(() => {
                  const existingConnection = allConnections?.find(
                    (c: Connection) =>
                      (c.requesterId === currentUserId && c.addresseeId === userId) ||
                      (c.addresseeId === currentUserId && c.requesterId === userId)
                  );

                  if (existingConnection?.status === 'Accepted') {
                    return (
                      <>
                        <div className="flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-blue-500/20 text-blue-400 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/5">
                          <UserCheck size={16} /> Signal Synchronized
                        </div>
                        <button
                          onClick={() => router.push('/pages/message')}
                          className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                        >
                          <MessageSquare size={16} /> Establish Link
                        </button>
                      </>
                    );
                  }

                  if (existingConnection?.status === 'Pending') {
                    return (
                      <div className="flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-amber-500/20 text-amber-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                        <Clock size={16} /> Syncing Frequency...
                      </div>
                    );
                  }

                  return (
                    <button
                      onClick={() => sendConnectionMutation.mutate(userId)}
                      disabled={sendConnectionMutation.isPending}
                      className="flex items-center gap-3 px-10 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-xl shadow-white/5 disabled:opacity-50"
                    >
                      {sendConnectionMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                      Connect To Signal
                    </button>
                  );
                })()}

                <button className="flex items-center gap-3 px-8 py-3.5 glass-button bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                  <Share2 size={16} /> Share ID
                </button>
                <button className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl transition-all ml-auto">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* About / Manifesto Section */}
            {profile?.about && (
              <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 md:p-12 backdrop-blur-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight italic flex items-center gap-4">
                    <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 text-blue-500"><FileText size={18} /></div>
                    Identity Manifesto
                  </h2>
                </div>
                <p className="text-lg text-white/60 leading-relaxed italic font-medium whitespace-pre-wrap">
                  {profile.about}
                </p>
              </div>
            )}

            {/* Activity Hub */}
            <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 md:p-12 backdrop-blur-3xl transition-all">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Signal Activity</h2>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{posts.length} Neural Updates Detected</p>
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 opacity-40">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white/30 border border-white/5">
                    <Zap size={32} />
                  </div>
                  <p className="text-white/40 font-black uppercase tracking-[0.2em] text-xs font-mono">Quiescent Frequency</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(showAllPosts ? posts : posts.slice(0, 4)).map(post => (
                    <div key={post.id} className="group flex flex-col md:flex-row gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer">
                      <div className="w-full md:w-32 h-32 rounded-[1.8rem] overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5">
                        {post.imageUrl ? (
                          <img src={post.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="Post" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10">
                            <FileText size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">{timeAgo(post.createdAt)} in archive</span>
                          <div className="flex items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart size={14} className="text-white/40 hover:text-blue-500" />
                            <Share2 size={14} className="text-white/40 hover:text-white" />
                          </div>
                        </div>
                        <p className="text-white/70 font-medium leading-relaxed italic line-clamp-3 mb-4 group-hover:text-white transition-colors">{post.content}</p>
                        <div className="flex items-center gap-6">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 italic">
                            <Heart size={12} className="fill-blue-500" /> {post.likeCount ?? 0} Echoes
                          </span>
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2 italic">
                            <MessageSquare size={12} /> {post.repostCount ?? 0} Threads
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {posts.length > 4 && (
                    <button
                      onClick={() => setShowAllPosts(!showAllPosts)}
                      className="w-full text-center py-6 text-xs font-black text-white/20 hover:text-white uppercase tracking-[0.3em] transition-all"
                    >
                      {showAllPosts ? '↑ Collapse Signal Archive' : `↓ Decode Full History (${posts.length})`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Cards */}
          <div className="lg:col-span-4 space-y-8">

            {/* Neural Profile DNA */}
            <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl border-t-white/10 relative overflow-hidden group">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full"></div>
              <h3 className="text-lg font-black text-white uppercase tracking-[0.1em] italic mb-8 flex items-center gap-3 relative z-10">
                <Award size={20} className="text-blue-500" /> Signal DNA
              </h3>
              <div className="space-y-6 relative z-10">
                <SidebarItem label="Status" value="Synchronized" active />
                <SidebarItem label="Activity Level" value={posts.length > 5 ? 'High Intensity' : 'Standard'} />
                <SidebarItem label="Integrity" value="Verified Member" />
                <SidebarItem label="Grid Sector" value={profile?.location?.split(',')[0] || 'Unknown'} />
              </div>

              <div className="mt-10 pt-10 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-white/40 hover:text-blue-500 transition-all cursor-pointer"><Globe size={18} /></div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-white/40 hover:text-blue-500 transition-all cursor-pointer"><Mail size={18} /></div>
                </div>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">
                  View Verified Matrix
                </button>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Neural Proximity</h3>
                <p className="text-white/80 text-sm font-medium leading-relaxed mb-8 italic">
                  Your professional DNA matches 82% of this user's current project portfolio.
                </p>
                <button className="flex items-center justify-between w-full group/btn bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                  Compare Synapse <ExternalLink size={16} className="group-hover/btn:translate-6 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ label, value, active }: { label: string, value: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</span>
      <span className={clsx("text-[11px] font-black uppercase tracking-widest font-mono italic whitespace-nowrap", active ? "text-blue-500" : "text-white/80")}>{value}</span>
    </div>
  );
}
