"use client"

import { useEffect, useState } from "react";
import { Bell, Sparkles, Trash2, CheckCircle2, Filter, MoreHorizontal, ChevronLeft, Search } from "lucide-react";
import { getNotificationsByUser, markNotificationAsRead, deleteNotification } from "../../services/notificationService";
import { getUserIdFromToken } from "@/src/store/authStore";
import type { Notification } from "../../types/notification";
import Link from "next/link";
import { clsx } from "clsx";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      if (!userId) return;
      const data = await getNotificationsByUser(userId);
      setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === "unread" ? !n.isRead : true;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="animate-pulse space-y-4">
              <div className="h-10 bg-white/5 rounded-2xl w-48"></div>
              <div className="h-64 bg-white/5 rounded-[2.5rem]"></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-20 text-white selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* ── NEW PREMIUM BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Deep Gradient Base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,58,138,0.2),transparent_70%)]"></div>
        
        {/* Technical Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Dynamic Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full delay-700 animate-pulse"></div>
        
        {/* Substrate Noise/Texture (Optional but adds premium feel) */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-black uppercase tracking-[0.2em] transition-all mb-4 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Neural Nexus
            </Link>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
              Interface <span className="text-blue-500 block md:inline">Archive</span>
            </h1>
            <p className="text-white/40 text-sm mt-4 font-medium max-w-md uppercase tracking-widest italic">
              Synchronizing all system updates and personal matches within the neural grid.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
            <button 
              onClick={() => setFilter("all")}
              className={clsx(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === "all" ? "bg-white text-slate-950 shadow-xl" : "text-white/40 hover:text-white"
              )}
            >
              All Signals
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={clsx(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === "unread" ? "bg-white text-slate-950 shadow-xl" : "text-white/40 hover:text-white"
              )}
            >
              Unread {notifications.filter(n => !n.isRead).length > 0 && `(${notifications.filter(n => !n.isRead).length})`}
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="SEARCH ARCHIVES..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-black tracking-widest w-64 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 uppercase"
                    />
                </div>
            </div>
            <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <Filter size={18} />
            </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-[3rem] py-32 text-center backdrop-blur-3xl">
              <Bell className="mx-auto text-white/10 mb-6 animate-pulse" size={64} strokeWidth={1} />
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Silence in the grid</h3>
              <p className="text-white/30 text-xs mt-2 uppercase tracking-[0.2em]">No signals detected on this frequency</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={clsx(
                  "group relative bg-white/5 border border-white/5 rounded-[2.5rem] p-6 hover:bg-white/[0.08] transition-all duration-500 backdrop-blur-xl",
                  !notif.isRead && "border-blue-500/30 bg-blue-500/[0.02]"
                )}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div className={clsx(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                    notif.type === 'JobMatched' 
                      ? "bg-blue-600 text-white shadow-blue-600/40" 
                      : "bg-white/10 text-white/40"
                  )}>
                    {notif.type === 'JobMatched' ? <Sparkles size={28} /> : <Bell size={28} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-black tracking-tight uppercase italic">{notif.title}</h4>
                        {!notif.isRead && (
                          <span className="px-3 py-1 bg-blue-500 text-slate-950 text-[9px] font-black rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            Priority
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed max-w-2xl font-medium">
                      {notif.message}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-6">
                      {notif.relatedId && (
                        <Link 
                          href={notif.type === 'JobMatched' ? `/pages/jobs/${notif.relatedId}` : '#'}
                          className="px-6 py-2.5 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5"
                        >
                          View Source
                        </Link>
                      )}
                      {!notif.isRead && (
                        <button 
                          onClick={() => handleMarkRead(notif.id)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <CheckCircle2 size={14} className="text-blue-500" /> Mark Read
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notif.id)}
                        className="flex items-center justify-center w-11 h-11 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all ml-auto md:ml-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Only Actions */}
                  <div className="hidden md:flex flex-col items-end gap-2 ml-auto">
                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 group hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-8 h-px bg-white/20"></span>
                System Integrity: 100%
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4">
                Neural Endpoints Active
                <span className="w-8 h-px bg-white/20"></span>
            </p>
        </div>

      </div>
    </div>
  );
}
