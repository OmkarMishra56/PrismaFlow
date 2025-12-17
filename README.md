# PrismaFlow | Task Intelligence

PrismaFlow is a high-performance productivity engine featuring intelligent task decomposition, priority analysis powered by Gemini AI, and a modern enterprise-grade architecture inspired by Microsoft's Fluent UI design system.

<img width="1909" height="798" alt="prismaflow " src="https://github.com/user-attachments/assets/f827a345-4efe-4c6e-8545-3097db527b67" />

---

## 🚀 Features

- **Operational Core Dashboard** – A sophisticated task management interface with smooth animations and intuitive layout.
- **Neural Engine Analysis** – Gemini-powered strategic summaries of your current workload to identify bottlenecks and priorities.
- **Smart Task Decomposition** – "Neural Break" feature that leverages AI to decompose high-level objectives into actionable sub-directives.
- **Fluent UI Aesthetic** – Premium "Acrylic" and "Mica" glassmorphism effects, Windows 11-inspired "Bloom" background animations, and responsive dark/light modes.
- **Satisfying Life-cycle Animations** – Celebratory "Neural Pop" and success ripples for task completion, and smooth "Collapse-out" exit animations for deletion.
- **Neural Nexus Assistant** – A persistent AI chat assistant with full context of your tasks to help optimize your workflow.
- **Protected Session Management** – Secure Auth context for user profile synchronization and protected routing using React Router.
- **Telemetry & Metrics** – Real-time efficiency index and workload visualization.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** – Component-based architecture.
- **TypeScript** – Microsoft's core language for robust, type-safe development.
- **Tailwind CSS** – Utility-first styling with custom Fluent UI extensions.
- **React Router 7** – Secure, protected navigation.
- **Lucide & Fluent Icons** – Minimalist, high-legibility iconography.

### AI & Intelligence
- **Google Gemini API** (`@google/genai`)
- **Primary Model**: `gemini-3-flash-preview`
- **Capabilities**: Strategic summarization, JSON-structured subtask generation, and context-aware chat interaction.

---

## 📁 Project Structure

```text
├── App.tsx                  
├── index.tsx                
├── index.html               
├── types.ts                 
├── metadata.json          
├── services/
│   ├── api.ts               
│   └── geminiService.ts     
├── context/
│   ├── AuthContext.tsx      
│   └── ThemeContext.tsx     
└── components/
    ├── Layout.tsx           
    ├── TaskForm.tsx       
    ├── TaskItem.tsx         
    ├── SmartAnalysis.tsx 
    └── AIAssistant.tsx      
```


## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/OmkarMishra56/PrismaFlow
```

### 2️⃣ Environment Variables
The application requires a valid Google Gemini API Key. Ensure `process.env.API_KEY` is available in your execution environment.

### 3️⃣ Run the App Locally
Since this project uses ES6 modules directly via import maps in `index.html`, you can serve it using any local web server:

```bash

npx serve 
```

---

## 🧠 AI Integration Details

PrismaFlow leverages the **Gemini 3 Flash** model to provide real-time intelligence:

- **Strategic Summarization**: Analyzes the `Priority`, `DueDate`, and `Status` of all tasks to generate a high-level executive summary.
- **Structural Decomposition**: Uses `responseSchema` to force the model to return a valid JSON array of subtasks, ensuring UI stability.
- **Contextual Awareness**: The `AIAssistant` is initialized with a `systemInstruction` containing a flattened string of the user's current workload, allowing for personalized productivity advice.

---

## 📄 License

This project is for learning and demonstration purposes. Built with a focus on high-end UI/UX and AI integration.

⭐ *If you find this intelligent workflow system useful, consider giving it a star!*
