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
  Settings
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
    { role: 'ai', content: 'Hello! I am your AI Career Assistant. How can I help you today?' }
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
      const errorMsg = backendError || err.message || 'AI is currently unavailable. Please try again later.';
      
      toast.error(errorMsg);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `❌ Error: ${errorMsg}\n\nThis usually happens when there is a high demand on the AI model. Please try a different prompt or wait a few moments.` 
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
        content: `I've analyzed your CV. Here are the key findings:`,
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
        content: `Here is a draft for your cover letter:`,
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
        content: `I've drafted a message for ${messageContext.recipient}:`,
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
    <div className="flex h-[calc(100vh-80px)] bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      <Toaster position="top-center" />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      
      {/* ── SIDEBAR ── */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">AI Assistant</h1>
          </div>
          
          <nav className="space-y-1">
            <NavItem 
              active={activeTool === 'chat'} 
              onClick={() => setActiveTool('chat')}
              icon={<MessageSquare size={18} />}
              label="AI Career Chat"
              badge="Beta"
            />
            <NavItem 
              active={activeTool === 'cv-analyzer'} 
              onClick={() => setActiveTool('cv-analyzer')}
              icon={<FileText size={18} />}
              label="CV Analyzer"
            />
            <NavItem 
              active={activeTool === 'cover-letter'} 
              onClick={() => setActiveTool('cover-letter')}
              icon={<Sparkles size={18} />}
              label="Draft Cover Letter"
            />
            <NavItem 
              active={activeTool === 'message-gen'} 
              onClick={() => setActiveTool('message-gen')}
              icon={<Mail size={18} />}
              label="Message Generator"
            />
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <BrainCircuit size={16} className="text-blue-600" />
              </div>
              <p className="text-xs font-bold text-slate-700">Token Usage</p>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-blue-500"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">3,400 / 10,000 credits left</p>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col relative bg-[#fcfdfe]">
        
        {/* Header toolbar */}
        <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-600 capitalize">{activeTool.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><History size={20}/></button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Settings size={20}/></button>
            <button 
              onClick={() => setMessages([{ role: 'ai', content: 'Chat cleared. How else can I help?' }])}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20}/>
            </button>
          </div>
        </header>

        {/* TOOL VIEWS */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* ── CHAT VIEW ── */}
          <div className={clsx("absolute inset-0 flex flex-col", activeTool === 'chat' ? 'visible' : 'invisible')}>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={clsx("flex gap-4 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform hover:scale-105",
                    msg.role === 'user' ? "bg-white border border-slate-200" : "bg-blue-600"
                  )}>
                    {msg.role === 'user' ? <User size={20} className="text-slate-600" /> : <Bot size={20} className="text-white" />}
                  </div>
                  <div className={clsx(
                    "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Render object data if available */}
                    {msg.type === 'object' && msg.data && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        {renderAiData(msg.data)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-4xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={20} className="text-white animate-pulse" />
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-xs font-medium text-slate-400">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="max-w-4xl mx-auto relative group">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all shadow-sm">
                  <button className="p-2.5 text-slate-400 hover:text-blue-500 rounded-xl hover:bg-white transition-all"><Paperclip size={20}/></button>
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder="Ask anything about your career..."
                    className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleSendChat}
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-all shadow-md shadow-blue-600/20 active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-center mt-3 text-slate-400 font-medium">AiJob Assistant may provide inaccurate career advice. Verify important info.</p>
              </div>
            </div>
          </div>

          {/* ── CV ANALYZER VIEW ── */}
          <div className={clsx("absolute inset-0 flex flex-col p-8 bg-white", activeTool === 'cv-analyzer' ? 'visible' : 'invisible')}>
            <div className="max-w-3xl mx-auto w-full pt-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-blue-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">CV Content Analyzer</h2>
                <p className="text-slate-500 text-sm">Paste your CV text to get a deep analysis of your skills and improvements.</p>
              </div>
              <textarea 
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                placeholder="Paste your CV text here..."
                className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:bg-white transition-all text-sm leading-relaxed shadow-inner"
              />
              <button 
                onClick={handleAnalyzeCv}
                disabled={!cvText.trim() || isLoading}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/25"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={18} />}
                Analyze My Profile
              </button>
            </div>
          </div>

          {/* ── COVER LETTER VIEW ── */}
          <div className={clsx("absolute inset-0 flex flex-col p-8 bg-white", activeTool === 'cover-letter' ? 'visible' : 'invisible')}>
            <div className="max-w-2xl mx-auto w-full pt-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-purple-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Draft Cover Letter</h2>
                <p className="text-slate-500 text-sm">Let AI write a tailored cover letter for your target job.</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job ID (Optional)</label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 transition-all text-sm"
                      placeholder="e.g. 104"
                      onChange={e => setCoverLetterContext(prev => ({ ...prev, jobId: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tone</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 transition-all text-sm"
                      onChange={e => setCoverLetterContext(prev => ({ ...prev, tone: e.target.value }))}
                    >
                      <option value="professional">Professional</option>
                      <option value="creative">Creative</option>
                      <option value="confident">Confident</option>
                      <option value="humble">Humble</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Extra Context (Job Desc, Company Name...)</label>
                  <textarea 
                    className="w-full h-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 transition-all text-sm"
                    placeholder="Describe the company or paste job requirements..."
                    onChange={e => setCoverLetterContext(prev => ({ ...prev, extra: e.target.value }))}
                  />
                </div>
                <button 
                  onClick={handleDraftCoverLetter}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25"
                >
                  Generate Cover Letter
                </button>
              </div>
            </div>
          </div>

          {/* ── MESSAGE GEN VIEW ── */}
          <div className={clsx("absolute inset-0 flex flex-col p-8 bg-white", activeTool === 'message-gen' ? 'visible' : 'invisible')}>
            <div className="max-w-2xl mx-auto w-full pt-10 overflow-y-auto pr-4 custom-scrollbar">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-amber-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Smart Message Generator</h2>
                <p className="text-slate-500 text-sm">Professional messages for recruiters or hiring managers.</p>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Name</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-all text-sm"
                      placeholder="e.g. John Doe"
                      onChange={e => setMessageContext(prev => ({ ...prev, recipient: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Purpose</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-all text-sm"
                      placeholder="e.g. Interview Follow-up"
                      onChange={e => setMessageContext(prev => ({ ...prev, purpose: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tone</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-all text-sm"
                      onChange={e => setMessageContext(prev => ({ ...prev, tone: e.target.value }))}
                    >
                      <option value="formal">Formal</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job ID</label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-all text-sm"
                      placeholder="e.g. 101"
                      onChange={e => setMessageContext(prev => ({ ...prev, jobId: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Extra Details</label>
                  <textarea 
                    className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-all text-sm"
                    placeholder="Mention specific points you want included..."
                    onChange={e => setMessageContext(prev => ({ ...prev, extra: e.target.value }))}
                  />
                </div>
                <button 
                  onClick={handleDraftMessage}
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/25"
                >
                  Generate Message
                </button>
              </div>
            </div>
          </div>

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
        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <div className="flex items-center gap-3">
        <span className={clsx("transition-transform duration-200", active ? "scale-110" : "group-hover:translate-x-0.5")}>{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {!badge && active && <ChevronRight size={14} className="text-blue-400" />}
    </button>
  );
}

function renderAiData(data: any) {
  // If it's the CV Analyzer response
  if (data.skills) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatBox label="Exp Years" value={data.experienceYears} icon={<Target size={14}/>} color="blue" />
          <StatBox label="Rank" value="A+" icon={<Sparkles size={14}/>} color="purple" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skills?.map((s: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-lg border border-blue-100">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Key Recommendations</h4>
          <ul className="space-y-1.5">
            {data.howToImprove?.slice(0, 3).map((r: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
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
      <div className="space-y-3">
        {data.subject && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subject</p>
            <p className="text-xs font-bold text-slate-800">{data.subject}</p>
          </div>
        )}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-inner relative group">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(data.content);
              toast.success('Copied to clipboard!');
            }}
            className="absolute top-2 right-2 p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-slate-200"
            title="Copy"
          >
            <FileText size={14}/>
          </button>
          <p className="text-xs text-slate-600 leading-relaxed font-mono">{data.content}</p>
        </div>
      </div>
    );
  }

  return <pre className="text-[10px] bg-slate-50 p-2 rounded overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>;
}

function StatBox({ label, value, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  return (
    <div className={clsx("p-3 rounded-xl border flex items-center gap-3", colors[color] || colors.blue)}>
      <div className="w-8 h-8 rounded-lg bg-white border border-inherit flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{label}</p>
        <p className="text-sm font-black">{value}</p>
      </div>
    </div>
  );
}
