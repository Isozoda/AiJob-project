"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosRequest, saveToken } from '@/src/store/authStore';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
    fullName: z.string().min(2, "Минимум 2 символа"),
    phoneNumber: z.string().min(6, "Некорректный номер"),
    email: z.string().email("Некорректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    role: z.enum(["Candidate", "Organization"]),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            role: 'Candidate',
            fullName: '',
            email: '',
            phoneNumber: '',
            password: ''
        }
    });

    const role = watch('role');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const res = await axiosRequest.post(`/Auth/register`, {
                ...data,
                fullName: data.fullName.trim()
            });

            const token = res.data?.token || res.data?.accessToken;
            toast.success("Регистрация прошла успешно!");

            if (token) {
                saveToken(token);
                router.push('/');
            } else {
                router.push('/pages/login');
            }
        } catch (err: any) {
            let message = 'Registration failed. Please try again.';
            if (err.response?.data) {
                const data = err.response.data;
                if (data.errors && typeof data.errors === 'object') {
                    message = Object.values(data.errors).flat().join(' ');
                } else if (data.message) {
                    message = data.message;
                } else if (typeof data === 'string') {
                    message = data;
                } else if (data.title) {
                    message = data.title;
                }
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-[#2b2b2b]">
            <Toaster position="top-right" />

            {/* LEFT SIDE */}
            <div className="w-1/2 bg-white flex flex-col justify-center px-20">
                <span className="text-[10px] font-bold tracking-widest uppercase text-purple-500 bg-purple-100 px-3 py-1 rounded-full w-fit mb-6">
                    THE COGNITIVE ATELIER
                </span>

                <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
                    Design your{" "}
                    <span className="text-blue-600">professional</span> future.
                </h1>

                <p className="text-sm text-gray-500 mb-10 max-w-md leading-relaxed">
                    Join an elite network where AI precision meets human ambition.
                    Start your journey into the next era of work.
                </p>

                <div className="flex gap-6">
                    <div className="bg-[#f6f6f6] p-5 rounded-2xl w-52">
                        <p className="font-bold text-sm mb-1 text-gray-900">Instant Matching</p>
                        <p className="text-xs text-gray-500 font-medium">
                            AI-driven role alignment.
                        </p>
                    </div>

                    <div className="bg-[#f6f6f6] p-5 rounded-2xl w-52">
                        <p className="font-bold text-sm mb-1 text-gray-900">Verified Talent</p>
                        <p className="text-xs text-gray-500 font-medium">
                            Elite vetted community.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 bg-[#f8f9fa] flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 w-full max-w-[480px]">

                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Create Account</h2>
                    <p className="text-sm text-gray-400 mb-8 font-medium">
                        Select your role to get started.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {/* ROLE */}
                        <div className="flex gap-3 mb-2">
                            <div
                                onClick={() => setValue('role', 'Candidate')}
                                className={`flex-1 border-2 rounded-2xl p-4 cursor-pointer transition-all ${role === 'Candidate' ? 'border-blue-500 bg-blue-50/30' : 'border-[#ececec] hover:border-gray-300'}`}
                            >
                                <p className={`font-bold text-sm ${role === 'Candidate' ? 'text-blue-600' : 'text-gray-700'}`}>Candidate</p>
                                <p className="text-[11px] font-medium text-gray-400 mt-1">
                                    Looking for my next AI-driven role.
                                </p>
                            </div>

                            <div
                                onClick={() => setValue('role', 'Organization')}
                                className={`flex-1 border-2 rounded-2xl p-4 cursor-pointer transition-all ${role === 'Organization' ? 'border-blue-500 bg-blue-50/30' : 'border-[#ececec] hover:border-gray-300'}`}
                            >
                                <p className={`font-bold text-sm ${role === 'Organization' ? 'text-blue-600' : 'text-gray-700'}`}>Organization</p>
                                <p className="text-[11px] font-medium text-gray-400 mt-1">
                                    We’re hiring AI talent.
                                </p>
                            </div>
                        </div>

                        {/* FULL NAME */}
                        <div>
                            <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 mb-2 uppercase">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Alex Sterling"
                                {...register("fullName")}
                                className={`w-full px-4 py-3.5 bg-[#f0f2f5] rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-all ${errors.fullName ? 'ring-2 ring-red-500/20 border-red-500' : ''}`}
                            />
                            {errors.fullName && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.fullName.message}</p>}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 mb-2 uppercase">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="alex@studio.design"
                                {...register("email")}
                                className={`w-full px-4 py-3.5 bg-[#f0f2f5] rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-all ${errors.email ? 'ring-2 ring-red-500/20 border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email.message}</p>}
                        </div>

                        {/* PHONE NUMBER */}
                        <div>
                            <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 mb-2 uppercase">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="+1 234 567 890"
                                {...register("phoneNumber")}
                                className={`w-full px-4 py-3.5 bg-[#f0f2f5] rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-all ${errors.phoneNumber ? 'ring-2 ring-red-500/20 border-red-500' : ''}`}
                            />
                            {errors.phoneNumber && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.phoneNumber.message}</p>}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 mb-2 uppercase">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`w-full px-4 py-3.5 bg-[#f0f2f5] rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-all ${errors.password ? 'ring-2 ring-red-500/20 border-red-500' : ''}`}
                            />
                            {errors.password ? (
                                <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.password.message}</p>
                            ) : (
                                <p className="text-[11px] font-medium text-gray-400 mt-1">
                                    Must be at least 6 characters.
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0d60d8] hover:bg-[#0a4fb5] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? "Creating..." : "Create account"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-0.5 bg-gray-100"></div>
                        <div className="text-[10px] font-bold tracking-widest text-[#a1a1a1] uppercase">
                            Or sign up with
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-100"></div>
                    </div>

                    {/* SOCIAL */}
                    <div className="flex gap-4">
                        <button type="button" className="flex-1 border-2 border-[#f0f0f0] bg-white rounded-xl py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            Google
                        </button>
                        <button type="button" className="flex-1 border-2 border-[#f0f0f0] bg-white rounded-xl py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            GitHub
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
