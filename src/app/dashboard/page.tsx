"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, FileText, Save, Clock, BookOpen, ChevronRight, Layout, Settings, LogOut, Search, Bell, Loader2, Sparkles, Trophy, Star, X, CheckCircle2, User, Radio, Video } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { VideoPlayer } from "@/components/VideoPlayer"

export default function DashboardPage() {
    const [note, setNote] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [showTopperModal, setShowTopperModal] = useState(false)
    const [videoReady, setVideoReady] = useState(false)
    const [activeTab, setActiveTab] = useState("dashboard")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const id = localStorage.getItem("notutor_user_id")
        if (!id) {
            router.push("/login")
            return
        }
        setUserId(id)

        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`/api/user/profile?userId=${id}`)
                setIsSubscribed(response.data.isSubscribed)
            } catch (err) {
                console.error("Failed to fetch profile")
            } finally {
                setIsLoadingProfile(false)
            }
        }

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
        fetchProfileData()
    }, [router])

    const handleUnlockAll = async () => {
        if (!userId) return
        setIsSaving(true)
        try {
            await axios.post("/api/user/unlock", { userId })
            setIsSubscribed(true)
        } catch (err) {
            console.error("Failed to unlock content")
        } finally {
            setIsSaving(false)
        }
    }


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
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col lg:flex-row font-sans overflow-hidden selection:bg-blue-500/30">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-600/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Sidebar */}
            <aside className="w-full lg:w-20 lg:h-[calc(100vh-2rem)] bg-white/5 backdrop-blur-xl border border-white/10 lg:m-4 lg:rounded-[2.5rem] flex lg:flex-col items-center py-8 gap-8 relative z-50">
                <Link href="/" className="w-12 h-12 btn-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <span className="text-white font-black text-2xl">N</span>
                </Link>

                <nav className="flex lg:flex-col gap-4 items-center flex-1">
                    {[
                        { icon: Layout, label: 'Dashboard', id: 'dashboard' },
                        { icon: User, label: 'Profile', id: 'profile' },
                        { icon: Radio, label: 'Live Section', id: 'live' },
                        { icon: Video, label: 'Videos', id: 'videos' }
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(item.id)}
                            className={`p-4 rounded-2xl transition-all relative group ${activeTab === item.id ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.id === 'live' && <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full glow-cyan animate-pulse"></span>}
                            <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden lg:block border border-white/10">
                                {item.label}
                            </div>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="p-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-8 relative overflow-y-auto h-screen custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20"
                                >
                                    CBSE CLASS 10
                                </motion.span>
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" /> TOPPER AI
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Physics: <span className="text-gradient">Light & Refraction</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search concepts..."
                                    className="w-full pl-11 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs font-medium placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/30 transition-all text-slate-200"
                                />
                            </div>
                            <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 border border-white/10 hover:text-blue-400 hover:bg-white/10 transition-all relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617] glow-cyan"></span>
                            </button>
                        </div>
                    </header>

                    {activeTab === 'dashboard' ? (
                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Video & Notes */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Video Section */}
                                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-3 border border-white/10 shadow-2xl overflow-hidden group">
                                    <div className="aspect-video bg-black rounded-[2rem] overflow-hidden relative">
                                        {!videoReady ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50"></div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setVideoReady(true)}
                                                    className="w-20 h-20 btn-gradient rounded-full flex items-center justify-center shadow-2xl relative z-10"
                                                >
                                                    <Play className="w-8 h-8 text-white fill-white translate-x-1" />
                                                </motion.button>
                                                <p className="text-slate-500 mt-6 font-bold tracking-[0.3em] text-[10px] uppercase relative z-10">Initializing secure session...</p>
                                            </div>
                                        ) : (
                                            <VideoPlayer
                                                options={{
                                                    autoplay: true,
                                                    controls: true,
                                                    responsive: true,
                                                    fluid: true,
                                                    sources: [{
                                                        src: 'https://res.cloudinary.com/dl0jkdtj6/video/upload/v1770871882/Screen_Recording_2026-01-27_175011_nfzlkp.mp4',
                                                        type: 'video/mp4'
                                                    }]
                                                }}
                                                watermarkText={userId || "Student"}
                                                videoId="demo-physics-refraction"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <div className="flex items-center gap-4 text-white">
                                            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold tracking-tight uppercase italic">Intelligence Capture</h3>
                                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Protocol synchronized with cloud</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <AnimatePresence>
                                                {lastSaved && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest italic flex items-center gap-1.5"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3" /> Updated: {lastSaved}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                            <button
                                                onClick={handleSaveNote}
                                                disabled={isSaving}
                                                className="btn-gradient px-6 py-2.5 rounded-xl text-white font-bold text-[11px] flex items-center gap-2 disabled:opacity-50 transition-all uppercase tracking-widest"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Sync Now
                                            </button>
                                        </div>
                                    </div>

                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Start recording your insights..."
                                        className="w-full h-64 bg-black/20 border border-white/5 rounded-2xl p-6 text-slate-300 font-medium text-base placeholder:text-slate-700 outline-none focus:border-blue-500/20 transition-all resize-none leading-relaxed custom-scrollbar"
                                    />
                                </motion.div>
                            </div>

                            {/* Sidebar Widgets */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Mastery Card */}
                                <div className="bg-indigo-600/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>

                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] italic">Knowledge Flow</h4>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse glow-cyan"></div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                                <span>Refraction Index</span>
                                                <span className="text-white">85%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "85%" }}
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400"
                                                ></motion.div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                                <span>Snell's Law</span>
                                                <span className="text-white">42%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "42%" }}
                                                    className="h-full bg-indigo-500"
                                                ></motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xl font-bold italic text-white tracking-tighter">1,240 <span className="text-slate-500 text-[10px] not-italic uppercase tracking-widest ml-1">XP</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold italic text-white tracking-tighter">14 <span className="text-slate-500 text-[10px] not-italic uppercase tracking-widest ml-1">Days</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lesson List */}
                                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-blue-500 rounded-full"></div> Phase 01: Core Theory
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { title: "Mirrors & Focus", time: "Completed", done: true },
                                            { title: "Light & Refraction", time: "Live Session", active: true },
                                            { title: "The Human Eye", time: "Locked" },
                                            { title: "Prism Dispersion", time: "Locked" },
                                        ].map((lesson, i) => (
                                            <div key={i} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${lesson.active ? 'bg-white/10 border-blue-500/20' : 'bg-transparent border-white/5 opacity-40'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${lesson.done ? 'bg-emerald-500' : lesson.active ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'}`}></div>
                                                    <span className="text-xs font-bold text-slate-200 tracking-tight italic uppercase">{lesson.title}</span>
                                                </div>
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${lesson.active ? 'text-blue-400' : 'text-slate-600'}`}>{lesson.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Upgrade Promo */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    onClick={() => setShowTopperModal(true)}
                                    className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer border border-white/10 shadow-2xl"
                                >
                                    <div className="relative z-10">
                                        <h3 className="text-white font-black text-2xl italic tracking-tighter leading-none mb-3">UNLEASH <br /> TOPPER MODE.</h3>
                                        <p className="text-indigo-300 text-[9px] font-bold uppercase tracking-widest mb-6">Access restricted AIR-1 strategy files</p>
                                        <button className="bg-white text-blue-950 px-6 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-blue-50 transition-all flex items-center gap-2">
                                            Join Elite <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <Trophy className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-0 transition-all duration-700" />
                                </motion.div>
                            </div>
                        </div>
                    ) : activeTab === 'videos' ? (
                        <div className="space-y-8">
                            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-3 border border-white/10 shadow-2xl overflow-hidden group">
                                <div className="aspect-video bg-black rounded-[2rem] overflow-hidden relative">
                                    {!isSubscribed ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-600/30 via-transparent to-transparent opacity-50"></div>
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-xl">
                                                <Star className="w-8 h-8 text-indigo-400 fill-indigo-400" />
                                            </div>
                                            <h3 className="text-2xl font-black italic text-white mb-2 uppercase tracking-tighter">PREMIUM CONTENT LOCKED</h3>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8 max-w-[240px]">This strategy session is reserved for elite batch members only.</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleUnlockAll}
                                                disabled={isSaving}
                                                className="btn-gradient px-8 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                Unlock All Content
                                            </motion.button>
                                        </div>
                                    ) : !videoReady ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50"></div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setVideoReady(true)}
                                                className="w-20 h-20 btn-gradient rounded-full flex items-center justify-center shadow-2xl relative z-10"
                                            >
                                                <Play className="w-8 h-8 text-white fill-white translate-x-1" />
                                            </motion.button>
                                            <p className="text-slate-500 mt-6 font-bold tracking-[0.3em] text-[10px] uppercase relative z-10">Initializing video vault...</p>
                                        </div>
                                    ) : (
                                        <VideoPlayer
                                            options={{
                                                autoplay: true,
                                                controls: true,
                                                responsive: true,
                                                fluid: true,
                                                sources: [{
                                                    src: 'https://res.cloudinary.com/dl0jkdtj6/video/upload/v1770871882/Screen_Recording_2026-01-27_175011_nfzlkp.mp4',
                                                    type: 'video/mp4'
                                                }]
                                            }}
                                            watermarkText={userId || "Student"}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Video Notes Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div className="flex items-center gap-4 text-white">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold tracking-tight uppercase italic">Intelligence Capture</h3>
                                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Synchronized during session</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <AnimatePresence>
                                            {lastSaved && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest italic flex items-center gap-1.5"
                                                >
                                                    <CheckCircle2 className="w-3 h-3" /> Updated: {lastSaved}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        <button
                                            onClick={handleSaveNote}
                                            disabled={isSaving}
                                            className="btn-gradient px-6 py-2.5 rounded-xl text-white font-bold text-[11px] flex items-center gap-2 disabled:opacity-50 transition-all uppercase tracking-widest"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Sync Now
                                        </button>
                                    </div>
                                </div>

                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Start recording your insights from this session..."
                                    className="w-full h-40 bg-black/20 border border-white/5 rounded-2xl p-6 text-slate-300 font-medium text-base placeholder:text-slate-700 outline-none focus:border-blue-500/20 transition-all resize-none leading-relaxed custom-scrollbar"
                                />
                            </motion.div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { title: "Refraction Basics", duration: "12:45", status: "watched" },
                                    { title: "Snell's Law Simulation", duration: "08:20", status: "new" },
                                    { title: "Ray Diagrams", duration: "15:10", status: "locked" }
                                ].map((vid, i) => (
                                    <div key={i} className={`bg-white/5 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group ${vid.status === 'locked' ? 'opacity-40' : ''}`}>
                                        <div className="aspect-video bg-slate-800 rounded-xl mb-4 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
                                            {vid.status === 'watched' && <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-emerald-500" />}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-8 h-8 text-white fill-white" />
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-bold text-white uppercase italic tracking-tight mb-1">{vid.title}</h4>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{vid.duration}</span>
                                            {vid.status === 'new' && <span className="text-[8px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">New</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : activeTab === 'live' ? (
                        <div className="space-y-8">
                            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] group-hover:bg-blue-600/20 transition-all duration-700"></div>

                                <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                                    <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                        <Radio className="w-10 h-10 text-indigo-400 animate-pulse" />
                                    </div>

                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
                                        Live Strategy <span className="text-gradient">Transmission</span>
                                    </h2>
                                    <p className="text-slate-400 font-medium text-sm mb-10 leading-relaxed uppercase tracking-widest">
                                        Synchronize with the elite batch for the <span className="text-white font-bold">Physics: Light & Refraction</span> live session. High-density learning protocol active.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 w-full mb-10">
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-emerald-400 text-lg font-black italic uppercase tracking-tighter">ONLINE NOW</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Moderator</p>
                                            <p className="text-white text-lg font-black italic uppercase tracking-tighter">AIR-1 TUTOR</p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={async () => {
                                            if (!userId) return;
                                            setIsSaving(true);
                                            try {
                                                const response = await axios.post("/api/live/join", { userId });
                                                if (response.data.joinUrl) {
                                                    window.open(response.data.joinUrl, '_blank');
                                                }
                                            } catch (err) {
                                                console.error("Failed to join live session", err);
                                            } finally {
                                                setIsSaving(false);
                                            }
                                        }}
                                        disabled={isSaving}
                                        className="w-full py-6 btn-gradient text-white rounded-3xl font-black text-xl tracking-tighter shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-4 transition-all uppercase italic"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-6 h-6" />
                                                START SYNC SESSION
                                            </>
                                        )}
                                    </motion.button>

                                    <p className="mt-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest italic flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full glow-cyan"></div>
                                        Low-Latency BigBlueButton Link Secured
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                                    <Sparkles className="w-12 h-12 text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
                                    {activeTab} Section
                                </h2>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                    This module is currently being optimized for your intelligence level by Topper AI. Check back shortly.
                                </p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>


            {/* Topper Modal */}
            <AnimatePresence>
                {showTopperModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="max-w-md w-full bg-[#0a0f1e] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden"
                        >
                            <button
                                onClick={() => setShowTopperModal(false)}
                                className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-16 h-16 btn-gradient rounded-[1.5rem] flex items-center justify-center mb-8 shadow-blue-500/20">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-3xl font-black text-white italic mb-4 tracking-tighter uppercase">THE ELITE VAULT</h2>
                            <p className="text-slate-400 font-medium text-sm mb-8">Unlock handwritten AIR-1 notes, mock exam predictions, and the secret 2026 intelligence batch.</p>

                            <div className="grid grid-cols-1 gap-3 mb-8">
                                {[
                                    { icon: Star, text: "AIR 1 Master Strategy" },
                                    { icon: BookOpen, text: "1,000+ Topic Simulations" },
                                    { icon: Sparkles, text: "AI Question Prediction" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 px-5 py-4 rounded-2xl border border-white/5">
                                        <item.icon className="w-5 h-5 text-indigo-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-5 btn-gradient text-white rounded-2xl font-black text-lg tracking-tighter hover:shadow-blue-500/40 transition-all uppercase italic">
                                Sync Full Access
                            </button>
                            <p className="mt-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center">Encrypted by NoTutor Secure Protocol</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}
