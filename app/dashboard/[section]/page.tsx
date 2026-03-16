'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText, Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function SectionItems() {
  const { section } = useParams() as { section: string };
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const url = localStorage.getItem('cms_db_url');
    if (!url) {
      router.push('/');
      return;
    }

    fetch(`/api/db/items?section=${section}`, {
      headers: { 'x-db-url': url }
    })
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setItems(data.items);
        }
        setLoading(false);
      });
  }, [section, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const url = localStorage.getItem('cms_db_url');
    if (!url) return;

    try {
      await fetch(`/api/db/items?section=${section}&id=${id}`, {
        method: 'DELETE',
        headers: { 'x-db-url': url }
      });
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete item');
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 capitalize">{section}</h1>
          <p className="text-zinc-500 mt-1">Manage your {section} entries.</p>
        </div>
        <Link
          href={`/dashboard/${section}/new`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-1">No entries found</h3>
            <p className="text-zinc-500 mb-6">Create your first entry in this section.</p>
            <Link
              href={`/dashboard/${section}/new`}
              className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Entry
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{item.title || 'Untitled'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-zinc-500">{item.slug || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-zinc-500">
                        {item.created_at ? format(new Date(item.created_at), 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/${section}/${item.id}`}
                          className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
