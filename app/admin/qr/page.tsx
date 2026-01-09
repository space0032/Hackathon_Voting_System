'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Link from 'next/link';

export default function QRGenerator() {
    const [qrUrl, setQrUrl] = useState('');
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        // Generate QR for the login page
        const url = `${window.location.origin}/login`;
        setOrigin(url);
        QRCode.toDataURL(url, { width: 400, margin: 2, color: { dark: '#000', light: '#FFF' } })
            .then(setQrUrl)
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <Link href="/admin/dashboard" className="absolute top-6 left-6 text-gray-400 hover:text-white">
                ← Back to Dashboard
            </Link>

            <div className="glass-card p-10 bg-white text-black max-w-lg w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Join the Voting!</h1>
                <p className="text-gray-600 mb-8">Scan to vote for your favorite project.</p>

                {qrUrl ? (
                    <div className="flex justify-center mb-6">
                        <img src={qrUrl} alt="Voting QR Code" className="rounded-lg shadow-xl" />
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">Box Loading...</div>
                )}

                <p className="text-sm text-gray-500 font-mono break-all">{origin}</p>

                <button
                    onClick={() => window.print()}
                    className="mt-8 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
                >
                    Print QR Code
                </button>
            </div>
        </div>
    );
}
