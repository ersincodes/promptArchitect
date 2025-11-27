# Persona Architect

**Persona Architect** is a sophisticated React application designed to help you build expert-level system instructions (personas) for AI assistants. Stop writing generic prompts—architect tailored, high-performance system prompts for coding, strategy, writing, and more.

Powered by **Google Gemini AI**, this tool guides you through a structured wizard to define roles, tools, behaviors, and principles, synthesizing them into a professional, copy-ready system persona.

![Persona Architect Banner](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2665&auto=format&fit=crop&ixlib=rb-4.0.3)

## ✨ Features

- **Guided Wizard Interface**: A step-by-step process to capture essential persona details (Role, Tech Stack, Behavior, Methodology).
- **AI-Powered Synthesis**: Uses Google's Gemini AI to generate nuanced, authoritative system instructions based on your inputs.
- **Expert Templates**: Generates personas following strict, high-performance engineering standards (e.g., "Senior Full-Stack Developer").
- **Modern UI/UX**: Built with a glassmorphism design, smooth animations, and a responsive layout.
- **One-Click Copy**: Easily copy the generated markdown to your clipboard for immediate use in ChatGPT, Claude, or Gemini.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Google GenAI SDK](https://github.com/google/google-auth-library-nodejs) (Gemini models)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/ersincodes/promptArchitect.git
    cd promptArchitect
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your API key:

    ```env
    VITE_API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the app.

## 📂 Project Structure

The project follows a clean, modular architecture:

```text
src/
├── components/
│   ├── Layout/          # Global layout (Header, Footer, Background)
│   ├── Screens/         # Main application states (Welcome, Result, etc.)
│   └── Wizard/          # Input wizard component
├── hooks/               # Custom hooks (e.g., useWizard)
├── lib/                 # Utility functions (cn, etc.)
├── services/            # API services (Google GenAI integration)
├── App.tsx              # Main application controller
├── types.ts             # TypeScript definitions
└── index.tsx            # Entry point
```

## 💡 Usage

1.  **Start the Architect**: Click "Start Architecting" on the welcome screen.
2.  **Answer Questions**:
    - **Role**: Define who the AI is (e.g., "Senior Python Engineer").
    - **Tools**: List the tech stack or concepts to use.
    - **Behavior**: Set the tone (e.g., "Critical, nuanced, step-by-step").
    - **Principles**: Define core methodologies (e.g., "DRY, SOLID, Mobile-first").
    - **Style**: Specify output format (e.g., "Strict code, no prose").
3.  **Generate**: The app will send your inputs to Gemini to synthesize a robust system prompt.
4.  **Copy & Use**: Copy the result and paste it into your AI assistant's "System Instructions" or initial prompt.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Ersin Bahar**

- GitHub: [@ersincodes](https://github.com/ersincodes)

---

_Built with ❤️ using React & AI_
