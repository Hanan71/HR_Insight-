import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Landing from '@/pages/Landing';
import Syncing from '@/pages/Syncing';
import Dashboard from '@/pages/Dashboard';
import EmployeeDashboard from '@/pages/EmployeeDashboard';

const queryClient = new QueryClient();
type View  = 'landing' | 'syncing' | 'dashboard' | 'employee';
type Theme = 'dark' | 'light';

function AppShell() {
  const [view,  setView]  = useState<View>('landing');
  const [role,  setRole]  = useState('manager');
  const [lang,  setLang]  = useState<'en' | 'ar'>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('xi-theme') as Theme) ?? 'dark'; } catch { return 'dark'; }
  });

  // Apply theme class to <html> and persist choice
  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', theme === 'light');
    try { localStorage.setItem('xi-theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const handleLogin = (selectedRole: string) => {
    setRole(selectedRole);
    setView('syncing');
  };

  const handleSyncDone = () => {
    const next: View = role === 'employee' ? 'employee' : 'dashboard';
    setView(next);
    // Bridge: notify the floating AI widget that a session has started
    window.dispatchEvent(new CustomEvent('xi:login', { detail: { role } }));
  };

  const handleLogout = () => {
    setView('landing');
    setRole('manager');
    // Bridge: hide the AI widget and reset it
    window.dispatchEvent(new CustomEvent('xi:logout'));
  };

  if (view === 'landing') return <Landing onLogin={handleLogin} lang={lang} onLangChange={setLang} />;
  if (view === 'syncing') return <Syncing role={role} lang={lang} onDone={handleSyncDone} />;
  if (view === 'employee') return (
    <EmployeeDashboard
      onLogout={handleLogout} lang={lang} onLangChange={setLang}
      theme={theme} onThemeToggle={toggleTheme}
    />
  );
  return (
    <Dashboard
      role={role} onLogout={handleLogout} lang={lang} onLangChange={setLang}
      theme={theme} onThemeToggle={toggleTheme}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppShell />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
