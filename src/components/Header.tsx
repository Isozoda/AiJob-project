"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, User, Menu, X, Sparkles, Bell, MessageSquare, ChevronDown, LayoutGrid, Building2, Briefcase } from "lucide-react";
import { getToken, getUserIdFromToken } from "../store/authStore";
import { getMyConversations } from "../app/services/conversationService";
import { getNotificationsByUser } from "../app/services/notificationService";
import type { Conversation } from "../app/types/conversation";
import type { Notification } from "../app/types/notification";
import image1 from "../app/images/Link.svg";
import { clsx } from "clsx";

export default function Header() {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const auth = !!getToken();
    setIsAuth(auth);
    setMounted(true);

    if (auth) {
      const userId = getUserIdFromToken();
      const fetchData = async () => {
        try {
          const convs = await getMyConversations();
          const totalUnread = convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
          setUnreadCount(totalUnread);

          if (userId) {
            const notifs = await getNotificationsByUser(userId);
            setNotifications(notifs);
            setNotificationCount(notifs.filter(n => !n.isRead).length);
          }
        } catch (err) {
            console.error("Header fetch error:", err);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 10000); // Check every 10s
      return () => clearInterval(interval);
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = () => {
      setShowDropdown(false);
      setShowNotifications(false);
    };
    if (showDropdown || showNotifications) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showDropdown, showNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("store_token");
    setIsAuth(false);
    setShowDropdown(false);
    window.location.href = "/";
  };

  return (
    <div className="sticky top-0 left-0 w-full z-[100] pointer-events-none p-0">
      <header className={clsx(
        "w-full pointer-events-auto transition-all duration-500 border-b",
        scrolled 
          ? "bg-slate-950/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-white/5 py-3" 
          : "bg-slate-950/80 backdrop-blur-md border-white/10 py-5"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:rotate-12 transition-transform duration-500">
                <Sparkles className="text-white fill-white" size={20} />
              </div>
              <Image src={image1} alt="AIJob Logo" width={90} height={30} className="w-auto h-6 sm:h-7 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/" label="Home" active={pathname === '/'} />
            <NavLink href="/pages/jobs" label="Jobs" icon={<Briefcase size={14}/>} active={pathname.startsWith('/pages/jobs')} />
            <NavLink href="/pages/organization" label="Studios" icon={<Building2 size={14}/>} active={pathname.startsWith('/pages/organization')} />
            <div className="w-px h-4 bg-white/10 mx-4"></div>
            <Link 
              href="/pages/ai" 
              className={clsx(
                "group flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95",
                pathname === '/pages/ai' 
                  ? "bg-white text-slate-950 shadow-white/10" 
                  : "bg-white/10 border border-white/10 text-white hover:bg-white hover:text-slate-900"
              )}
            >
              <Sparkles size={14} className={clsx("transition-colors", pathname === '/pages/ai' ? "text-blue-600" : "group-hover:text-blue-500")} />
              AI Assistant
            </Link>
            <NavLink href="/pages/about" label="About Us" active={pathname === '/pages/about'} />
          </nav>

          {/* AUTH / PROFILE */}
          <div className="flex items-center gap-3">
            {mounted && isAuth ? (
              <div className="flex items-center gap-3">
                {/* Messages */}
                <Link
                  href="/pages/message"
                  className={clsx(
                    "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 group",
                    pathname === '/pages/message' 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                      : "bg-white/5 border border-white/5 text-white/50 hover:text-white hover:bg-white/10"
                  )}
                >
                  <MessageSquare size={20} strokeWidth={2.5} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg animate-pulse ring-4 ring-red-600/20">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowDropdown(false); }}
                    className={clsx(
                      "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 group",
                      showNotifications
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "bg-white/5 border border-white/5 text-white/50 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Bell size={20} strokeWidth={2.5} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg animate-pulse ring-4 ring-red-600/20">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-80 bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10 p-2 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Aura Notifications</p>
                        <button className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest">Clear All</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar p-1">
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center">
                            <Bell className="mx-auto text-white/10 mb-3" size={32} />
                            <p className="text-xs text-white/30 font-black uppercase tracking-widest">Zero Frequency</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className={clsx(
                              "p-4 rounded-2xl mb-1 transition-all border border-transparent hover:border-white/5 group relative",
                              !notif.isRead ? "bg-white/5" : "opacity-60"
                            )}>
                              <div className="flex gap-3">
                                <div className={clsx(
                                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                  notif.type === 'JobMatched' ? "bg-blue-600/20 text-blue-400" : "bg-white/10 text-white/40"
                                )}>
                                  {notif.type === 'JobMatched' ? <Sparkles size={16} /> : <Bell size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-black text-white uppercase tracking-tight truncate">{notif.title}</h4>
                                  <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                                  <p className="text-[9px] text-white/20 mt-2 font-black uppercase tracking-widest">
                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              {!notif.isRead && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <Link 
                        href="/pages/notifications" 
                        onClick={() => setShowNotifications(false)}
                        className="block w-full py-4 text-center text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest border-t border-white/5"
                      >
                        Interface Archive →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Profile Avatar */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                    className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/5 border border-white/5 rounded-[1.5rem] hover:bg-white/10 hover:shadow-xl transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                       <User size={18} />
                    </div>
                    <ChevronDown size={14} className={clsx("text-white/40 transition-transform duration-300", showDropdown && "rotate-180")} />
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-4 w-64 bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10 p-2 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-5 py-4 border-b border-white/5 mb-1">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Protocol ID</p>
                        <p className="text-sm font-black text-white mt-1 italic uppercase tracking-tighter">System Admin</p>
                      </div>
                      <div className="space-y-1">
                        <DropdownItem href="/pages/profile" icon={<User size={16}/>} label="Neural Profile" active={pathname === '/pages/profile'} />
                        <DropdownItem href="/pages/organization" icon={<Building2 size={16}/>} label="Managed Portfolios" active={pathname === '/pages/organization'} />
                        <DropdownItem href="/pages/applications" icon={<LayoutGrid size={16}/>} label="Application Feed" active={pathname === '/pages/applications'} />
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-5 py-3.5 text-xs font-black text-red-500 hover:bg-red-500/10 w-full text-left transition-all rounded-xl uppercase tracking-widest italic"
                        >
                          <LogIn size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/pages/login"
                  className="px-6 py-3 text-white/60 hover:text-white font-black text-[11px] uppercase tracking-[0.2em] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/pages/register"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  Join Alpha
                </Link>
              </div>
            )}

            {/* MOBILE MENU */}
            <button className="lg:hidden w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/5 rounded-2xl ml-2 border border-white/5">
              <Menu size={24} />
            </button>
          </div>

        </div>
      </header>
    </div>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon?: React.ReactNode; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={clsx(
        "relative px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 group",
        active ? "text-blue-500" : "text-white/50 hover:text-white"
      )}
    >
      {icon && <span className={clsx("transition-opacity", active ? "opacity-100" : "opacity-40 group-hover:opacity-100")}>{icon}</span>}
      {label}
      <span className={clsx(
        "absolute bottom-0 left-5 right-5 h-0.5 bg-blue-500 rounded-full transition-all duration-300",
        active ? "scale-x-100 shadow-[0_0_10px_#3b82f6]" : "scale-x-0 group-hover:scale-x-100"
      )} />
    </Link>
  );
}

function DropdownItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-4 px-5 py-3.5 text-xs font-black transition-all rounded-xl uppercase tracking-widest italic",
        active ? "bg-blue-600 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
      )}
    >
      <span className={clsx(active ? "opacity-100" : "opacity-40")}>{icon}</span>
      {label}
    </Link>
  );
}
