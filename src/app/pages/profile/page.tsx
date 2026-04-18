"use client"

import { useEffect, useState } from 'react';
import { getToken, getUserIdFromToken, axiosRequest } from '@/src/store/authStore';
import type { Profile } from '@/src/app/types/profile';
import type { Post } from '@/src/app/types/post';
import Link from 'next/link';
import { 
  Camera, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Edit3, 
  Plus, 
  ExternalLink, 
  FileText, 
  Heart, 
  MessageSquare, 
  Share2, 
  Settings,
  MoreHorizontal,
  Mail,
  // Linkedin,
  // Github,
  Award,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  X
} from 'lucide-react';
import { clsx } from "clsx";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [noProfile, setNoProfile] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Edit form
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    about: '',
    location: '',
    photoUrl: '',
    backgroundPhotoUrl: '',
    birthDate: '',
  });
  const [saving, setSaving] = useState(false);

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axiosRequest.get(`/Profile/by-user/${userId}`);
      const p = res.data.data;
      setProfile(p);
      setForm({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        headline: p.headline || '',
        about: p.about || '',
        location: p.location || '',
        photoUrl: p.photoUrl || '',
        backgroundPhotoUrl: p.backgroundPhotoUrl || '',
        birthDate: p.birthDate ? p.birthDate.split('T')[0] : '',
      });
      setNoProfile(false);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        setNoProfile(true);
      }
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

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      if (noProfile || !profile) {
        // CREATE profile
        await axiosRequest.post('/Profile', {
          userId,
          firstName: form.firstName,
          lastName: form.lastName,
          headline: form.headline,
          about: form.about,
          location: form.location,
          photoUrl: form.photoUrl,
          backgroundPhotoUrl: form.backgroundPhotoUrl,
          birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : new Date().toISOString(),
        });
      } else {
        // UPDATE profile
        await axiosRequest.put(`/Profile/${profile.id}`, {
          id: profile.id,
          firstName: form.firstName,
          lastName: form.lastName,
          headline: form.headline,
          about: form.about,
          location: form.location,
          photoUrl: form.photoUrl,
          backgroundPhotoUrl: form.backgroundPhotoUrl,
        });
      }
      setEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
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

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center max-w-md backdrop-blur-2xl">
          <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-500">
             <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Security Access Required</h2>
          <p className="text-white/40 mb-8 font-medium">Please authenticate within the neural grid to access private profiles.</p>
          <Link href="/pages/login" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest">
            Authenticate
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs">Synchronizing Neural Profile...</p>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-600/30 overflow-hidden relative pb-32">
            
            {/* ── AMBIENT HUD ELEMENTS ── */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/5 blur-[100px] rounded-full"></div>
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
            </div>

            {/* ── CINEMATIC BANNER ── */}
            <section className="relative h-[350px] md:h-[450px] overflow-hidden">
                <div className="absolute inset-0">
                    {profile?.backgroundPhotoUrl ? (
                        <img src={profile.backgroundPhotoUrl} className="w-full h-full object-cover opacity-40 scale-105 group-hover:scale-100 transition-transform duration-1000" alt="Banner" />
                    ) : (
                        <div className="w-full h-full bg-slate-900 bg-[radial-gradient(circle_at_50%_0%,rgba(30,58,138,0.4),transparent_70%)]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/60 to-[#020617]"></div>
                </div>

                <div className="container mx-auto px-6 h-full relative">
                    <div className="absolute top-10 right-10 flex gap-4">
                        <button 
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all backdrop-blur-xl group"
                        >
                            <Camera size={14} className="group-hover:scale-110 transition-transform" />
                            Update Atmosphere
                        </button>
                    </div>
                </div>
            </section>

            {/* ── CORE PROFILE INTERFACE ── */}
            <main className="container mx-auto px-6 -mt-40 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT COLUMN: IDENTITY & ARCHIVE */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* Primary Identity Module */}
                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 md:p-14 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                                {/* Technical Avatar HUD */}
                                <div className="relative group/avatar">
                                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-[3rem] p-1.5 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 shadow-[0_0_80px_rgba(37,99,235,0.25)]">
                                        <div className="w-full h-full rounded-[2.8rem] bg-slate-900 overflow-hidden relative">
                                            {profile?.photoUrl ? (
                                                <img src={profile.photoUrl} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-1000" alt="Avatar" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-6xl font-black text-white/10 uppercase tracking-tighter italic">
                                                    {(profile?.firstName?.[0] || 'U')}
                                                </div>
                                            )}
                                            {/* HUD Overlay */}
                                            <div className="absolute inset-0 border-[10px] border-slate-900/50 pointer-events-none rounded-[2.8rem]"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/50 border-8 border-[#020617] group-hover/avatar:scale-110 transition-all">
                                        <Zap size={24} className="fill-white" />
                                    </div>
                                </div>

                                {/* Identity Data */}
                                <div className="flex-1 text-center md:text-left pt-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">
                                            {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : `OPERATOR_${userId}`}
                                        </h1>
                                        <div className="flex items-center justify-center md:justify-start">
                                            <span className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black rounded-full uppercase tracking-[0.2em] flex items-center gap-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                                Active_Sync
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-2xl md:text-3xl text-white/40 font-bold mb-10 leading-relaxed italic tracking-tight text-balance">
                                        “{profile?.headline || 'Initializing strategic neural interface...'}”
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-10 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                                        <span className="flex items-center gap-3"><MapPin size={16} className="text-blue-500" /> {profile?.location || 'GRID_NULL'}</span>
                                        <span className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group/link">
                                            <Globe size={16} className="text-blue-500 group-hover/link:rotate-12 transition-transform" /> 
                                            NETWORK_ID: {userId}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Operational HUD */}
                            <div className="flex flex-wrap items-center gap-6 mt-16 pt-12 border-t border-white/5">
                                <button onClick={() => setEditing(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all active:scale-95 shadow-2xl shadow-white/5 group">
                                    <Edit3 size={18} className="group-hover:rotate-12 transition-transform" /> UPDATE_PROTOCOLS
                                </button>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all">
                                    <Settings size={18} /> PREFERENCES
                                </button>
                                <button className="w-16 h-16 bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white rounded-[1.8rem] flex items-center justify-center transition-all ml-auto">
                                    <MoreHorizontal size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Manifesto Module */}
                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 md:p-16 backdrop-blur-3xl relative overflow-hidden group">
                           <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                           
                           <div className="flex items-center justify-between mb-12">
                              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-6 leading-none">
                                <div className="w-14 h-14 bg-blue-600/10 rounded-[1.2rem] flex items-center justify-center border border-blue-500/20 text-blue-500">
                                    <FileText size={28} strokeWidth={2.5} />
                                </div>
                                THE MANIFESTO
                              </h2>
                              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">LAST_UPDATE: {profile?.id ? 'SYNCED' : 'INITIAL'}</div>
                           </div>
                           
                           <p className="text-2xl md:text-3xl text-white/60 leading-relaxed italic font-medium whitespace-pre-wrap text-balance">
                              {profile?.about || 'Synchronize your professional manifesto. Define your operational goals and structural impact within the elite neural grid.'}
                           </p>
                           
                           {/* Performance Grid */}
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                              <StatCard label="Deployments" value={posts.length.toString()} color="blue" />
                              <StatCard label="Neural_Rank" value="#12" color="indigo" />
                              <StatCard label="Skill_Quotient" value="98%" color="emerald" />
                              <StatCard label="Grid_Authority" value="Level 4" color="amber" />
                           </div>
                        </div>

                        {/* Activity Archive */}
                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 md:p-16 backdrop-blur-3xl">
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                            <div>
                               <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">ACTIVITY_FEED</h2>
                               <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mt-4">STREAMING {posts.length} NEURAL UPDATES</p>
                            </div>
                            <button className="flex items-center gap-4 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] group">
                               <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> NEW_LOG_ENTRY
                            </button>
                          </div>

                          {posts.length === 0 ? (
                            <div className="py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5">
                               <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white/10 border border-white/10">
                                  <Zap size={40} />
                               </div>
                               <p className="text-white/20 font-black uppercase tracking-[0.4em] text-sm italic italic">Frequency Quiescent: No logs detected.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {(showAllPosts ? posts : posts.slice(0, 4)).map(post => (
                                <div key={post.id} className="group flex flex-col md:flex-row gap-10 p-8 rounded-[3rem] bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden">
                                  <div className="w-full md:w-40 h-40 rounded-[2.2rem] overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10 relative">
                                    {post.imageUrl ? (
                                      <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Archive" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-white/5">
                                         <FileText size={48} />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-4">
                                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{timeAgo(post.createdAt)} IN_GRID</span>
                                      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                         <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"><Heart size={16} /></button>
                                         <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"><Share2 size={16} /></button>
                                      </div>
                                    </div>
                                    <p className="text-xl text-white/60 font-medium leading-relaxed italic mb-8 group-hover:text-white transition-colors">{post.content}</p>
                                    <div className="flex items-center gap-10">
                                       <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                                          <Heart size={14} className="fill-blue-500" /> {post.likeCount ?? 0} Echoes
                                       </span>
                                       <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                                          <MessageSquare size={14} /> {post.repostCount ?? 0} Response_Threads
                                       </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {posts.length > 4 && (
                                <button
                                  onClick={() => setShowAllPosts(!showAllPosts)}
                                  className="w-full text-center py-10 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all hover:bg-white/5 rounded-[2.5rem] mt-4"
                                >
                                  {showAllPosts ? '↑ Terminate Stream' : `↓ Access Full Archive (${posts.length})`}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: TECHNICAL TELEMETRY */}
                    <div className="lg:col-span-4 space-y-10">
                        
                        {/* Professional DNA HUD */}
                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-3xl relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                           
                           <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] italic mb-10 flex items-center gap-4">
                              <Award size={24} className="text-amber-500" /> PROFESSIONAL_DNA
                           </h3>
                           
                           <div className="space-y-8">
                              <SidebarItem label="Network_Status" value="High_Integrity" active />
                              <SidebarItem label="Cycle_Registry" value="8+ Cycles" />
                              <SidebarItem label="Sector_Link" value={profile?.location?.split(',')[0] || 'GRID_NODE'} />
                              <SidebarItem label="Avail_Protocol" value="PRIORITY_OPS" />
                           </div>
                           
                           <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">CONNECT_SERVICES</span>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-blue-500 hover:border-blue-500/50 transition-all cursor-pointer"><Globe size={18}/></div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-blue-500 hover:border-blue-500/50 transition-all cursor-pointer"><Mail size={18}/></div>
                                </div>
                              </div>
                              <button className="w-full py-5 border-2 border-white/5 hover:border-blue-500/50 text-white/20 hover:text-blue-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl italic">
                                DOWNLOAD_CREDENTIALS.PDF
                              </button>
                           </div>
                        </div>

                        {/* Neural Opportunity Module */}
                        <div className="bg-blue-600 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)]">
                           <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                           <div className="relative z-10">
                              <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center mb-10 backdrop-blur-md border border-white/20">
                                 <Zap size={32} className="text-white fill-white" />
                              </div>
                              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-6 leading-none">NEURAL MATCH BOOST</h3>
                              <p className="text-white/80 text-lg font-medium leading-relaxed mb-12 italic text-balance">
                                 "Identify 14 strategic alignments within the grid based on your professional signature."
                              </p>
                              <Link href="/pages/jobs" className="flex items-center justify-between group/btn bg-white text-slate-950 px-10 py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-2xl">
                                 ACCESS_ALIGNS <ExternalLink size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                              </Link>
                           </div>
                        </div>

                        {/* Grid Pulse HUD */}
                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-3xl border-l-blue-500/50">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-6">GRID_PULSE_REALTIME_HUD</p>
                            <div className="h-20 flex items-end gap-1 px-2">
                                {[0.3, 0.7, 0.4, 0.9, 0.5, 0.8, 0.2, 0.6, 0.4, 0.7, 0.3, 0.5, 0.8, 0.4, 0.9, 0.6].map((h, i) => (
                                    <div key={i} className="flex-1 bg-blue-600/30 rounded-t-sm" style={{ height: `${h * 100}%` }}></div>
                                ))}
                            </div>
                            <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-500 italic">
                                <span>Signal_Integrity</span>
                                <span>100%_Locked</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* SYNC MODAL */}
            {editing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-6" onClick={() => setEditing(false)}>
                    <div className="bg-slate-900 border border-white/10 rounded-[4rem] w-full max-w-2xl max-h-full overflow-y-auto shadow-[0_80px_150px_rgba(0,0,0,0.9)] scale-in-center animate-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-12 border-b border-white/5 sticky top-0 bg-slate-900 z-10">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">NEURAL_SYNC_MODE</h2>
                            <button onClick={() => setEditing(false)} className="w-14 h-14 rounded-[1.5rem] bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all transform active:scale-95">
                                <X size={28} />
                            </button>
                        </div>

                        <div className="p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormGroup label="Identity_01 [FIRST]" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} placeholder="Alex" />
                                <FormGroup label="Identity_02 [LAST]" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} placeholder="Sterling" />
                            </div>

                            <FormGroup label="NEURAL_SIGNATURE_HEADLINE" value={form.headline} onChange={v => setForm({ ...form, headline: v })} placeholder="e.g. Senior Architect at Neural Corp" />
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-6 italic">MANIFESTO_DATA</label>
                                <textarea
                                    value={form.about}
                                    onChange={e => setForm({ ...form, about: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white text-lg font-medium outline-none focus:border-blue-500/50 transition-all min-h-[200px] resize-none italic leading-relaxed placeholder:text-white/5"
                                    placeholder="Tell the grid your story..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormGroup label="GEOGRAPHIC_NODE" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="San Francisco, CA" icon={<MapPin size={16}/>} />
                                <FormGroup label="ORIGINATION_DATE" value={form.birthDate} onChange={v => setForm({ ...form, birthDate: v })} type="date" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <FormGroup label="AVATAR_SIGNAL_URL" value={form.photoUrl} onChange={v => setForm({ ...form, photoUrl: v })} placeholder="https://..." />
                                 <FormGroup label="ATMOSPHERE_SIGNAL_URL" value={form.backgroundPhotoUrl} onChange={v => setForm({ ...form, backgroundPhotoUrl: v })} placeholder="https://..." />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-6 p-12 border-t border-white/5 sticky bottom-0 bg-slate-900">
                            <button onClick={() => setEditing(false)} className="px-10 py-5 text-xs font-black text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all italic">
                                ABORT_LINK
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.firstName.trim() || !form.lastName.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] disabled:opacity-50 transition-all shadow-2xl shadow-blue-600/30 italic active:scale-95"
                            >
                                {saving ? 'SYNCING...' : 'COMMIT_CHANGES'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: string, color: 'blue' | 'indigo' | 'emerald' | 'amber' }) {
    const colors = {
        blue: "text-blue-500",
        indigo: "text-indigo-400",
        emerald: "text-emerald-400",
        amber: "text-amber-400"
    };
    const bgs = {
        blue: "bg-blue-500/10",
        indigo: "bg-indigo-500/10",
        emerald: "bg-emerald-500/10",
        amber: "bg-amber-500/10"
    };
    return (
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 text-center group hover:bg-white/[0.08] transition-all hover:-translate-y-2">
           <p className="text-3xl md:text-4xl font-black text-white italic tracking-tighter mb-2 leading-none">{value}</p>
           <div className={clsx("inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-1", bgs[color], colors[color])}>
                {label}
           </div>
        </div>
    );
}

function SidebarItem({ label, value, active }: { label: string, value: string, active?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-6">
           <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">{label}</span>
           <span className={clsx("text-xs font-black uppercase tracking-widest font-mono italic leading-none", active ? "text-blue-500" : "text-white/60")}>{value}</span>
        </div>
    );
}

function FormGroup({ label, value, onChange, placeholder, type = "text", icon }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string, icon?: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] ml-8 italic leading-none">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10">{icon}</div>}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={clsx(
                        "w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 text-white text-base font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-white/5 italic",
                        icon ? "pl-16 pr-8" : "px-8"
                    )}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}
