import { useEffect, useState } from 'react';

const STEPS = [
  { en: 'Connecting to GitHub...', ar: 'الاتصال بـ GitHub...' },
  { en: 'Fetching organization data...', ar: 'جلب بيانات المؤسسة...' },
  { en: 'Analyzing workforce patterns...', ar: 'تحليل أنماط القوى العاملة...' },
  { en: 'Running AI burnout models...', ar: 'تشغيل نماذج الذكاء الاصطناعي...' },
  { en: 'Generating insights...', ar: 'توليد الرؤى...' },
  { en: 'Ready ✦', ar: 'جاهز ✦' },
];

const ROLE_LABELS: Record<string, { en: string; ar: string }> = {
  employee: { en: 'Employee', ar: 'موظف' },
  hr:       { en: 'HR',       ar: 'موارد بشرية' },
  manager:  { en: 'Manager',  ar: 'مدير' },
};

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-zinc-400" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Syncing({
  role,
  lang,
  onDone,
}: {
  role: string;
  lang: 'en' | 'ar';
  onDone: () => void;
}) {
  const [stepIdx, setStepIdx]       = useState(0);
  const [progress, setProgress]     = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const isAr = lang === 'ar';
  const roleLabel = ROLE_LABELS[role]?.[lang] ?? role;

  // Drive progress 0→100 over ~2 s, then show success popup
  useEffect(() => {
    const totalMs  = 2000;
    const tickMs   = 30;
    const base     = 100 / (totalMs / tickMs);
    let current    = 0;
    let fired      = false;

    const iv = setInterval(() => {
      current = Math.min(current + base + Math.random() * 0.8, 100);
      setProgress(current);

      if (current >= 100 && !fired) {
        fired = true;
        clearInterval(iv);
        // Small pause so bar visibly reaches 100%, then show popup
        setTimeout(() => setShowSuccess(true), 150);
        // Navigate after popup is visible for 1.2 s
        setTimeout(onDone, 150 + 1200);
      }
    }, tickMs);

    return () => clearInterval(iv);
  }, [onDone]);

  // Advance step label in sync with progress
  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * (STEPS.length - 1)),
      STEPS.length - 1,
    );
    setStepIdx(idx);
  }, [progress]);

  return (
    <div
      className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Noto Sans Arabic', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      {/* ── Syncing UI ── */}
      <div
        className={`relative z-10 flex flex-col items-center gap-8 w-full max-w-sm transition-all duration-500 ${
          showSuccess ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
            H
          </div>
          <span className="font-bold text-white tracking-tight text-lg">HR Insight</span>
        </div>

        {/* Spinner rings */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '1.4s' }} viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="url(#sg1)" strokeWidth="3" strokeLinecap="round" strokeDasharray="200 64" />
            <defs>
              <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
          <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin" style={{ animationDuration: '2.2s', animationDirection: 'reverse' }} viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="url(#sg2)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="80 134" />
            <defs>
              <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
            <GitHubIcon />
          </div>
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isAr ? `تسجيل دخول كـ ${roleLabel}` : `Signing in as ${roleLabel}`}
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #a78bfa, #10b981)',
                boxShadow: '0 0 12px rgba(99,102,241,0.6)',
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-600">
            <span key={stepIdx} className="text-zinc-400" style={{ animation: 'fadeUp 0.3s ease' }}>
              {STEPS[stepIdx]?.[lang]}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i <= stepIdx ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
          ))}
        </div>
      </div>

      {/* ── Success popup ── */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ${
          showSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop glow burst */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${showSuccess ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
        />

        <div
          className={`relative flex flex-col items-center gap-5 px-10 py-10 rounded-3xl border border-emerald-500/30 bg-zinc-900/90 backdrop-blur-xl shadow-2xl transition-all duration-500 ${
            showSuccess ? 'scale-100 translate-y-0' : 'scale-90 translate-y-6'
          }`}
          style={{ boxShadow: showSuccess ? '0 0 60px rgba(16,185,129,0.18), 0 0 120px rgba(16,185,129,0.08)' : 'none' }}
        >
          {/* Animated checkmark ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 24px rgba(16,185,129,0.5)' }}>
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-1.5">
            <p className="text-emerald-400 font-bold text-lg tracking-tight">
              {isAr ? 'تم تسجيل الدخول بنجاح!' : 'Login Successful!'}
            </p>
            <p className="text-zinc-400 text-sm">
              {isAr ? 'مرحباً بك في HR Insight' : 'Welcome to HR Insight'}
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              {isAr ? `جارٍ تحميل لوحة الـ ${roleLabel}...` : `Loading ${roleLabel} dashboard...`}
            </p>
          </div>

          {/* Mini progress pulse */}
          <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                boxShadow: '0 0 8px rgba(16,185,129,0.8)',
                animation: showSuccess ? 'fillBar 1.1s ease forwards' : 'none',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
