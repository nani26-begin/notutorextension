"use client";

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
    options: any;
    onReady?: (player: any) => void;
    watermarkText?: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const { options, onReady, watermarkText } = props;

    useEffect(() => {
        const checkDomain = (playerInstance: any) => {
            const authorizedDomains = ['localhost', 'notutor.ai', 'www.notutor.ai'];
            if (!authorizedDomains.includes(window.location.hostname)) {
                playerInstance.error({
                    code: 4,
                    message: "UNAUTHORIZED DOMAIN: Playback restricted to authorized sites only."
                });
                playerInstance.pause();
                return false;
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

            player.on('beforeRequest', (options: any) => {
                return options;
            });

        } else {
            const player = playerRef.current;
            if (checkDomain(player)) {
                player.autoplay(options.autoplay);
                player.src(options.sources);
            }
        }
    }, [options, videoRef]);

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
                    <div
                        className="absolute text-white/10 text-[8px] font-bold whitespace-nowrap select-none"
                        style={{
                            bottom: '15%',
                            right: '10%',
                            transform: 'rotate(10deg)',
                        }}
                    >
                        {watermarkText} - Secure Stream
                    </div>
                    {/* Moving Watermark (Periodic) */}
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
