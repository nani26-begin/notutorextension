"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose, onSuccess }: SubscriptionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubscribe = async () => {
        setLoading(true);
        setError('');
        try {
            const userId = localStorage.getItem("notutor_user_id");
            if (!userId) throw new Error("User ID not found");

            const response = await axios.post('/api/subscription', { userId });
            if (response.data.success) {
                onSuccess();
            } else {
                setError('Subscription failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full shadow-2xl relative">

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
                    <p className="text-zinc-400">
                        Your free preview has ended. Subscribe now to unlock full access to all videos and premium features.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Subscribe Now - $0.00 (Mock)'
                    )}
                </button>

                <p className="text-xs text-zinc-600 text-center mt-4">
                    Secure payment powered by Stripe (Mock)
                </p>
            </div>
        </div>
    );
};
