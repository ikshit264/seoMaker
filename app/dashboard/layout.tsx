'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Database, Settings, LogOut, Plus, Folder, Loader2, ChevronDown, ChevronRight, Archive, Menu, PanelLeftClose, PanelLeftOpen, Code, Grid3X3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<{ cms: string[], archived: string[] }>({ cms: [], archived: [] });
  const [appName, setAppName] = useState('CMS');
  const [loading, setLoading] = useState(true);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Fetch user's registered applications
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          router.push('/'); // Auth failed
          return;
        }

        const apps = data.applications;
        if (apps.length === 0) {
          if (pathname !== '/dashboard/new-app') {
            router.push('/dashboard/new-app');
          }
          setLoading(false);
          return;
        }

        // 2. Determine Active App
        let url = localStorage.getItem('cms_db_url');
        let currentApp = apps.find((a: any) => a.cmsDbUrl === url);

        if (!currentApp) {
          // If no app is selected, redirect to apps page to let user choose
          // But allow access to /dashboard/new-app to create a new application
          if (pathname !== '/dashboard/new-app') {
            router.push('/apps');
          }
          setLoading(false);
          return;
        }

        localStorage.setItem('cms_db_url', currentApp.cmsDbUrl);
        localStorage.setItem('cms_app_name', currentApp.appName);
        localStorage.setItem('cms_app_id', currentApp.id);
        setAppName(currentApp.appName);
        window.dispatchEvent(new Event('app-switched'));

        // 3. Fetch specific app's sections
        return fetch('/api/db/sections', {
          headers: { 'x-db-url': currentApp.cmsDbUrl }
        });
      })
      .then(res => res?.json())
      .then(data => {
        if (data?.sections) setSections(data.sections);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router, pathname]);

  const handleLogout = () => {
    // Note: To clear the secure HttpOnly cookie we'd need an /api/auth/logout endpoint 
    // but for now we'll just clear local state and push back to home
    localStorage.removeItem('cms_db_url');
    localStorage.removeItem('cms_app_name');
    localStorage.removeItem('cms_app_id');
    document.cookie = 'auth_token=; Max-Age=0; path=/'; // Attempt soft clear
    router.push('/');
  };

  // Handle navigation from collapsed sidebar - expand first, then navigate
  const handleCollapsedNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isCollapsed) {
      e.preventDefault();
      setIsCollapsed(false);
      // Delay navigation to allow animation to complete
      setTimeout(() => {
        router.push(href);
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-zinc-200 flex flex-col fixed h-full transition-all duration-300 z-30`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200">
          {!isCollapsed && (
            <div className="flex items-center overflow-hidden">
              <Database className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
              <span className="font-semibold text-zinc-900 truncate">{appName}</span>
            </div>
          )}
          {isCollapsed && <Database className="w-5 h-5 text-indigo-600 mx-auto" />}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-1 px-3">
            <Link
              href="/dashboard"
              onClick={(e) => handleCollapsedNav(e, '/dashboard')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'} ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? 'Overview' : ''}
            >
              <LayoutDashboard className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span>Overview</span>}
            </Link>

            <Link
              href="/dashboard/integration-guide"
              onClick={(e) => handleCollapsedNav(e, '/dashboard/integration-guide')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === '/dashboard/integration-guide' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'} ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? 'Integration Guide' : ''}
            >
              <Code className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span>Integration Guide</span>}
            </Link>

            {!isCollapsed ? (
              <div className="pt-4 pb-2 px-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">CMS Tables</span>
                <Link href="/dashboard/sections/new" onClick={(e) => handleCollapsedNav(e, '/dashboard/sections/new')} className="text-zinc-400 hover:text-indigo-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="h-px bg-zinc-100 my-4 mx-2" />
            )}
            {loading ? (
              <div className="px-6 py-4 flex justify-center">
                <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
              </div>
            ) : sections.cms.length === 0 ? (
              <div className="px-6 py-4 text-xs text-zinc-500 text-center">
                No CMS tables yet
              </div>
            ) : (
              sections.cms.map(section => {
                const isActive = pathname.startsWith(`/dashboard/${section}`);
                const href = `/dashboard/${section}`;
                return (
                  <Link
                    key={section}
                    href={href}
                    onClick={(e) => handleCollapsedNav(e, href)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'} ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? section.charAt(0).toUpperCase() + section.slice(1) : ''}
                  >
                    <Folder className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
                    {!isCollapsed && <span className="capitalize">{section}</span>}
                  </Link>
                );
              })
            )}

            {!loading && sections.archived.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setArchivedOpen(!archivedOpen)}
                  className="w-full pt-4 pb-2 px-3 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center">
                    <Archive className="w-4 h-4 mr-2 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider group-hover:text-zinc-600 transition-colors">External Data</span>
                  </div>
                  {archivedOpen ? (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  )}
                </button>

                {archivedOpen && (
                  <div className="space-y-1 mt-1">
                    {sections.archived.map(section => {
                      const isActive = pathname.startsWith(`/dashboard/external/${section}`);
                      const href = `/dashboard/external/${section}`;
                      return (
                        <div key={section} className="group relative">
                          <Link
                            href={href}
                            onClick={(e) => handleCollapsedNav(e, href)}
                            className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'}`}
                          >
                            <div className="flex items-center overflow-hidden">
                              <Database className={`w-4 h-4 mr-3 flex-shrink-0 ${isActive ? 'text-zinc-600' : 'text-zinc-400'}`} />
                              <span className="truncate">{section}</span>
                            </div>

                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const dbUrl = localStorage.getItem('cms_db_url');
                                if (!dbUrl) return;

                                // 1. Prompt: Do you want to do this?
                                if (!confirm(`Do you want to move "${section}" to CMS Tables?`)) return;

                                try {
                                  // 2. Check table status (record count)
                                  const statusRes = await fetch(`/api/db/sections/migrate?table=${section}`, {
                                    headers: { 'x-db-url': dbUrl }
                                  });
                                  const { count } = await statusRes.json();

                                  let wipe = false;
                                  if (count > 0) {
                                    // 3. Prompt if not empty
                                    if (confirm(`Table "${section}" has ${count} records. To move it to CMS, it must be completely emptied. Do you want to proceed and wipe all data?`)) {
                                      wipe = true;
                                    } else {
                                      return; // Cancel migration
                                    }
                                  }

                                  // 4. Perform migration
                                  const migrateRes = await fetch('/api/db/sections/migrate', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'x-db-url': dbUrl
                                    },
                                    body: JSON.stringify({ table: section, wipe })
                                  });

                                  if (migrateRes.ok) {
                                    // Refresh sections
                                    const sectionsRes = await fetch('/api/db/sections', {
                                      headers: { 'x-db-url': dbUrl }
                                    });
                                    const data = await sectionsRes.json();
                                    if (data.sections) setSections(data.sections);
                                    alert(`Successfully moved "${section}" to CMS Tables.`);
                                  } else {
                                    const err = await migrateRes.json();
                                    alert(`Migration failed: ${err.error}`);
                                  }
                                } catch (err) {
                                  console.error(err);
                                  alert('An error occurred during migration.');
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-200 rounded text-zinc-400 hover:text-indigo-600 transition-all ml-1"
                              title="Move to CMS Tables"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-200 space-y-2">
          <Link
            href="/apps"
            onClick={(e) => handleCollapsedNav(e, '/apps')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Switch App' : ''}
          >
            <Grid3X3 className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>Switch Application</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Disconnect' : ''}
          >
            <LogOut className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>Disconnect</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
