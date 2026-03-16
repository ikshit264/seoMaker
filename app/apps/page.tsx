'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Database, 
  Plus, 
  ArrowRight, 
  Loader2, 
  LayoutTemplate,
  Settings,
  ExternalLink,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface Application {
  id: string;
  appName: string;
  cmsDbUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function AppsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Failed to fetch applications');
      }

      setApplications(data.applications || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApp = (app: Application) => {
    // Set the selected app in localStorage
    localStorage.setItem('cms_db_url', app.cmsDbUrl);
    localStorage.setItem('cms_app_name', app.appName);
    localStorage.setItem('cms_app_id', app.id);
    
    // Navigate to dashboard
    router.push('/dashboard');
  };

  const handleDeleteApp = async (appId: string, appName: string) => {
    if (!confirm(`Are you sure you want to delete "${appName}"? This will only remove the application reference, not your database data.`)) {
      return;
    }

    setDeletingId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete application');
      }

      // Remove from local state
      setApplications(apps => apps.filter(app => app.id !== appId));
      
      // Clear localStorage if this was the active app
      const activeAppId = localStorage.getItem('cms_app_id');
      if (activeAppId === appId) {
        localStorage.removeItem('cms_db_url');
        localStorage.removeItem('cms_app_name');
        localStorage.removeItem('cms_app_id');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const maskDbUrl = (url: string) => {
    try {
      // Hide credentials in the URL
      if (url.includes('@')) {
        const parts = url.split('@');
        return 'mongodb://***@' + parts[1];
      }
      return url.substring(0, 30) + '...';
    } catch {
      return url.substring(0, 30) + '...';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-zinc-500">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <nav className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-zinc-900">SeoMaker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Your Applications</h1>
            <p className="text-zinc-500 mt-1">
              Select an application to manage or create a new one.
            </p>
          </div>
          <Link
            href="/dashboard/new-app"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Applications Grid */}
        {applications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white border border-zinc-200 border-dashed rounded-2xl"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              No applications yet
            </h3>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Create your first application to start managing your CMS content. Each application connects to its own database.
            </p>
            <Link
              href="/dashboard/new-app"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Application
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Database className="w-6 h-6" />
                    </div>
                    <button
                      onClick={() => handleDeleteApp(app.id, app.appName)}
                      disabled={deletingId === app.id}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete application"
                    >
                      {deletingId === app.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-semibold text-zinc-900 text-lg mb-1 truncate">
                    {app.appName}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4 font-mono truncate">
                    {maskDbUrl(app.cmsDbUrl)}
                  </p>

                  <div className="flex items-center text-xs text-zinc-500 mb-6">
                    <span>Created {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleOpenApp(app)}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Open Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Add New Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: applications.length * 0.1 }}
            >
              <Link
                href="/dashboard/new-app"
                className="flex flex-col items-center justify-center h-full min-h-[240px] bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
              >
                <div className="w-12 h-12 bg-white text-zinc-400 group-hover:text-indigo-600 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:shadow transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-medium text-zinc-600 group-hover:text-indigo-700">
                  Create New Application
                </span>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                What is an Application?
              </h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                An application in SeoMaker represents a connection to a specific database. 
                Each application has its own CMS tables, content, and settings. You can create 
                multiple applications to manage different projects or environments (e.g., Production, Staging, Development).
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
