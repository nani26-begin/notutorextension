"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, CheckCircle2, MessageSquare, GraduationCap, Video, FileText, BarChart3, Star, Zap, Shield, Globe } from "lucide-react"
import { useRef } from "react"

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const features = [
    { title: "AI Chat Assistant", desc: "Instant answers to any CBSE doubt, 24/7.", icon: MessageSquare, color: "from-blue-500 to-blue-600" },
    { title: "Board Simulation", desc: "2026 Batch specialized mock exams.", icon: GraduationCap, color: "from-purple-500 to-purple-600" },
    { title: "Voice Learning", desc: "Listen to concepts in multiple languages.", icon: Video, color: "from-cyan-500 to-cyan-600" },
    { title: "PDF Smart Search", desc: "Upload and analyze your school notes.", icon: FileText, color: "from-pink-500 to-pink-600" },
    { title: "Peak Analytics", desc: "Track your progress with precision.", icon: BarChart3, color: "from-orange-500 to-orange-600" },
    { title: "Doubt Verification", desc: "Step-by-step visual explanations.", icon: CheckCircle2, color: "from-green-500 to-green-600" }
  ]

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Super Navbar */}
      <nav className="fixed top-0 w-full z-50 px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-full px-6 py-3 flex justify-between items-center bg-white/60">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center shadow-blue-500/40"
              >
                <span className="text-white font-bold text-2xl">N</span>
              </motion.div>
              <span className="text-2xl font-black tracking-tighter text-blue-950">NoTutor</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-10 text-sm font-bold text-gray-700">
              {['Features', 'Board Exam', 'Pricing', 'Testimonials'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[10px]">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/login" className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                SIGN IN
              </Link>
              <Link href="/signup" className="btn-gradient px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-xl">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[120px] opacity-60 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              style={{ opacity, scale }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
              >
                <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">Built for the 2026 Batch</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-black text-blue-950 leading-[0.95] tracking-tighter mb-8"
              >
                MASTER <br /> CBSE 10 <br />
                <span className="text-gradient">WITH AI.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-500 max-w-lg mb-12 leading-relaxed font-medium"
              >
                Don&apos;t just study, dominate. The most powerful AI tutor ever built for Indian students is here.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/signup" className="btn-gradient px-10 py-5 rounded-2xl text-white font-black text-lg shadow-2xl shadow-blue-500/40 hover:scale-105 transition-transform flex items-center gap-3">
                  START STUDYING
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="glass px-8 py-5 rounded-2xl text-blue-950 font-black text-lg hover:bg-white transition-colors flex items-center gap-3">
                  <Play className="w-5 h-5 fill-blue-950" />
                  DEMO
                </button>
              </motion.div>

              {/* Trust Badge */}
              <div className="mt-16 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="avatar" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    +50K
                  </div>
                </div>
                <div>
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Trusted by Class 10th Toppers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(31,38,135,0.2)] border-[12px] border-white glass">
                <div className="aspect-[4/5] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-12">
                  <div className="w-full space-y-6">
                    <div className="h-6 w-3/4 bg-blue-100 rounded-full animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-100 rounded-full animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded-full animate-pulse"></div>
                    <div className="pt-8 grid grid-cols-2 gap-4">
                      <div className="h-32 rounded-3xl bg-blue-50"></div>
                      <div className="h-32 rounded-3xl bg-cyan-50"></div>
                    </div>
                    <div className="h-40 rounded-[2rem] bg-gradient-to-r from-blue-600 to-cyan-400"></div>
                  </div>
                </div>
              </div>
              {/* Floating Widgets */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass p-6 rounded-3xl shadow-2xl z-20 w-56"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>
                  <div className="font-black text-blue-950 text-sm italic">AI MATCH: 99.8%</div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-green-500"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-2xl z-20 w-64"
              >
                <p className="text-xs font-black text-gray-400 uppercase mb-3">Live Progress</p>
                <div className="flex items-end gap-1 h-12">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-500 rounded-t-sm"></div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-blue-950 mb-6 tracking-tight"
            >
              ONE AI. ALL THE <span className="text-gradient">ANSWERS.</span>
            </motion.h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">We've automated the entire Class 10 prep. Just bring your brain.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative p-10 rounded-[2.5rem] bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-[0_30px_60px_-12px_rgba(31,38,135,0.08)] transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-blue-950 mb-4">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>

                <div className="absolute top-8 right-10 text-gray-100 font-black text-6xl select-none group-hover:text-blue-50 transition-colors">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          whileInView={{ scale: [0.95, 1] }}
          className="max-w-7xl mx-auto bg-blue-950 rounded-[4rem] p-12 md:p-24 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20 -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[120px] opacity-10 -ml-40 -mb-40"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left text-white">
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter italic">
                Don&apos;t wait. Become topper.
              </h2>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Secure Data</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-cyan-400" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Top Rated</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Made in India</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 text-center flex flex-col items-center">
              <p className="text-cyan-400 font-black uppercase tracking-[0.3em] text-xs mb-6 italic">Join the movement</p>
              <h3 className="text-3xl font-black text-white mb-10">Start your journey <br /> for ₹0 today.</h3>
              <Link href="/signup" className="w-full bg-white text-blue-950 px-8 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3">
                JOIN NOW
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Deep Footer */}
      <footer className="bg-white pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-32">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">N</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-blue-950">NoTutor</span>
              </Link>
              <p className="text-gray-400 font-medium max-w-sm leading-relaxed mb-8">
                Reimagining education for India's youth through the power of advanced Artificial Intelligence.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em] mb-8 italic">Product</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li className="hover:text-blue-600 cursor-pointer">Features</li>
                <li className="hover:text-blue-600 cursor-pointer">Board Exam</li>
                <li className="hover:text-blue-600 cursor-pointer">AI Search</li>
                <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em] mb-8 italic">Compnay</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li className="hover:text-blue-600 cursor-pointer">Story</li>
                <li className="hover:text-blue-600 cursor-pointer">Careers</li>
                <li className="hover:text-blue-600 cursor-pointer">Press</li>
                <li className="hover:text-blue-600 cursor-pointer">Legal</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em] mb-8 italic">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li className="hover:text-blue-600 cursor-pointer">Help Center</li>
                <li className="hover:text-blue-600 cursor-pointer">System Status</li>
                <li className="hover:text-blue-600 cursor-pointer">Twitter</li>
                <li className="hover:text-blue-600 cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">© 2026 NoTutor AI India. All rights reserved.</p>
            <div className="flex gap-8">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic hover:text-blue-600 cursor-pointer transition-colors">Privacy</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic hover:text-blue-600 cursor-pointer transition-colors">Terms</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic hover:text-blue-600 cursor-pointer transition-colors">Cookies</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
