import os
import json
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI(title="HR Insight API", docs_url="/api/docs", redoc_url="/api/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Gemini setup ──────────────────────────────────────────────────────────────
api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash-lite")
else:
    model = None

# ── Rich mock data per employee ───────────────────────────────────────────────
MOCK_RESPONSES = {
    "ahmed": {
        "summary": "أحمد الراشدي يُظهر أداءً استثنائياً كمدير منتج خلال الفترة الأخيرة، حيث قاد إطلاق ثلاث ميزات رئيسية في وقت قياسي وحصل على تقييمات إيجابية من العملاء بنسبة 94%. تشير بيانات نشاطه إلى ارتفاع ملحوظ في ساعات العمل تجاوزت المعدل الطبيعي بنسبة 40%.",
        "skills": ["إدارة المنتج", "التفكير الاستراتيجي", "التواصل مع أصحاب المصلحة", "تحليل البيانات", "القيادة"],
        "burnout": {
            "score": 82,
            "status": "High",
            "signals": [
                "ساعات عمل مفرطة تتجاوز 55 ساعة أسبوعياً",
                "تراجع في جودة التعليقات على طلبات السحب مؤخراً",
                "غياب عن 3 اجتماعات تخطيطية اختيارية خلال شهر"
            ]
        },
        "role_drift": {
            "detected": True,
            "official_role": "مدير منتج",
            "actual_role": "مدير مشروع تقني + محلل أعمال",
            "reason": "يتولى أحمد مهام تفصيلية في إدارة المشاريع التقنية والتحليل الوظيفي بشكل متكرر تتجاوز نطاق دوره الرسمي، مما يُثقل عليه دون اعتراف رسمي بهذه المسؤوليات."
        },
        "thinking_style": {
            "category": "Innovative Contributor",
            "explanation": "يتميز أحمد بأسلوب تفكير ريادي يجمع بين الرؤية الكبيرة والتنفيذ الدقيق. يميل إلى اقتراح حلول خارج الصندوق وغالباً ما يكون أول من يتبنى الأدوات والمنهجيات الجديدة في الفريق."
        },
        "smart_decisions": {
            "recommended_task": "قيادة مبادرة تحسين تجربة المستخدم للوحة التحكم الرئيسية مع تفويض المهام التشغيلية اليومية لأعضاء الفريق",
            "career_development": "الالتحاق ببرنامج شهادة في إدارة المنتجات المتقدمة أو MBA مسرّع خلال العام القادم",
            "alert": "⚠️ خطر الاحتراق الوظيفي مرتفع — يُوصى بإعادة توزيع المهام فوراً وجدولة إجازة إجبارية لمدة 5 أيام خلال الشهر القادم."
        }
    },
    "sara": {
        "summary": "سارة الزهراء تُقدّم أعمالاً تصميمية عالية الجودة باستمرار وتحظى بتقدير كبير من الفريق والعملاء. مستوى إنتاجيتها ثابت ومتوازن مع مستوى التوتر الوظيفي، وتُعدّ نموذجاً صحياً للأداء المستدام.",
        "skills": ["تصميم تجربة المستخدم", "أبحاث المستخدم", "Figma", "نماذج الأولية", "التفكير التصميمي"],
        "burnout": {
            "score": 22,
            "status": "Low",
            "signals": [
                "توازن ممتاز بين العمل والحياة الشخصية",
                "مشاركة فعّالة في اجتماعات الفريق",
                "إنجاز المهام ضمن أوقات العمل الاعتيادية"
            ]
        },
        "role_drift": {
            "detected": False,
            "official_role": "مصممة تجربة المستخدم",
            "actual_role": "مصممة تجربة المستخدم",
            "reason": "لا يوجد انحراف ملحوظ؛ سارة تعمل ضمن نطاق دورها الرسمي بوضوح واتساق تام."
        },
        "thinking_style": {
            "category": "Empathetic Designer",
            "explanation": "تتميز سارة بقدرة فائقة على التعاطف مع المستخدمين وفهم احتياجاتهم العميقة. منهجيتها تقوم على الاستماع أولاً ثم التصميم، وتستند دائماً إلى بيانات الاستخدام الفعلي قبل اتخاذ أي قرار تصميمي."
        },
        "smart_decisions": {
            "recommended_task": "قيادة ورشة عمل داخلية حول مبادئ التصميم المتمحور حول المستخدم لرفع مستوى الوعي لدى الفريق الهندسي",
            "career_development": "التخصص في مجال إمكانية الوصول (Accessibility) وتصميم المنتجات الشاملة للحصول على ميزة تنافسية",
            "alert": "✅ لا تنبيهات عاجلة — يُوصى بإعطائها فرصة قيادية في المشاريع القادمة للاستفادة الكاملة من إمكاناتها."
        }
    },
    "omar": {
        "summary": "عمر خالد مهندس برمجيات موثوق يُسهم بشكل منتظم في قاعدة الكود ويتميز بجودة عالية في مراجعة الكود. بدأت تظهر بعض مؤشرات التعب الوظيفي المتوسط، خاصة بعد سلسلة من الإصدارات الكثيفة خلال الربع الأخير.",
        "skills": ["Python", "React", "هندسة الأنظمة", "مراجعة الكود", "التوثيق التقني"],
        "burnout": {
            "score": 55,
            "status": "Medium",
            "signals": [
                "تراجع طفيف في وتيرة الـ commits خلال الأسبوعين الماضيين",
                "تعليقات أقصر في مراجعات الكود مقارنة بالمعتاد",
                "أسئلة متكررة حول جداول الإجازات"
            ]
        },
        "role_drift": {
            "detected": True,
            "official_role": "مهندس برمجيات",
            "actual_role": "مهندس برمجيات + مسؤول دعم تقني",
            "reason": "يتلقى عمر طلبات دعم تقني من فرق أخرى بشكل غير رسمي ويستجيب لها، مما يستهلك ما يقارب 25% من وقته الأسبوعي خارج مهامه الأساسية."
        },
        "thinking_style": {
            "category": "Analytical Executor",
            "explanation": "يتميز عمر بالدقة والمنهجية في تحليل المشكلات التقنية. يُفضّل الحلول المُختبرة والموثقة على الحلول التجريبية، وقوته تكمن في تحويل المتطلبات المعقدة إلى كود نظيف وقابل للصيانة."
        },
        "smart_decisions": {
            "recommended_task": "تولّي قيادة تحسين منظومة الاختبارات الآلية وتوثيق بيئة التطوير للفريق بالكامل",
            "career_development": "دراسة شهادة AWS Solutions Architect وتعميق الخبرة في تصميم الأنظمة الموزعة",
            "alert": "⚠️ يجب إيقاف تدفق طلبات الدعم غير الرسمية إلى عمر وتوجيهها لقناة رسمية لحمايته من الإرهاق."
        }
    },
    "fatima": {
        "summary": "فاطمة حسن تُقدّم نماذج تحليلية عالية الدقة وأسهمت مؤخراً في اكتشاف فرصة تحسين تجاوزت وفوراتها 200 ألف ريال سنوياً. أداؤها الاستثنائي ومستوى الاحتراق الوظيفي المنخفض لديها يجعلانها مرشحة مثالية للقيادة.",
        "skills": ["تعلم الآلة", "Python/Pandas", "التصور البياني للبيانات", "الإحصاء التطبيقي", "SQL متقدم"],
        "burnout": {
            "score": 18,
            "status": "Low",
            "signals": [
                "مستويات طاقة ومشاركة عالية باستمرار",
                "تبادر طوعي بمهام إضافية ذات قيمة عالية",
                "انتظام تام في ساعات العمل مع جودة إنتاج متميزة"
            ]
        },
        "role_drift": {
            "detected": False,
            "official_role": "عالمة بيانات",
            "actual_role": "عالمة بيانات",
            "reason": "لا انحراف — فاطمة مُركّزة تماماً على مجال تخصصها وتعمق خبرتها فيه باستمرار."
        },
        "thinking_style": {
            "category": "Innovative Contributor",
            "explanation": "فاطمة تجمع بين الدقة التحليلية العالية والقدرة على رؤية الأنماط الخفية في البيانات. تتميز بشجاعة طرح فرضيات غير تقليدية واختبارها بمنهجية علمية، مما أفضى لعدة اكتشافات مؤثرة."
        },
        "smart_decisions": {
            "recommended_task": "قيادة مشروع بناء نموذج تنبؤي لمعدل الاستبقاء الوظيفي للمساعدة في تخطيط القوى العاملة",
            "career_development": "الحصول على شهادة في الذكاء الاصطناعي التوليدي والتحضير لدور قيادي في علم البيانات خلال 12-18 شهراً",
            "alert": "🌟 موهبة نادرة يجب الاستثمار فيها — خطر المغادرة مرتفع إن لم تُقدَّم لها فرص نمو واضحة وتحديات جديدة."
        }
    },
    "khalid": {
        "summary": "خالد إبراهيم يُعاني من ضغط وظيفي شديد ناتج عن إدارة عدد كبير من قضايا الموارد البشرية المعلقة في وقت واحد، مصحوباً بتحولات تنظيمية متسارعة. نشاطه في البريد الإلكتروني خارج أوقات العمل ارتفع بنسبة 60% خلال الشهر الماضي.",
        "skills": ["علاقات الموظفين", "التوظيف والاستقطاب", "إدارة الأداء", "الامتثال القانوني", "الاستشارات الوظيفية"],
        "burnout": {
            "score": 88,
            "status": "High",
            "signals": [
                "نشاط بريد إلكتروني مكثف بعد منتصف الليل لأكثر من 3 أسابيع",
                "شكاوى صريحة من ضغط العمل في آخر جلستي مراجعة",
                "تراجع ملحوظ في مبادراته خلال اجتماعات الفريق"
            ]
        },
        "role_drift": {
            "detected": True,
            "official_role": "أخصائي موارد بشرية",
            "actual_role": "مدير موارد بشرية + مستشار قانوني داخلي",
            "reason": "يتولى خالد مسؤوليات لا تتناسب مع مستواه الوظيفي، تشمل التفاوض على عقود العمل ومعالجة الشكاوى القانونية دون صلاحيات رسمية أو مقابل مادي إضافي."
        },
        "thinking_style": {
            "category": "Empathetic Mediator",
            "explanation": "خالد يمتلك ذكاءً عاطفياً رفيعاً يُمكّنه من إدارة النزاعات وبناء الثقة بين الأطراف المتعارضة. يُعدّ المرجع الأول للموظفين في المسائل الحساسة، وهو ما يُثقل كاهله رغم كونه ميزة نادرة."
        },
        "smart_decisions": {
            "recommended_task": "إعادة توزيع 30% من ملفاته الحالية على متخصص موارد بشرية جديد وتحويله لقيادة برنامج الرفاهية المؤسسية",
            "career_development": "الترشح للحصول على شهادة SHRM-CP والتخطيط للترقية لمدير موارد بشرية خلال 6 أشهر",
            "alert": "🚨 تنبيه عاجل: الاحتراق الوظيفي في المرحلة الحرجة — التدخل الفوري ضروري لمنع الاستقالة المبكرة."
        }
    },
    "nora": {
        "summary": "نورة سليم تؤدي دور القائدة باقتدار وتحافظ على تماسك الفريق وإنتاجيته في ظل ظروف ضاغطة. تتولى مسؤوليات إدارية متزايدة مع الحفاظ على مساهماتها التقنية، مما يضعها في حالة من الضغط المتوسط المزمن.",
        "skills": ["قيادة الفرق", "التخطيط الاستراتيجي", "إدارة المخاطر", "التواصل التنفيذي", "Agile/Scrum"],
        "burnout": {
            "score": 61,
            "status": "Medium",
            "signals": [
                "ازدواجية الأدوار بين القيادة والمساهمة التقنية",
                "كثافة الاجتماعات تصل لـ 6 ساعات يومياً أحياناً",
                "انخفاض نسبي في حضور الفعاليات الاجتماعية للفريق"
            ]
        },
        "role_drift": {
            "detected": True,
            "official_role": "قائدة فريق",
            "actual_role": "قائدة فريق + مدير مشاريع + مرشدة مهنية",
            "reason": "تتحمل نورة مسؤوليات تطوير المسار المهني لأعضاء فريقها وإدارة علاقات أصحاب المصلحة بشكل غير رسمي، وهي مهام تتجاوز نطاق دورها المعتمد رسمياً."
        },
        "thinking_style": {
            "category": "Strategic Visionary",
            "explanation": "نورة تمتلك رؤية استراتيجية واضحة وقدرة على ربط الأهداف التشغيلية اليومية بالتوجهات المؤسسية بعيدة المدى. تتميز بالقدرة على اتخاذ القرارات تحت الضغط مع الحفاظ على ثقة الفريق."
        },
        "smart_decisions": {
            "recommended_task": "قيادة مبادرة تحديث عملية Onboarding للموظفين الجدد مع تفويض متابعة المهام التقنية اليومية",
            "career_development": "الانتقال نحو دور مدير هندسة أو مدير برامج أول مع دعم تدريبي في القيادة التنفيذية",
            "alert": "⚠️ يجب تحديد حدود واضحة لمسؤولياتها الرسمية وإضافة موظف إداري مساعد لدعمها."
        }
    }
}

# Generic fallback pool for unknown inputs
GENERIC_RESPONSES = [
    {
        "summary": "يُظهر الموظف أداءً جيداً بشكل عام مع بعض مؤشرات الضغط الوظيفي الناتجة عن الحجم المتزايد من المهام. تشير بياناته إلى مساهمات قيّمة في مشاريع الفريق مع ميل واضح نحو التميز والكمالية.",
        "skills": ["التواصل الفعّال", "إدارة الوقت", "حل المشكلات", "العمل الجماعي", "الاهتمام بالتفاصيل"],
        "burnout": {
            "score": 47,
            "status": "Medium",
            "signals": [
                "أعباء عمل متراكمة دون توزيع متوازن",
                "تداخل بين مهام متعددة الأولويات",
                "قلة فترات الاستراحة بين المشاريع الكثيفة"
            ]
        },
        "role_drift": {
            "detected": True,
            "official_role": "الدور الرسمي المُعيَّن",
            "actual_role": "دور مُوسَّع غير معتمد رسمياً",
            "reason": "تُشير الأنماط الوظيفية إلى تجاوز الموظف لحدود دوره الرسمي بشكل متكرر لسد فجوات في فريق العمل دون اعتراف مؤسسي."
        },
        "thinking_style": {
            "category": "Collaborative Problem Solver",
            "explanation": "يتميز الموظف بنهج تعاوني في مواجهة التحديات، ويُفضّل العمل مع الآخرين لبناء حلول شاملة. يمتلك مهارة جمع وجهات النظر المتباينة والوصول إلى توافق يخدم جميع الأطراف."
        },
        "smart_decisions": {
            "recommended_task": "تكليفه بقيادة مشروع تحسين بعينه يتوافق مع نقاط قوته ويُتيح له إثبات كفاءاته القيادية",
            "career_development": "وضع خطة تطوير مهني واضحة مع مرشد (Mentor) متمرس ومراجعة دورية كل ربع سنة",
            "alert": "⚠️ يُوصى بمراجعة توزيع المهام وضمان توافر وقت للتعلم والتطوير الذاتي ضمن ساعات العمل الرسمية."
        }
    },
    {
        "summary": "يُقدّم الموظف مستوى أداء ثابتاً يتراوح بين الجيد والممتاز، مع قدرة واضحة على التكيف مع متطلبات العمل المتغيرة. يمتلك إمكانات غير مستغلة بالكامل يمكن تفعيلها بالتوجيه الصحيح.",
        "skills": ["التخطيط والتنظيم", "التحليل النقدي", "الإبداع والابتكار", "القدرة على التعلم السريع", "الموثوقية"],
        "burnout": {
            "score": 35,
            "status": "Low",
            "signals": [
                "مستوى تفاعل إيجابي في الاجتماعات",
                "التزام بالمواعيد النهائية",
                "لا توجد مؤشرات مقلقة ملحوظة حالياً"
            ]
        },
        "role_drift": {
            "detected": False,
            "official_role": "الدور المُعيَّن",
            "actual_role": "الدور المُعيَّن",
            "reason": "الموظف يعمل ضمن نطاق دوره المحدد بوضوح ولا يوجد انحراف يُذكر."
        },
        "thinking_style": {
            "category": "Analytical Executor",
            "explanation": "يتبنى الموظف نهجاً تحليلياً دقيقاً في تناول المهام، ويُقدّر الوضوح والهياكل المحددة في العمل. يتألق في بيئات تتطلب الدقة والمنهجية وتنفيذ الخطط المُعدّة جيداً."
        },
        "smart_decisions": {
            "recommended_task": "إسناد مشروع ريادي يُوظّف قدراته التحليلية ويفتح له أفقاً أوسع من الفرص",
            "career_development": "الالتحاق ببرنامج تدريبي في مجال تخصصه مع توسيع شبكة العلاقات المهنية داخل المؤسسة وخارجها",
            "alert": "✅ الوضع مستقر ومشجع — التركيز الآن على توفير فرص النمو لمنع الركود الوظيفي على المدى البعيد."
        }
    }
]


# ── Request model ─────────────────────────────────────────────────────────────
class EmployeeDataInput(BaseModel):
    raw_text: str


# ── Mock routing ──────────────────────────────────────────────────────────────
def get_mock_response(raw_text: str) -> dict:
    """Return a named mock if an employee name is detected, else a random generic."""
    text_lower = raw_text.lower()
    for key in MOCK_RESPONSES:
        if key in text_lower:
            return MOCK_RESPONSES[key]
    return random.choice(GENERIC_RESPONSES)


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/api/healthz")
def health_check():
    return {
        "status": "ok",
        "gemini": "configured" if api_key else "missing — running in mock mode",
        "mode": "live" if api_key else "mock",
    }


@app.post("/api/analyze")
async def analyze_employee(data: EmployeeDataInput):
    # Try Gemini first; fall back to mock on any failure or missing key
    if model:
        try:
            prompt = f"""
You are an advanced Enterprise Workforce Intelligence AI.
Analyze the provided raw data of an employee (such as emails, code commits, or daily logs).

Provide a comprehensive analysis in Arabic.

You MUST respond with a valid JSON object matching this schema exactly:
{{
  "summary": "تلخيص احترافي لإنجازات الموظف مؤخراً بأسلوب لائق ومختصر",
  "skills": ["مهارة 1", "مهارة 2", "مهارة 3"],
  "burnout": {{
    "score": 85,
    "status": "High / Medium / Low",
    "signals": ["إشارة 1", "إشارة 2"]
  }},
  "role_drift": {{
    "detected": true,
    "official_role": "المسمى الرسمي الحالي",
    "actual_role": "الدور الفعلي المكتشف",
    "reason": "شرح مختصر باللغة العربية"
  }},
  "thinking_style": {{
    "category": "Innovative Contributor",
    "explanation": "تحليل لأسلوب تفكيره بالعربية"
  }},
  "smart_decisions": {{
    "recommended_task": "مهمة مقترحة",
    "career_development": "تطوير مساره",
    "alert": "تنبيه ذكي"
  }}
}}

Employee Raw Data:
{data.raw_text}
"""
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"},
            )
            return json.loads(response.text)
        except Exception:
            # Quota exhausted, network error, etc. — fall through to mock
            pass

    return get_mock_response(data.raw_text)


# ══════════════════════════════════════════════════════════════════════════════
# KNOWLEDGE BASE — static document served to ElevenLabs agent at boot
# ══════════════════════════════════════════════════════════════════════════════
KNOWLEDGE_BASE = {
    "platform": {
        "name": "HR Insight | بصيرة الموارد البشرية",
        "version": "1.0",
        "description": (
            "HR Insight is an AI-powered bilingual (English/Arabic) HR analytics dashboard "
            "designed for enterprise workforce intelligence. It provides real-time burnout detection, "
            "role-drift analysis, innovation tracking, project contribution mapping, and department-based "
            "performance insights — all driven by AI and presented in a dark-mode executive interface."
        ),
        "tagline": "Know Your Team Before You Ask",
        "target_users": ["HR Managers", "Department Heads", "C-Suite Executives", "Team Leads"],
        "languages": ["English", "Arabic (RTL)"],
        "access_roles": {
            "Employee": "View personal performance profile and AI-generated insights.",
            "HR": "Full workforce analytics — burnout, innovation, role drift, department and project breakdowns.",
            "Manager": "Executive summary view with smart alerts and AI recommendations.",
        },
    },
    "features": [
        {
            "id": "burnout_detection",
            "name": "Burnout Detection",
            "name_ar": "كشف الإرهاق الوظيفي",
            "description": (
                "Tracks work-hour patterns, commit frequency, email activity, and meeting attendance "
                "to score each employee's burnout risk on a 0–100 scale. Thresholds: Low (0–35), "
                "Medium (36–65), High (66–100)."
            ),
            "faqs": [
                {
                    "q": "How is the burnout score calculated?",
                    "a": "It is a composite of five signals: overtime hours, commit-rate drop, after-hours email activity, meeting attendance decline, and manager feedback sentiment — each weighted and normalised to a 0–100 scale.",
                },
                {
                    "q": "What happens when an employee reaches High burnout?",
                    "a": "The system raises a red alert card on the dashboard and the AI generates a specific intervention recommendation (workload reduction, mandatory leave, task redistribution).",
                },
                {
                    "q": "Can employees see their own burnout score?",
                    "a": "Yes — employees who log in with the Employee role can see their own score and signals on their personal dashboard. They cannot see other employees' scores.",
                },
            ],
        },
        {
            "id": "role_drift",
            "name": "Role Drift Detection",
            "name_ar": "كشف انحراف الدور الوظيفي",
            "description": (
                "Compares an employee's official job title with their observed task footprint "
                "(commit topics, email threads, meeting tags) and flags mismatches as drift. "
                "Useful for identifying scope creep, underutilisation, and promotion readiness."
            ),
            "faqs": [
                {
                    "q": "What counts as role drift?",
                    "a": "When more than 20 % of an employee's measurable work activity falls outside their official role description for two or more consecutive weeks.",
                },
                {
                    "q": "Is role drift always bad?",
                    "a": "Not always. Positive drift (e.g. an engineer leading architecture reviews) may indicate promotion readiness. Negative drift (e.g. an HR specialist doing legal work) flags overreach and stress risk.",
                },
            ],
        },
        {
            "id": "innovation_tracking",
            "name": "Innovation Tracking",
            "name_ar": "تتبع الابتكار",
            "description": (
                "Identifies employees exhibiting innovative behaviour: proposing new tools, "
                "driving process improvements, contributing to cross-team initiatives, or receiving "
                "peer recognition for novel ideas. Top innovators are surfaced with a 🔥 badge."
            ),
            "faqs": [
                {
                    "q": "How are innovators identified?",
                    "a": "Through NLP analysis of commit messages, proposal documents, meeting transcripts, and peer feedback. Employees whose language and action patterns match the 'innovation cluster' are flagged.",
                },
            ],
        },
        {
            "id": "project_contributions",
            "name": "Project Contribution Mapping",
            "name_ar": "مساهمات المشاريع",
            "description": (
                "Automatically maps each employee to the projects they contributed to by analysing "
                "commit logs, pull-request reviews, and report authorship. Displays commit counts, "
                "report counts, contributor role (Lead / Contributor / Reviewer), and cross-project load."
            ),
            "faqs": [
                {
                    "q": "What projects are currently tracked?",
                    "a": "Project Atlas (active, 234 commits), Nova Platform (active, 189 commits), Pulse Analytics (in review, 145 commits), Shield Security (active, 98 commits).",
                },
                {
                    "q": "Can an employee appear on multiple projects?",
                    "a": "Yes. Omar Khalid, for example, is active on three simultaneous projects — which is itself flagged as an overload risk by the AI.",
                },
            ],
        },
        {
            "id": "department_breakdown",
            "name": "Department Breakdown",
            "name_ar": "تصنيف الأقسام",
            "description": (
                "Groups employees under Engineering, Operations, Marketing, and HR & Admin. "
                "Displays burnout distribution and innovator counts per department. "
                "The dashboard table can be filtered by department in one click."
            ),
        },
        {
            "id": "team_breakdown",
            "name": "Team Breakdown (Technical / Non-Technical)",
            "name_ar": "تصنيف الفرق",
            "description": (
                "Segments the workforce into Technical (142 employees, 57 %) and Non-Technical "
                "(106 employees, 43 %) tracks, with per-segment burnout rates and innovator counts. "
                "AI flags that technical teams carry a disproportionate 66 % of total burnout cases."
            ),
        },
        {
            "id": "ai_analysis_modal",
            "name": "AI Employee Analysis",
            "name_ar": "التحليل الذكي للموظف",
            "description": (
                "Clicking 'View Details' on any employee opens a deep-dive modal powered by "
                "Gemini AI (with a rich Arabic fallback). Sections: Professional Summary, "
                "Detected Skills, Burnout Analysis, Role Drift Detection, Thinking Style, "
                "and Smart Recommendations."
            ),
            "faqs": [
                {
                    "q": "Is the AI analysis live or pre-generated?",
                    "a": "The system first attempts a live Gemini API call. If the API quota is exhausted or unavailable, it falls back to rich pre-generated Arabic profiles for each named employee — so the demo always works.",
                },
            ],
        },
    ],
    "employees": [
        {
            "name_en": "Ahmed Al-Rashidi", "name_ar": "أحمد الراشدي",
            "role_en": "Product Manager", "role_ar": "مدير المنتج",
            "department": "Engineering", "technical": True,
            "burnout": "High (score 82)", "innovator": True,
            "projects": ["Project Atlas (Lead, 47 commits)", "Nova Platform (Contributor, 22 commits)"],
            "summary": "High innovation potential with escalating burnout risk. Handling scope beyond official role.",
        },
        {
            "name_en": "Sara Al-Zahra", "name_ar": "سارة الزهراء",
            "role_en": "UX Designer", "role_ar": "مصممة تجربة المستخدم",
            "department": "Engineering", "technical": True,
            "burnout": "Low (score 22)", "innovator": False,
            "projects": ["Project Atlas (Contributor, 31 commits)", "Pulse Analytics (Lead, 28 commits)"],
            "summary": "Model of sustainable performance. Excellent work-life balance. Leadership opportunity recommended.",
        },
        {
            "name_en": "Omar Khalid", "name_ar": "عمر خالد",
            "role_en": "Software Engineer", "role_ar": "مهندس برمجيات",
            "department": "Engineering", "technical": True,
            "burnout": "Medium (score 55)", "innovator": False,
            "projects": ["Nova Platform (Lead, 56 commits)", "Project Atlas (Contributor, 18 commits)", "Shield Security (Reviewer, 12 commits)"],
            "summary": "Reliable contributor absorbing informal support requests from other teams. Three-project load flagged as overload risk.",
        },
        {
            "name_en": "Fatima Hassan", "name_ar": "فاطمة حسن",
            "role_en": "Data Scientist", "role_ar": "عالمة بيانات",
            "department": "Operations", "technical": True,
            "burnout": "Low (score 18)", "innovator": True,
            "projects": ["Pulse Analytics (Lead, 67 commits)", "Nova Platform (Contributor, 34 commits)"],
            "summary": "Exceptional performer with highest commit rate. Identified a 200K SAR annual saving. Retention risk if not given growth opportunities.",
        },
        {
            "name_en": "Khalid Ibrahim", "name_ar": "خالد إبراهيم",
            "role_en": "HR Specialist", "role_ar": "أخصائي موارد بشرية",
            "department": "HR & Admin", "technical": False,
            "burnout": "High (score 88)", "innovator": False,
            "projects": ["Shield Security (Contributor, 11 commits)"],
            "summary": "Critical burnout alert. Handling legal and managerial responsibilities beyond role scope. Immediate intervention required.",
        },
        {
            "name_en": "Nora Saleem", "name_ar": "نورة سليم",
            "role_en": "Team Lead", "role_ar": "قائدة الفريق",
            "department": "Marketing", "technical": True,
            "burnout": "Medium (score 61)", "innovator": True,
            "projects": ["Project Atlas (Contributor, 29 commits)", "Nova Platform (Reviewer, 14 commits)", "Shield Security (Lead, 45 commits)"],
            "summary": "Effective leader balancing strategic and technical work. Meeting load reaching 6 hrs/day. Needs formal scope boundaries.",
        },
    ],
    "departments": [
        {"name": "Engineering", "headcount": 3, "burnout_high": 1, "innovators": 1, "technical": True},
        {"name": "Operations", "headcount": 1, "burnout_high": 0, "innovators": 1, "technical": True},
        {"name": "Marketing", "headcount": 1, "burnout_high": 0, "innovators": 1, "technical": True},
        {"name": "HR & Admin", "headcount": 1, "burnout_high": 1, "innovators": 0, "technical": False},
    ],
    "projects": [
        {"id": "atlas",  "name": "Project Atlas",     "status": "Active",     "total_commits": 234, "contributors": 4},
        {"id": "nova",   "name": "Nova Platform",      "status": "Active",     "total_commits": 189, "contributors": 4},
        {"id": "pulse",  "name": "Pulse Analytics",    "status": "In Review",  "total_commits": 145, "contributors": 2},
        {"id": "shield", "name": "Shield Security",    "status": "Active",     "total_commits": 98,  "contributors": 3},
    ],
    "hr_policies": [
        {"topic": "Leave Policy", "summary": "Employees are entitled to 21 days annual leave, 14 days sick leave, and up to 5 days emergency leave per year. Leave must be approved by the direct manager at least 3 days in advance for non-emergency cases."},
        {"topic": "Performance Review Cycle", "summary": "Formal reviews occur bi-annually (January and July). AI-generated insights from HR Insight are used as supplementary input, not primary evaluation criteria."},
        {"topic": "Burnout Intervention Protocol", "summary": "Employees with a burnout score above 75 trigger an automatic HR notification. A mandatory 1:1 meeting with HR must be scheduled within 5 business days. Workload redistribution plan required within 2 weeks."},
        {"topic": "Role Drift Policy", "summary": "If role drift is detected for 3 consecutive weeks, HR initiates a role-alignment conversation. Positive drift may trigger a promotion review; negative drift triggers workload correction."},
        {"topic": "Remote Work", "summary": "Hybrid model: 3 days in-office, 2 days remote per week. Full-remote requests are reviewed quarterly by the HR committee."},
        {"topic": "Training & Development", "summary": "Each employee receives an annual learning budget of 5,000 SAR for courses, certifications, and conferences. Requests require manager approval and HR logging."},
        {"topic": "Promotion Criteria", "summary": "Promotions are evaluated based on: 6+ months of consistent high performance, positive 360 feedback, no active burnout alerts, and manager nomination. AI insights may support but not solely determine promotion decisions."},
    ],
    "faqs": [
        {"q": "How do I log into HR Insight?", "a": "From the landing page, select your role (Employee or HR), then sign in with your email or via Google, GitHub, or Microsoft SSO."},
        {"q": "Can I change the language?", "a": "Yes. Use the 'AR / EN' toggle in the top-right corner of any page to switch between English and Arabic instantly. The switch is bilingual and RTL-aware."},
        {"q": "Who can see my data?", "a": "Your personal performance data is visible to you (Employee role), your direct manager, and the HR team. Raw data is never shared outside your organisation."},
        {"q": "How often is data refreshed?", "a": "The dashboard shows a live pulse indicator for real-time analytics. Aggregate scores (burnout, performance) are recalculated daily at midnight."},
        {"q": "What is an AI Insight?", "a": "AI Insights are Gemini-generated observations about a specific employee — covering skills, burnout signals, role drift, thinking style, and personalised recommendations. Clicking 'View Details' on any employee card opens their full AI analysis."},
        {"q": "Is HR Insight a production system?", "a": "The current deployment is a hackathon demo with static mock data. The API layer is fully operational and designed to connect to a real HRMS database in production."},
        {"q": "How do I report an issue?", "a": "Contact the HR Insight support team via the internal helpdesk portal or email hrsupport@company.com."},
        {"q": "What does the 🔥 badge mean?", "a": "The flame badge marks an employee identified as a Top Innovator — someone whose work patterns, language, and peer recognition align with innovative behaviour."},
        {"q": "What is role drift?", "a": "Role drift occurs when an employee's actual day-to-day tasks consistently fall outside their official job description. The system detects this and flags it so HR can take corrective or recognition action."},
        {"q": "How accurate is burnout detection?", "a": "The model is trained on workforce research benchmarks and cross-validated against HR case studies. In demo mode, scores are illustrative. In production, accuracy improves with 90+ days of continuous data ingestion."},
    ],
}


# ── Per-employee personal context ─────────────────────────────────────────────
# Mirrors the mock data shown on the Employee Portal dashboard.
# Used exclusively by /api/session-context to build the agent's system prompt.
# ══════════════════════════════════════════════════════════════════════════════
EMPLOYEE_PROFILES: dict = {
    "khalid ibrahim": {
        "name_en": "Khalid Ibrahim", "name_ar": "خالد إبراهيم",
        "role_en": "HR Specialist",  "role_ar": "أخصائي موارد بشرية",
        "department": "HR & Admin",
        "burnout_score": 34, "burnout_level": "Low",
        "performance_score": 78, "contribution_streak": 12,
        "leave_balance": {
            "annual":    {"total": 21, "used": 3,  "remaining": 18},
            "sick":      {"total": 14, "used": 0,  "remaining": 14},
            "emergency": {"total": 5,  "used": 0,  "remaining": 5},
        },
        "tasks": [
            {"title": "Update Q3 HR policy documents",             "due": "July 25, 2026", "status": "In Progress",     "priority": "High"},
            {"title": "Schedule Q3 performance review interviews",  "due": "July 30, 2026", "status": "Pending",         "priority": "Medium"},
            {"title": "Process 4 pending leave requests",          "due": "July 22, 2026", "status": "Action Required", "priority": "High"},
            {"title": "Prepare onboarding checklist for new hire",  "due": "Aug  1, 2026",  "status": "Not Started",     "priority": "Low"},
        ],
        "projects": [{"name": "Shield Security", "role": "Contributor", "commits": 11, "reports": 5}],
        "ai_recommendations": [
            "Burnout score is healthy (34/100). Maintain current work-life balance and take regular short breaks.",
            "Q3 policy document update is due July 25 — prioritize this task this week to avoid a last-minute rush.",
            "4 pending leave requests require approval by July 22. Review them in the portal to avoid an SLA breach.",
            "Current duties include legal and managerial tasks outside the HR Specialist scope. Consider requesting a formal role-boundary review.",
        ],
        "recent_activity": [
            {"date": "July 18, 2026", "action": "Approved Sara Al-Zahra's annual leave request (2 days)"},
            {"date": "July 15, 2026", "action": "Updated remote work policy document (v2.1)"},
            {"date": "July 12, 2026", "action": "Completed Q2 performance review documentation"},
        ],
    },
    "ahmed al-rashidi": {
        "name_en": "Ahmed Al-Rashidi", "name_ar": "أحمد الراشدي",
        "role_en": "Product Manager",  "role_ar": "مدير المنتج",
        "department": "Engineering",
        "burnout_score": 82, "burnout_level": "High",
        "performance_score": 92, "contribution_streak": 8,
        "leave_balance": {
            "annual":    {"total": 21, "used": 6, "remaining": 15},
            "sick":      {"total": 14, "used": 2, "remaining": 12},
            "emergency": {"total": 5,  "used": 0, "remaining": 5},
        },
        "tasks": [
            {"title": "Finalise Project Atlas Q3 roadmap",     "due": "July 24, 2026", "status": "In Progress", "priority": "High"},
            {"title": "Conduct weekly sprint review",           "due": "July 21, 2026", "status": "Pending",     "priority": "Medium"},
            {"title": "Submit innovation proposal to leadership","due": "July 28, 2026", "status": "In Progress", "priority": "High"},
        ],
        "projects": [
            {"name": "Project Atlas",  "role": "Lead",        "commits": 47, "reports": 8},
            {"name": "Nova Platform",  "role": "Contributor", "commits": 22, "reports": 4},
        ],
        "ai_recommendations": [
            "BURNOUT ALERT: Score 82/100 (High). Immediate workload review recommended — consider taking 3+ days leave this month.",
            "Handling architecture-review and system-design scope beyond the Product Manager role — delegate where possible.",
            "Consider reducing Nova Platform contributions to focus capacity on Project Atlas leadership.",
        ],
        "recent_activity": [
            {"date": "July 19, 2026", "action": "Completed sprint planning session for Project Atlas"},
            {"date": "July 17, 2026", "action": "Reviewed and merged 5 PRs on Nova Platform"},
            {"date": "July 14, 2026", "action": "Presented Q2 product metrics to leadership"},
        ],
    },
    "sara al-zahra": {
        "name_en": "Sara Al-Zahra", "name_ar": "سارة الزهراء",
        "role_en": "UX Designer",   "role_ar": "مصممة تجربة المستخدم",
        "department": "Engineering",
        "burnout_score": 22, "burnout_level": "Low",
        "performance_score": 85, "contribution_streak": 21,
        "leave_balance": {
            "annual":    {"total": 21, "used": 2, "remaining": 19},
            "sick":      {"total": 14, "used": 0, "remaining": 14},
            "emergency": {"total": 5,  "used": 0, "remaining": 5},
        },
        "tasks": [
            {"title": "Deliver Pulse Analytics UI wireframes",  "due": "July 23, 2026", "status": "In Review",   "priority": "High"},
            {"title": "Conduct usability testing session",       "due": "July 26, 2026", "status": "Pending",     "priority": "Medium"},
            {"title": "Update Project Atlas design system",      "due": "Aug  3, 2026",  "status": "Not Started", "priority": "Low"},
        ],
        "projects": [
            {"name": "Project Atlas",   "role": "Contributor", "commits": 31, "reports": 5},
            {"name": "Pulse Analytics", "role": "Lead",        "commits": 28, "reports": 6},
        ],
        "ai_recommendations": [
            "Excellent health score (22/100) — a model of sustainable performance on the team.",
            "21-day contribution streak is the longest on the team: strong engagement signal.",
            "Leadership opportunity identified: well-positioned for a Senior UX Designer role.",
        ],
        "recent_activity": [
            {"date": "July 18, 2026", "action": "Submitted Pulse Analytics dashboard wireframes for review"},
            {"date": "July 16, 2026", "action": "Led design critique session with engineering team"},
            {"date": "July 13, 2026", "action": "Published Project Atlas component library update"},
        ],
    },
    "omar khalid": {
        "name_en": "Omar Khalid", "name_ar": "عمر خالد",
        "role_en": "Software Engineer", "role_ar": "مهندس برمجيات",
        "department": "Engineering",
        "burnout_score": 55, "burnout_level": "Medium",
        "performance_score": 78, "contribution_streak": 15,
        "leave_balance": {
            "annual":    {"total": 21, "used": 4, "remaining": 17},
            "sick":      {"total": 14, "used": 1, "remaining": 13},
            "emergency": {"total": 5,  "used": 0, "remaining": 5},
        },
        "tasks": [
            {"title": "Fix Nova Platform authentication bug",  "due": "July 21, 2026", "status": "In Progress", "priority": "Critical"},
            {"title": "Code review: Shield Security patches",  "due": "July 22, 2026", "status": "Pending",     "priority": "Medium"},
            {"title": "Refactor Atlas API endpoints",          "due": "July 29, 2026", "status": "Not Started", "priority": "Medium"},
        ],
        "projects": [
            {"name": "Nova Platform",  "role": "Lead",        "commits": 56, "reports": 9},
            {"name": "Project Atlas",  "role": "Contributor", "commits": 18, "reports": 3},
            {"name": "Shield Security","role": "Reviewer",    "commits": 12, "reports": 2},
        ],
        "ai_recommendations": [
            "Burnout score Medium (55/100): three-project workload is flagged as overload risk — monitor closely.",
            "Informal support requests from other teams are consuming significant capacity. Set clear support-hours boundaries.",
            "1-2 days leave would help reduce the medium burnout signal. You have 17 annual leave days available.",
        ],
        "recent_activity": [
            {"date": "July 19, 2026", "action": "Resolved 3 high-priority Nova Platform issues"},
            {"date": "July 17, 2026", "action": "Completed Shield Security code review (batch 2)"},
            {"date": "July 15, 2026", "action": "Committed Atlas API endpoint refactor (phase 1)"},
        ],
    },
    "fatima hassan": {
        "name_en": "Fatima Hassan", "name_ar": "فاطمة حسن",
        "role_en": "Data Scientist", "role_ar": "عالمة بيانات",
        "department": "Operations",
        "burnout_score": 18, "burnout_level": "Low",
        "performance_score": 94, "contribution_streak": 28,
        "leave_balance": {
            "annual":    {"total": 21, "used": 0, "remaining": 21},
            "sick":      {"total": 14, "used": 0, "remaining": 14},
            "emergency": {"total": 5,  "used": 0, "remaining": 5},
        },
        "tasks": [
            {"title": "Finalise Q3 predictive burnout model",    "due": "July 27, 2026", "status": "In Progress", "priority": "High"},
            {"title": "Present 200K SAR savings analysis to CFO","due": "July 24, 2026", "status": "In Review",   "priority": "High"},
            {"title": "Document Pulse Analytics ML pipeline",    "due": "Aug  5, 2026",  "status": "Not Started", "priority": "Medium"},
        ],
        "projects": [
            {"name": "Pulse Analytics", "role": "Lead",        "commits": 67, "reports": 14},
            {"name": "Nova Platform",   "role": "Contributor", "commits": 34, "reports": 7},
        ],
        "ai_recommendations": [
            "Exceptional performance score (94/100) with the lowest burnout on the team (18/100).",
            "Retention risk flag: if growth opportunities (senior title, expanded scope) are not provided, attrition likelihood increases.",
            "21 annual leave days available — none used this year. A short break is recommended.",
        ],
        "recent_activity": [
            {"date": "July 19, 2026", "action": "Submitted CFO deck for 200K SAR operational savings analysis"},
            {"date": "July 16, 2026", "action": "Completed Pulse Analytics model accuracy benchmark (98.2%)"},
            {"date": "July 14, 2026", "action": "Published internal research note on predictive burnout signals"},
        ],
    },
    "nora saleem": {
        "name_en": "Nora Saleem", "name_ar": "نورة سليم",
        "role_en": "Team Lead",   "role_ar": "قائدة الفريق",
        "department": "Marketing",
        "burnout_score": 61, "burnout_level": "Medium",
        "performance_score": 88, "contribution_streak": 18,
        "leave_balance": {
            "annual":    {"total": 21, "used": 3, "remaining": 18},
            "sick":      {"total": 14, "used": 0, "remaining": 14},
            "emergency": {"total": 5,  "used": 0, "remaining": 5},
        },
        "tasks": [
            {"title": "Prepare Shield Security go-live checklist", "due": "July 22, 2026", "status": "In Progress", "priority": "High"},
            {"title": "Conduct team 1-on-1s (3 remaining)",        "due": "July 25, 2026", "status": "In Progress", "priority": "Medium"},
            {"title": "Review Q3 marketing campaign metrics",      "due": "July 28, 2026", "status": "Pending",     "priority": "Medium"},
        ],
        "projects": [
            {"name": "Shield Security", "role": "Lead",        "commits": 45, "reports": 9},
            {"name": "Project Atlas",   "role": "Contributor", "commits": 29, "reports": 6},
            {"name": "Nova Platform",   "role": "Reviewer",    "commits": 14, "reports": 3},
        ],
        "ai_recommendations": [
            "Burnout score Medium (61/100). Meeting load has reached 6 hrs/day — above the recommended 4-hour threshold.",
            "Formal scope boundaries needed: currently spanning strategic leadership and deep technical contributions simultaneously.",
            "Consider delegating Nova Platform reviewer responsibilities to reduce the three-project load.",
        ],
        "recent_activity": [
            {"date": "July 19, 2026", "action": "Completed Shield Security UAT sign-off session"},
            {"date": "July 17, 2026", "action": "Led quarterly marketing strategy review"},
            {"date": "July 15, 2026", "action": "Reviewed and approved 2 team leave requests"},
        ],
    },
}


@app.get("/api/knowledge-base")
def get_knowledge_base():
    """
    Returns the full HR Insight knowledge base as structured JSON.
    Intended for ElevenLabs Conversational AI agents to load at session start.
    CORS: open to all origins.
    """
    return KNOWLEDGE_BASE


# ── Agent query request model ─────────────────────────────────────────────────
class AgentQueryInput(BaseModel):
    query: str
    top_k: int = 5          # max sections to return
    language: str = "en"   # "en" or "ar"


def _score_section(text: str, query_tokens: list[str]) -> int:
    """Simple token-overlap relevance score."""
    text_lower = text.lower()
    return sum(1 for tok in query_tokens if tok in text_lower)


def _search_knowledge_base(query: str, top_k: int) -> list[dict]:
    """
    Keyword-search across the flat knowledge base and return ranked results.
    Each result carries a 'source', 'relevance', and 'content' key.
    """
    tokens = [t.strip("?.,!") for t in query.lower().split() if len(t) > 2]
    candidates: list[dict] = []

    # Platform description
    candidates.append({
        "source": "platform_overview",
        "content": KNOWLEDGE_BASE["platform"]["description"] + " " + KNOWLEDGE_BASE["platform"]["tagline"],
        "relevance": _score_section(KNOWLEDGE_BASE["platform"]["description"], tokens),
    })

    # Features + nested FAQs
    for feat in KNOWLEDGE_BASE["features"]:
        score = _score_section(feat["name"] + " " + feat["description"], tokens)
        candidates.append({"source": f"feature:{feat['id']}", "content": f"{feat['name']}: {feat['description']}", "relevance": score})
        for faq in feat.get("faqs", []):
            faq_score = _score_section(faq["q"] + " " + faq["a"], tokens)
            candidates.append({"source": f"feature:{feat['id']}:faq", "content": f"Q: {faq['q']} A: {faq['a']}", "relevance": faq_score})

    # Employees
    for emp in KNOWLEDGE_BASE["employees"]:
        blob = (
            f"{emp['name_en']} ({emp['name_ar']}) — {emp['role_en']}, {emp['department']}. "
            f"Burnout: {emp['burnout']}. Innovator: {emp['innovator']}. "
            f"Projects: {', '.join(emp['projects'])}. {emp['summary']}"
        )
        candidates.append({"source": f"employee:{emp['name_en'].split()[0].lower()}", "content": blob, "relevance": _score_section(blob, tokens)})

    # HR Policies
    for policy in KNOWLEDGE_BASE["hr_policies"]:
        blob = f"{policy['topic']}: {policy['summary']}"
        candidates.append({"source": f"policy:{policy['topic'].lower().replace(' ', '_')}", "content": blob, "relevance": _score_section(blob, tokens)})

    # Global FAQs
    for faq in KNOWLEDGE_BASE["faqs"]:
        blob = f"Q: {faq['q']} A: {faq['a']}"
        candidates.append({"source": "faq", "content": blob, "relevance": _score_section(blob, tokens)})

    # Projects
    for proj in KNOWLEDGE_BASE["projects"]:
        blob = f"{proj['name']} — status: {proj['status']}, {proj['total_commits']} commits, {proj['contributors']} contributors."
        candidates.append({"source": f"project:{proj['id']}", "content": blob, "relevance": _score_section(blob, tokens)})

    # Sort by relevance, deduplicate, take top_k (always include at least 1 result)
    candidates.sort(key=lambda x: x["relevance"], reverse=True)
    top = [c for c in candidates if c["relevance"] > 0][:top_k]
    if not top:
        top = candidates[:2]   # fallback: return top-2 regardless of score
    return top


@app.post("/api/agent-query")
async def agent_query(data: AgentQueryInput):
    """
    Webhook for ElevenLabs Conversational AI tool calls.
    Accepts a natural-language query and returns:
      - relevant context snippets from the knowledge base
      - an AI-synthesised answer (Gemini if available, else assembled from snippets)
    CORS: open to all origins.
    """
    if not data.query or not data.query.strip():
        raise HTTPException(status_code=400, detail="'query' must be a non-empty string.")

    results = _search_knowledge_base(data.query.strip(), data.top_k)
    context_blob = "\n\n".join(f"[{r['source']}] {r['content']}" for r in results)

    # Try Gemini synthesis first
    answer = None
    if model:
        try:
            lang_instruction = (
                "Respond in Arabic only." if data.language == "ar"
                else "Respond in clear, concise English."
            )
            prompt = f"""You are the HR Insight AI assistant. Answer the user's question using ONLY the context provided below.
Be concise, factual, and helpful. Do not make up information not present in the context.
{lang_instruction}

Context:
{context_blob}

User Question: {data.query}

Answer:"""
            resp = model.generate_content(prompt)
            answer = resp.text.strip()
        except Exception:
            answer = None

    # Fallback: assemble from top context snippet
    if not answer:
        if results:
            answer = results[0]["content"]
        else:
            answer = (
                "لم أجد معلومات كافية للإجابة على هذا السؤال." if data.language == "ar"
                else "I could not find enough information to answer that question."
            )

    return {
        "query": data.query,
        "answer": answer,
        "sources": [{"source": r["source"], "snippet": r["content"][:200]} for r in results],
        "context_used": len(results),
    }


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC (EMPLOYEE-SAFE) KNOWLEDGE BASE
# Strips all sensitive/administrative metrics before exposure to the widget.
# Omits: burnout scores & signals, innovator flags, project commit counts,
#         role-drift details, headcount breakdowns, internal system notes.
# ══════════════════════════════════════════════════════════════════════════════

# Fields allowed per employee for the public endpoint
_SAFE_EMPLOYEE_FIELDS = {"name_en", "name_ar", "role_en", "role_ar", "department"}

# FAQs that reference internal implementation details are excluded
_ADMIN_FAQ_KEYWORDS = {
    "hackathon", "mock data", "gemini", "api quota", "quota",
    "commit", "innovator", "burnout score", "66 %", "shadow dom",
}

def _is_public_faq(faq: dict) -> bool:
    combined = (faq["q"] + " " + faq["a"]).lower()
    return not any(kw in combined for kw in _ADMIN_FAQ_KEYWORDS)

PUBLIC_KNOWLEDGE_BASE = {
    "platform": {
        "name": KNOWLEDGE_BASE["platform"]["name"],
        "description": (
            "HR Insight is an AI-powered bilingual (English/Arabic) HR self-service portal. "
            "Employees can review HR policies, get answers to common questions, understand "
            "portal features, and request HR support — all in one place."
        ),
        "tagline": KNOWLEDGE_BASE["platform"]["tagline"],
        "languages": KNOWLEDGE_BASE["platform"]["languages"],
        "access_roles": {
            "Employee": KNOWLEDGE_BASE["platform"]["access_roles"]["Employee"],
        },
    },
    "features": [
        {
            "name": "Personal Profile",
            "description": "View your own name, role, and department details via the Employee dashboard.",
        },
        {
            "name": "HR Policies Library",
            "description": (
                "Access the full library of company HR policies: leave entitlements, remote work, "
                "training budgets, performance review cycles, and promotion criteria."
            ),
        },
        {
            "name": "AI HR Assistant",
            "description": (
                "Ask questions in natural language (English or Arabic) about HR guidelines, "
                "portal navigation, leave requests, training, and more."
            ),
        },
        {
            "name": "Language Toggle",
            "description": (
                "Switch between English and Arabic (RTL) at any time using the AR/EN toggle "
                "in the top-right corner of every page."
            ),
        },
    ],
    # Only safe identity fields — no performance, burnout, or project data
    "employees": [
        {k: v for k, v in emp.items() if k in _SAFE_EMPLOYEE_FIELDS}
        for emp in KNOWLEDGE_BASE["employees"]
    ],
    # Department names only — no analytics counts
    "departments": [
        {"name": d["name"]} for d in KNOWLEDGE_BASE["departments"]
    ],
    # HR policies are public guidelines — expose in full
    "hr_policies": KNOWLEDGE_BASE["hr_policies"],
    # FAQs filtered to remove any that mention internal system details
    "faqs": [faq for faq in KNOWLEDGE_BASE["faqs"] if _is_public_faq(faq)],
    # Public announcements / general info
    "announcements": [
        {
            "title": "Performance Review — July 2025",
            "body": "The mid-year performance review cycle begins on 1 July. Employees should complete self-assessments in the portal by 15 July.",
        },
        {
            "title": "Remote Work Policy Update",
            "body": "Effective 1 June, the hybrid model is 3 days in-office and 2 days remote per week. Full-remote requests are reviewed quarterly.",
        },
        {
            "title": "Training Budget Reminder",
            "body": "Each employee has a 5,000 SAR annual learning budget. Unused budget does not roll over. Submit your training request before 30 November.",
        },
    ],
}


@app.get("/api/public-knowledge-base")
def get_public_knowledge_base():
    """
    Returns a RESTRICTED knowledge base safe for employee-facing AI agents.
    Sensitive fields (burnout scores, innovator flags, commit counts, role-drift
    data, system internals) are fully excluded.
    CORS: open to all origins.
    """
    return PUBLIC_KNOWLEDGE_BASE


# ── Public search helper ──────────────────────────────────────────────────────

def _search_public_knowledge_base(query: str, top_k: int) -> list[dict]:
    """Keyword-ranked retrieval over PUBLIC_KNOWLEDGE_BASE only."""
    tokens = [t.strip("?.,!") for t in query.lower().split() if len(t) > 2]
    candidates: list[dict] = []

    # Platform
    blob = PUBLIC_KNOWLEDGE_BASE["platform"]["description"]
    candidates.append({"source": "platform", "content": blob, "relevance": _score_section(blob, tokens)})

    # Features
    for feat in PUBLIC_KNOWLEDGE_BASE["features"]:
        blob = f"{feat['name']}: {feat['description']}"
        candidates.append({"source": f"feature:{feat['name'].lower().replace(' ','_')}", "content": blob, "relevance": _score_section(blob, tokens)})

    # HR Policies
    for policy in PUBLIC_KNOWLEDGE_BASE["hr_policies"]:
        blob = f"{policy['topic']}: {policy['summary']}"
        candidates.append({"source": f"policy:{policy['topic'].lower().replace(' ','_')}", "content": blob, "relevance": _score_section(blob, tokens)})

    # FAQs
    for faq in PUBLIC_KNOWLEDGE_BASE["faqs"]:
        blob = f"Q: {faq['q']} A: {faq['a']}"
        candidates.append({"source": "faq", "content": blob, "relevance": _score_section(blob, tokens)})

    # Announcements
    for ann in PUBLIC_KNOWLEDGE_BASE["announcements"]:
        blob = f"{ann['title']}: {ann['body']}"
        candidates.append({"source": "announcement", "content": blob, "relevance": _score_section(blob, tokens)})

    # Employees (safe profile only — name + role + dept)
    for emp in PUBLIC_KNOWLEDGE_BASE["employees"]:
        blob = f"{emp['name_en']} ({emp.get('name_ar','')}) — {emp['role_en']}, {emp['department']} department."
        candidates.append({"source": f"employee:{emp['name_en'].split()[0].lower()}", "content": blob, "relevance": _score_section(blob, tokens)})

    candidates.sort(key=lambda x: x["relevance"], reverse=True)
    top = [c for c in candidates if c["relevance"] > 0][:top_k]
    return top if top else candidates[:2]


@app.post("/api/public-agent-query")
async def public_agent_query(data: AgentQueryInput):
    """
    Restricted webhook for employee-facing ElevenLabs AI agents.
    Searches PUBLIC_KNOWLEDGE_BASE only — no burnout scores, no internal metrics,
    no role-drift or innovator data is ever returned.
    CORS: open to all origins.
    """
    if not data.query or not data.query.strip():
        raise HTTPException(status_code=400, detail="'query' must be a non-empty string.")

    results = _search_public_knowledge_base(data.query.strip(), data.top_k)
    context_blob = "\n\n".join(f"[{r['source']}] {r['content']}" for r in results)

    answer = None
    if model:
        try:
            lang_instruction = (
                "Respond in Arabic only." if data.language == "ar"
                else "Respond in clear, concise English."
            )
            prompt = f"""You are a helpful HR assistant for employees. Answer the user's question
using ONLY the HR policies, FAQs, and public information provided below.
Do NOT reveal any performance metrics, burnout scores, internal analytics, or data
about other employees. If a question is outside your scope, politely say so and
suggest contacting the HR team directly.
{lang_instruction}

Context:
{context_blob}

Employee Question: {data.query}

Answer:"""
            resp = model.generate_content(prompt)
            answer = resp.text.strip()
        except Exception:
            answer = None

    if not answer:
        answer = results[0]["content"] if results else (
            "لم أجد معلومات كافية. يرجى التواصل مع فريق الموارد البشرية مباشرة."
            if data.language == "ar"
            else "I couldn't find a specific answer. Please contact the HR team directly for assistance."
        )

    return {
        "query": data.query,
        "answer": answer,
        "sources": [{"source": r["source"], "snippet": r["content"][:200]} for r in results],
        "context_used": len(results),
    }


# ══════════════════════════════════════════════════════════════════════════════
# SESSION CONTEXT — role-scoped live data for ElevenLabs agent prompt injection
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/session-context")
async def get_session_context(role: str = "employee", name: str = "Khalid Ibrahim"):
    """
    Returns role-scoped live context consumed by the frontend widget to build
    the ElevenLabs agent's conversation-config-override (system prompt + first
    message) before the user starts talking.

    role=employee + name=<employee>
        → Returns ONLY that employee's personal profile: burnout score,
          performance, leave balances, active tasks, projects, AI
          recommendations, and public HR policies. No other employee's
          data is ever included.

    role=manager | hr
        → Returns full workforce analytics: all employee records (with burnout
          scores, innovator flags, project summaries), department stats,
          active projects, all HR policies, and all FAQs.

    CORS: open to all origins (same as other /api/* endpoints).
    """
    role_clean = role.lower().strip()

    if role_clean == "employee":
        profile_key = name.lower().strip()
        profile = EMPLOYEE_PROFILES.get(profile_key) or EMPLOYEE_PROFILES["khalid ibrahim"]

        return {
            "context_type": "employee",
            "user": {
                "name_en":    profile["name_en"],
                "name_ar":    profile["name_ar"],
                "role":       profile["role_en"],
                "department": profile["department"],
            },
            "metrics": {
                "burnout_score":       profile["burnout_score"],
                "burnout_level":       profile["burnout_level"],
                "performance_score":   profile["performance_score"],
                "contribution_streak": profile["contribution_streak"],
            },
            "leave_balance":      profile["leave_balance"],
            "tasks":              profile["tasks"],
            "projects":           profile["projects"],
            "ai_recommendations": profile["ai_recommendations"],
            "recent_activity":    profile["recent_activity"],
            "hr_policies":        KNOWLEDGE_BASE["hr_policies"],
            "faqs":               [f for f in KNOWLEDGE_BASE["faqs"] if _is_public_faq(f)],
        }

    elif role_clean in ("manager", "hr"):
        all_emps     = KNOWLEDGE_BASE["employees"]
        high_burnout = [e for e in all_emps if "High" in e.get("burnout", "")]
        innovators   = [e for e in all_emps if e.get("innovator")]
        active_projs = sum(1 for p in KNOWLEDGE_BASE["projects"] if p["status"] == "Active")

        return {
            "context_type": role_clean,
            "team_summary": {
                "total_employees":    len(all_emps),
                "burnout_high_count": len(high_burnout),
                "innovator_count":    len(innovators),
                "departments":        len(KNOWLEDGE_BASE["departments"]),
                "active_projects":    active_projs,
            },
            "burnout_alerts": [
                {
                    "employee":   e["name_en"],
                    "role":       e["role_en"],
                    "department": e["department"],
                    "burnout":    e["burnout"],
                    "summary":    e["summary"],
                }
                for e in high_burnout
            ],
            "top_innovators": [
                {"employee": e["name_en"], "role": e["role_en"], "department": e["department"]}
                for e in innovators
            ],
            "employees":   all_emps,
            "departments": KNOWLEDGE_BASE["departments"],
            "projects":    KNOWLEDGE_BASE["projects"],
            "hr_policies": KNOWLEDGE_BASE["hr_policies"],
            "faqs":        KNOWLEDGE_BASE["faqs"],
        }

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Accepted values: employee, manager, hr",
        )
