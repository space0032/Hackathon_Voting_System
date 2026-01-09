'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    // Simple "auth" for demo - just a secret code check or direct access
    // For this hackathon scope: direct access or simple pass code
    const router = useRouter();
    const [passcode, setPasscode] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === 'cooldude69') { // Simple hardcode for demo
            // In a real app we'd set a cookie/session
            // Here we just redirect to the dashboard
            sessionStorage.setItem('admin_auth', 'true');
            router.push('/admin/dashboard');
        } else {
            alert('Invalid Passcode');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="glass-card w-full max-w-md space-y-8 text-center animate-float">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Admin Portal
                </h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input
                        type="password"
                        placeholder="Enter Admin Passcode"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-center text-xl text-white"
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                        Enter Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
