"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, AlertCircle, ArrowRight, Loader2, Zap, Star, KeyRound } from "lucide-react"
import axios from "axios"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (step === 'email') {
                const response = await axios.post("/api/auth/otp/send", { email, type: 'login' })
                if (response.status === 200) {
                    setStep('otp')
                }
            } else {
                const response = await axios.post("/api/auth/otp/verify", {
                    email,
                    otp,
                    type: 'login'
                })
                if (response.status === 200) {
                    localStorage.setItem("notutor_user_id", response.data.user.id)
                    router.push("/dashboard")
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* Left: Branding & Info (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-blue-950 relative overflow-hidden flex-col justify-between p-24">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-400 rounded-full blur-[120px] opacity-10 -ml-40 -mb-40"></div>

                <Link href="/" className="relative z-10 flex items-center gap-2 group">
                    <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">N</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">NoTutor</span>
                </Link>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                    >
                        <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 italic">Exclusive AI Tutor</span>
                    </motion.div>
                    <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40 italic">
                        RESUME <br /> YOUR <br /> LEGENDARY <br /> STUDY.
                    </h2>
                    <p className="text-white/50 text-lg font-medium max-w-sm mb-12 italic">
                        Log back in to continue mastering the CBSE curriculum with our personalized AI.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex text-orange-400">
                            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic">Join 50K+ Active Students</p>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">
                    NoTutor AI • Mumbai • 2026
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 bg-gray-50/50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="lg:hidden text-center mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">N</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-blue-950 italic">NoTutor</span>
                        </Link>
                    </div>

                    <div className="mb-10 lg:text-left text-center">
                        <h1 className="text-4xl font-black text-blue-950 tracking-tighter mb-2 italic uppercase">SIGN IN</h1>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest text-[10px]">Access your intelligence dashboard</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="mb-8"
                            >
                                <div className="bg-red-50 border-2 border-red-100 text-red-600 p-5 rounded-3xl flex items-center gap-4 shadow-sm shadow-red-100/50">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-wider leading-relaxed">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {step === 'email' ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-2"
                            >
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">
                                    Identifier ID (Email)
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-blue-500/20 rounded-3xl outline-none transition-all text-blue-950 font-bold text-sm shadow-sm placeholder:text-gray-200"
                                        placeholder="ID@NOTUTOR.AI"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between items-center ml-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                                        Verification Code
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic"
                                    >
                                        Change Email?
                                    </button>
                                </div>
                                <div className="relative">
                                    <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-blue-500/20 rounded-3xl outline-none transition-all text-blue-950 font-bold text-sm shadow-sm placeholder:text-gray-200 tracking-[0.5em] text-center font-mono"
                                        placeholder="••• •••"
                                        required
                                        autoFocus
                                        maxLength={6}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 btn-gradient text-white rounded-3xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 uppercase italic"
                        >
                            {loading ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <>
                                    {step === 'email' ? 'SEND CODE' : 'VERIFY & ENTER'}
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-blue-600 hover:text-blue-700 transition-colors">
                                Initialize Account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
