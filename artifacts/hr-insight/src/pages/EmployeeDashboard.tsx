import { useState, type ReactNode } from 'react';
import {
  GitCommit, Calendar, Clock, Star, TrendingUp,
  MessageSquare, FileText, Bell, ChevronRight, Flame, Sparkles,
  Globe, LogOut,
} from 'lucide-react';

// ── Mock employee data ────────────────────────────────────────────────────────
const EMPLOYEE = {
  nameEn: 'Khalid Ibrahim', nameAr: 'خالد إبراهيم',
  roleEn: 'HR Specialist',  roleAr: 'أخصائي موارد بشرية',
  avatar: 'KI',
  photo: 'https://i.pravatar.cc/150?img=12',
  burnoutScore: 34, performanceScore: 78,
  contributionStreak: 12, departmentEn: 'Human Resources', departmentAr: 'الموارد البشرية',
};

const GITHUB_CONTRIBUTIONS = [
  { day: 'Mon', commits: 4 }, { day: 'Tue', commits: 7 }, { day: 'Wed', commits: 2 },
  { day: 'Thu', commits: 9 }, { day: 'Fri', commits: 5 }, { day: 'Sat', commits: 1 }, { day: 'Sun', commits: 3 },
];

const AI_RECS = {
  en: [
    { icon: '🌟', title: 'Great work this week!',   body: "You've closed 3 PRs and maintained consistent commits. Keep it up!", color: 'emerald',
      detail: 'Your commit velocity is 15% above your monthly average. This week you reviewed 5 documents, closed 3 HR cases, and led the onboarding update — all on time.' },
    { icon: '😴', title: 'Consider a break',         body: "Burnout signals are rising slightly. A short break could boost tomorrow's focus.", color: 'amber',
      detail: 'AI detected a 12% drop in after-hours email response times and slightly shorter meeting contributions over the past 3 days. Recommended: schedule a 30-minute recovery block tomorrow morning.' },
    { icon: '🚀', title: 'Growth opportunity',       body: 'Your analytical skills are above average. Ask about the Q3 strategy project.', color: 'indigo',
      detail: 'Based on your task history, you have strong pattern-recognition and reporting skills. The Q3 HR Strategy project needs an analyst — speak to your manager or HR lead to express interest.' },
  ],
  ar: [
    { icon: '🌟', title: 'أداء رائع هذا الأسبوع!',     body: 'أغلقت 3 طلبات سحب وحافظت على مساهمات ثابتة. أحسنت!', color: 'emerald',
      detail: 'سرعة إيداعاتك أعلى بنسبة 15% من متوسطك الشهري. هذا الأسبوع راجعت 5 وثائق وأغلقت 3 قضايا وقدت تحديث التأهيل — كل ذلك في الوقت المحدد.' },
    { icon: '😴', title: 'ننصحك بأخذ قسط من الراحة', body: 'إشارات الإرهاق ترتفع قليلاً. استراحة قصيرة ستعزز تركيزك.', color: 'amber',
      detail: 'رصد الذكاء الاصطناعي انخفاضاً بنسبة 12% في أوقات الاستجابة ومساهمات أقصر في الاجتماعات. التوصية: جدول كتلة تعافٍ لمدة 30 دقيقة صباح الغد.' },
    { icon: '🚀', title: 'فرصة للنمو',               body: 'مهاراتك التحليلية فوق المتوسط. اسأل مديرك عن مشروع استراتيجية Q3.', color: 'indigo',
      detail: 'بناءً على سجل مهامك، تمتلك مهارات قوية في التحليل وإعداد التقارير. يحتاج مشروع استراتيجية الموارد البشرية للربع الثالث لمحلل — تحدث مع مديرك للتعبير عن اهتمامك.' },
  ],
};

const RECENT_TASKS = {
  en: [
    { title: 'Updated onboarding documentation',    status: 'done',    time: '2h ago',  notes: 'Revised sections 3-5 based on feedback from the new-hire cohort. Filed in SharePoint.' },
    { title: 'Reviewed 5 performance evaluations',  status: 'done',    time: '1d ago',  notes: 'All reviews completed and submitted to the HR portal. Two flagged for follow-up.' },
    { title: 'Q3 headcount planning spreadsheet',   status: 'pending', time: 'Due Fri', notes: 'Draft in progress. Need Finance sign-off on budget column before submitting.' },
    { title: 'Coordinate 1-on-1 sessions for team', status: 'pending', time: 'Due Mon', notes: 'Send calendar invites to 6 team members. Template agenda ready in Notion.' },
  ],
  ar: [
    { title: 'تحديث وثائق التأهيل',             status: 'done',    time: 'منذ ساعتين', notes: 'تمت مراجعة الأقسام 3-5 بناءً على ملاحظات الدفعة الجديدة. مُؤرشف في SharePoint.' },
    { title: 'مراجعة 5 تقييمات أداء',           status: 'done',    time: 'منذ يوم',    notes: 'اكتملت جميع المراجعات وأُرسلت لبوابة الموارد البشرية. اثنتان مُعلَّمتان للمتابعة.' },
    { title: 'جدول تخطيط العمالة للربع الثالث', status: 'pending', time: 'الجمعة',     notes: 'المسودة قيد الإعداد. تحتاج موافقة المالية على عمود الميزانية قبل الإرسال.' },
    { title: 'تنسيق جلسات فردية للفريق',        status: 'pending', time: 'الاثنين',    notes: 'إرسال دعوات التقويم لـ 6 أعضاء. قالب جدول الأعمال جاهز في Notion.' },
  ],
};

const NOTIFICATIONS = {
  en: [
    { icon: '🔔', title: 'Leave request approved',    body: 'Your 3-day annual leave (Jul 28–30) was approved by your manager.', time: '2h ago',  unread: true  },
    { icon: '📋', title: 'Performance review reminder', body: 'Your mid-year review is on 15 Jul. Complete your self-assessment by 10 Jul.', time: '1d ago', unread: true  },
    { icon: '🎯', title: 'New task assigned',           body: 'Q3 headcount planning spreadsheet has been assigned to you. Due Friday.', time: '2d ago', unread: false },
    { icon: '🌟', title: 'Recognition badge earned',   body: 'You received a "Consistent Contributor" badge this month. Well done!', time: '3d ago', unread: false },
  ],
  ar: [
    { icon: '🔔', title: 'تمت الموافقة على طلب الإجازة', body: 'تمت الموافقة على إجازتك السنوية (28–30 يوليو) من قِبل مديرك.', time: 'منذ ساعتين', unread: true  },
    { icon: '📋', title: 'تذكير بمراجعة الأداء',          body: 'مراجعتك نصف السنوية في 15 يوليو. أكمل تقييمك الذاتي قبل 10 يوليو.', time: 'منذ يوم',   unread: true  },
    { icon: '🎯', title: 'مهمة جديدة مُعيَّنة',           body: 'تم تعيين جدول تخطيط العمالة للربع الثالث لك. الموعد الجمعة.', time: 'منذ يومين', unread: false },
    { icon: '🌟', title: 'شارة تقدير مكتسبة',            body: 'حصلت على شارة "مساهم ثابت" هذا الشهر. أحسنت!', time: 'منذ 3 أيام', unread: false },
  ],
};

type Task = { title: string; status: string; time: string; notes: string };

// ── Burnout gauge (SVG arc) ───────────────────────────────────────────────────
function BurnoutGauge({ score }: { score: number }) {
  const r = 54; const cx = 70; const cy = 70;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const polar = (a: number) => ({ x: cx + r * Math.cos(toRad(a)), y: cy + r * Math.sin(toRad(a)) });
  const arc = (from: number, to: number) => {
    const s = polar(from); const e = polar(to); const large = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const startAngle = -110; const totalArc = 200;
  const filled = (score / 100) * totalArc;
  const color = score < 40 ? '#10b981' : score < 70 ? '#f59e0b' : '#ef4444';
  const glow  = score < 40 ? 'rgba(16,185,129,.5)' : score < 70 ? 'rgba(245,158,11,.5)' : 'rgba(239,68,68,.5)';
  return (
    <svg viewBox="0 0 140 120" className="w-full max-w-[160px]">
      <defs><filter id="gaugeGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <path d={arc(startAngle, startAngle + totalArc)} fill="none" stroke="#27272a" strokeWidth="10" strokeLinecap="round"/>
      {filled > 0 && <path d={arc(startAngle, startAngle + filled)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>}
      <text x={cx} y={cy + 8} textAnchor="middle" fill="white" fontSize="22" fontWeight="700">{score}%</text>
    </svg>
  );
}

// ── Mini bar for GitHub commits ───────────────────────────────────────────────
function CommitBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : (value / max) * 100;
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      <div className="w-full h-16 bg-zinc-800 rounded-md relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 rounded-md transition-all duration-700"
          style={{ height: `${pct}%`, background: 'linear-gradient(180deg,#6366f1,#a78bfa)', boxShadow: '0 0 8px rgba(99,102,241,.4)' }} />
      </div>
      <span className="text-zinc-600 text-[10px]">{value}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODAL SYSTEM
// ══════════════════════════════════════════════════════════════════════════════

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors';
const cardCls  = 'rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl space-y-4 w-full';
const btnBase  = 'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]';

function ModalWrap({ onClose, children }: { onClose(): void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function LeaveModal({ isAr, onClose, onSubmit }: { isAr: boolean; onClose(): void; onSubmit(): void }) {
  const [type, setType] = useState('annual');
  const [from, setFrom] = useState('');
  const [to,   setTo]   = useState('');
  const [note, setNote] = useState('');
  const types = isAr
    ? [['annual','إجازة سنوية'],['sick','مرضية'],['emergency','طارئة'],['other','أخرى']]
    : [['annual','Annual'],['sick','Sick'],['emergency','Emergency'],['other','Other']];
  return (
    <ModalWrap onClose={onClose}>
      <div className={cardCls}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">{isAr ? 'طلب إجازة' : 'Apply for Leave'}</h3>
            <p className="text-zinc-500 text-xs mt-0.5">{isAr ? 'يُعالَج الطلب خلال 24 ساعة' : 'Requests processed within 24 hrs'}</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-lg leading-none mt-0.5">✕</button>
        </div>

        <div>
          <p className="text-xs text-zinc-500 mb-2">{isAr ? 'نوع الإجازة' : 'Leave Type'}</p>
          <div className="flex flex-wrap gap-2">
            {types.map(([v, l]) => (
              <button key={v} onClick={() => setType(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${type === v ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-xs text-zinc-500 mb-1.5">{isAr ? 'من' : 'From'}</p>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={inputCls} /></div>
          <div><p className="text-xs text-zinc-500 mb-1.5">{isAr ? 'إلى' : 'To'}</p>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className={inputCls} /></div>
        </div>

        <div>
          <p className="text-xs text-zinc-500 mb-1.5">{isAr ? 'ملاحظة (اختياري)' : 'Note (optional)'}</p>
          <textarea rows={2} value={note} onChange={e => setNote(e.target.value)}
            placeholder={isAr ? 'سبب الإجازة أو تفاصيل...' : 'Reason or additional details...'}
            className={inputCls + ' resize-none'} />
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className={btnBase + ' border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button onClick={onSubmit} className={btnBase + ' bg-indigo-600 hover:bg-indigo-500 text-white'}>
            {isAr ? 'إرسال الطلب' : 'Submit Request'}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
}

function MeetingModal({ isAr, onClose, onSubmit }: { isAr: boolean; onClose(): void; onSubmit(): void }) {
  const [date,  setDate]  = useState('');
  const [slot,  setSlot]  = useState('');
  const [topic, setTopic] = useState('');
  const slots = isAr
    ? ['9:00 – 10:00 ص', '10:00 – 11:00 ص', '2:00 – 3:00 م', '3:00 – 4:00 م']
    : ['9:00 – 10:00 AM', '10:00 – 11:00 AM', '2:00 – 3:00 PM', '3:00 – 4:00 PM'];
  return (
    <ModalWrap onClose={onClose}>
      <div className={cardCls}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">{isAr ? 'طلب جلسة فردية' : 'Request 1-on-1'}</h3>
            <p className="text-zinc-500 text-xs mt-0.5">{isAr ? 'مع مديرك المباشر' : 'with your direct manager'}</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-lg leading-none mt-0.5">✕</button>
        </div>

        <div>
          <p className="text-xs text-zinc-500 mb-1.5">{isAr ? 'التاريخ المفضل' : 'Preferred Date'}</p>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
        </div>

        <div>
          <p className="text-xs text-zinc-500 mb-2">{isAr ? 'الوقت المفضل' : 'Preferred Time'}</p>
          <div className="grid grid-cols-2 gap-2">
            {slots.map(s => (
              <button key={s} onClick={() => setSlot(s)}
                className={`py-2.5 rounded-xl text-xs border transition-all ${slot === s ? 'bg-violet-600 border-violet-500 text-white' : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-zinc-500 mb-1.5">{isAr ? 'موضوع الاجتماع' : 'Agenda / Topic'}</p>
          <textarea rows={2} value={topic} onChange={e => setTopic(e.target.value)}
            placeholder={isAr ? 'ماذا تريد أن تناقش؟' : 'What would you like to discuss?'}
            className={inputCls + ' resize-none'} />
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className={btnBase + ' border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button onClick={onSubmit} className={btnBase + ' bg-violet-600 hover:bg-violet-500 text-white'}>
            {isAr ? 'إرسال' : 'Send Request'}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
}

function TaskModal({ task, isAr, onClose }: { task: Task; isAr: boolean; onClose(): void }) {
  const [notes, setNotes] = useState(task.notes);
  return (
    <ModalWrap onClose={onClose}>
      <div className={cardCls}>
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-white text-sm">{isAr ? 'تفاصيل المهمة' : 'Task Detail'}</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 space-y-2">
          <p className="text-zinc-100 text-sm font-medium leading-snug">{task.title}</p>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${task.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
              {task.status === 'done' ? (isAr ? '✓ مكتملة' : '✓ Completed') : (isAr ? '⏳ معلقة' : '⏳ Pending')}
            </span>
            <span className="text-zinc-600 text-xs">{task.time}</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-zinc-500 mb-1.5">{isAr ? 'ملاحظاتك' : 'Your Notes'}</p>
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
            placeholder={isAr ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
            className={inputCls + ' resize-none'} />
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className={btnBase + ' border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}>
            {isAr ? 'إغلاق' : 'Close'}
          </button>
          {task.status !== 'done' && (
            <button onClick={onClose} className={btnBase + ' bg-emerald-600 hover:bg-emerald-500 text-white'}>
              {isAr ? '✓ تعليم مكتملة' : '✓ Mark Complete'}
            </button>
          )}
        </div>
      </div>
    </ModalWrap>
  );
}

function RecModal({ rec, isAr, onClose }: { rec: typeof AI_RECS.en[0]; isAr: boolean; onClose(): void }) {
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500/30 bg-emerald-500/8',
    amber:   'border-amber-500/30 bg-amber-500/8',
    indigo:  'border-indigo-500/30 bg-indigo-500/8',
  };
  return (
    <ModalWrap onClose={onClose}>
      <div className={cardCls}>
        <div className="flex items-start justify-between">
          <span className="text-2xl">{rec.icon}</span>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>
        <div>
          <h3 className="font-bold text-white text-sm mb-1">{rec.title}</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">{rec.body}</p>
        </div>
        <div className={`p-3 rounded-xl border text-xs text-zinc-300 leading-relaxed ${colorMap[rec.color] ?? ''}`}>
          {rec.detail}
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm transition-all">
          {isAr ? 'إغلاق' : 'Got it'}
        </button>
      </div>
    </ModalWrap>
  );
}

function NotificationsModal({ isAr, onClose }: { isAr: boolean; onClose(): void }) {
  const notifs = NOTIFICATIONS[isAr ? 'ar' : 'en'];
  const unread = notifs.filter(n => n.unread).length;
  return (
    <ModalWrap onClose={onClose}>
      <div className={cardCls}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">{isAr ? 'الإشعارات' : 'Notifications'}</h3>
            <p className="text-zinc-500 text-xs mt-0.5">
              {unread} {isAr ? 'غير مقروءة' : 'unread'}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        <div className="space-y-2">
          {notifs.map((n, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-default ${n.unread ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-zinc-800/50 bg-zinc-800/20'}`}>
              <span className="text-base flex-shrink-0 mt-0.5">{n.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className={`text-xs font-semibold truncate ${n.unread ? 'text-zinc-200' : 'text-zinc-400'}`}>{n.title}</p>
                  {n.unread && <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-zinc-700 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-2 rounded-xl border border-zinc-700 text-zinc-400 text-xs hover:border-zinc-600 hover:text-zinc-200 transition-all">
          {isAr ? '✓ تعليم الكل كمقروء' : '✓ Mark all as read'}
        </button>
      </div>
    </ModalWrap>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function EmployeeDashboard({
  onLogout, lang, onLangChange, theme = 'dark', onThemeToggle,
}: {
  onLogout: () => void;
  lang: 'en' | 'ar';
  onLangChange: (l: 'en' | 'ar') => void;
  theme?: string;
  onThemeToggle?: () => void;
}) {
  const [showLeaveModal,    setShowLeaveModal]    = useState(false);
  const [showMeetingModal,  setShowMeetingModal]  = useState(false);
  const [activeTask,        setActiveTask]        = useState<Task | null>(null);
  const [activeRec,         setActiveRec]         = useState<typeof AI_RECS.en[0] | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [leaveSubmitted,    setLeaveSubmitted]    = useState(false);
  const [meetingSubmitted,  setMeetingSubmitted]  = useState(false);
  const [photoErr,          setPhotoErr]          = useState(false);

  const isAr = lang === 'ar';
  const maxCommits = Math.max(...GITHUB_CONTRIBUTIONS.map(d => d.commits));
  const recs  = AI_RECS[lang];
  const tasks = RECENT_TASKS[lang];
  const burnoutColor = EMPLOYEE.burnoutScore < 40 ? 'emerald' : EMPLOYEE.burnoutScore < 70 ? 'amber' : 'red';
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
    indigo:  'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    red:     'text-red-400 bg-red-500/10 border-red-500/20',
    violet:  'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: "'Inter','Segoe UI','Noto Sans Arabic',sans-serif" }}>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/6 blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">H</div>
            <span className="font-bold text-white tracking-tight">HR Insight</span>
            <span className="hidden sm:block text-zinc-600 text-xs px-2 py-0.5 rounded-full border border-zinc-800">
              {isAr ? 'لوحة الموظف' : 'Employee Portal'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            </button>

            {/* Theme toggle */}
            {onThemeToggle && (
              <button onClick={onThemeToggle}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-amber-300 transition-all duration-200">
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

            {/* Lang toggle */}
            <button onClick={() => onLangChange(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 text-xs font-medium hover:border-zinc-700 hover:text-zinc-200 transition-all">
              <Globe className="w-3.5 h-3.5" />
              {isAr ? 'EN' : 'AR'}
            </button>

            {/* Logout */}
            <button onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-500 text-xs hover:border-zinc-700 hover:text-zinc-300 transition-all">
              <LogOut className="w-3.5 h-3.5" />
              {isAr ? 'خروج' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Personal greeting banner ── */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 p-6">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 90% 50%,rgba(99,102,241,.08) 0%,transparent 70%)' }} />
          <div className="flex items-center gap-4 relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20">
              {!photoErr ? (
                <img
                  src={EMPLOYEE.photo}
                  alt={EMPLOYEE.nameEn}
                  onError={() => setPhotoErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                  {EMPLOYEE.avatar}
                </div>
              )}
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-0.5">{isAr ? 'مرحباً بعودتك 👋' : 'Welcome back 👋'}</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {isAr ? `أهلاً بك يا ${EMPLOYEE.nameAr.split(' ')[0]}` : `Hello, ${EMPLOYEE.nameEn.split(' ')[0]}!`}
              </h1>
              <p className="text-zinc-500 text-xs mt-1">
                {isAr ? EMPLOYEE.roleAr : EMPLOYEE.roleEn} · {isAr ? EMPLOYEE.departmentAr : EMPLOYEE.departmentEn}
              </p>
            </div>
          </div>
        </div>

        {/* ── Top stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Flame className="w-4 h-4" />,      label: isAr ? 'مؤشر الإجهاد' : 'Burnout Risk',     value: `${EMPLOYEE.burnoutScore}%`,       sub: isAr ? 'منخفض' : 'Low',         color: `text-${burnoutColor}-400`, bg: `bg-${burnoutColor}-500/10 border-${burnoutColor}-500/20` },
            { icon: <TrendingUp className="w-4 h-4" />,  label: isAr ? 'الأداء' : 'Performance',            value: `${EMPLOYEE.performanceScore}%`,   sub: isAr ? 'فوق المتوسط' : 'Above avg', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { icon: <GitCommit className="w-4 h-4" />,   label: isAr ? 'سلسلة المساهمات' : 'Commit Streak', value: `${EMPLOYEE.contributionStreak}d`, sub: isAr ? 'متواصل' : 'Consecutive', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
            { icon: <Star className="w-4 h-4" />,        label: isAr ? 'المهام المكتملة' : 'Tasks Done',    value: '18',                              sub: isAr ? 'هذا الشهر' : 'This month', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl border p-4 ${stat.bg}`}>
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-zinc-500 text-xs mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Middle row: Burnout gauge + GitHub ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Burnout gauge */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between">
              <p className="font-semibold text-white text-sm">{isAr ? 'معدل الإجهاد الخاص بك' : 'Your Burnout Risk'}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${colorMap[burnoutColor]}`}>
                {isAr ? (EMPLOYEE.burnoutScore < 40 ? 'منخفض' : EMPLOYEE.burnoutScore < 70 ? 'متوسط' : 'مرتفع')
                       : (EMPLOYEE.burnoutScore < 40 ? 'Low' : EMPLOYEE.burnoutScore < 70 ? 'Medium' : 'High')}
              </span>
            </div>
            <BurnoutGauge score={EMPLOYEE.burnoutScore} />
            <div className="w-full space-y-2">
              {[
                { label: isAr ? 'توازن العمل والحياة' : 'Work-Life Balance', val: 72 },
                { label: isAr ? 'عبء العمل' : 'Workload',              val: 38 },
                { label: isAr ? 'التواصل الاجتماعي' : 'Social Connection', val: 85 },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500 w-28 flex-shrink-0 truncate">{label}</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${val}%`, background: val > 60 ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)' }} />
                  </div>
                  <span className="text-zinc-600 w-8 text-right">{val}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub contributions */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white text-sm">{isAr ? 'نشاط GitHub هذا الأسبوع' : 'GitHub Activity This Week'}</p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />
                {isAr ? 'تسليمات' : 'Commits'}
              </div>
            </div>
            <div className="flex items-end gap-2 h-24 px-1">
              {GITHUB_CONTRIBUTIONS.map(d => <CommitBar key={d.day} value={d.commits} max={maxCommits} />)}
            </div>
            <div className="flex gap-2 px-1">
              {GITHUB_CONTRIBUTIONS.map(d => (
                <span key={d.day} className="flex-1 text-center text-zinc-600 text-[10px]">
                  {isAr ? { Mon:'إث',Tue:'ثل',Wed:'أر',Thu:'خم',Fri:'جم',Sat:'سب',Sun:'أح' }[d.day] : d.day}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {[
                { icon: <GitCommit className="w-3 h-3"/>, label: isAr ? '31 تسليم' : '31 commits', c: 'indigo' },
                { icon: <Clock className="w-3 h-3"/>,     label: isAr ? 'آخر نشاط: اليوم' : 'Last: Today', c: 'emerald' },
                { icon: <Calendar className="w-3 h-3"/>,  label: isAr ? '8 طلبات سحب' : '8 pull reqs', c: 'violet' },
              ].map(({ icon, label, c }) => (
                <span key={label} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${colorMap[c] || 'text-zinc-400 bg-zinc-800 border-zinc-700'}`}>
                  {icon}{label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI Recommendations ── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <p className="font-semibold text-white text-sm">{isAr ? 'توصيات الذكاء الاصطناعي لك' : 'AI Recommendations For You'}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recs.map((rec, i) => (
              <button key={i} onClick={() => setActiveRec(rec)}
                className={`rounded-xl border p-4 space-y-2 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 text-left rtl:text-right cursor-pointer ${colorMap[rec.color]}`}>
                <span className="text-xl">{rec.icon}</span>
                <p className="font-semibold text-sm text-white">{rec.title}</p>
                <p className="text-xs leading-relaxed text-zinc-400">{rec.body}</p>
                <p className="text-[10px] text-zinc-600 flex items-center gap-1">
                  {isAr ? 'انقر للمزيد' : 'Click for details'} <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Recent Tasks ── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <p className="font-semibold text-white text-sm">{isAr ? 'المهام الأخيرة' : 'Recent Tasks'}</p>
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <button key={i} onClick={() => setActiveTask(task)}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-zinc-800/50 transition-colors group cursor-pointer text-left rtl:text-right">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span className={`flex-1 text-sm ${task.status === 'done' ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-200'}`}>
                  {task.title}
                </span>
                <span className="text-zinc-600 text-xs flex-shrink-0">{task.time}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0 rtl:rotate-180" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          <button onClick={() => setShowMeetingModal(true)}
            className={`group flex items-center justify-center gap-3 py-4 rounded-2xl border font-semibold text-sm transition-all duration-300 ${
              meetingSubmitted
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-default'
                : 'border-zinc-700 bg-zinc-900 text-white hover:border-indigo-500/60 hover:bg-indigo-500/8 hover:shadow-[0_0_24px_rgba(99,102,241,.15)] active:scale-[.98] cursor-pointer'
            }`}>
            <MessageSquare className={`w-4 h-4 transition-transform duration-200 ${!meetingSubmitted && 'group-hover:scale-110'}`} />
            {meetingSubmitted
              ? (isAr ? '✓ تم إرسال الطلب' : '✓ Request Sent!')
              : (isAr ? 'طلب جلسة فردية' : 'Request 1-on-1 Meeting')}
          </button>

          <button onClick={() => setShowLeaveModal(true)}
            className={`group flex items-center justify-center gap-3 py-4 rounded-2xl border font-semibold text-sm transition-all duration-300 ${
              leaveSubmitted
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-default'
                : 'border-zinc-700 bg-zinc-900 text-white hover:border-violet-500/60 hover:bg-violet-500/8 hover:shadow-[0_0_24px_rgba(139,92,246,.15)] active:scale-[.98] cursor-pointer'
            }`}>
            <FileText className={`w-4 h-4 transition-transform duration-200 ${!leaveSubmitted && 'group-hover:scale-110'}`} />
            {leaveSubmitted
              ? (isAr ? '✓ تم إرسال الطلب' : '✓ Leave Submitted!')
              : (isAr ? 'تقديم طلب إجازة' : 'Apply for Leave')}
          </button>

          {(meetingSubmitted || leaveSubmitted) && (
            <div className="sm:col-span-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-emerald-400 text-sm">
                {isAr ? 'تم إرسال طلبك بنجاح. سيتواصل معك الفريق قريباً. 🎉' : 'Your request was submitted. Your team will get back to you soon. 🎉'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      {showLeaveModal    && <LeaveModal   isAr={isAr} onClose={() => setShowLeaveModal(false)}    onSubmit={() => { setLeaveSubmitted(true);   setShowLeaveModal(false); }} />}
      {showMeetingModal  && <MeetingModal isAr={isAr} onClose={() => setShowMeetingModal(false)}  onSubmit={() => { setMeetingSubmitted(true); setShowMeetingModal(false); }} />}
      {activeTask        && <TaskModal    isAr={isAr} task={activeTask} onClose={() => setActiveTask(null)} />}
      {activeRec         && <RecModal     isAr={isAr} rec={activeRec}   onClose={() => setActiveRec(null)} />}
      {showNotifications && <NotificationsModal isAr={isAr} onClose={() => setShowNotifications(false)} />}
    </div>
  );
}
