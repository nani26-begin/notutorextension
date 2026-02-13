"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, FileText, Save, Clock, BookOpen, ChevronRight, Layout, Settings, LogOut, Search, Bell, Loader2, Sparkles, Trophy, Star, X, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function DashboardPage() {
    const [note, setNote] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [showTopperModal, setShowTopperModal] = useState(false)
    const [videoReady, setVideoReady] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const id = localStorage.getItem("notutor_user_id")
        if (!id) {
            router.push("/login")
            return
        }
        setUserId(id)

        const fetchNote = async () => {
            try {
                const response = await axios.get(`/api/notes?userId=${id}`)
                if (response.data?.content !== undefined) {
                    setNote(response.data.content)
                }
            } catch (err) {
                console.error("Failed to fetch notes")
            }
        }
        fetchNote()
    }, [router])

    const handleSaveNote = async () => {
        if (!userId) return
        setIsSaving(true)
        try {
            await axios.post("/api/notes", { userId, content: note })
            setLastSaved(new Date().toLocaleTimeString())
        } catch (err) {
            console.error("Failed to save notes")
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("notutor_user_id")
        router.push("/login")
    }

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-950">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans overflow-hidden">
            {/* Super Sidebar */}
            <aside className="w-full lg:w-24 lg:min-h-screen bg-[#020617] flex lg:flex-col items-center py-10 gap-10 border-r border-white/5 relative z-50">
                <Link href="/" className="w-12 h-12 btn-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 active:scale-95 transition-transform">
                    <span className="text-white font-black text-2xl">N</span>
                </Link>

                <nav className="flex lg:flex-col gap-6 items-center flex-1">
                    {[Layout, BookOpen, Clock, Trophy, Settings].map((Icon, i) => (
                        <button key={i} className={`p-4 rounded-2xl transition-all relative group ${i === 1 ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                            <Icon className="w-6 h-6" />
                            {i === 3 && <span className="absolute top-3 right-3 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="p-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all mb-4"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto h-screen bg-grid-slate-100">
                <div className="max-w-7xl mx-auto pb-20">
                    {/* Header area */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    CBSE CURRICULUM • CLASS 10
                                </motion.span>
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 fill-cyan-500" /> TOPPER AI ACTIVE
                                </span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-cyan-400/30 decoration-8 underline-offset-[-2px]">
                                Physics: LIGHT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">&</span> Refraction
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80 group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH CONCEPTS, FORMULAS..."
                                    className="w-full pl-14 pr-6 py-4 bg-white rounded-3xl border-2 border-transparent focus:border-blue-500/10 outline-none text-xs font-black tracking-widest transition-all shadow-sm focus:shadow-xl"
                                />
                            </div>
                            <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm relative group hover:text-blue-600 transition-colors">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-white"></span>
                            </button>
                        </div>
                    </header>

                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Left: Video Player & Notes (8 cols) */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Video Section */}
                            <div className="relative group">
                                <div className="aspect-video bg-[#020617] rounded-[3.5rem] overflow-hidden shadow-2xl relative border-[12px] border-white group-hover:shadow-blue-500/10 transition-shadow">
                                    {!videoReady ? (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1427] to-black flex flex-col items-center justify-center">
                                            <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-blue-500 rounded-full blur-[120px] opacity-10"></div>
                                            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[120px] opacity-10"></div>

                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setVideoReady(true)}
                                                className="w-28 h-28 btn-gradient rounded-[2rem] flex items-center justify-center shadow-blue-500/40 z-10 transition-all"
                                            >
                                                <Play className="w-12 h-12 text-white fill-white translate-x-1" />
                                            </motion.button>
                                            <p className="text-white/30 mt-10 font-black tracking-[0.4em] text-[10px] skew-x-[-12deg] uppercase">INITIALIZING SESSION CONTENT...</p>
                                        </div>
                                    ) : (
                                        <iframe
                                            className="w-full h-full"
                                            src="https://www.youtube.com/embed/SST966X9YQc?autoplay=1&mute=0"
                                            title="Physics Lesson"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                            </div>

                            {/* Note Taking Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[3.5rem] p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden border border-slate-100"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-[1.5rem] bg-blue-600/5 text-blue-600">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">SMART NOTES</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Capture critical formulas & energy principles</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <AnimatePresence>
                                            {lastSaved && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-2"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> AUTO-SAVED: {lastSaved}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        <button
                                            onClick={handleSaveNote}
                                            disabled={isSaving}
                                            className="btn-gradient px-8 py-4 rounded-2xl text-white font-black text-xs flex items-center gap-3 shadow-[0_10px_30px_rgba(59,130,246,0.3)] disabled:opacity-50 active:scale-95 transition-all group"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                                            SAVE PROTOCOL
                                        </button>
                                    </div>
                                </div>

                                <div className="relative z-10 group">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="START TYPING TO RECORD YOUR INTELLIGENCE..."
                                        className="w-full h-80 bg-slate-50/50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 rounded-[2.5rem] p-10 text-slate-700 font-bold text-lg placeholder:text-slate-200 outline-none transition-all resize-none leading-relaxed shadow-inner"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Sidebar Stats/Info (4 cols) */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Mastery Card */}
                            <div className="bg-[#020617] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px]"></div>
                                <div className="flex items-center justify-between mb-10">
                                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em] italic">Intelligence Level</h4>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"
                                    ></motion.div>
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[11px] font-black tracking-[0.2em] uppercase">
                                            <span>REFRACTION INDEX</span>
                                            <span className="text-cyan-400">85% COMPLETE</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "85%" }}
                                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                                            ></motion.div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[11px] font-black tracking-[0.2em] uppercase">
                                            <span>SNELL'S LAW</span>
                                            <span className="text-blue-500">42% MASTERY</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "42%" }}
                                                className="h-full bg-blue-500"
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between">
                                    <div className="text-center">
                                        <p className="text-2xl font-black italic">1,240</p>
                                        <p className="text-[9px] text-white/40 uppercase font-black">XP GAINED</p>
                                    </div>
                                    <div className="text-center border-l border-white/5 pl-8">
                                        <p className="text-2xl font-black italic">14</p>
                                        <p className="text-[9px] text-white/40 uppercase font-black">STREAK</p>
                                    </div>
                                </div>
                            </div>

                            {/* Module List */}
                            <div className="bg-white rounded-[3.5rem] p-12 shadow-xl shadow-slate-200/30 border border-slate-100">
                                <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.4em] mb-10 italic border-l-4 border-blue-600 pl-4">PHASE 01: SYLLABUS</h4>
                                <div className="space-y-6">
                                    {[
                                        { title: "Mirrors & Focus", time: "15:00", active: true, done: true },
                                        { title: "Light & Refraction", time: "LIVE", active: true, done: false },
                                        { title: "The Human Eye", time: "05:00", active: false, done: false },
                                        { title: "Prism Dispersion", time: "LOCK", active: false, done: false },
                                    ].map((lesson, i) => (
                                        <div key={i} className={`flex items-center justify-between group cursor-pointer p-4 rounded-3xl transition-all ${lesson.done ? 'bg-blue-50/50 opacity-60' : lesson.active ? 'bg-white shadow-lg ring-1 ring-slate-100' : 'opacity-40 hover:opacity-100'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${lesson.done ? 'bg-emerald-500' : lesson.active ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`}></div>
                                                <span className="text-sm font-black text-slate-900 tracking-tight italic uppercase">{lesson.title}</span>
                                            </div>
                                            <span className={`text-[10px] font-black tracking-widest ${lesson.active ? 'text-blue-600' : 'text-slate-400'}`}>{lesson.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Topper Mode Promo */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setShowTopperModal(true)}
                                className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-[3.5rem] p-12 relative overflow-hidden group cursor-pointer shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="relative z-10">
                                    <h3 className="text-white font-black text-3xl italic mb-4 tracking-tighter leading-none">ENTER <br /> TOPPER MODE.</h3>
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-10 leading-relaxed shadow-sm">Unlock the restricted intelligence vault of 2026 TOPPERS.</p>
                                    <button className="bg-white text-blue-950 px-8 py-5 rounded-2xl font-black text-xs tracking-widest shadow-xl group-hover:bg-cyan-400 group-hover:text-white transition-all scale-100 group-active:scale-95">GO PRO NOW</button>
                                </div>
                                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                    <Trophy className="w-64 h-64 text-white" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Topper Modal */}
            <AnimatePresence>
                {showTopperModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="max-w-xl w-full bg-white rounded-[4rem] p-16 relative overflow-hidden text-center"
                        >
                            <button
                                onClick={() => setShowTopperModal(false)}
                                className="absolute top-10 right-10 p-4 rounded-3xl bg-slate-50 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="w-24 h-24 btn-gradient rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-blue-500/20">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-4xl font-black text-slate-950 italic mb-6 tracking-tight uppercase">THE TOPPER VAULT</h2>
                            <p className="text-slate-500 font-bold mb-12 px-6">Access restricted CBSE Class 10 Mock Exams, handwritten AIR-1 notes, and the secret 2026 batch intelligence files.</p>

                            <div className="grid grid-cols-2 gap-6 mb-12 text-left">
                                {[
                                    { icon: Star, text: "AIR 1 Strategy" },
                                    { icon: BookOpen, text: "1,000+ Mock Tests" },
                                    { icon: Sparkles, text: "AI Prediction Model" },
                                    { icon: Layout, text: "Handwritten Notes" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <item.icon className="w-6 h-6 text-blue-600" />
                                        <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-7 btn-gradient text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all uppercase italic">
                                UNLOCK ALL ACCESS
                            </button>
                            <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Secure Payment Protected by NoTutor Encrypt</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
