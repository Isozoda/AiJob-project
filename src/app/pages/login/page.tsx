"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosRequest, saveToken } from '@/src/store/authStore';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            // Updated to use the custom axios instance 
            const res = await axiosRequest.post(`/Auth/login`, { email, password });

            const token = res.data.token || res.data.accessToken;
            if (token) {
                saveToken(token);
            }
            router.push('/');
        } catch (err: any) {
            setError(true);
            setErrorMsg(err.response?.data?.message || 'Invalid credentials. Please verify your email or password and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#eef1f8] flex items-center justify-center px-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">

                <div className="flex flex-col gap-7">
                    <div className="flex items-center gap-3">
                        <span className="text-[22px] font-bold tracking-tight text-gray-900">
                            <span className="text-blue-600">AI</span>Job
                        </span>
                        <span className="text-[10px] font-semibold tracking-widest uppercase bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full">
                            Atelier V.2
                        </span>
                    </div>

                    <div>
                        <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-gray-900">
                            Engineering the{' '}
                            <span className="text-blue-600">Cognitive Workforce.</span>
                        </h1>
                    </div>

                    {/* Description */}
                    <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm">
                        A curated environment for high-end professional networking and
                        AI-driven talent insights. Secure your portal to the next generation
                        of labor.
                    </p>

                    {/* Avatars */}
                    <div className="flex items-center gap-3">
                        <div className="flex">
                            {['#6366f1', '#8b5cf6', '#a78bfa'].map((color, i) => (
                                <div
                                    key={i}
                                    className="w-9 h-9 rounded-full border-2 border-[#eef1f8] flex items-center justify-center text-white text-xs font-bold -mr-2.5"
                                    style={{ backgroundColor: color }}
                                >
                                    {['A', 'B', 'C'][i]}
                                </div>
                            ))}
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-500">
                            Joined by 12k+ AI Leaders
                        </span>
                    </div>
                </div>

                {/* ── Right Card ── */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="w-full bg-white rounded-2xl shadow-[0_4px_40px_rgba(35,72,214,0.09)] p-9">
                        <h2 className="text-[22px] font-bold tracking-tight text-gray-900 mb-1">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-gray-400 mb-7">
                            Enter your credentials to access your dashboard.
                        </p>

                        {/* Error Alert */}
                        {error && (
                            <div className="flex gap-3 bg-red-50 border-l-[3px] border-red-400 rounded-xl px-4 py-3 mb-6">
                                <svg
                                    className="text-red-500 mt-0.5 flex-shrink-0"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-0.5">
                                        Authentication Error
                                    </p>
                                    <p className="text-[13px] text-red-500 leading-snug">
                                        {errorMsg || 'Invalid credentials. Please verify your email or password and try again.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            {/* Email */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                            <path d="M2 7l10 7 10-7" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@company.com"
                                        className="w-full bg-[#f0f3fd] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                        Password
                                    </label>
                                    <a
                                        href="#"
                                        className="text-[13px] font-medium text-blue-600 hover:opacity-70 transition-opacity"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-[#f0f3fd] rounded-xl pl-10 pr-11 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >

                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>

                                    </button>
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                                Or continue with
                            </span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* OAuth Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] rounded-xl py-2.5 text-sm font-medium text-gray-700 transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] rounded-xl py-2.5 text-sm font-medium text-gray-700 transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-400 mt-6">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-600 font-medium hover:opacity-70 transition-opacity">
                                Create an account
                            </a>
                        </p>
                    </div>

                    {/* Security note */}
                    <p className="flex items-center gap-1.5 text-[11px] tracking-widest text-gray-400 uppercase">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Precision Security Protocols Active
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
