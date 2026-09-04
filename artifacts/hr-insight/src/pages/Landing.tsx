import { useState } from 'react';
import { Users, ShieldCheck, Crown, Sparkles, ArrowRight, Globe, Mail } from 'lucide-react';

const ROLES = [
  {
    id: 'employee',
    labelEn: 'Employee',
    labelAr: 'موظف',
    descEn: 'View your performance profile & AI insights',
    descAr: 'اطّلع على ملفك الشخصي ورؤى الذكاء الاصطناعي',
    Icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'hover:shadow-[0_0_28px_rgba(59,130,246,0.25)]',
    activeBorder: 'border-blue-500/60',
    activeBg: 'bg-blue-500/8',
    dot: 'bg-blue-400',
  },
  {
    id: 'hr',
    labelEn: 'HR',
    labelAr: 'موارد بشرية',
    descEn: 'Manage workforce, burnout detection & reports',
    descAr: 'أدر القوى العاملة واكتشف الإرهاق وتقارير الأداء',
    Icon: ShieldCheck,
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'hover:shadow-[0_0_28px_rgba(16,185,129,0.25)]',
    activeBorder: 'border-emerald-500/60',
    activeBg: 'bg-emerald-500/8',
    dot: 'bg-emerald-400',
  },
];

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden>
    <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022"/>
    <path d="M24 24H12.6V12.6H24V24z" fill="#00A4EF"/>
    <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#7FBA00"/>
    <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900"/>
  </svg>
);

export default function Landing({ onLogin, lang, onLangChange }: {
  onLogin: (role: string) => void;
  lang: 'en' | 'ar';
  onLangChange: (l: 'en' | 'ar') => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const isAr = lang === 'ar';

  return (
    <div
      className="min-h-screen bg-zinc-950 text-white overflow-hidden relative"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Noto Sans Arabic', sans-serif" }}
    >
      {/* ── Ambient glow orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-emerald-600/6 blur-[100px]" />
      </div>

      {/* ── Subtle grid ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-zinc-800/60">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
            H
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">HR Insight</span>
            <span className="text-zinc-500 text-sm hidden sm:inline">|</span>
            <span className="text-zinc-400 text-sm hidden sm:inline">بصيرة الموارد البشرية</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Manager quick-login pill */}
          <button
            onClick={() => onLogin('manager')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/40 bg-violet-500/8 text-violet-300 text-xs font-medium
              hover:border-violet-400/70 hover:bg-violet-500/16 hover:text-violet-200
              hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
              active:scale-95 transition-all duration-200 cursor-pointer select-none"
          >
            <Crown className="w-3.5 h-3.5" />
            Manager / مدير
          </button>

          {/* Lang toggle */}
          <button
            onClick={() => onLangChange(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 text-xs font-medium hover:border-zinc-700 hover:text-zinc-200 transition-all duration-200"
          >
            <Globe className="w-3.5 h-3.5" />
            {isAr ? 'EN' : 'AR'}
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-16">

        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          {isAr ? 'مدعوم بالذكاء الاصطناعي — تحليل القوى العاملة في الوقت الفعلي' : 'AI-Powered · Real-time Workforce Intelligence'}
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 max-w-3xl">
          <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {isAr ? 'تعرّف على فريقك' : 'Know Your Team'}
          </span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            {isAr ? 'قبل أن تسألهم' : 'Before You Ask'}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-12">
          {isAr
            ? 'رؤى الإرهاق والأداء وانحراف الدور — كلها مدعومة بالذكاء الاصطناعي ومتاحة في لوحة واحدة.'
            : 'Burnout, performance, and role-drift insights — all AI-driven, all in one dashboard.'}
        </p>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto mb-8">
          {ROLES.map(role => {
            const isActive = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300
                  cursor-pointer text-left select-none
                  hover:scale-[1.04] hover:-translate-y-1 ${role.glow}
                  ${isActive
                    ? `${role.activeBorder} ${role.activeBg} shadow-lg`
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className={`absolute top-3 ${isAr ? 'left-3' : 'right-3'} w-2 h-2 rounded-full ${role.dot} shadow-lg`} />
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg
                  group-hover:scale-110 transition-transform duration-300`}>
                  <role.Icon className="w-6 h-6 text-white" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="font-semibold text-white text-sm">
                    {isAr ? role.labelAr : role.labelEn}
                  </p>
                  {isAr && (
                    <p className="text-zinc-500 text-xs mt-0.5">{role.labelEn}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-zinc-500 text-xs text-center leading-relaxed group-hover:text-zinc-400 transition-colors duration-200">
                  {isAr ? role.descAr : role.descEn}
                </p>
              </button>
            );
          })}
        </div>

        {/* Sign-in box */}
        <div className="w-full max-w-sm space-y-3">

          {/* Email field */}
          <div className="relative">
            <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none ${isAr ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="email"
              placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
              className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-sm text-white placeholder-zinc-600
                focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200
                ${isAr ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
            />
          </div>

          {/* Email continue button */}
          <button
            onClick={() => selected && onLogin(selected)}
            disabled={!selected}
            className={`group relative flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm
              border transition-all duration-300 overflow-hidden
              ${selected
                ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] active:scale-[0.98] cursor-pointer'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
          >
            {isAr ? 'المتابعة' : 'Continue with Email'}
            {selected && <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 rtl:rotate-180 transition-transform duration-200" />}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">{isAr ? 'أو تابع عبر' : 'or continue with'}</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-2">
            {/* Google */}
            <button
              onClick={() => selected && onLogin(selected)}
              disabled={!selected}
              title="Google"
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                ${selected
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white active:scale-[0.97] cursor-pointer'
                  : 'bg-zinc-900/30 border-zinc-800 text-zinc-700 cursor-not-allowed'
                }`}
            >
              <GoogleIcon />
              <span className="hidden sm:inline">Google</span>
            </button>

            {/* GitHub */}
            <button
              onClick={() => selected && onLogin(selected)}
              disabled={!selected}
              title="GitHub"
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                ${selected
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white active:scale-[0.97] cursor-pointer'
                  : 'bg-zinc-900/30 border-zinc-800 text-zinc-700 cursor-not-allowed'
                }`}
            >
              <GitHubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </button>

            {/* Microsoft */}
            <button
              onClick={() => selected && onLogin(selected)}
              disabled={!selected}
              title="Microsoft"
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                ${selected
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white active:scale-[0.97] cursor-pointer'
                  : 'bg-zinc-900/30 border-zinc-800 text-zinc-700 cursor-not-allowed'
                }`}
            >
              <MicrosoftIcon />
              <span className="hidden sm:inline">Microsoft</span>
            </button>
          </div>

          {/* Hint */}
          {selected ? (
            <p className="text-zinc-600 text-xs text-center">
              {isAr
                ? `ستدخل كـ "${ROLES.find(r => r.id === selected)?.labelAr}"`
                : `Signing in as ${ROLES.find(r => r.id === selected)?.labelEn}`}
            </p>
          ) : (
            <p className="text-zinc-700 text-xs text-center">
              {isAr ? 'اختر دورك أولاً للمتابعة' : 'Select your role above to continue'}
            </p>
          )}
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-2">
          {[
            { en: '🔥 Burnout Detection', ar: '🔥 كشف الإرهاق' },
            { en: '📊 Role Drift Analysis', ar: '📊 تحليل انحراف الدور' },
            { en: '🧠 AI Thinking Profiles', ar: '🧠 ملفات التفكير الذكي' },
            { en: '🌐 Arabic / English', ar: '🌐 عربي / إنجليزي' },
            { en: '⚡ Real-time Insights', ar: '⚡ رؤى فورية' },
          ].map(pill => (
            <span key={pill.en} className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-500 text-xs">
              {isAr ? pill.ar : pill.en}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
