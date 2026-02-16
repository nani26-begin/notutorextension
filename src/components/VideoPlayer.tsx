"use client";

import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import axios from 'axios';
import { SubscriptionModal } from './SubscriptionModal';

interface VideoPlayerProps {
    options: any;
    onReady?: (player: any) => void;
    watermarkText?: string;
    videoId?: string; // We need videoId to check access
}

export const VideoPlayer = (props: VideoPlayerProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const { options, onReady, watermarkText, videoId } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accessInfo, setAccessInfo] = useState<{ accessLevel: string; timeLimit: number; videoUrl?: string } | null>(null);
    const [currentTime, setCurrentTime] = useState(0);

    // Fetch video access info
    useEffect(() => {
        const fetchAccess = async () => {
            if (!videoId) return;
            const userId = localStorage.getItem("notutor_user_id");

            // If strictly enforcing auth, return/warn if no userId
            if (!userId) {
                console.warn("User ID not found in localStorage, cannot verify subscription status.");
                return;
            }

            try {
                const response = await axios.post('/api/video', { videoId, userId });
                setAccessInfo(response.data);

                // If we get a new video URL (signed), update the player source
                if (playerRef.current && response.data.videoUrl) {
                    playerRef.current.src({ type: 'video/mp4', src: response.data.videoUrl });
                }

            } catch (error) {
                console.error("Failed to fetch video access:", error);
            }
        };

        fetchAccess();
    }, [videoId]);

    useEffect(() => {
        const checkDomain = (playerInstance: any) => {
            // Basic domain check from previous code
            const authorizedDomains = ['notutorextension-git-main-chiranjeevis-projects-2c5bc43c.vercel.app', 'notutor.ai', 'www.notutor.ai', 'localhost'];
            if (!authorizedDomains.includes(window.location.hostname)) {
                // warning: localhost is allowed for dev
                if (window.location.hostname !== 'localhost') {
                    playerInstance.error({
                        code: 4,
                        message: "UNAUTHORIZED DOMAIN: Playback restricted to authorized sites only."
                    });
                    playerInstance.pause();
                    return false;
                }
            }
            return true;
        };

        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-city');
            videoRef.current?.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });

            checkDomain(player);

            player.on('timeupdate', () => {
                const time = player.currentTime();
                if (typeof time === 'number') {
                    setCurrentTime(time);
                }
            });

            // Handle source requests
            player.on('beforeRequest', (options: any) => {
                return options;
            });

        } else {
            const player = playerRef.current;
            if (checkDomain(player)) {
                // Only update if options change and we haven't set a signed URL yet
                if (!accessInfo?.videoUrl) {
                    player.autoplay(options.autoplay);
                    player.src(options.sources);
                }
            }
        }
    }, [options, videoRef, accessInfo]); // Depend on accessInfo to re-trigger if needed, though mostly handled in fetch

    // Timer Logic for Limited Access
    useEffect(() => {
        if (!accessInfo || !playerRef.current) return;

        const { accessLevel, timeLimit } = accessInfo;

        if (accessLevel === 'limited' && timeLimit > 0) {
            if (currentTime >= timeLimit) {
                playerRef.current.pause();
                playerRef.current.exitFullscreen(); // Exit fullscreen if active
                setIsModalOpen(true);
            }
        }
    }, [currentTime, accessInfo]);

    const handleSubscriptionSuccess = () => {
        setIsModalOpen(false);
        // Refresh access info to get full access
        if (videoId) {
            const userId = localStorage.getItem("notutor_user_id");
            axios.post('/api/video', { videoId, userId }).then(response => {
                setAccessInfo(response.data);
                if (playerRef.current && response.data.videoUrl) {
                    const currentTime = playerRef.current.currentTime();
                    playerRef.current.src({ type: 'video/mp4', src: response.data.videoUrl });
                    playerRef.current.currentTime(currentTime); // Resume from where stopped
                    playerRef.current.play();
                }
            });
        }
        alert("Subscription Successful! Enjoy full access.");
    };

    // Dispose the player on unmount
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player className="w-full h-full relative group">
            <div ref={videoRef} className="w-full h-full" />

            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Optional: forbid closing?
                onSuccess={handleSubscriptionSuccess}
            />

            {/* --- Security Feature: Watermarking --- */}
            {watermarkText && (
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <div
                        className="absolute text-white/20 text-xs font-bold whitespace-nowrap select-none italic"
                        style={{
                            top: '10%',
                            left: '5%',
                            transform: 'rotate(-20deg)',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        {watermarkText}
                    </div>
                    {/* ... other watermark elements ... */}
                    <div className="watermark-moving absolute text-white/5 text-[10px] font-bold pointer-events-none">
                        {watermarkText} - {new Date().toLocaleDateString()}
                    </div>
                </div>
            )}

            <style jsx>{`
        .watermark-moving {
          animation: moveWatermark 20s linear infinite;
        }
        @keyframes moveWatermark {
          0% { top: 10%; left: 10%; opacity: 0.05; }
          25% { top: 80%; left: 20%; opacity: 0.1; }
          50% { top: 30%; left: 70%; opacity: 0.05; }
          75% { top: 70%; left: 80%; opacity: 0.1; }
          100% { top: 10%; left: 10%; opacity: 0.05; }
        }
      `}</style>
        </div>
    );
}
