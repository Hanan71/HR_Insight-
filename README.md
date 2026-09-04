<div align="center">

# 🧠 HR Insight | بصيرة الموارد البشرية

<p align="center">
  <b>An AI-powered HR intelligence platform designed to assess employee well-being, mitigate burnout, and optimize workforce roles.</b>
</p>

<!-- Badges Section -->
<p align="center">
  <a href="https://try.ka.nz/certificate/KANZ-GWR-738BBDEFCD?certificate_type=gwr2&recipient_name=%D8%AD%D9%86%D8%A7%D9%86+%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%84%D9%87&issue_date=July+15%2C+2026&certificate_id=KANZ-GWR-738BBDEFCD&lang=ar"><img src="https://img.shields.io/badge/Guinness%20World%20Records-Record%20Participant-FF8C00?style=for-the-badge&logo=target&logoColor=black&labelColor=FFD700" alt="Guinness World Record" /></a>
  &nbsp;
  <a href="https://try.ka.nz/ai/hananeabdallah"><img src="https://img.shields.io/badge/Kanz%20Hackathon-Gold%20Rating%20🥇-D4AF37?style=for-the-badge&logo=trophy&logoColor=white&labelColor=1F2428" alt="Gold Rating" /></a>
  &nbsp;
  <a href="https://try.ka.nz/ai/hananeabdallah"><img src="https://img.shields.io/badge/Kanz-Developer%20Profile-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Profile" /></a>
</p>

</div>

---

### 🏆 Hackathon Recognition & World Record

* **Gold Rating (التصنيف الذهبي):** Evaluated and awarded the prestigious **Gold Tier** rating at the **Kanz Hackathon** (out of Gold, Silver, and Bronze tiers), recognizing technical execution, architectural robustness, and real-world AI impact.
* **Guinness World Records Participant:** Official participant in the historic record set during the Kanz Hackathon—recognized globally as the world's largest hackathon.
  * 📜 [View Official Guinness World Records Certificate](https://try.ka.nz/certificate/KANZ-GWR-738BBDEFCD?certificate_type=gwr2&recipient_name=%D8%AD%D9%86%D8%A7%D9%86+%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%84%D9%87&issue_date=July+15%2C+2026&certificate_id=KANZ-GWR-738BBDEFCD&lang=ar)
  * 👤 [View Kanz Platform Profile](https://try.ka.nz/ai/hananeabdallah)

---

### 📌 About The Project

**HR Insight** is an intelligent analytics and decision-support system built to tackle one of the most critical challenges in modern workplaces: employee burnout, disengagement, and suboptimal role allocation.

By leveraging advanced natural language understanding and generative AI, the platform evaluates behavioral signals, work distribution patterns, and communication markers to provide HR leaders with actionable intelligence. It offers early burnout detection warnings and smart recommendations to rebalance responsibilities and foster a sustainable work environment.

---

### ✨ Key Features

* **Burnout Risk Detection:** Identifies indicators of employee fatigue, overburdening, and stress through multidimensional metric evaluation.
* **Intelligent Role Optimization:** Delivers data-driven suggestions to reassign, delegate, or align responsibilities with employee strengths.
* **Generative Insights Engine:** Produces concise executive summaries and strategic action plans for talent management.
* **Voice-Powered Interaction:** Integrates natural conversational audio synthesis for dynamic reporting and accessible feedback summaries.

---

### 🛠️ Tech Stack & Architecture

* **Backend Framework:** Python & **FastAPI** (asynchronous, high-performance API routing and data orchestration)
* **Large Language Models & AI:** **Google Gemini API** (deep context analysis, reasoning, and automated recommendation generation)
* **Voice Synthesis:** **ElevenLabs API** (ultra-realistic AI audio narration and voice reporting)
* **Environment & Deployment:** **Replit** & Git-based workflow

---

### 📂 Project Structure

<div align="left" dir="ltr">

```text
HR_Insight/
├── app/
│   ├── api/             # FastAPI route handlers and endpoints
│   ├── core/            # App configurations, secrets, and environment setup
│   ├── models/          # Data schemas and validation logic
│   └── services/        # AI orchestration (Gemini API & ElevenLabs pipelines)
├── static/              # Frontend UI assets (scripts, styles, layouts)
├── requirements.txt     # Python dependencies and packages
├── main.py              # Application entrypoint and startup lifecycle
└── README.md            # Project overview and documentation
```

</div>

---

### 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Hanan71/HR_Insight-.git](https://github.com/Hanan71/HR_Insight-.git)
   cd HR_Insight-
   ```

2. **Set up a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

5. **Run the application:**
   ```bash
   uvicorn main:app --reload
   ```

---

<div align="center">
  <sub>Developed for Kanz Hackathon — Honored with a Gold Rating & Guinness World Record Participation 🏆</sub>
</div>
