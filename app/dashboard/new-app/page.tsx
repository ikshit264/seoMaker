'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Loader2, Database } from 'lucide-react';

export default function NewAppPage() {
    const [appName, setAppName] = useState('');
    const [cmsDbUrl, setCmsDbUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Verify DB Connection
            const verifyRes = await fetch('/api/db/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: cmsDbUrl })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
                throw new Error(`DB Connection Failed: ${verifyData.error || 'Invalid URL'}`);
            }

            // 2. Create Application in Platform
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appName, cmsDbUrl })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to create application');
            }

            // 3. Set Active App locally and redirect to apps page
            localStorage.setItem('cms_db_url', data.application.cmsDbUrl);
            localStorage.setItem('cms_app_name', data.application.appName);
            localStorage.setItem('cms_app_id', data.application.id);

            // Redirect to apps page so user can see all their applications
            router.push('/apps');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-12">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-zinc-900">Create your first Application</h1>
                <p className="text-zinc-500 mt-2">Connect your PostgreSQL or MongoDB database to start building.</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Application Name</label>
                        <input
                            type="text"
                            required
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="E.g., Production Site"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Database Connection String</label>
                        <input
                            type="text"
                            required
                            value={cmsDbUrl}
                            onChange={(e) => setCmsDbUrl(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="postgresql://... or mongodb+srv://..."
                        />
                        <p className="text-xs text-zinc-500 mt-2">This is where your CMS content will be stored securely for either SQL or NoSQL mode.</p>
                    </div>

                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Connect Database & Create App
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
