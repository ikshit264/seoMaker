'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Database, Loader2, Search } from 'lucide-react';

export default function ExternalSectionItems() {
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

  // Get columns from the first item
  const columns = items.length > 0 ? Object.keys(items[0]).filter(k => k !== 'id' && k !== '_id').slice(0, 4) : [];

  const filteredItems = items.filter(item => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return columns.some(col => String(item[col]).toLowerCase().includes(searchLower));
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 truncate flex items-center gap-2">
            <Database className="w-6 h-6 text-zinc-400" />
            {section}
          </h1>
          <p className="text-zinc-500 mt-1">View and manage external data.</p>
        </div>
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
            <Database className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-1">No entries found</h3>
            <p className="text-zinc-500">This table is currently empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-3">ID</th>
                  {columns.map(col => (
                    <th key={col} className="px-6 py-3">{col}</th>
                  ))}
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredItems.map((item, i) => (
                  <tr key={item.id || i} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-zinc-500 truncate max-w-[100px]">
                        {item.id || item._id || '-'}
                      </div>
                    </td>
                    {columns.map(col => (
                      <td key={col} className="px-6 py-4">
                        <div className="text-sm text-zinc-900 truncate max-w-[200px]">
                          {typeof item[col] === 'object' ? JSON.stringify(item[col]) : String(item[col] || '-')}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/external/${section}/${item.id || item._id || 'unknown'}`}
                          className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
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
