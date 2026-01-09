'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TeamManagement() {
    const router = useRouter();
    const { data: event } = useSWR('/api/event', fetcher);
    const { data: teams, error } = useSWR(event ? `/api/teams?eventId=${event.id}` : null, fetcher);

    const [newTeam, setNewTeam] = useState({ name: '', description: '' });
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return alert('No event found');

        const res = await fetch('/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newTeam, eventId: event.id })
        });

        if (res.ok) {
            setNewTeam({ name: '', description: '' });
            setIsAdding(false);
            mutate(`/api/teams?eventId=${event.id}`);
        } else {
            alert('Failed to add team');
        }
    };

    if (!event) return <div className="p-10 text-center">Loading event...</div>;

    return (
        <div className="min-h-screen p-6 container mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-white mb-2 inline-block">← Back to Dashboard</Link>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
                        Manage Teams
                    </h1>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    {isAdding ? 'Close Form' : '+ Add New Team'}
                </button>
            </div>

            {isAdding && (
                <div className="glass-card mb-8 animate-float" style={{ animationDuration: '0s' }}>
                    <h2 className="text-xl font-bold mb-4">Add New Team</h2>
                    <form onSubmit={handleAddTeam} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm mb-1 text-gray-400">Team/Project Name</label>
                            <input
                                required
                                value={newTeam.name}
                                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded p-2 focus:border-primary outline-none"
                                placeholder="e.g. Team Alpha"
                            />
                        </div>
                        <div className="flex-[2] w-full">
                            <label className="block text-sm mb-1 text-gray-400">Description (Optional)</label>
                            <input
                                value={newTeam.description}
                                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded p-2 focus:border-primary outline-none"
                                placeholder="One line pitch..."
                            />
                        </div>
                        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold">
                            Save
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams && teams.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No teams added yet. Click "Add New Team" to start.
                    </div>
                )}

                {teams?.map((team: any) => (
                    <div key={team.id} className="glass-card border-l-4 border-l-secondary">
                        <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                        <p className="text-gray-400 mb-4 text-sm">{team.description || 'No description'}</p>
                        <div className="text-xs bg-white/5 inline-block px-2 py-1 rounded text-gray-300">
                            Votes Received: {team._count?.votes || 0}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
