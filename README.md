# Persona Architect

**Persona Architect** is a sophisticated React application designed to help you build expert-level system instructions (personas) for AI assistants. Stop writing generic prompts—architect tailored, high-performance system prompts for coding, strategy, writing, and more.

After you finish the wizard, you choose **how** generations run: **OpenAI**, **Anthropic**, **Google Gemini**, or a **local OpenAI-compatible** server. You can use your own API keys (frontier providers) or point at a local endpoint for fully offline or self-hosted models.

![Persona Architect Banner](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2665&auto=format&fit=crop&ixlib=rb-4.0.3)

## ✨ Features

- **Guided Wizard Interface**: A step-by-step process to capture essential persona details (role, tools, behavior, principles, output style).
- **Model & credentials step**: Pick **OpenAI**, **Anthropic**, **Gemini**, or **Local AI** before persona generation; the same settings apply to **Prompt Builder** (JSON prompt generation).
- **Bring-your-own-key**: Cloud providers use the API key you enter in the app (your account balance).
- **Local AI**: Optional base URL (e.g. `http://127.0.0.1:1234`) for servers that expose OpenAI-style `POST /v1/chat/completions` (e.g. LM Studio, compatible proxies).
- **Expert templates**: Personas follow strict, high-performance patterns inspired by real engineering standards.
- **Modern UI/UX**: Glassmorphism design, smooth animations, and a responsive layout.
- **One-click copy**: Copy the generated persona or JSON prompt for use in your tools.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **LLM access**: Vite dev **API routes** under `api/` call provider REST APIs (OpenAI, Anthropic, Gemini `generateContent`, or local OpenAI-compatible chat completions). Default models are defined in [`api/lib/completeText.ts`](api/lib/completeText.ts).

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- For cloud providers: an API key from [OpenAI](https://platform.openai.com/), [Anthropic](https://console.anthropic.com/), or [Google AI Studio](https://aistudio.google.com/app/apikey) (depending on what you select in the app)
- For **Local AI**: a running OpenAI-compatible server on your machine (see below)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ersincodes/promptArchitect.git
   cd promptArchitect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables (optional)**

   The dev server loads variables from `.env` in the project root (see [`vite.config.ts`](vite.config.ts)). You can set a **default Gemini key** for the server so that choosing **Google Gemini** with an **empty** API key in the UI still works (useful for local development):

   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

   If you always enter keys in the **Model & credentials** screen for OpenAI, Anthropic, or Gemini, you do not need this variable.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the app.

### Local AI notes

- The app appends **`/v1/chat/completions`** to the base URL you enter. Allowed hostnames are **`localhost`**, **`127.0.0.1`**, and **`::1`** (SSRF protection).
- Requests are made **from the Vite API process** to that URL, so this works when **`npm run dev`** runs on the **same machine** as your local model server. A hosted deployment generally **cannot** reach your laptop’s `127.0.0.1`.

## 📂 Project Structure

The project follows a clean, modular architecture:

```text
api/
├── lib/
│   └── completeText.ts   # Shared LLM calls (OpenAI, Anthropic, Gemini, local)
├── generate-persona.ts   # POST /api/generate-persona
└── generate-structured-prompt.ts  # POST /api/generate-structured-prompt
src/
├── components/
│   ├── Layout/           # Global layout (Header, Footer, Background)
│   ├── Screens/          # Welcome, Wizard flow, ProviderConfig, Result, Prompt Builder, etc.
│   └── Wizard/           # Input wizard component
├── hooks/                # Custom hooks (e.g., useWizard)
├── lib/                  # Utility functions (cn, etc.)
├── services/             # Client API helpers (e.g., geminiService.ts)
├── App.tsx               # Main application controller
├── types.ts              # TypeScript definitions
└── index.tsx             # Entry point
```

## 💡 Usage

1. **Start the Architect**: Click **Start Architecting** on the welcome screen.
2. **Answer the five questions**:
   - **Role**: Who the AI is (e.g., “Senior Python Engineer”).
   - **Tools**: Tech stack or concepts to use.
   - **Behavior**: Tone and reasoning style.
   - **Principles**: Methodologies and rules.
   - **Style**: Output format preferences.
3. **Model & credentials**: After the last question, choose **OpenAI**, **Anthropic**, **Gemini**, or **Local AI**:
   - Cloud: enter your **API key** (required for OpenAI and Anthropic; Gemini can be left empty if `GEMINI_API_KEY` is set on the server).
   - Local: enter the **base URL** (e.g. `http://127.0.0.1:1234`).
4. **Generate persona**: The app calls the selected backend and shows your system persona.
5. **Prompt Builder** (optional): Generate a capped JSON image prompt using the **same** provider settings.
6. **Copy & use**: Paste the persona or JSON into your assistant or pipeline.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Ersin Bahar**

- GitHub: [@ersincodes](https://github.com/ersincodes)

---

_Built with ❤️ using React & AI_
