import { useState, useMemo } from 'react';
import {
  Users, AlertTriangle, Flame, Lightbulb, Sparkles, X,
  Brain, TrendingUp, ShieldAlert, CheckCircle2, Loader2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

type Language = 'en' | 'ar';

// ── Types ─────────────────────────────────────────────────────────────────────
interface AnalysisResult {
  summary: string;
  skills: string[];
  burnout: { score: number; status: string; signals: string[] };
  role_drift: { detected: boolean; official_role: string; actual_role: string; reason: string };
  thinking_style: { category: string; explanation: string };
  smart_decisions: { recommended_task: string; career_development: string; alert: string };
}
type Department = 'engineering' | 'operations' | 'marketing' | 'hr-admin';

interface ProjectContribution {
  projectId: string;
  commits: number;
  reports: number;
  role: 'lead' | 'contributor' | 'reviewer';
}

interface Employee {
  nameEn: string; nameAr: string; roleEn: string; roleAr: string;
  burnout: 'low' | 'medium' | 'high'; innovator: boolean; technical: boolean;
  department: Department;
  projects: ProjectContribution[];
  photo?: string;   // profile picture URL; falls back to gradient initials on error/absence
}

// ── Translations ──────────────────────────────────────────────────────────────
const translations = {
  en: {
    appTitle: 'HR Insight', appTitleAr: 'بصيرة الموارد البشرية',
    totalEmployees: 'Total Employees', burnoutCases: 'Burnout Cases',
    topInnovators: 'Top Innovators', aiInsightsToday: 'AI Insights Today',
    burnoutDistribution: 'Burnout Distribution', employeePerformance: 'Employee Performance Overview',
    name: 'Name', role: 'Role', burnoutLevel: 'Burnout Level', innovation: 'Innovation',
    action: 'Action', aiInsightTitle: 'AI Insight',
    aiInsightContent: 'Ahmed Al-Rashidi shows high innovation potential but increasing burnout risk. Recommendation: reduce current workload by 20% and involve him in strategic planning tasks to sustain engagement.',
    viewDetails: 'View Details', burnoutHigh: 'High', burnoutMedium: 'Medium', burnoutLow: 'Low',
    analyzing: 'Analyzing…', aiAnalysis: 'AI Analysis', professionalSummary: 'Professional Summary',
    detectedSkills: 'Detected Skills', burnoutAnalysis: 'Burnout Analysis', burnoutScore: 'Burnout Score',
    burnoutSignals: 'Warning Signals', roleDrift: 'Role Drift Detection', officialRole: 'Official Role',
    actualRole: 'Actual Role', driftReason: 'Reason', driftDetected: '⚠️ Drift Detected',
    noDrift: '✅ No Drift', thinkingStyle: 'Thinking Style', smartDecisions: 'Smart Recommendations',
    recommendedTask: 'Recommended Task', careerDev: 'Career Development', alert: 'Smart Alert', close: 'Close',
    technical: 'Technical', nonTechnical: 'Non-Technical', teamBreakdown: 'Team Breakdown',
    teamBreakdownSub: 'Smartly categorizes technical and non-technical teams via real-time analytics.',
    filterAll: 'All', techCount: 'Technical Teams', nonTechCount: 'Non-Technical Teams',
    category: 'Category', burnoutInTech: 'Burnout in Tech', innovatorsInTech: 'Innovators in Tech',
    department: 'Department', deptAll: 'All Departments',
    deptEngineering: 'Engineering', deptOperations: 'Operations',
    deptMarketing: 'Marketing', deptHrAdmin: 'HR & Admin',
    deptBreakdown: 'Department Breakdown',
    deptBreakdownSub: 'Automatically groups employees under their respective departments using real-time task analytics.',
    projectContributions: 'Project Contributions',
    projectContributionsSub: 'Automatically tracks and maps each employee to the specific projects they contributed to using real-time commit and report analytics.',
    commits: 'commits', reports: 'reports', contributors: 'contributors',
    projectLead: 'Lead', projectContributor: 'Contributor', projectReviewer: 'Reviewer',
    statusActive: 'Active', statusReview: 'In Review',
    projects: 'Projects',
  },
  ar: {
    appTitle: 'HR Insight', appTitleAr: 'بصيرة الموارد البشرية',
    totalEmployees: 'إجمالي الموظفين', burnoutCases: 'حالات الإرهاق',
    topInnovators: 'المبتكرون الرائدون', aiInsightsToday: 'رؤى الذكاء الاصطناعي',
    burnoutDistribution: 'توزيع الإرهاق', employeePerformance: 'نظرة عامة على أداء الموظفين',
    name: 'الاسم', role: 'المسمى الوظيفي', burnoutLevel: 'مستوى الإرهاق', innovation: 'الابتكار',
    action: 'الإجراء', aiInsightTitle: 'رؤية الذكاء الاصطناعي',
    aiInsightContent: 'يُظهر أحمد الراشدي إمكانات ابتكارية عالية مع ارتفاع في مخاطر الإرهاق. التوصية: تخفيض عبء العمل الحالي بنسبة 20٪ وإشراكه في مهام التخطيط الاستراتيجي للحفاظ على مستوى التفاعل.',
    viewDetails: 'عرض التفاصيل', burnoutHigh: 'مرتفع', burnoutMedium: 'متوسط', burnoutLow: 'منخفض',
    analyzing: 'جارٍ التحليل…', aiAnalysis: 'التحليل الذكي', professionalSummary: 'الملخص المهني',
    detectedSkills: 'المهارات المكتشفة', burnoutAnalysis: 'تحليل الإرهاق الوظيفي', burnoutScore: 'درجة الإرهاق',
    burnoutSignals: 'إشارات التحذير', roleDrift: 'كشف انحراف الدور الوظيفي', officialRole: 'الدور الرسمي',
    actualRole: 'الدور الفعلي', driftReason: 'السبب', driftDetected: '⚠️ انحراف مكتشف',
    noDrift: '✅ لا انحراف', thinkingStyle: 'أسلوب التفكير', smartDecisions: 'التوصيات الذكية',
    recommendedTask: 'المهمة المقترحة', careerDev: 'التطوير المهني', alert: 'التنبيه الذكي', close: 'إغلاق',
    technical: 'تقني', nonTechnical: 'غير تقني', teamBreakdown: 'تصنيف الفرق',
    teamBreakdownSub: 'يصنّف الفرق التقنية وغير التقنية بذكاء عبر تحليلات فورية.',
    filterAll: 'الكل', techCount: 'الفرق التقنية', nonTechCount: 'الفرق غير التقنية',
    category: 'التصنيف', burnoutInTech: 'الإرهاق في التقنية', innovatorsInTech: 'المبتكرون في التقنية',
    department: 'القسم', deptAll: 'جميع الأقسام',
    deptEngineering: 'الهندسة', deptOperations: 'العمليات',
    deptMarketing: 'التسويق', deptHrAdmin: 'الموارد البشرية والإدارة',
    deptBreakdown: 'تصنيف الأقسام',
    deptBreakdownSub: 'يجمّع الموظفين تلقائياً ضمن أقسامهم عبر تحليلات المهام الفورية.',
    projectContributions: 'مساهمات المشاريع',
    projectContributionsSub: 'يتتبع ويربط كل موظف بالمشاريع التي ساهم فيها تلقائياً عبر تحليلات الإيداعات والتقارير الفورية.',
    commits: 'إيداع', reports: 'تقرير', contributors: 'مساهمون',
    projectLead: 'قائد', projectContributor: 'مساهم', projectReviewer: 'مراجع',
    statusActive: 'نشط', statusReview: 'قيد المراجعة',
    projects: 'المشاريع',
  },
};

// ── Static data ───────────────────────────────────────────────────────────────
const burnoutDataEn = [
  { key: 'low',    name: 'Low',    value: 156, color: '#22c55e' },
  { key: 'medium', name: 'Medium', value: 60,  color: '#f59e0b' },
  { key: 'high',   name: 'High',   value: 32,  color: '#ef4444' },
];
const burnoutDataAr = [
  { key: 'low',    name: 'منخفض', value: 156, color: '#22c55e' },
  { key: 'medium', name: 'متوسط', value: 60,  color: '#f59e0b' },
  { key: 'high',   name: 'مرتفع', value: 32,  color: '#ef4444' },
];
const performanceData = [
  { nameEn: 'Ahmed Al-Rashidi', nameAr: 'أحمد الراشدي', score: 92, department: 'engineering',
    projects: [{ projectId:'atlas', commits:47, reports:8, role:'lead' }, { projectId:'nova', commits:22, reports:4, role:'contributor' }] },
  { nameEn: 'Sara Al-Zahra',    nameAr: 'سارة الزهراء',  score: 85, department: 'engineering',
    projects: [{ projectId:'atlas', commits:31, reports:5, role:'contributor' }, { projectId:'pulse', commits:28, reports:6, role:'lead' }] },
  { nameEn: 'Omar Khalid',      nameAr: 'عمر خالد',      score: 78, department: 'engineering',
    projects: [{ projectId:'nova', commits:56, reports:9, role:'lead' }, { projectId:'atlas', commits:18, reports:3, role:'contributor' }, { projectId:'shield', commits:12, reports:2, role:'reviewer' }] },
  { nameEn: 'Fatima Hassan',    nameAr: 'فاطمة حسن',     score: 94, department: 'operations',
    projects: [{ projectId:'pulse', commits:67, reports:14, role:'lead' }, { projectId:'nova', commits:34, reports:7, role:'contributor' }] },
  { nameEn: 'Khalid Ibrahim',   nameAr: 'خالد إبراهيم',  score: 71, department: 'hr-admin',
    projects: [{ projectId:'shield', commits:11, reports:5, role:'contributor' }] },
  { nameEn: 'Nora Saleem',      nameAr: 'نورة سليم',     score: 88, department: 'marketing',
    projects: [{ projectId:'atlas', commits:29, reports:6, role:'contributor' }, { projectId:'nova', commits:14, reports:3, role:'reviewer' }, { projectId:'shield', commits:45, reports:9, role:'lead' }] },
];
const employees: Employee[] = [
  { nameEn: 'Ahmed Al-Rashidi', nameAr: 'أحمد الراشدي', roleEn: 'Product Manager',   roleAr: 'مدير المنتج',            burnout: 'high',   innovator: true,  technical: true, department: 'engineering',
    photo: 'https://i.pravatar.cc/150?img=11',
    projects: [{ projectId:'atlas', commits:47, reports:8, role:'lead' }, { projectId:'nova', commits:22, reports:4, role:'contributor' }] },
  { nameEn: 'Sara Al-Zahra',    nameAr: 'سارة الزهراء',  roleEn: 'UX Designer',       roleAr: 'مصممة تجربة المستخدم',  burnout: 'low',    innovator: false, technical: true, department: 'engineering',
    photo: 'https://i.pravatar.cc/150?img=47',
    projects: [{ projectId:'atlas', commits:31, reports:5, role:'contributor' }, { projectId:'pulse', commits:28, reports:6, role:'lead' }] },
  { nameEn: 'Omar Khalid',      nameAr: 'عمر خالد',      roleEn: 'Software Engineer', roleAr: 'مهندس برمجيات',         burnout: 'medium', innovator: false, technical: true, department: 'engineering',
    photo: 'https://i.pravatar.cc/150?img=3',
    projects: [{ projectId:'nova', commits:56, reports:9, role:'lead' }, { projectId:'atlas', commits:18, reports:3, role:'contributor' }, { projectId:'shield', commits:12, reports:2, role:'reviewer' }] },
  { nameEn: 'Fatima Hassan',    nameAr: 'فاطمة حسن',     roleEn: 'Data Scientist',    roleAr: 'عالمة بيانات',          burnout: 'low',    innovator: true,  technical: true, department: 'operations',
    photo: 'https://i.pravatar.cc/150?img=25',
    projects: [{ projectId:'pulse', commits:67, reports:14, role:'lead' }, { projectId:'nova', commits:34, reports:7, role:'contributor' }] },
  { nameEn: 'Khalid Ibrahim',   nameAr: 'خالد إبراهيم',  roleEn: 'HR Specialist',     roleAr: 'أخصائي موارد بشرية',   burnout: 'high',   innovator: false, technical: false, department: 'hr-admin',
    photo: 'https://i.pravatar.cc/150?img=12',
    projects: [{ projectId:'shield', commits:11, reports:5, role:'contributor' }] },
  { nameEn: 'Nora Saleem',      nameAr: 'نورة سليم',     roleEn: 'Team Lead',         roleAr: 'قائدة الفريق',          burnout: 'medium', innovator: true,  technical: true, department: 'marketing',
    photo: 'https://i.pravatar.cc/150?img=48',
    projects: [{ projectId:'atlas', commits:29, reports:6, role:'contributor' }, { projectId:'nova', commits:14, reports:3, role:'reviewer' }, { projectId:'shield', commits:45, reports:9, role:'lead' }] },
];

// ── Project registry ──────────────────────────────────────────────────────────
const projectData = [
  { id: 'atlas',  nameEn: 'Project Atlas',     nameAr: 'مشروع أطلس',        color: 'indigo',  totalCommits: 234, status: 'active' as const },
  { id: 'nova',   nameEn: 'Nova Platform',      nameAr: 'منصة نوفا',         color: 'violet',  totalCommits: 189, status: 'active' as const },
  { id: 'pulse',  nameEn: 'Pulse Analytics',    nameAr: 'تحليلات بُلس',      color: 'emerald', totalCommits: 145, status: 'review' as const },
  { id: 'shield', nameEn: 'Shield Security',    nameAr: 'شيلد للأمان',       color: 'amber',   totalCommits: 98,  status: 'active' as const },
];

// ── Avatar (photo + gradient-initials fallback) ───────────────────────────────
const _AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
];

function Avatar({
  nameEn, photo = '', size = 32, borderRadius = '50%',
}: {
  nameEn: string; photo?: string; size?: number; borderRadius?: string;
}) {
  const [err, setErr] = useState(false);
  const ini = nameEn.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const grad = _AVATAR_GRADIENTS[nameEn.charCodeAt(0) % _AVATAR_GRADIENTS.length];
  const dim = size + 'px';
  const fontSize = size <= 24 ? '9px' : size <= 32 ? '10px' : size <= 42 ? '12px' : '15px';

  if (photo && !err) {
    return (
      <img
        src={photo} alt={nameEn}
        onError={() => setErr(true)}
        className="object-cover flex-shrink-0 ring-1 ring-zinc-700/60"
        style={{ width: dim, height: dim, borderRadius }}
      />
    );
  }
  return (
    <div
      className={`flex-shrink-0 bg-gradient-to-br ${grad} flex items-center justify-center font-bold text-white ring-1 ring-white/10`}
      style={{ width: dim, height: dim, borderRadius, fontSize }}
    >
      {ini}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard({ role = 'manager', onLogout, lang, onLangChange, theme = 'dark', onThemeToggle }: {
  role?: string; onLogout?: () => void;
  lang: Language; onLangChange: (l: Language) => void;
  theme?: string; onThemeToggle?: () => void;
}) {
  const [cardModal, setCardModal] = useState<'employees' | 'burnout' | 'innovators' | 'insights' | null>(null);
  const [tableFilter, setTableFilter] = useState<'all' | 'technical' | 'non-technical'>('all');
  const [deptFilter, setDeptFilter] = useState<'all' | Department>('all');
  const filteredEmployees = useMemo(() => {
    let list = tableFilter === 'all' ? employees :
               tableFilter === 'technical' ? employees.filter(e => e.technical) :
               employees.filter(e => !e.technical);
    if (deptFilter !== 'all') list = list.filter(e => e.department === deptFilter);
    return list;
  }, [tableFilter, deptFilter]);
  const [modalState, setModalState] = useState<{
    open: boolean; employee: Employee | null; loading: boolean;
    result: AnalysisResult | null; error: string | null;
  }>({ open: false, employee: null, loading: false, result: null, error: null });

  const t = translations[lang];
  const isAr = lang === 'ar';
  const burnoutData = isAr ? burnoutDataAr : burnoutDataEn;
  const fontStyle = isAr ? { fontFamily: "'Segoe UI', 'Noto Sans Arabic', Arial, sans-serif" } : {};
  const toggleLanguage = () => onLangChange(lang === 'en' ? 'ar' : 'en');

  const handleViewDetails = async (emp: Employee) => {
    setModalState({ open: true, employee: emp, loading: true, result: null, error: null });
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: emp.nameEn }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data: AnalysisResult = await res.json();
      setModalState(s => ({ ...s, loading: false, result: data }));
    } catch (err) {
      setModalState(s => ({ ...s, loading: false, error: String(err) }));
    }
  };
  const closeModal = () =>
    setModalState({ open: false, employee: null, loading: false, result: null, error: null });

  return (
    <div
      className="min-h-[100dvh] bg-zinc-950 text-white"
      dir={isAr ? 'rtl' : 'ltr'}
      style={fontStyle}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              H
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">{t.appTitle}</span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-zinc-400 text-sm hidden sm:inline">{t.appTitleAr}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-amber-300 transition-all duration-200"
              >
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            )}
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 text-xs font-medium hover:border-zinc-700 hover:text-zinc-200 transition-all duration-200"
            >
              <span className={lang === 'en' ? 'text-indigo-400 font-bold' : ''}>EN</span>
              <span className="text-zinc-700">|</span>
              <span className={lang === 'ar' ? 'text-indigo-400 font-bold' : ''}>AR</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-500 text-xs hover:border-zinc-700 hover:text-zinc-300 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {isAr ? 'خروج' : 'Logout'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Role greeting banner ── */}
        <div className={`relative overflow-hidden flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-500
          ${role === 'hr'
            ? 'bg-emerald-500/6 border-emerald-500/20'
            : 'bg-indigo-500/6 border-indigo-500/20'
          }`}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: role === 'hr'
              ? 'radial-gradient(ellipse at 0% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at 0% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)'
            }}
          />
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg
            ${role === 'hr' ? 'bg-emerald-500/12' : 'bg-indigo-500/12'}`}>
            {role === 'hr' ? '🛡️' : '👑'}
          </div>
          <div>
            <p className={`font-bold text-sm sm:text-base ${role === 'hr' ? 'text-emerald-300' : 'text-indigo-300'}`}>
              {isAr
                ? role === 'hr'
                  ? 'أهلاً بكِ في لوحة التحكم، مرحباً بالـ HR 👋'
                  : 'أهلاً بك في لوحة التحكم، مرحباً بالـ Manager 👋'
                : role === 'hr'
                  ? 'Welcome to the dashboard, hello HR! 👋'
                  : 'Welcome to the dashboard, hello Manager! 👋'
              }
            </p>
            <p className={`text-xs mt-0.5 ${role === 'hr' ? 'text-emerald-500' : 'text-indigo-500'}`}>
              {isAr
                ? 'إليك أحدث تحليلات القوى العاملة المدعومة بالذكاء الاصطناعي.'
                : 'Here are the latest AI-powered workforce analytics for your team.'}
            </p>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ClickCard onClick={() => setCardModal('employees')}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">{t.totalEmployees}</p>
                <h3 className="text-2xl font-bold text-white mt-0.5">248</h3>
              </div>
            </div>
          </ClickCard>

          <ClickCard onClick={() => setCardModal('burnout')}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">{t.burnoutCases}</p>
                <h3 className="text-2xl font-bold text-white mt-0.5">32</h3>
              </div>
            </div>
          </ClickCard>

          <ClickCard onClick={() => setCardModal('innovators')}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">{t.topInnovators}</p>
                <h3 className="text-2xl font-bold text-white mt-0.5">14</h3>
              </div>
            </div>
          </ClickCard>

          <ClickCard onClick={() => setCardModal('insights')}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">{t.aiInsightsToday}</p>
                <h3 className="text-2xl font-bold text-white mt-0.5">7</h3>
              </div>
            </div>
          </ClickCard>
        </div>

        {/* ── AI Insight banner ── */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/20 via-violet-600/15 to-indigo-600/10 px-6 py-5">
          <div className="absolute top-0 right-0 p-6 opacity-6 pointer-events-none">
            <Sparkles className="w-28 h-28 text-indigo-300" />
          </div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-indigo-300 mb-1">{t.aiInsightTitle}</h2>
              <p className="text-zinc-300 text-sm leading-relaxed max-w-4xl">{t.aiInsightContent}</p>
            </div>
          </div>
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DarkCard>
            <h3 className="text-sm font-semibold text-zinc-200 mb-5">{t.burnoutDistribution}</h3>
            <div className="flex flex-col items-center gap-4">
              <DonutChart data={burnoutData} />
              <div className="flex items-center gap-5">
                {burnoutData.map(entry => (
                  <div key={entry.key} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-zinc-400">{entry.name}</span>
                    <span className="text-xs font-bold text-zinc-200">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </DarkCard>

          <DarkCard>
            <h3 className="text-sm font-semibold text-zinc-200 mb-5">{t.employeePerformance}</h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis
                    dataKey={isAr ? 'nameAr' : 'nameEn'}
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    interval={0} angle={-30} textAnchor="end"
                  />
                  <YAxis
                    domain={[0, 100]} axisLine={false} tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 12 }} width={32}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                    contentStyle={{
                      borderRadius: '10px', border: '1px solid #3f3f46',
                      backgroundColor: '#18181b', color: '#e4e4e7', fontSize: 12,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  />
                  <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={36}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.4))' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DarkCard>
        </div>

        {/* ── Team Breakdown ── */}
        <DarkCard>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="9" height="9" rx="1"/><rect x="13" y="3" width="9" height="9" rx="1"/>
                  <rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{t.teamBreakdown}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 max-w-md">{t.teamBreakdownSub}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {isAr ? 'تحديث فوري' : 'Live'}
            </div>
          </div>

          {/* Segmented bar */}
          <div className="mb-5">
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              <div
                className="h-full rounded-s-full transition-all duration-700"
                style={{ width: '57%', background: 'linear-gradient(90deg,#6366f1,#818cf8)', boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}
              />
              <div
                className="h-full rounded-e-full transition-all duration-700"
                style={{ width: '43%', background: 'linear-gradient(90deg,#10b981,#34d399)', boxShadow: '0 0 10px rgba(16,185,129,0.3)' }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-zinc-600">
              <span>57% {t.technical}</span>
              <span>43% {t.nonTechnical}</span>
            </div>
          </div>

          {/* Two big stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Technical */}
            <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-indigo-500/6 p-4">
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-indigo-500/8 blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{t.technical}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/12 border border-indigo-500/20 text-indigo-400">57%</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">142</p>
              <p className="text-xs text-zinc-500 mb-4">{isAr ? 'موظف' : 'employees'}</p>
              <div className="space-y-1.5">
                <MiniStat label={isAr ? 'إرهاق مرتفع' : 'High burnout'} value="21" color="text-red-400" />
                <MiniStat label={isAr ? 'مبتكرون' : 'Innovators'} value="11" color="text-amber-400" />
                <MiniStat label={isAr ? 'فوق المتوسط أداءً' : 'Above avg performance'} value="89" color="text-emerald-400" />
              </div>
            </div>

            {/* Non-Technical */}
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/6 p-4">
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-emerald-500/8 blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{t.nonTechnical}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/12 border border-emerald-500/20 text-emerald-400">43%</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">106</p>
              <p className="text-xs text-zinc-500 mb-4">{isAr ? 'موظف' : 'employees'}</p>
              <div className="space-y-1.5">
                <MiniStat label={isAr ? 'إرهاق مرتفع' : 'High burnout'} value="11" color="text-red-400" />
                <MiniStat label={isAr ? 'مبتكرون' : 'Innovators'} value="3" color="text-amber-400" />
                <MiniStat label={isAr ? 'فوق المتوسط أداءً' : 'Above avg performance'} value="61" color="text-emerald-400" />
              </div>
            </div>
          </div>

          {/* AI insight strip */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/40">
            <span className="text-base flex-shrink-0 mt-0.5">🤖</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'يُشير الذكاء الاصطناعي إلى أن الفرق التقنية تحمل 66% من إجمالي حالات الإرهاق رغم أنها تضم 57% من الموظفين. يُنصح بمراجعة أعباء العمل وتوزيعها بشكل أكثر توازناً.'
                : 'AI flags that technical teams carry 66% of all burnout cases despite being 57% of headcount. A workload rebalancing review is recommended.'}
            </p>
          </div>
        </DarkCard>

        {/* ── Project Contributions ── */}
        <DarkCard>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{t.projectContributions}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 max-w-lg">{t.projectContributionsSub}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {isAr ? 'تحديث فوري' : 'Live'}
            </div>
          </div>

          {/* Project cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {projectData.map(proj => {
              const palette: Record<string, { border: string; bg: string; text: string; dot: string; badge: string }> = {
                indigo:  { border: 'border-indigo-500/25',  bg: 'bg-indigo-500/8',  text: 'text-indigo-300',  dot: 'bg-indigo-400',  badge: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' },
                violet:  { border: 'border-violet-500/25',  bg: 'bg-violet-500/8',  text: 'text-violet-300',  dot: 'bg-violet-400',  badge: 'bg-violet-500/15 border-violet-500/30 text-violet-400' },
                emerald: { border: 'border-emerald-500/25', bg: 'bg-emerald-500/8', text: 'text-emerald-300', dot: 'bg-emerald-400', badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
                amber:   { border: 'border-amber-500/25',   bg: 'bg-amber-500/8',   text: 'text-amber-300',   dot: 'bg-amber-400',   badge: 'bg-amber-500/15 border-amber-500/30 text-amber-400' },
              };
              const pal = palette[proj.color];
              const contributors = employees.filter(e => e.projects.some(p => p.projectId === proj.id));
              const totalCommits = contributors.reduce((sum, e) => sum + (e.projects.find(p => p.projectId === proj.id)?.commits ?? 0), 0);
              const totalReports = contributors.reduce((sum, e) => sum + (e.projects.find(p => p.projectId === proj.id)?.reports ?? 0), 0);
              return (
                <div key={proj.id} className={`rounded-xl border ${pal.border} ${pal.bg} p-4`}>
                  {/* Title + status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${pal.dot}`} />
                      <span className={`text-sm font-semibold ${pal.text}`}>{isAr ? proj.nameAr : proj.nameEn}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${pal.badge}`}>
                      {proj.status === 'active' ? t.statusActive : t.statusReview}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold text-white">{totalCommits}</p>
                      <p className="text-[10px] text-zinc-600">{t.commits}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{totalReports}</p>
                      <p className="text-[10px] text-zinc-600">{t.reports}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{contributors.length}</p>
                      <p className="text-[10px] text-zinc-600">{t.contributors}</p>
                    </div>
                  </div>

                  {/* Contributors list */}
                  <div className="space-y-2">
                    {contributors.map(emp => {
                      const contrib = emp.projects.find(p => p.projectId === proj.id)!;
                      const roleLabelMap = { lead: t.projectLead, contributor: t.projectContributor, reviewer: t.projectReviewer };
                      const roleColorMap = { lead: 'text-yellow-400', contributor: 'text-zinc-400', reviewer: 'text-cyan-400' };
                      return (
                        <div key={emp.nameEn} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar nameEn={emp.nameEn} photo={emp.photo} size={24} />
                            <span className="text-xs text-zinc-300">{isAr ? emp.nameAr : emp.nameEn}</span>
                            <span className={`text-[10px] font-medium ${roleColorMap[contrib.role]}`}>· {roleLabelMap[contrib.role]}</span>
                          </div>
                          <span className="text-[11px] text-zinc-500 tabular-nums">{contrib.commits} {t.commits}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI insight strip */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/40">
            <span className="text-base flex-shrink-0 mt-0.5">🤖</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'تقود فاطمة حسن مشروع Pulse Analytics بأعلى معدل إيداع (67 إيداعاً)، في حين يُسهم عمر خالد في ثلاثة مشاريع متزامنة — مما يُشير إلى خطر إرهاق وظيفي محتمل.'
                : 'Fatima Hassan leads Pulse Analytics with the highest commit rate (67 commits), while Omar Khalid contributes across three simultaneous projects — flagging a potential overload risk.'}
            </p>
          </div>
        </DarkCard>

        {/* ── Employee Table ── */}
        <DarkCard className="p-0 overflow-hidden">
          {/* Table header + filters */}
          <div className="px-6 py-4 border-b border-zinc-800 flex flex-col gap-3">
            {/* Row 1: title + team-type tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-200">{t.totalEmployees}
                <span className="ml-2 text-xs font-normal text-zinc-500">({filteredEmployees.length})</span>
              </h3>
              <div className="flex items-center gap-1 bg-zinc-800/60 rounded-lg p-1 w-fit">
                {(['all', 'technical', 'non-technical'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setTableFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                      tableFilter === f
                        ? f === 'technical'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : f === 'non-technical'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-zinc-700 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {f === 'all' ? t.filterAll : f === 'technical' ? t.technical : t.nonTechnical}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: department pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider shrink-0">{t.department}:</span>
              {([
                { key: 'all',         labelKey: 'deptAll',         icon: '🏢' },
                { key: 'engineering', labelKey: 'deptEngineering', icon: '⚙️' },
                { key: 'operations',  labelKey: 'deptOperations',  icon: '📊' },
                { key: 'marketing',   labelKey: 'deptMarketing',   icon: '📣' },
                { key: 'hr-admin',    labelKey: 'deptHrAdmin',     icon: '🤝' },
              ] as { key: 'all' | Department; labelKey: keyof typeof t; icon: string }[]).map(({ key, labelKey, icon }) => (
                <button
                  key={key}
                  onClick={() => setDeptFilter(key)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                    deptFilter === key
                      ? 'bg-violet-600/30 border-violet-500/50 text-violet-300 shadow-sm shadow-violet-500/10'
                      : 'bg-zinc-800/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{t[labelKey] as string}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60">
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.name}</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.role}</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.department}</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.category}</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.projects}</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.burnoutLevel}</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">{t.innovation}</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredEmployees.map((emp, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar nameEn={emp.nameEn} photo={emp.photo} size={32} />
                        <span className="font-medium text-zinc-100">{isAr ? emp.nameAr : emp.nameEn}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {isAr ? emp.roleAr : emp.roleEn}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const deptMeta: Record<Department, { icon: string; label: keyof typeof t; color: string }> = {
                          engineering: { icon: '⚙️', labelKey: 'deptEngineering', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' } as any,
                          operations:  { icon: '📊', labelKey: 'deptOperations',  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' } as any,
                          marketing:   { icon: '📣', labelKey: 'deptMarketing',   color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' } as any,
                          'hr-admin':  { icon: '🤝', labelKey: 'deptHrAdmin',     color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' } as any,
                        };
                        const meta = deptMeta[emp.department];
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${(meta as any).color}`}>
                            <span>{meta.icon}</span>
                            <span>{t[(meta as any).labelKey]}</span>
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        emp.technical
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${emp.technical ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                        {emp.technical ? t.technical : t.nonTechnical}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {emp.projects.map(p => {
                          const proj = projectData.find(pd => pd.id === p.projectId);
                          if (!proj) return null;
                          const chipColor: Record<string, string> = {
                            indigo:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                            violet:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
                            emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                            amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
                          };
                          return (
                            <span key={p.projectId} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${chipColor[proj.color]}`}>
                              <span className="tabular-nums">{p.commits}</span>
                              <span className="opacity-60">·</span>
                              <span>{isAr ? proj.nameAr.split(' ')[1] ?? proj.nameAr : proj.nameEn.split(' ').slice(-1)[0]}</span>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        emp.burnout === 'high'   ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        emp.burnout === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {emp.burnout === 'high' ? t.burnoutHigh : emp.burnout === 'medium' ? t.burnoutMedium : t.burnoutLow}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-base">
                      {emp.innovator ? '🔥' : <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(emp)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg
                          hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300
                          transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                      >
                        {t.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DarkCard>

      </main>

      {/* Card Info Modal */}
      {cardModal && (
        <CardInfoModal type={cardModal} isAr={isAr} onClose={() => setCardModal(null)} />
      )}

      {/* Analysis Modal */}
      {modalState.open && (
        <AnalysisModal
          t={t} isAr={isAr} employee={modalState.employee!}
          loading={modalState.loading} result={modalState.result}
          error={modalState.error} onClose={closeModal}
        />
      )}
    </div>
  );
}

// ── Analysis Modal ────────────────────────────────────────────────────────────
function AnalysisModal({ t, isAr, employee, loading, result, error, onClose }: {
  t: typeof translations['en']; isAr: boolean; employee: Employee;
  loading: boolean; result: AnalysisResult | null; error: string | null; onClose: () => void;
}) {
  const burnoutColor =
    result?.burnout.score != null
      ? result.burnout.score >= 70 ? '#ef4444'
      : result.burnout.score >= 40 ? '#f59e0b'
      : '#22c55e'
      : '#6366f1';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: isAr ? "'Segoe UI', 'Noto Sans Arabic', Arial, sans-serif" : undefined }}
    >
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600/90 to-violet-600/90 backdrop-blur-sm rounded-t-2xl px-6 py-5 flex items-center justify-between z-10 border-b border-indigo-500/20">
          <div className="flex items-center gap-4">
            <Avatar
              nameEn={employee.nameEn}
              photo={employee.photo}
              size={48}
              borderRadius="0.75rem"
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span className="text-indigo-200 text-xs font-medium uppercase tracking-wider">{t.aiAnalysis}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{isAr ? employee.nameAr : employee.nameEn}</h2>
              <p className="text-indigo-200 text-sm mt-0.5">{isAr ? employee.roleAr : employee.roleEn}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-zinc-500 text-sm">{t.analyzing}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">{error}</div>
          )}
          {result && (
            <>
              <Section icon={<Sparkles className="w-4 h-4" />} title={t.professionalSummary} color="indigo">
                <p className="text-zinc-300 leading-relaxed text-sm">{result.summary}</p>
              </Section>
              <Section icon={<TrendingUp className="w-4 h-4" />} title={t.detectedSkills} color="violet">
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
              <Section icon={<AlertTriangle className="w-4 h-4" />} title={t.burnoutAnalysis} color="red">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-zinc-500">{t.burnoutScore}</span>
                    <span className="text-lg font-bold" style={{ color: burnoutColor }}>{result.burnout.score}/100</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${result.burnout.score}%`, backgroundColor: burnoutColor,
                        boxShadow: `0 0 8px ${burnoutColor}80` }} />
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ backgroundColor: burnoutColor + '18', color: burnoutColor, borderColor: burnoutColor + '40' }}>
                    {result.burnout.status}
                  </span>
                  {result.burnout.signals.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-zinc-500 mb-2">{t.burnoutSignals}</p>
                      <ul className="space-y-1.5">
                        {result.burnout.signals.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                            <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
              <Section icon={<ShieldAlert className="w-4 h-4" />} title={t.roleDrift} color="amber">
                <div className="space-y-3">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    result.role_drift.detected
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {result.role_drift.detected ? t.driftDetected : t.noDrift}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/50">
                      <p className="text-xs text-zinc-500 mb-1">{t.officialRole}</p>
                      <p className="text-sm font-medium text-zinc-200">{result.role_drift.official_role}</p>
                    </div>
                    <div className={`rounded-xl p-3 border ${result.role_drift.detected ? 'bg-amber-500/8 border-amber-500/20' : 'bg-zinc-800/60 border-zinc-700/50'}`}>
                      <p className="text-xs text-zinc-500 mb-1">{t.actualRole}</p>
                      <p className="text-sm font-medium text-zinc-200">{result.role_drift.actual_role}</p>
                    </div>
                  </div>
                  {result.role_drift.detected && (
                    <p className="text-xs text-zinc-400 bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-2 leading-relaxed">
                      <span className="font-medium text-amber-400">{t.driftReason}: </span>
                      {result.role_drift.reason}
                    </p>
                  )}
                </div>
              </Section>
              <Section icon={<Brain className="w-4 h-4" />} title={t.thinkingStyle} color="purple">
                <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4">
                  <p className="text-violet-300 font-semibold text-sm mb-2">{result.thinking_style.category}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{result.thinking_style.explanation}</p>
                </div>
              </Section>
              <Section icon={<CheckCircle2 className="w-4 h-4" />} title={t.smartDecisions} color="emerald">
                <div className="space-y-3">
                  <DecisionItem label={t.recommendedTask} value={result.smart_decisions.recommended_task} color="blue" />
                  <DecisionItem label={t.careerDev} value={result.smart_decisions.career_development} color="green" />
                  <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                    <p className="text-xs text-zinc-500 mb-1 font-medium">{t.alert}</p>
                    <p className="text-sm text-zinc-200 leading-relaxed">{result.smart_decisions.alert}</p>
                  </div>
                </div>
              </Section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 px-6 py-4 rounded-b-2xl">
          <button onClick={onClose}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl transition-all duration-200 text-sm border border-zinc-700">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({ icon, title, color, children }: {
  icon: React.ReactNode; title: string;
  color: 'indigo' | 'violet' | 'red' | 'amber' | 'purple' | 'emerald' | 'blue' | 'green';
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    indigo:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    violet:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
    red:     'bg-red-500/10 text-red-400 border-red-500/20',
    amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center border ${colors[color] ?? colors.indigo}`}>{icon}</span>
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DecisionItem({ label, value, color }: { label: string; value: string; color: 'blue' | 'green' }) {
  const styles = {
    blue:  'bg-blue-500/8 border-blue-500/20 text-blue-300',
    green: 'bg-emerald-500/8 border-emerald-500/20 text-emerald-300',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${styles[color]}`}>
      <p className="text-xs font-medium mb-1 opacity-60 text-zinc-300">{label}</p>
      <p className="text-sm leading-relaxed text-zinc-200">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}

function DarkCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 ${className}`}>
      {children}
    </div>
  );
}

function ClickCard({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-5 cursor-pointer select-none
        hover:border-indigo-500/30 hover:bg-zinc-900/80 hover:-translate-y-0.5
        hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]
        active:scale-[0.98] transition-all duration-200"
    >
      {children}
    </div>
  );
}

// ── Card Info Modal ───────────────────────────────────────────────────────────
const CARD_MODAL_DATA = {
  employees: {
    titleEn: 'All Employees', titleAr: 'جميع الموظفين',
    headerGrad: 'from-blue-600/90 to-cyan-600/80',
    rows: [
      { nameEn: 'Ahmed Al-Rashidi',     nameAr: 'أحمد الراشدي',   detailEn: 'Product Manager',           detailAr: 'مدير المنتج', department: 'engineering',
    projects: [{ projectId:'atlas', commits:47, reports:8, role:'lead' }, { projectId:'nova', commits:22, reports:4, role:'contributor' }] },
      { nameEn: 'Sara Al-Zahra',        nameAr: 'سارة الزهراء',    detailEn: 'UX Designer',               detailAr: 'مصممة تجربة المستخدم', department: 'engineering',
    projects: [{ projectId:'atlas', commits:31, reports:5, role:'contributor' }, { projectId:'pulse', commits:28, reports:6, role:'lead' }] },
      { nameEn: 'Omar Khalid',          nameAr: 'عمر خالد',        detailEn: 'Software Engineer',         detailAr: 'مهندس برمجيات', department: 'engineering',
    projects: [{ projectId:'nova', commits:56, reports:9, role:'lead' }, { projectId:'atlas', commits:18, reports:3, role:'contributor' }, { projectId:'shield', commits:12, reports:2, role:'reviewer' }] },
      { nameEn: 'Fatima Hassan',        nameAr: 'فاطمة حسن',       detailEn: 'Data Scientist',            detailAr: 'عالمة بيانات', department: 'operations',
    projects: [{ projectId:'pulse', commits:67, reports:14, role:'lead' }, { projectId:'nova', commits:34, reports:7, role:'contributor' }] },
      { nameEn: 'Khalid Ibrahim',       nameAr: 'خالد إبراهيم',    detailEn: 'HR Specialist',             detailAr: 'أخصائي موارد بشرية', department: 'hr-admin',
    projects: [{ projectId:'shield', commits:11, reports:5, role:'contributor' }] },
      { nameEn: 'Nora Saleem',          nameAr: 'نورة سليم',       detailEn: 'Team Lead',                 detailAr: 'قائدة الفريق', department: 'marketing',
    projects: [{ projectId:'atlas', commits:29, reports:6, role:'contributor' }, { projectId:'nova', commits:14, reports:3, role:'reviewer' }, { projectId:'shield', commits:45, reports:9, role:'lead' }] },
      { nameEn: 'Reem Al-Dosari',       nameAr: 'ريم الدوسري',     detailEn: 'Marketing Manager',         detailAr: 'مديرة التسويق' },
      { nameEn: 'Turki Al-Shehri',      nameAr: 'تركي الشهري',     detailEn: 'DevOps Engineer',           detailAr: 'مهندس DevOps' },
      { nameEn: 'Lina Hamdan',          nameAr: 'لينا حمدان',      detailEn: 'Business Analyst',          detailAr: 'محللة أعمال' },
      { nameEn: 'Faisal Al-Mutairi',    nameAr: 'فيصل المطيري',    detailEn: 'QA Engineer',               detailAr: 'مهندس ضمان الجودة' },
      { nameEn: '+ 238 more employees', nameAr: '+ 238 موظفاً آخر', detailEn: 'Across 12 departments',   detailAr: 'عبر 12 قسماً', faded: true },
    ],
  },
  burnout: {
    titleEn: 'Burnout Cases (32)', titleAr: 'حالات الإرهاق (32)',
    headerGrad: 'from-red-600/90 to-rose-600/80',
    rows: [
      { nameEn: 'Ahmed Al-Rashidi', nameAr: 'أحمد الراشدي', detailEn: '82% — Excessive overtime & role overload',                    detailAr: '82% — إرهاق من العمل الإضافي المفرط',             badge: 'high', department: 'engineering',
    projects: [{ projectId:'atlas', commits:47, reports:8, role:'lead' }, { projectId:'nova', commits:22, reports:4, role:'contributor' }] },
      { nameEn: 'Khalid Ibrahim',   nameAr: 'خالد إبراهيم',  detailEn: '88% — Late-night emails + unrecognized responsibilities',     detailAr: '88% — رسائل متأخرة + مسؤوليات غير معترف بها',    badge: 'high', department: 'hr-admin',
    projects: [{ projectId:'shield', commits:11, reports:5, role:'contributor' }] },
      { nameEn: 'Omar Khalid',      nameAr: 'عمر خالد',      detailEn: '55% — Informal support requests draining focus',             detailAr: '55% — طلبات دعم غير رسمية تستنزف التركيز',        badge: 'medium', department: 'engineering',
    projects: [{ projectId:'nova', commits:56, reports:9, role:'lead' }, { projectId:'atlas', commits:18, reports:3, role:'contributor' }, { projectId:'shield', commits:12, reports:2, role:'reviewer' }] },
      { nameEn: 'Nora Saleem',      nameAr: 'نورة سليم',     detailEn: '61% — Dual role pressure: lead + contributor',              detailAr: '61% — ضغط الدورين: قائدة + مساهمة',               badge: 'medium', department: 'marketing',
    projects: [{ projectId:'atlas', commits:29, reports:6, role:'contributor' }, { projectId:'nova', commits:14, reports:3, role:'reviewer' }, { projectId:'shield', commits:45, reports:9, role:'lead' }] },
      { nameEn: 'Reem Al-Dosari',   nameAr: 'ريم الدوسري',   detailEn: '74% — Back-to-back campaign deadlines',                     detailAr: '74% — مواعيد نهائية متتالية للحملات',             badge: 'high'   },
      { nameEn: 'Turki Al-Shehri',  nameAr: 'تركي الشهري',   detailEn: '68% — On-call incidents spiked this quarter',               detailAr: '68% — ارتفاع حوادث الاستدعاء هذا الربع',          badge: 'high'   },
      { nameEn: '+ 26 more cases',  nameAr: '+ 26 حالة أخرى', detailEn: 'Flagged across all departments',                          detailAr: 'مُرصودة عبر جميع الأقسام',                        faded: true     },
    ],
  },
  innovators: {
    titleEn: 'Top Innovators (14)', titleAr: 'المبتكرون الرائدون (14)',
    headerGrad: 'from-amber-500/90 to-orange-500/80',
    rows: [
      { nameEn: 'Fatima Hassan',        nameAr: 'فاطمة حسن',           detailEn: 'Discovered $200K cost-saving model using predictive analytics', detailAr: 'اكتشفت نموذجاً يوفر 200 ألف ريال باستخدام التحليل التنبؤي', department: 'operations',
    projects: [{ projectId:'pulse', commits:67, reports:14, role:'lead' }, { projectId:'nova', commits:34, reports:7, role:'contributor' }] },
      { nameEn: 'Ahmed Al-Rashidi',     nameAr: 'أحمد الراشدي',        detailEn: 'Pioneered AI-assisted roadmap planning adopted company-wide',   detailAr: 'ريادة التخطيط بمساعدة الذكاء الاصطناعي المعتمد على مستوى الشركة', department: 'engineering',
    projects: [{ projectId:'atlas', commits:47, reports:8, role:'lead' }, { projectId:'nova', commits:22, reports:4, role:'contributor' }] },
      { nameEn: 'Nora Saleem',          nameAr: 'نورة سليم',           detailEn: 'Redesigned onboarding flow → 40% faster ramp-up time',          detailAr: 'أعادت تصميم عملية التأهيل → تسريع 40% في وقت الاندماج', department: 'marketing',
    projects: [{ projectId:'atlas', commits:29, reports:6, role:'contributor' }, { projectId:'nova', commits:14, reports:3, role:'reviewer' }, { projectId:'shield', commits:45, reports:9, role:'lead' }] },
      { nameEn: 'Lina Hamdan',          nameAr: 'لينا حمدان',          detailEn: 'Automated reporting pipeline saving 12 hrs/week per analyst',   detailAr: 'أتمتت خط تقارير يوفر 12 ساعة أسبوعياً لكل محلل' },
      { nameEn: 'Turki Al-Shehri',      nameAr: 'تركي الشهري',         detailEn: 'Zero-downtime deployment framework now standard in DevOps',     detailAr: 'إطار نشر بدون توقف أصبح معياراً في DevOps' },
      { nameEn: '+ 9 more innovators',  nameAr: '+ 9 مبتكرين آخرين',  detailEn: 'Recognized in Q2 innovation awards',                           detailAr: 'مُكرَّمون في جوائز الابتكار للربع الثاني', faded: true },
    ],
  },
  insights: {
    titleEn: 'AI Insights Today (7)', titleAr: 'رؤى الذكاء الاصطناعي اليوم (7)',
    headerGrad: 'from-indigo-600/90 to-violet-600/80',
    rows: [
      { nameEn: '🔴 Burnout Alert',       nameAr: '🔴 تنبيه إرهاق',     detailEn: 'Khalid Ibrahim at critical burnout threshold — immediate intervention recommended', detailAr: 'خالد إبراهيم عند حد الإرهاق الحرج — يُوصى بالتدخل الفوري', department: 'hr-admin',
    projects: [{ projectId:'shield', commits:11, reports:5, role:'contributor' }] },
      { nameEn: '🌟 Retention Risk',      nameAr: '🌟 خطر المغادرة',    detailEn: 'Fatima Hassan may leave within 6 months without a clear growth path',                detailAr: 'فاطمة حسن قد تغادر خلال 6 أشهر بدون مسار نمو واضح', department: 'operations',
    projects: [{ projectId:'pulse', commits:67, reports:14, role:'lead' }, { projectId:'nova', commits:34, reports:7, role:'contributor' }] },
      { nameEn: '⚠️ Role Drift',          nameAr: '⚠️ انحراف الدور',    detailEn: '3 employees performing work beyond their official scope — compensation review needed', detailAr: '3 موظفين يؤدون مهاماً تتجاوز نطاق دورهم الرسمي' },
      { nameEn: '📈 Performance Spike',   nameAr: '📈 ارتفاع الأداء',   detailEn: "Fatima Hassan's score jumped 9 points this month — fast-track promotion candidate",   detailAr: 'ارتفع أداء فاطمة حسن 9 نقاط هذا الشهر — مرشحة للترقية السريعة', department: 'operations',
    projects: [{ projectId:'pulse', commits:67, reports:14, role:'lead' }, { projectId:'nova', commits:34, reports:7, role:'contributor' }] },
      { nameEn: '💡 Team Synergy',        nameAr: '💡 تآزر الفريق',     detailEn: 'Pairing Ahmed & Fatima on the next strategic project predicts 23% higher output',     detailAr: 'إشراك أحمد وفاطمة معاً في المشروع الاستراتيجي يتوقع زيادة الإنتاج 23%' },
      { nameEn: '🏆 Innovation Index',    nameAr: '🏆 مؤشر الابتكار',   detailEn: 'Team innovation score up 18% vs last quarter — highest in company history',          detailAr: 'مؤشر الابتكار ارتفع 18% مقارنة بالربع الأخير — الأعلى في تاريخ الشركة' },
      { nameEn: '🔄 Workload Imbalance',  nameAr: '🔄 اختلال الأعباء',  detailEn: 'Omar Khalid absorbing 25% of informal support tickets — redistribute urgently',      detailAr: 'عمر خالد يستوعب 25% من تذاكر الدعم غير الرسمية — أعد التوزيع فوراً', department: 'engineering',
    projects: [{ projectId:'nova', commits:56, reports:9, role:'lead' }, { projectId:'atlas', commits:18, reports:3, role:'contributor' }, { projectId:'shield', commits:12, reports:2, role:'reviewer' }] },
    ],
  },
};

function CardInfoModal({ type, isAr, onClose }: {
  type: 'employees' | 'burnout' | 'innovators' | 'insights'; isAr: boolean; onClose: () => void;
}) {
  const data = CARD_MODAL_DATA[type];
  const title = isAr ? data.titleAr : data.titleEn;
  const badgeColors: Record<string, string> = {
    high:   'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: isAr ? "'Segoe UI', 'Noto Sans Arabic', Arial, sans-serif" : undefined }}
    >
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${data.headerGrad} px-6 py-5 flex items-center justify-between flex-shrink-0`}>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Rows */}
        <div className="overflow-y-auto flex-1 divide-y divide-zinc-800/60">
          {data.rows.map((row, i) => (
            <div key={i}
              className={`px-6 py-4 flex items-start justify-between gap-4 hover:bg-zinc-800/40 transition-colors ${
                (row as any).faded ? 'opacity-40' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="font-semibold text-zinc-100 text-sm truncate">{isAr ? row.nameAr : row.nameEn}</p>
                <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{isAr ? row.detailAr : row.detailEn}</p>
              </div>
              {(row as any).badge && (
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeColors[(row as any).badge]}`}>
                  {(row as any).badge === 'high' ? (isAr ? 'مرتفع' : 'High') : (isAr ? 'متوسط' : 'Medium')}
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-4 flex-shrink-0">
          <button onClick={onClose}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl transition-all duration-200 text-sm border border-zinc-700">
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ data }: { data: { key: string; name: string; value: number; color: string }[] }) {
  const size = 220; const cx = size / 2; const cy = size / 2;
  const outerR = 90; const innerR = 58; const gap = 2;
  const total = data.reduce((s, d) => s + d.value, 0);
  const arcs: { path: string; color: string; key: string }[] = [];
  let startAngle = -90;

  for (const slice of data) {
    const sliceDeg = (slice.value / total) * 360 - gap;
    const endAngle = startAngle + sliceDeg;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1  = cx + outerR * Math.cos(toRad(startAngle));
    const y1  = cy + outerR * Math.sin(toRad(startAngle));
    const x2  = cx + outerR * Math.cos(toRad(endAngle));
    const y2  = cy + outerR * Math.sin(toRad(endAngle));
    const ix1 = cx + innerR * Math.cos(toRad(endAngle));
    const iy1 = cy + innerR * Math.sin(toRad(endAngle));
    const ix2 = cx + innerR * Math.cos(toRad(startAngle));
    const iy2 = cy + innerR * Math.sin(toRad(startAngle));
    const large = sliceDeg > 180 ? 1 : 0;
    arcs.push({
      path: [`M ${x1} ${y1}`, `A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`, `A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2}`, 'Z'].join(' '),
      color: slice.color, key: slice.key,
    });
    startAngle += sliceDeg + gap;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map(arc => <path key={arc.key} d={arc.path} fill={arc.color} />)}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="26" fontWeight="700" fill="#ffffff">{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill="#71717a">Total</text>
    </svg>
  );
}
