"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Lock, AlertCircle, ArrowRight, Loader2, CheckCircle2, Zap, GraduationCap, KeyRound } from "lucide-react"
import axios from "axios"

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState<'details' | 'otp'>('details')
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (step === 'details') {
                const response = await axios.post("/api/auth/otp/send", { email, type: 'signup' })
                if (response.status === 200) {
                    setStep('otp')
                }
            } else {
                const response = await axios.post("/api/auth/otp/verify", {
                    email,
                    otp,
                    type: 'signup',
                    name
                })
                if (response.status === 200) {
                    localStorage.setItem("notutor_user_id", response.data.user.id)
                    setSuccess(true)
                    setTimeout(() => {
                        router.push("/dashboard")
                    }, 2000)
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
            {/* Right: Branding & Info (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-blue-950 relative overflow-hidden flex-col justify-between p-24 order-2">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 -ml-64 -mt-64"></div>
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-400 rounded-full blur-[120px] opacity-10 -mr-40 -mb-40"></div>

                <Link href="/" className="relative z-10 flex items-center gap-2 group self-end">
                    <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">N</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white uppercase italic">NoTutor</span>
                </Link>

                <div className="relative z-10 text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                    >
                        <GraduationCap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 italic">2026 Batch Ready</span>
                    </motion.div>
                    <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-bl from-white to-white/40 italic uppercase text-white">
                        JOIN <br /> THE <br /> ELITE <br /> SQUAD.
                    </h2>
                    <p className="text-white/50 text-lg font-medium max-w-sm ml-auto mb-12 italic">
                        Create your account and unlock the full potential of CBSE-tailored AI intelligence.
                    </p>
                </div>

                <div className="relative z-10 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic text-right">
                    DESIGNED FOR INDIA • CBSE FOCUS • v1.0.4
                </div>
            </div>

            {/* Left: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 bg-gray-50/50 order-1">
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
                        <h1 className="text-4xl font-black text-blue-950 tracking-tighter mb-2 italic uppercase">INITIALIZE</h1>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest text-[10px]">Create your secure AI profile</p>
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
                                    <p className="text-xs font-black uppercase tracking-wider leading-relaxed leading-relaxed">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8"
                            >
                                <div className="bg-green-50 border-2 border-green-100 text-green-600 p-5 rounded-3xl flex items-center gap-4 shadow-sm shadow-green-100/50">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-wider leading-relaxed">System Activated! Transferring to access point...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSignup} className="space-y-6">
                        {step === 'details' ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">
                                        STUDENT NAME (Full Name)
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-blue-500/20 rounded-3xl outline-none transition-all text-blue-950 font-bold text-sm shadow-sm placeholder:text-gray-200"
                                            placeholder="COMMANDER NAME"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">
                                        COMM-LINK ID (Email)
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
                                        />
                                    </div>
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
                                        onClick={() => setStep('details')}
                                        className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic"
                                    >
                                        Change Details?
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
                            disabled={loading || success}
                            className="w-full py-6 btn-gradient text-white rounded-3xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 uppercase italic"
                        >
                            {loading ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <>
                                    {step === 'details' ? 'SEND CODE' : 'INITIALIZE ACCESS'}
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                            Already Active?{" "}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors">
                                SIGN IN
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
