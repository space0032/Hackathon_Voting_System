'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
    const { data: event, error, isLoading } = useSWR('/api/event', fetcher);
    const [loading, setLoading] = useState(false);

    if (error) return <div className="text-red-500">Failed to load event data</div>;
    if (isLoading) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Admin Dashboard
                </h1>
                <div className="text-sm text-gray-100">
                    Event: {event?.name || 'No Event Setup'}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Event Setup Card */}
                <Link href="/admin/event" className="glass-card group cursor-pointer hover:bg-white/5 block">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                            ⚙️
                        </div>
                        <h2 className="text-xl font-bold">Event Setup</h2>
                    </div>
                    <p className="text-gray-100 text-sm">Create event, set points balance, and configure rules.</p>
                </Link>

                {/* Team Management Card */}
                <Link href="/admin/teams" className="glass-card group cursor-pointer hover:bg-white/5 block">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 rounded-full bg-secondary/20 text-secondary group-hover:scale-110 transition-transform">
                            👥
                        </div>
                        <h2 className="text-xl font-bold">Manage Teams</h2>
                    </div>
                    <p className="text-gray-100 text-sm">Add, edit, or remove participating teams.</p>
                </Link>

                {/* QR Code Card */}
                <Link href="/admin/qr" className="glass-card group cursor-pointer hover:bg-white/5 block">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 rounded-full bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                            📱
                        </div>
                        <h2 className="text-xl font-bold">Audience QR</h2>
                    </div>
                    <p className="text-gray-100 text-sm">Generate QR code for audience voting access.</p>
                </Link>

                {/* Results Card */}
                <Link href="/leaderboard" className="glass-card group cursor-pointer hover:bg-white/5 block">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 rounded-full bg-green-500/20 text-green-500 group-hover:scale-110 transition-transform">
                            🏆
                        </div>
                        <h2 className="text-xl font-bold">Live Results</h2>
                    </div>
                    <p className="text-gray-100 text-sm">View real-time voting leaderboard.</p>
                </Link>
            </div>

            <div className="glass-card mt-8">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors border border-red-500/50">
                        Stop Voting
                    </button>
                    <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors border border-blue-500/50">
                        Export Data
                    </button>
                </div>
            </div>
        </div>
    );
}
