'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, ArrowRight, Loader2 } from 'lucide-react';

export default function NewSection() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = localStorage.getItem('cms_db_url');
    if (!url) {
      router.push('/');
      return;
    }

    try {
      const res = await fetch('/api/db/sections', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-db-url': url
        },
        body: JSON.stringify({ name: name.toLowerCase().replace(/[^a-z0-9_]/g, '_') }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create section');
      }

      // Force a hard navigation to refresh the sidebar
      window.location.href = `/dashboard/${data.section}`;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Create Section</h1>
        <p className="text-zinc-500 mb-8">
          Sections are like tables or collections in your database. Use them to group related content like &quot;blogs&quot;, &quot;products&quot;, or &quot;authors&quot;.
        </p>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Section Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. blogs"
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
            <p className="text-xs text-zinc-400 mt-2">
              Only lowercase letters, numbers, and underscores are allowed.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Section <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
