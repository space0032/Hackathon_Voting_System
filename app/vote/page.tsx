'use client';

import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function VoteDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [event, setEvent] = useState<any>(null);

    // Load session from local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedEvent = localStorage.getItem('event');
        if (!storedUser || !storedEvent) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
        setEvent(JSON.parse(storedEvent));
    }, []);

    const { data: teams, error } = useSWR(event ? `/api/teams?eventId=${event.id}` : null, fetcher);

    // Re-fetch user data to get updated points
    const { data: userData } = useSWR(user ? `/api/user/${user.id}` : null, fetcher, { refreshInterval: 2000 });

    const [votingFor, setVotingFor] = useState<string | null>(null);
    const [pointsToGive, setPointsToGive] = useState(1);

    const totalPoints = event ? (user?.role === 'JUDGE' ? event.judgePoints : event.audiencePoints) : 0;
    // Use userData if available (live updates), else fall back to initial user state
    const spentPoints = userData ? userData.pointsSpent : (user?.pointsSpent || 0);
    const remainingPoints = totalPoints - spentPoints;

    const handleVote = async () => {
        if (!votingFor || !user) return;

        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    teamId: votingFor,
                    points: pointsToGive
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Vote cast successfully!');
                setVotingFor(null);
                mutate(`/api/teams?eventId=${event.id}`); // Refresh team counts
                mutate(`/api/user/${user.id}`); // Refresh user points
            } else {
                alert(data.error || 'Voting failed');
            }
        } catch (err) {
            alert('Network error');
        }
    };

    if (!user || !event) return <div className="text-center p-10">Loading session...</div>;

    return (
        <div className="min-h-screen p-6 pb-20">
            <header className="sticky top-0 z-10 glass-card mb-8 flex justify-between items-center py-4 px-6 bg-black/80 backdrop-blur-xl">
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        {event.name}
                    </h1>
                    <p className="text-xs text-gray-400">Welcome, {user.name}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-secondary">
                        {remainingPoints} <span className="text-xs text-gray-500">pts</span>
                    </div>
                    <p className="text-xs text-gray-500">Remaining Balance</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams?.map((team: any) => (
                    <div key={team.id} className="glass-card flex flex-col justify-between h-full">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {team.description || "No description provided."}
                            </p>
                        </div>

                        <button
                            onClick={() => setVotingFor(team.id)}
                            className="w-full mt-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                        >
                            Vote for this Team
                        </button>
                    </div>
                ))}
            </div>

            {/* Voting Modal */}
            {votingFor && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card max-w-sm w-full animate-float" style={{ animationDuration: '0s' }}>
                        <h3 className="text-xl font-bold mb-4">Cast Vote</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            How many points do you want to give to this team? (Max: {remainingPoints})
                        </p>

                        <div className="mb-8">
                            <input
                                type="number"
                                min="1"
                                max={remainingPoints}
                                value={pointsToGive}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) {
                                        // Allow empty string temporarily or clamp? 
                                        // Better to just set it, clamping on submit or blur might be better UX, 
                                        // but for now let's just properly set it and limit max visual
                                        setPointsToGive(val);
                                    }
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-center text-3xl font-bold font-mono text-primary outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setVotingFor(null)}
                                className="flex-1 py-3 rounded bg-transparent border border-white/20 hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVote}
                                disabled={pointsToGive > remainingPoints || pointsToGive <= 0}
                                className="flex-1 py-3 rounded bg-gradient-to-r from-primary to-accent font-bold disabled:opacity-50"
                            >
                                Confirm Vote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
