'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Database, Layers, Clock, Folder, Archive } from 'lucide-react';

export default function DashboardOverview() {
  const [sections, setSections] = useState<{ cms: string[], archived: string[] }>({ cms: [], archived: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const url = localStorage.getItem('cms_db_url');
      if (!url) return;

      setLoading(true);
      fetch('/api/db/sections', {
        headers: { 'x-db-url': url }
      })
        .then(res => res.json())
        .then(data => {
          if (data.sections) {
            setSections(data.sections);
          }
          setLoading(false);
        }).catch(() => setLoading(false));
    };

    loadData();
    window.addEventListener('app-switched', loadData);
    return () => window.removeEventListener('app-switched', loadData);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Overview</h1>
          <p className="text-zinc-500 mt-1">Manage your database collections and tables.</p>
        </div>
        <Link
          href="/dashboard/sections/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Section
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">CMS Tables</h3>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{loading ? '-' : sections.cms.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">External Tables</h3>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{loading ? '-' : sections.archived.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">Last Sync</h3>
          <p className="text-3xl font-bold text-zinc-900 mt-1">Just now</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-zinc-900 mb-4">CMS Tables</h2>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-20 bg-zinc-200 rounded-xl"></div>
            <div className="h-20 bg-zinc-200 rounded-xl"></div>
          </div>
        </div>
      ) : sections.cms.length === 0 ? (
        <div className="text-center py-12 bg-white border border-zinc-200 border-dashed rounded-2xl mb-8">
          <Layers className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-1">No CMS tables found</h3>
          <p className="text-zinc-500 mb-6">Create your first table to start adding content.</p>
          <Link
            href="/dashboard/sections/new"
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Table
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {sections.cms.map(section => (
            <Link
              key={section}
              href={`/dashboard/${section}`}
              className="group bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-zinc-50 group-hover:bg-indigo-50 text-zinc-600 group-hover:text-indigo-600 rounded-xl flex items-center justify-center transition-colors">
                  <Folder className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-semibold text-zinc-900 capitalize mb-1">{section}</h3>
              <p className="text-sm text-zinc-500">Manage {section}</p>
            </Link>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold text-zinc-900 mb-4">External Data</h2>
      {!loading && sections.archived.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.archived.map(section => (
            <Link
              key={section}
              href={`/dashboard/external/${section}`}
              className="group bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-zinc-50 group-hover:bg-zinc-100 text-zinc-600 rounded-xl flex items-center justify-center transition-colors">
                  <Archive className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-semibold text-zinc-900 mb-1 truncate">{section}</h3>
              <p className="text-sm text-zinc-500">View external data</p>
            </Link>
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-8 bg-zinc-50 border border-zinc-200 rounded-2xl">
          <p className="text-zinc-500">No external tables found in database.</p>
        </div>
      ) : null}
    </div>
  );
}
