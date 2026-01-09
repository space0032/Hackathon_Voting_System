'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Simple client-side session
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('event', JSON.stringify(data.event));
                router.push('/vote');
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="glass-card w-full max-w-md animate-float">
                <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Welcome!
                </h1>
                <p className="text-gray-100 text-center mb-8">Enter your details to start voting.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-2 text-gray-100">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-gray-100">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Entering...' : 'Enter Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}
