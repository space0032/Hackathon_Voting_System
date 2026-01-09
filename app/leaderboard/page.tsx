'use client';

import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Leaderboard() {
    // Poll every 3 seconds for real-time updates
    const { data: teams, error } = useSWR('/api/teams?eventId=current', fetcher, { refreshInterval: 3000 });
    const { data: event } = useSWR('/api/event', fetcher);

    // Sort teams by total points
    const sortedTeams = teams?.sort((a: any, b: any) => (b.totalPoints || 0) - (a.totalPoints || 0));

    return (
        <div className="min-h-screen p-6">
            <header className="text-center mb-12 mt-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                    Live Leaderboard
                </h1>
                <p className="text-xl text-gray-400">{event?.name || 'Hackathon Event'}</p>
            </header>

            <div className="max-w-4xl mx-auto space-y-4">
                {sortedTeams?.map((team: any, index: number) => {
                    const isFirst = index === 0;
                    const isTop3 = index < 3;

                    return (
                        <div
                            key={team.id}
                            className={`
                glass-card flex items-center justify-between p-6 transform transition-all duration-500
                ${isFirst ? 'bg-yellow-500/10 border-yellow-500/50 scale-105' : ''}
              `}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`
                  w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl
                  ${isFirst ? 'bg-yellow-500 text-f' :
                                        index === 1 ? 'bg-gray-300 text-black' :
                                            index === 2 ? 'bg-orange-600 text-white' : 'bg-white/10 text-gray-400'}
                `}>
                                    #{index + 1}
                                </div>
                                <div>
                                    <h2 className={`font-bold ${isFirst ? 'text-2xl text-yellow-500' : 'text-xl'}`}>
                                        {team.name}
                                    </h2>
                                    <p className="text-gray-200 text-sm hidden md:block">{team.description}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className={`text-3xl font-bold font-mono ${index === 0 ? 'text-yellow-500' :
                                    index === 1 ? 'text-gray-300' :
                                        index === 2 ? 'text-orange-500' : 'text-white'
                                    }`}>
                                    {team.totalPoints || 0}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest">Points</div>
                            </div>
                        </div>
                    );
                })}

                {(!sortedTeams || sortedTeams.length === 0) && (
                    <div className="text-center text-gray-500 py-20 bg-white/5 rounded-xl">
                        Waiting for votes...
                    </div>
                )}
            </div>

            <div className="text-center mt-12 pb-6">
                <Link href="/login" className="text-gray-500 hover:text-white underline">
                    Go to Voting Portal
                </Link>
            </div>
        </div>
    );
}
