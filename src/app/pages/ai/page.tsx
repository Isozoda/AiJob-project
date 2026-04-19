"use client"
import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  ChevronRight,
  History,
  Trash2,
  Paperclip,
  Zap,
  Target,
  BrainCircuit,
  Settings,
  ShieldCheck,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { getToken } from '@/src/store/authStore';
import { 
  aiAsk, 
  analyzeCv, 
  draftCoverLetter, 
  draftMessage 
} from '@/src/app/services/aiService';
import { clsx } from 'clsx';
import toast, { Toaster } from 'react-hot-toast';

type Message = {
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'object';
  data?: any;
};

type AiTool = 'chat' | 'cv-analyzer' | 'cover-letter' | 'message-gen';

export default function AiAssistantPage() {
  const [activeTool, setActiveTool] = useState<AiTool>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Protocol established. I am your neural career strategist. How shall we architect your professional future today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // States for other tools
  const [cvText, setCvText] = useState('');
  const [coverLetterContext, setCoverLetterContext] = useState({ jobId: 0, tone: 'professional', extra: '' });
  const [messageContext, setMessageContext] = useState({ jobId: 0, recipient: '', purpose: '', tone: 'professional', extra: '' });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const currentUserId = (() => {
    const token = getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.UserId || payload.sub || '0');
    } catch { return 0; }
  })();

  const handleSendChat = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await aiAsk({ prompt: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err: any) {
      console.error('AI Error:', err);
      const backendError = err.response?.data?.description?.[0];
      const errorMsg = backendError || err.message || 'Neural link unstable. Recalibrating...';
      
      toast.error(errorMsg);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `❌ INTERRUPT: ${errorMsg}\n\nThe neural stream is currently saturated. Deploying alternative routing logic. Please re-synchronize or wait for lower bandwidth density.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCv = async () => {
    if (!cvText.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await analyzeCv({
        userId: currentUserId,
        cvText: cvText,
        applyToProfile: false,
        syncSkills: false
      });
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Neural CV scan complete. Synchronizing findings to telemetry flow:`,
        type: 'object',
        data: result
      }]);
      setActiveTool('chat');
    } catch (err) {
      toast.error('Failed to analyze CV');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftCoverLetter = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await draftCoverLetter({
        userId: currentUserId,
        jobId: coverLetterContext.jobId,
        tone: coverLetterContext.tone,
        extraContext: coverLetterContext.extra
      });
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Generated Manifesto for Opportunity Node #${coverLetterContext.jobId}:`,
        type: 'object',
        data: result
      }]);
      setActiveTool('chat');
    } catch (err) {
      toast.error('Failed to generate cover letter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftMessage = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await draftMessage({
        userId: currentUserId,
        jobId: messageContext.jobId,
        recipientName: messageContext.recipient,
        purpose: messageContext.purpose,
        tone: messageContext.tone,
        extraContext: messageContext.extra
      });
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Encrypted signal drafted for ${messageContext.recipient}:`,
        type: 'object',
        data: result
      }]);
      setActiveTool('chat');
    } catch (err) {
      toast.error('Failed to generate message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-900 text-white overflow-hidden font-sans relative">
      <Toaster position="top-right" />
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
      
      {/* ── SIDEBAR ── */}
      <aside className="w-80 bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
              <Cpu size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tighter text-white uppercase italic">NEURAL CORE</h1>
              <p className="text-[9px] font-extrabold text-blue-500 uppercase tracking-[0.3em]">Protocol v4.2.0</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <NavItem 
              active={activeTool === 'chat'} 
              onClick={() => setActiveTool('chat')}
              icon={<MessageSquare size={18} />}
              label="NEURAL CHAT"
              badge="STABLE"
            />
            <NavItem 
              active={activeTool === 'cv-analyzer'} 
              onClick={() => setActiveTool('cv-analyzer')}
              icon={<FileText size={18} />}
              label="SCAN CV"
            />
            <NavItem 
              active={activeTool === 'cover-letter'} 
              onClick={() => setActiveTool('cover-letter')}
              icon={<Sparkles size={18} />}
              label="MANIFESTO GEN"
            />
            <NavItem 
              active={activeTool === 'message-gen'} 
              onClick={() => setActiveTool('message-gen')}
              icon={<Mail size={18} />}
              label="SIGNAL BROADCAST"
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="bg-white/5 backdrop-blur-3xl rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                <BrainCircuit size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-white uppercase tracking-widest italic">NEURAL CAPACITY</p>
                <p className="text-[9px] text-slate-500 font-semibold">3,400 / 10,000 FLOPs</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
              <div className="w-1/3 h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Header toolbar */}
        <header className="h-20 border-b border-white/5 bg-slate-900/60 backdrop-blur-3xl flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.4em] italic leading-none">{activeTool.replace('-', ' ')} protocol active</span>
          </div>
          <div className="flex items-center gap-4">
            <ToolbarBtn icon={<History size={20}/>}/>
            <ToolbarBtn icon={<Settings size={20}/>}/>
            <button 
              onClick={() => setMessages([{ role: 'ai', content: 'Neural buffer cleared. Re-initializing session...' }])}
              className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <Trash2 size={20}/>
            </button>
          </div>
        </header>

        {/* TOOL VIEWS */}
        <div className="flex-1 overflow-hidden relative custom-scrollbar">
          
          {/* ── CHAT VIEW ── */}
          <div className={clsx("absolute inset-0 flex flex-col", activeTool === 'chat' ? 'visible' : 'invisible')}>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={clsx("flex gap-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700", msg.role === 'user' ? "ml-auto flex-row-reverse text-right" : "")}>
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl transition-all duration-500 backdrop-blur-3xl border",
                    msg.role === 'user' ? "bg-white/5 border-white/10 group-hover:scale-110" : "bg-blue-600 border-blue-400/30 group-hover:scale-110"
                  )}>
                    {msg.role === 'user' ? <User size={24} className="text-slate-400" /> : <Bot size={24} className="text-white" />}
                  </div>
                  <div className={clsx(
                    "p-6 md:p-8 rounded-[2.5rem] shadow-2xl text-lg leading-relaxed border relative overflow-hidden",
                    msg.role === 'user' 
                      ? "bg-blue-600/90 text-white rounded-tr-none border-blue-400/30" 
                      : "bg-white/5 backdrop-blur-3xl border-white/5 text-slate-300 rounded-tl-none"
                  )}>
                    <p className={clsx("whitespace-pre-wrap font-semibold italic opacity-95", msg.role === 'user' ? "" : "tracking-tight uppercase")}>{msg.content}</p>
                    
                    {/* Render object data if available */}
                    {msg.type === 'object' && msg.data && (
                      <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                        {renderAiData(msg.data)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-6 max-w-5xl animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                    <Bot size={24} className="text-white animate-spin duration-[3000ms]" />
                  </div>
                  <div className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] rounded-tl-none shadow-2xl flex items-center gap-4">
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.5em] italic">Synthesizing Neural Response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-10 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
              <div className="max-w-5xl mx-auto relative">
                <div className="flex items-center gap-4 bg-slate-950/60 backdrop-blur-3xl border border-white/10 p-3 rounded-[3.5rem] focus-within:border-blue-500/50 focus-within:shadow-[0_0_40px_rgba(37,99,235,0.15)] transition-all duration-500 shadow-2xl">
                  <button className="p-4 text-slate-500 hover:text-blue-500 hover:bg-white/5 rounded-full transition-all"><Paperclip size={24}/></button>
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder="Ask the Neural Core anything about your career..."
                    className="flex-1 bg-transparent py-4 text-xl outline-none placeholder:text-slate-600 font-semibold italic uppercase tracking-tight"
                  />
                  <button 
                    onClick={handleSendChat}
                    disabled={!input.trim() || isLoading}
                    className="p-5 bg-blue-600 text-white rounded-[2.5rem] hover:bg-white hover:text-blue-600 disabled:opacity-20 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.4)] active:scale-90"
                  >
                    <Send size={28} />
                  </button>
                </div>
                <p className="text-[9px] text-center mt-6 text-slate-600 font-extrabold uppercase tracking-[0.6em] italic opacity-60">NEURAL ADVISORY: VERIFY SYNTHESIZED DATA BEFORE DEPLOYMENT.</p>
              </div>
            </div>
          </div>

          {/* ── CV ANALYZER VIEW ── */}
          <ToolLayout 
            visible={activeTool === 'cv-analyzer'}
            icon={<FileText className="text-blue-500" size={48} />}
            title="NEURAL CV ANALYZER"
            subtitle="Deploy your CV signature for horizontal skill-sync analysis."
          >
            <textarea 
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              placeholder="PASTE CV RAW TEXT HERE..."
              className="w-full h-96 p-8 bg-white/5 border border-white/10 rounded-[3.5rem] outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-xl font-semibold italic uppercase leading-relaxed shadow-inner placeholder:text-slate-800"
            />
            <button 
              onClick={handleAnalyzeCv}
              disabled={!cvText.trim() || isLoading}
              className="w-full mt-10 bg-blue-600 text-white py-6 rounded-[3rem] font-extrabold text-2xl flex items-center justify-center gap-4 hover:bg-white hover:text-blue-600 disabled:opacity-20 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] uppercase italic tracking-widest"
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} fill="white" />}
              INITIATE NEURAL SCAN
            </button>
          </ToolLayout>

          {/* ── COVER LETTER VIEW ── */}
          <ToolLayout 
            visible={activeTool === 'cover-letter'}
            icon={<Sparkles className="text-indigo-400" size={48} />}
            title="MANIFESTO GENERATOR"
            subtitle="Architect a tailored manifesto for your target opportunity node."
          >
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <ToolInput label="NODE ID (OPTIONAL)">
                  <input 
                    type="number"
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-indigo-500/50 transition-all text-lg font-semibold italic text-white"
                    placeholder="e.g. 104"
                    onChange={e => setCoverLetterContext(prev => ({ ...prev, jobId: parseInt(e.target.value) || 0 }))}
                  />
                </ToolInput>
                <ToolInput label="SIGNAL TONE">
                  <select 
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-indigo-500/50 transition-all text-lg font-semibold italic text-white appearance-none uppercase"
                    onChange={e => setCoverLetterContext(prev => ({ ...prev, tone: e.target.value }))}
                  >
                    <option value="professional" className="bg-slate-900">Professional</option>
                    <option value="creative" className="bg-slate-900">Creative</option>
                    <option value="confident" className="bg-slate-900">Confident</option>
                    <option value="humble" className="bg-slate-900">Humble</option>
                  </select>
                </ToolInput>
              </div>
              <ToolInput label="EXTRA CONTEXT (TARGET DIRECTIVES)">
                <textarea 
                  className="w-full h-48 px-8 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] outline-none focus:border-indigo-500/50 transition-all text-lg font-semibold italic text-white uppercase"
                  placeholder="DEPLOY TARGET DETAILS..."
                  onChange={e => setCoverLetterContext(prev => ({ ...prev, extra: e.target.value }))}
                />
              </ToolInput>
              <button 
                onClick={handleDraftCoverLetter}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-6 rounded-[3rem] font-extrabold text-2xl flex items-center justify-center gap-4 hover:bg-white hover:text-indigo-600 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] uppercase italic tracking-widest"
              >
                GENERATE MANIFESTO
              </button>
            </div>
          </ToolLayout>

          {/* ── MESSAGE GEN VIEW ── */}
          <ToolLayout 
            visible={activeTool === 'message-gen'}
            icon={<Mail className="text-amber-500" size={48} />}
            title="SIGNAL BROADCASTER"
            subtitle="Engage recruiters with high-precision messaging protocols."
          >
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <ToolInput label="RECIPIENT SIGNATURE">
                  <input 
                    type="text"
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-amber-500/50 transition-all text-lg font-semibold italic text-white"
                    placeholder="e.g. JOHN DOE"
                    onChange={e => setMessageContext(prev => ({ ...prev, recipient: e.target.value }))}
                  />
                </ToolInput>
                <ToolInput label="SIGNAL PURPOSE">
                  <input 
                    type="text"
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-amber-500/50 transition-all text-lg font-semibold italic text-white"
                    placeholder="e.g. FOLLOW-UP"
                    onChange={e => setMessageContext(prev => ({ ...prev, purpose: e.target.value }))}
                  />
                </ToolInput>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <ToolInput label="PROTOCOL TONE">
                  <select 
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-amber-500/50 transition-all text-lg font-semibold italic text-white appearance-none uppercase"
                    onChange={e => setMessageContext(prev => ({ ...prev, tone: e.target.value }))}
                  >
                    <option value="formal" className="bg-slate-900">Formal</option>
                    <option value="casual" className="bg-slate-900">Casual</option>
                    <option value="friendly" className="bg-slate-900">Friendly</option>
                  </select>
                </ToolInput>
                <ToolInput label="TARGET NODE ID">
                  <input 
                    type="number"
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-amber-500/50 transition-all text-lg font-semibold italic text-white"
                    placeholder="e.g. 101"
                    onChange={e => setMessageContext(prev => ({ ...prev, jobId: parseInt(e.target.value) || 0 }))}
                  />
                </ToolInput>
              </div>
              <ToolInput label="EXTRA CHANNEL DATA">
                <textarea 
                  className="w-full h-32 px-8 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] outline-none focus:border-amber-500/50 transition-all text-lg font-semibold italic text-white uppercase"
                  placeholder="SPECIFY TARGET DIRECTIVES..."
                  onChange={e => setMessageContext(prev => ({ ...prev, extra: e.target.value }))}
                />
              </ToolInput>
              <button 
                onClick={handleDraftMessage}
                disabled={isLoading}
                className="w-full bg-amber-600 text-white py-6 rounded-[3rem] font-extrabold text-2xl flex items-center justify-center gap-4 hover:bg-white hover:text-amber-600 transition-all shadow-[0_20px_50px_rgba(217,119,6,0.3)] uppercase italic tracking-widest"
              >
                BROADCAST SIGNAL
              </button>
            </div>
          </ToolLayout>

        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "w-full flex items-center justify-between px-6 py-4 rounded-3xl transition-all duration-300 group",
        active 
          ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] scale-105" 
          : "text-slate-500 hover:bg-white/5 hover:text-white"
      )}
    >
      <div className="flex items-center gap-4">
        <span className={clsx("transition-transform duration-300", active ? "scale-110" : "group-hover:translate-x-1")}>{icon}</span>
        <span className="text-sm font-extrabold italic uppercase tracking-widest leading-none mt-0.5">{label}</span>
      </div>
      {badge && (
        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] bg-white/10 text-white px-2.5 py-1 rounded-full italic animate-pulse">
          {badge}
        </span>
      )}
      {!badge && active && <ChevronRight size={16} className="text-white/50" />}
    </button>
  );
}

function ToolbarBtn({ icon }: any) {
  return (
    <button className="p-3 bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all backdrop-blur-3xl shadow-2xl">
      {icon}
    </button>
  );
}

function ToolLayout({ visible, icon, title, subtitle, children }: any) {
  return (
    <div className={clsx("absolute inset-0 flex flex-col p-10 custom-scrollbar overflow-y-auto", visible ? 'visible' : 'invisible opacity-0 pointer-events-none')}>
      <div className="max-w-4xl mx-auto w-full pt-16 pb-20">
        <div className="text-center mb-16 space-y-4">
          <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-in zoom-in duration-700">
            {icon}
          </div>
          <h2 className="text-5xl font-extrabold text-white tracking-tighter italic uppercase">{title}<span className="text-blue-500">.</span></h2>
          <p className="text-slate-500 font-semibold text-xl italic uppercase tracking-tight opacity-80">{subtitle}</p>
        </div>
        <div className="bg-slate-950/40 backdrop-blur-3xl p-12 rounded-[5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -translate-x-10 translate-y-10 group-hover:bg-blue-600/10 transition-all duration-1000"></div>
          <div className="relative z-10 space-y-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolInput({ label, children }: any) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.6em] italic ml-6">{label}</label>
      {children}
    </div>
  );
}

function renderAiData(data: any) {
  // If it's the CV Analyzer response
  if (data.skills) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-2 gap-6">
          <StatBox label="NEURAL EXP" value={`${data.experienceYears} CYCLES`} icon={<Target size={18}/>} color="blue" />
          <StatBox label="RANK TIER" value="S-Class" icon={<Sparkles size={18}/>} color="purple" />
        </div>
        <div>
          <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.5em] mb-6 italic ml-2">CALIBRATED SKILLSETS</h4>
          <div className="flex flex-wrap gap-3">
            {data.skills?.map((s: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-blue-600/20 text-blue-400 text-[11px] font-extrabold uppercase tracking-widest rounded-xl border border-blue-500/20 italic">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.5em] mb-6 italic ml-2">CORE DIRECTIVES</h4>
          <ul className="space-y-4 mt-2">
            {data.howToImprove?.slice(0, 3).map((r: string, i: number) => (
              <li key={i} className="flex items-start gap-4 text-sm text-slate-400 font-semibold italic uppercase tracking-tight">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb] flex-shrink-0"></div>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // If it's a drafted text (Letter or Message)
  if (data.subject || data.content) {
    return (
      <div className="space-y-6">
        {data.subject && (
          <div className="p-6 bg-white/[0.03] rounded-[2rem] border border-white/5">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.4em] mb-3 italic">SIGNAL SUBJECT</p>
            <p className="text-lg font-extrabold text-white italic uppercase tracking-tighter leading-none">{data.subject}</p>
          </div>
        )}
        <div className="p-8 bg-slate-950/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
           <div className="absolute inset-0 bg-blue-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(data.content);
              toast.success('Signal buffered to local registry!');
            }}
            className="absolute top-4 right-4 p-3 bg-white/5 text-slate-500 hover:text-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-white/10 backdrop-blur-3xl"
            title="Copy Signal"
          >
            <FileText size={20}/>
          </button>
          <p className="text-xl text-slate-300 leading-relaxed font-semibold italic uppercase tracking-tight pr-10">{data.content}</p>
        </div>
      </div>
    );
  }

  return <pre className="text-[10px] bg-white/5 p-6 rounded-3xl border border-white/5 overflow-x-auto custom-scrollbar italic">{JSON.stringify(data, null, 2)}</pre>;
}

function StatBox({ label, value, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-600/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-600/10 text-purple-400 border-purple-500/20",
  };
  return (
    <div className={clsx("p-6 rounded-3xl border flex items-center gap-6 shadow-2xl backdrop-blur-md", colors[color] || colors.blue)}>
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-inherit flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-extrabold uppercase tracking-[0.4em] opacity-60 mb-1 italic">{label}</p>
        <p className="text-xl font-extrabold italic uppercase tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}
