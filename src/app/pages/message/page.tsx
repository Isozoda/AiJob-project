"use client"

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, axiosRequest, getUserIdFromToken } from '@/src/store/authStore';
import type { Profile } from '@/src/app/types/profile';
import type { Message } from '@/src/app/types/message';
import type { Connection } from '@/src/app/types/connection';
import type { Conversation } from '@/src/app/types/conversation';
import { createConversation, getMyConversations } from '@/src/app/services/conversationService';
import Link from 'next/link';
import { 
  Send, 
  Smile, 
  Sticker, 
  MoreHorizontal, 
  Trash2, 
  User, 
  Search, 
  Plus, 
  X, 
  Loader2, 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  ChevronLeft,
  Circle,
  ExternalLink,
  Settings,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react';
import { clsx } from "clsx";

// ─── Emoji Data ────────────────────────────────────────────
const EMOJI_LIST = ['😊','😂','❤️','👍','🔥','😍','🎉','👋','🤔','😎','💯','✅','🚀','⭐','💪','🙏','😢','😡','🥰','😘','🤗','🤩','😇','🤝','👏','💼','📈','🎯','💡','⚡'];
const STICKER_LIST = ['🎨','🌈','🦄','🐱','🐶','🌸','🌺','🍕','🎸','🎮','🏆','🎁','🎭','🎪','🌍','🏄','🎵','📸','☕','🍩'];

type SearchUser = {
  userId: number;
  firstName: string;
  lastName: string;
  headline: string;
  photoUrl: string;
};

export default function MessagesPage() {
  const currentUserId = getUserIdFromToken();
  const router = useRouter();

  // ── State ──
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loadingConns, setLoadingConns] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [activeConnId, setActiveConnId] = useState<number | null>(null);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [openedUserIds, setOpenedUserIds] = useState<number[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [sendingConnect, setSendingConnect] = useState<number | null>(null);

  const [profiles, setProfiles] = useState<Record<number, Profile>>({});

  const [showEmoji, setShowEmoji] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastScrollId = useRef<number | null>(null);

  // ── Helpers ──
  const fetchConversations = useCallback(async () => {
    try {
      const d = await getMyConversations();
      setConversations(Array.isArray(d) ? d : []);
    } catch { setConversations([]); }
  }, []);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await axiosRequest.get('/Connection/all');
      const d = res.data.data ?? res.data ?? [];
      setConnections(Array.isArray(d) ? d : []);
    } catch { setConnections([]); }
    finally { setLoadingConns(false); }
  }, []);

  const fetchProfile = useCallback(async (uid: number) => {
    if (profiles[uid]) return;
    try {
      const res = await axiosRequest.get(`/Profile/by-user/${uid}`);
      const p = res.data.data;
      if (p) setProfiles(prev => ({ ...prev, [uid]: p }));
    } catch {}
  }, [profiles]);

  const fetchMessages = useCallback(async (connId: number) => {
    try {
      const res = await axiosRequest.get(`/Message/by-conversation/${connId}`);
      const d = res.data.data ?? res.data ?? [];
      setMessages(Array.isArray(d) ? d : []);
    } catch { setMessages([]); }
  }, []);

  const getConnForUser = (uid: number) => {
    if (!connections) return null;
    return connections.find(c =>
      (c.requesterId === currentUserId && c.addresseeId === uid) ||
      (c.addresseeId === currentUserId && c.requesterId === uid)
    );
  };

  // ── Init ──
  useEffect(() => {
    if (!currentUserId) return;
    fetchConversations();
    fetchConnections();
    
    // Restore active user from localStorage
    const saved = localStorage.getItem('chat_activeUserId');
    if (saved) {
      const uid = parseInt(saved, 10);
      setActiveUserId(uid);
      fetchProfile(uid);
    }

    // Restore opened user list
    try {
      const savedOpened = localStorage.getItem('chat_openedUserIds');
      if (savedOpened) {
        const ids = JSON.parse(savedOpened);
        setOpenedUserIds(ids);
        ids.forEach((id: number) => fetchProfile(id));
      }
    } catch {}
  }, [currentUserId, fetchConversations, fetchProfile]);

  useEffect(() => {
    conversations.forEach(c => {
      const other = c.user1Id === currentUserId ? c.user2Id : c.user1Id;
      fetchProfile(other);
    });
    
    // Auto-set the active connection if we have an active user restored
    if (activeUserId) {
      localStorage.setItem('chat_activeUserId', activeUserId.toString());
      const conv = conversations.find(c => 
        (c.user1Id === currentUserId && c.user2Id === activeUserId) ||
        (c.user2Id === currentUserId && c.user1Id === activeUserId)
      );
      if (conv) setActiveConnId(conv.id);
    } else {
      localStorage.removeItem('chat_activeUserId');
    }
  }, [conversations, currentUserId, activeUserId, fetchProfile]);

  // ── Load all users for search ──
  const loadAllUsers = useCallback(async () => {
    if (allUsers.length > 0) return;
    setLoadingSearch(true);
    try {
      const res = await axiosRequest.get('/Post');
      const posts = (res.data.data ?? []) as any[];
      const ids = [...new Set(posts.map((p: any) => p.userId as number))].filter((uid): uid is number => typeof uid === 'number' && uid !== currentUserId);
      const users = await Promise.all(
        ids.map(async (uid) => {
          try {
            const r = await axiosRequest.get(`/Profile/by-user/${uid}`);
            const p = r.data.data;
            if (p) {
              setProfiles(prev => ({ ...prev, [uid]: p }));
              return { userId: uid, firstName: p.firstName || '', lastName: p.lastName || '', headline: p.headline || '', photoUrl: p.photoUrl || '' };
            }
          } catch {}
          return { userId: uid, firstName: 'User', lastName: `#${uid}`, headline: 'AiJob Member', photoUrl: '' };
        })
      );
      setAllUsers(users);
    } catch { setAllUsers([]); }
    finally { setLoadingSearch(false); }
  }, [currentUserId, allUsers.length]);

  // ── Search filter ──
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults(allUsers.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.headline.toLowerCase().includes(q) ||
      `${u.userId}`.includes(q)
    ));
  }, [searchQuery, allUsers]);

  // ── Poll messages ──
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (activeConnId) {
      setLoadingMsgs(true);
      fetchMessages(activeConnId).finally(() => setLoadingMsgs(false));
      pollRef.current = setInterval(() => fetchMessages(activeConnId), 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeConnId]);

  useEffect(() => {
    if (messages.length > 0) {
      const area = scrollAreaRef.current;
      if (area) {
        if (lastScrollId.current !== activeConnId) {
          area.scrollTop = area.scrollHeight;
          lastScrollId.current = activeConnId;
        } else {
          const isNearBottom = area.scrollHeight - area.scrollTop - area.clientHeight < 250;
          if (isNearBottom) {
             area.scrollTo({ top: area.scrollHeight, behavior: 'smooth' });
          }
        }
      }
    }
  }, [messages, activeConnId]);

  const [isOtherTyping, setIsOtherTyping] = useState(false);

  // ── Actions ──
  const addOpenedUser = (uid: number) => {
    setOpenedUserIds(prev => {
      if (prev[0] === uid) return prev;
      const next = [uid, ...prev.filter(id => id !== uid)];
      localStorage.setItem('chat_openedUserIds', JSON.stringify(next));
      return next;
    });
  };

  const openChat = (conv: Conversation) => {
    const other = conv.user1Id === currentUserId ? conv.user2Id : conv.user1Id;
    setActiveConnId(conv.id);
    setActiveUserId(other);
    setSearchQuery('');
    setShowEmoji(false);
    setShowStickers(false);
    fetchProfile(other);
    addOpenedUser(other);
  };

  const openChatForUser = async (uid: number) => {
    setSearchQuery('');
    try {
      const conv = await createConversation(uid);
      if (conv) {
        setActiveConnId(conv.id);
        setActiveUserId(uid);
        fetchConversations();
      }
    } catch {
      setActiveUserId(uid);
      setActiveConnId(null);
    }
    setShowEmoji(false);
    setShowStickers(false);
    fetchProfile(uid);
    addOpenedUser(uid);
  };

  const handleSend = async () => {
    if (!messageText.trim() || !activeConnId) return;
    const text = messageText;
    setSendingMsg(true);
    try {
      await axiosRequest.post('/Message', { conversationId: activeConnId, content: text });
      setMessageText('');
      setShowEmoji(false);
      setShowStickers(false);
      await fetchMessages(activeConnId);
      
      setTimeout(() => {
        setIsOtherTyping(true);
        setTimeout(() => setIsOtherTyping(false), 5000);
      }, 500);

    } catch (err) { console.error('Send failed', err); }
    finally { setSendingMsg(false); inputRef.current?.focus(); }
  };

  const handleConnect = async (uid: number) => {
    setSendingConnect(uid);
    try {
      await axiosRequest.post(`/Connection/send/${uid}`);
      await createConversation(uid);
      await fetchConversations();
    } catch (err) { console.error('Connect failed', err); }
    finally { setSendingConnect(null); }
  };

  const insertEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const sendSticker = async (sticker: string) => {
    if (!activeConnId) return;
    try {
      await axiosRequest.post('/Message', { conversationId: activeConnId, content: sticker });
      setShowStickers(false);
      await fetchMessages(activeConnId);
    } catch {}
  };

  const handleDelete = async (msgId: number) => {
    if (!activeConnId) return;
    try {
      await axiosRequest.delete(`/Message/${msgId}`);
      await fetchMessages(activeConnId);
    } catch {}
  };

  const displayUserIds = Array.from(new Set([
    ...openedUserIds,
    ...conversations.map(c => c.user1Id === currentUserId ? c.user2Id : c.user1Id)
  ])).slice(0, 15);

  const activeProfile = activeUserId ? profiles[activeUserId] : null;
  const activeName = activeProfile ? `${activeProfile.firstName} ${activeProfile.lastName}` : `Unit #${activeUserId}`;

  // ── Auth Guard ──
  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center max-w-md backdrop-blur-2xl">
          <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-500">
             <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Access Protocol Required</h2>
          <p className="text-white/40 mb-8 font-medium">Please authenticate within the neural grid to access decrypted communication channels.</p>
          <Link href="/pages/login" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest">
            Authenticate
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#020617] pt-4 pb-4 selection:bg-blue-500/30">
      <div className="max-w-[90%] mx-auto px-4 h-full">
        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden flex" style={{ height: 'calc(100vh - 120px)' }}>

          {/* ═══════ LEFT PANEL: CHANNELS ═══════ */}
          <div className="w-[380px] border-r border-white/5 flex flex-col relative z-20">
            {/* Header + Search */}
            <div className="p-8 border-b border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Messages</h2>
                <button 
                  onClick={() => loadAllUsers()} 
                  className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all group" 
                  title="Search people"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="relative group">
                <input
                  type="text" value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); if (allUsers.length === 0) loadAllUsers(); }}
                  onFocus={() => { if (allUsers.length === 0) loadAllUsers(); }}
                  placeholder="SEARCH THE GRID..."
                  className="w-full pl-12 pr-6 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black tracking-widest text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 uppercase"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {searchQuery.trim() ? (
                /* ── Search Results ── */
                <div className="p-4 space-y-2">
                  <p className="px-4 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mb-4">Neural Search Results</p>
                  {loadingSearch ? (
                    <div className="p-12 text-center flex flex-col items-center gap-4">
                       <Loader2 className="animate-spin text-blue-500" size={24} />
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Scanning Grid...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <p className="p-8 text-center text-[10px] font-black text-white/20 uppercase tracking-widest">No Identities Found</p>
                  ) : (
                    searchResults.map(u => (
                      <button key={u.userId} onClick={() => openChatForUser(u.userId)}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] bg-white/5 border border-transparent hover:border-white/5 hover:bg-white/[0.08] transition-all text-left group">
                        <div className="w-12 h-12 rounded-[1rem] flex-shrink-0 overflow-hidden bg-slate-900 border border-white/10">
                          {u.photoUrl ? <img src={u.photoUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : (
                            <div className="w-full h-full flex items-center justify-center text-white/10 font-black italic">{u.firstName[0]}</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-xs text-white uppercase italic tracking-tight">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] text-white/40 truncate uppercase font-medium mt-0.5">{u.headline}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                /* ── Conversations ── */
                <div className="p-4 space-y-2">
                  {loadingConns ? (
                    [1,2,3,4].map(i => <div key={i} className="flex gap-4 p-4 animate-pulse"><div className="w-14 h-14 rounded-2xl bg-white/5 outline outline-1 outline-white/5"/><div className="flex-1 space-y-3 pt-2"><div className="h-2 bg-white/5 rounded-full w-2/3"/><div className="h-1.5 bg-white/5 rounded-full w-1/2"/></div></div>)
                  ) : displayUserIds.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                       <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/10 border border-white/5">
                          <MessageSquare size={32} />
                       </div>
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 leading-relaxed">No encrypted channels established</p>
                       <button onClick={() => loadAllUsers()} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Scan Grid</button>
                    </div>
                  ) : (
                    displayUserIds.map(uid => {
                      const conv = conversations.find(c => c.user1Id === uid || c.user2Id === uid);
                      const p = profiles[uid];
                      const active = activeUserId === uid;
                      
                      return (
                        <button key={uid} onClick={() => conv ? openChat(conv) : openChatForUser(uid)}
                          className={clsx(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-[1.8rem] transition-all relative group text-left",
                            active ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-white/[0.05] border border-transparent"
                          )}>
                          <div className="relative">
                            <div className="w-14 h-14 rounded-[1.2rem] flex-shrink-0 overflow-hidden bg-slate-900 border border-white/10 group-hover:scale-105 transition-transform">
                              {p?.photoUrl ? <img src={p.photoUrl} alt="" className="w-full h-full object-cover" /> : (
                                <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-lg italic">{p?.firstName?.[0]}</div>
                              )}
                            </div>
                            <Circle size={10} className={clsx("absolute -bottom-1 -right-1 fill-green-500 text-slate-950 stroke-[3px]", active ? "opacity-100" : "opacity-0")} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline mb-1">
                                <p className={clsx("text-xs font-black uppercase tracking-tight italic", active ? "text-blue-500" : "text-white")}>
                                  {p ? `${p.firstName} ${p.lastName}` : `Identity #${uid}`}
                                </p>
                                {conv?.lastMessageAt && (
                                  <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{(conv.lastMessageAt)}</span>
                                )}
                             </div>
                             <div className="flex justify-between items-center h-4">
                                {isOtherTyping && activeUserId === uid ? (
                                   <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest animate-pulse italic">typing interface...</span>
                                ) : (
                                  <p className="text-[10px] text-white/40 truncate font-medium max-w-[180px]">
                                    {conv?.lastMessagePreview || p?.headline || 'Channel established'}
                                  </p>
                                )}
                                {conv?.unreadCount ? (
                                  <span className="bg-red-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-lg shadow-lg shadow-red-600/20">{conv.unreadCount}</span>
                                ) : null}
                             </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ═══════ RIGHT PANEL: DECRYPTED INTERFACE ═══════ */}
          <div className="flex-1 flex flex-col relative bg-slate-950/20 overflow-hidden">
            {!activeUserId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-white relative">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                 <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 animate-pulse">
                    <Zap className="text-blue-500/20" size={48} />
                 </div>
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Select Frequency</h3>
                 <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em] max-w-sm leading-relaxed">Select an identity from the grid to establish a secure websocket handshake.</p>
              </div>
            ) : (
              <>
                {/* ── INTERFACE HEADER ── */}
                <div className="flex items-center gap-6 px-10 py-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-3xl relative z-10">
                  <Link href={`/pages/profile/${activeUserId}`} className="group relative">
                    <div className="w-14 h-14 rounded-[1.2rem] overflow-hidden bg-slate-900 border-2 border-white/10 group-hover:border-blue-500 transition-all">
                      {activeProfile?.photoUrl ? <img src={activeProfile.photoUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : (
                        <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-xl italic">{activeProfile?.firstName?.[0]}</div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/pages/profile/${activeUserId}`} className="block text-xl font-black text-white uppercase italic tracking-tighter hover:text-blue-500 transition-colors">{activeName}</Link>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{activeProfile?.headline || 'Neural Member'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex items-center justify-center">
                       <Settings size={20} />
                    </button>
                    <Link href={`/pages/profile/${activeUserId}`} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-blue-400 transition-all flex items-center justify-center">
                      <ExternalLink size={20} />
                    </Link>
                  </div>
                </div>

                {/* ── DATA STREAM Area ── */}
                {(() => {
                  const conn = getConnForUser(activeUserId!);
                  const isConnected = !!activeConnId;
                  const isPending = conn?.status === 'Pending';

                  if (!isConnected && !isPending) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]">
                        <div className="bg-slate-900/60 border border-white/5 rounded-[3rem] p-12 backdrop-blur-2xl max-w-md shadow-2xl relative group">
                          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] overflow-hidden bg-slate-900 border-2 border-white/10 shadow-2xl relative">
                            {activeProfile?.photoUrl ? <img src={activeProfile.photoUrl} alt="" className="w-full h-full object-cover" /> : (
                              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/5 italic">{activeProfile?.firstName?.[0]}</div>
                            )}
                          </div>
                          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">{activeProfile?.firstName || 'Access Identity'}</h3>
                          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-8">{activeProfile?.headline || 'Protocol Blocked'}</p>
                          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.1em] mb-10 leading-relaxed italic">"Signal handshaking required to exchange encrypted data packets."</p>
                          <button
                            onClick={() => handleConnect(activeUserId!)}
                            disabled={sendingConnect === activeUserId}
                            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                            {sendingConnect === activeUserId ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
                            Initialize Connection
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (isPending) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950/20">
                        <div className="bg-white/5 border border-white/5 rounded-[3rem] p-12 backdrop-blur-xl text-center max-w-md">
                           <Loader2 className="animate-spin text-amber-500 mx-auto mb-8" size={64} />
                           <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Signal Pending</h3>
                           <p className="text-white/40 text-xs font-medium leading-relaxed italic mb-8">
                             Your connection request is pending verification from the target identity. Synchronizing frequencies...
                           </p>
                           <button onClick={() => router.push(`/pages/profile/${activeUserId}`)} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-all flex items-center justify-center gap-2 mx-auto">
                              Investigate Identity <ExternalLink size={12} />
                           </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-10 py-10 space-y-6 scroll-smooth custom-scrollbar relative">
                        {loadingMsgs && messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
                             <Loader2 className="animate-spin text-blue-500" size={32} />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Establishing Stream...</span>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center bg-white/5 border border-white/5 rounded-[2.5rem] px-12 py-12 backdrop-blur-xl group hover:border-blue-500/20 transition-all">
                              <div className="w-16 h-16 bg-blue-600 rounded-[1.2rem] flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform italic text-2xl font-black">!</div>
                              <p className="text-lg font-black text-white uppercase italic tracking-tighter mb-2">Zero Comms Detected</p>
                              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-loose">Transmit first data packet to {activeProfile?.firstName} to begin the sequence.</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-6 py-6 opacity-20">
                              <div className="flex-1 h-px bg-white/10"></div>
                              <span className="text-[9px] text-white font-black uppercase tracking-[0.5em] italic">Stream Initiated</span>
                              <div className="flex-1 h-px bg-white/10"></div>
                            </div>
                            {messages.map((msg, idx) => {
                              const isMe = msg.senderId === currentUserId;
                              const isSticker = msg.content.length <= 2 && /\p{Emoji}/u.test(msg.content);
                              const prevMsg = idx > 0 ? messages[idx - 1] : null;
                              const isNewGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
                              
                              return (
                                <div key={msg.id} className={clsx("flex group transition-all", isMe ? "justify-end" : "justify-start", isNewGroup ? "mt-8" : "mt-1")}>
                                  <div className={clsx("max-w-[70%] flex flex-col", isMe ? "items-end" : "items-start")}>
                                    {!isMe && isNewGroup && (
                                       <div className="flex items-center gap-2 mb-2 ml-2">
                                          <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                                            {activeProfile?.photoUrl && <img src={activeProfile.photoUrl} className="w-full h-full object-cover" />}
                                          </div>
                                          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{activeProfile?.firstName}</span>
                                       </div>
                                    )}
                                    <div className="relative group/msg">
                                      {isSticker ? (
                                        <div className="text-7xl py-4 px-2 hover:scale-110 transition-transform cursor-pointer filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{msg.content}</div>
                                      ) : (
                                        <div className={clsx(
                                          "px-6 py-4 rounded-[1.8rem] text-sm font-medium italic shadow-2xl relative transition-all",
                                          isMe 
                                            ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-br-none shadow-blue-900/20" 
                                            : "bg-white/5 border border-white/10 text-white/80 rounded-bl-none backdrop-blur-xl"
                                        )}>
                                          <p className="whitespace-pre-wrap leading-relaxed tracking-wide">{msg.content}</p>
                                        </div>
                                      )}
                                      
                                      {/* Msg Actions */}
                                      <div className={clsx(
                                        "absolute top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-all duration-300",
                                        isMe ? "right-full mr-4" : "left-full ml-4"
                                      )}>
                                         <span className="text-[8px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                         </span>
                                         {isMe && (
                                           <button onClick={() => handleDelete(msg.id)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 flex items-center justify-center transition-all">
                                              <Trash2 size={12} />
                                           </button>
                                         )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}

                        {isOtherTyping && (
                          <div className="flex justify-start mt-6 ml-2">
                             <div className="bg-white/5 px-6 py-4 rounded-[1.5rem] rounded-bl-none border border-white/5 backdrop-blur-md flex items-center gap-2 min-w-[80px]">
                               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                             </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Decryption Deck (Input Area) */}
                      <div className="px-8 py-8 border-t border-white/5 bg-slate-900/40 relative z-20">
                        {/* Popovers */}
                        {(showEmoji || showStickers) && (
                           <div className="absolute bottom-full left-8 right-8 mb-4 bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom-2 duration-300">
                             <div className="flex items-center justify-between mb-4 px-2">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{showEmoji ? 'Identity Expressions' : 'Neural Grid Stickers'}</span>
                                <button onClick={() => { setShowEmoji(false); setShowStickers(false); }} className="text-white/20 hover:text-white"><X size={14}/></button>
                             </div>
                             <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                               {showEmoji ? EMOJI_LIST.map(e => (
                                 <button key={e} onClick={() => insertEmoji(e)} className="w-10 h-10 text-xl hover:bg-white/5 rounded-xl transition-all flex items-center justify-center hover:scale-125">{e}</button>
                               )) : STICKER_LIST.map(s => (
                                 <button key={s} onClick={() => sendSticker(s)} className="w-12 h-12 text-3xl hover:bg-white/5 rounded-xl transition-all flex items-center justify-center hover:scale-125">{s}</button>
                               ))}
                             </div>
                           </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
                             <button onClick={() => { setShowEmoji(!showEmoji); setShowStickers(false); }}
                               className={clsx("w-10 h-10 rounded-xl flex items-center justify-center transition-all", showEmoji ? "bg-blue-600 text-white" : "text-white/40 hover:text-white")}>
                               <Smile size={20} />
                             </button>
                             <button onClick={() => { setShowStickers(!showStickers); setShowEmoji(false); }}
                               className={clsx("w-10 h-10 rounded-xl flex items-center justify-center transition-all", showStickers ? "bg-blue-600 text-white" : "text-white/40 hover:text-white")}>
                               <Sticker size={20} />
                             </button>
                             <div className="w-px h-6 bg-white/5 mx-1" />
                             <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-white transition-all"><Paperclip size={18} /></button>
                          </div>
                          
                          <div className="flex-1 relative group">
                            <input ref={inputRef} type="text" value={messageText}
                              onChange={e => setMessageText(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                              placeholder="ENCRYPT DATA PACKET..."
                              className="w-full px-8 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 italic" />
                          </div>

                          <button onClick={handleSend} disabled={!messageText.trim() || sendingMsg}
                            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center disabled:opacity-40 transition-all shadow-xl shadow-blue-600/20 group active:scale-95">
                            {sendingMsg ? (
                              <Loader2 size={24} className="animate-spin" />
                            ) : (
                              <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
