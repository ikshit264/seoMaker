'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Database, Lock } from 'lucide-react';

export default function ExternalItemEditor() {
  const { section, id } = useParams() as { section: string, id: string };
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const url = localStorage.getItem('cms_db_url');
    if (!url) {
      router.push('/');
      return;
    }

    if (id === 'new' || id === 'unknown') {
      setData({});
      setLoading(false);
      return;
    }

    fetch(`/api/db/items?section=${section}&id=${id}`, {
      headers: { 'x-db-url': url }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.item) {
          setData(resData.item);
        } else {
          setData({});
        }
        setLoading(false);
      });
  }, [section, id, router]);

  const handleFieldChange = (key: string, value: string) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveClick = () => {
    setShowPasskeyModal(true);
    setPasskey('');
    setPasskeyError('');
  };

  const confirmSave = async () => {
    if (!passkey) {
      setPasskeyError('Passkey is required');
      return;
    }

    setSaving(true);
    setPasskeyError('');
    
    const url = localStorage.getItem('cms_db_url');
    if (!url) return;

    try {
      // First verify passkey
      const verifyRes = await fetch('/api/db/passkey', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-db-url': url
        },
        body: JSON.stringify({ passkey }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error || 'Invalid passkey');
      }

      // If valid, save data
      const method = id === 'new' || id === 'unknown' ? 'POST' : 'PUT';
      const body = id === 'new' || id === 'unknown' ? { section, data } : { section, id, data };

      const res = await fetch('/api/db/items', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-db-url': url
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setShowPasskeyModal(false);
      router.push(`/dashboard/external/${section}`);
    } catch (err: any) {
      setPasskeyError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const fields = data ? Object.keys(data).filter(k => k !== 'id' && k !== '_id') : [];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/external/${section}`}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-zinc-400" />
              {id === 'new' || id === 'unknown' ? 'New Entry' : 'Edit Entry'}
            </h1>
            <p className="text-zinc-500 mt-1">External Data: {section}</p>
          </div>
        </div>
        <button
          onClick={handleSaveClick}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        {fields.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">No editable fields found.</p>
        ) : (
          fields.map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-zinc-700 mb-1 capitalize">{field}</label>
              {typeof data[field] === 'object' ? (
                <textarea
                  value={JSON.stringify(data[field], null, 2)}
                  onChange={(e) => {
                    try {
                      handleFieldChange(field, JSON.parse(e.target.value));
                    } catch (err) {
                      // Let them type invalid JSON temporarily
                      handleFieldChange(field, e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[100px] font-mono text-sm"
                />
              ) : (
                <input
                  type="text"
                  value={data[field] || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Passkey Modal */}
      {showPasskeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-zinc-900 mb-2">Security Verification</h3>
            <p className="text-center text-zinc-500 mb-6 text-sm">
              You are modifying an external database table. Please enter your passkey to confirm these changes.
            </p>
            
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center tracking-widest"
                  autoFocus
                />
              </div>
              
              {passkeyError && (
                <p className="text-red-500 text-sm text-center">{passkeyError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPasskeyModal(false)}
                  className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  disabled={saving || !passkey}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
