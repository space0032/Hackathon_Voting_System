import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-float" style={{ animationDelay: '-3s' }} />

      <div className="glass-card max-w-2xl w-full p-12 z-10 animate-float" style={{ animationDuration: '8s' }}>
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary mb-6">
          HackVote
        </h1>
        <p className="text-xl text-gray-300 mb-10">
          The Future of Hackathon Judging. <br />
          Real-time, Transparent, and Interactive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/login" className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/25">
            🗳️ Vote Now
          </Link>
          <Link href="/leaderboard" className="px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-lg transition-all transform hover:scale-105 border border-white/10 backdrop-blur-sm">
            🏆 Leaderboard
          </Link>
          <div className="col-span-full mt-4">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-white transition-colors">
              Admin Portal &rarr;
            </Link>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-gray-600">
        &copy; 2026 Hackathon Systems Inc.
      </footer>
    </div>
  );
}
