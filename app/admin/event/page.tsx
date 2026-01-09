'use client';

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EventSetup() {
    const router = useRouter();
    const { data: event, error } = useSWR('/api/event', fetcher);

    const [formData, setFormData] = useState({
        name: '',
        audiencePoints: 10,
        judgePoints: 50
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (event && !event.error) {
            setFormData({
                name: event.name,
                audiencePoints: event.audiencePoints,
                judgePoints: event.judgePoints
            });
        }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                mutate('/api/event');
                alert('Event saved successfully!');
                router.push('/admin/dashboard');
            } else {
                alert('Failed to save event');
            }
        } catch (err) {
            alert('Error saving event');
        } finally {
            setLoading(false);
        }
    };

    if (error) return <div className="text-red-500 p-6">Failed to load event</div>;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto glass-card">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Event Setup
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Event Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                            placeholder="e.g. Hackathon 2026"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Audience Points</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.audiencePoints}
                                onChange={(e) => setFormData({ ...formData, audiencePoints: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">Points each audience member gets to distribute.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Judge Points</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.judgePoints}
                                onChange={(e) => setFormData({ ...formData, judgePoints: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">Points allocated to judges (if applicable).</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
