# CodeEval - AI-Powered Code Evaluation

A modern Next.js application that automates code assignment evaluation for technical hiring. Uses a 3-pass AI evaluation pipeline powered by Groq (Llama 3.3 70B) or Google Gemini to assess code structure, requirement fulfillment, and overall quality.

![CodeEval Screenshot](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## Features

- 🔍 **3-Pass AI Evaluation** - Structure scan, requirement review, and final scoring
- 🌙 **Dark/Light Mode** - Glassmorphic UI with smooth theme transitions
- 📂 **Multiple Input Methods** - GitHub URL or local folder upload
- 📊 **Detailed Reports** - Section scores, key takeaways, and markdown export
- 🖨️ **Export Options** - Copy, Markdown download, and Print PDF
- ⚡ **Fast Inference** - Groq primary (Llama 3.3 70B) with Gemini fallback

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (package manager)
- API Keys (at least one required):
  - [Groq API Key](https://console.groq.com) (recommended - free, high rate limits)
  - [Google AI Studio API Key](https://aistudio.google.com) (fallback)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/code-eval.git
cd code-eval

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env
# GROQ_API_KEY=your_groq_key
# GOOGLE_API_KEY=your_google_key
# GITHUB_TOKEN=your_github_token (optional, increases rate limits)

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

### Environment Variables

| Variable         | Required    | Description                                             |
| ---------------- | ----------- | ------------------------------------------------------- |
| `GROQ_API_KEY`   | Recommended | Groq API key for Llama 3.3 70B (free, high rate limits) |
| `GOOGLE_API_KEY` | Fallback    | Google AI API key for Gemini (free tier)                |
| `GITHUB_TOKEN`   | Optional    | GitHub token for higher API rate limits (60→5000/hr)    |

## Usage

1. **Provide Source Code** - Enter a GitHub repository URL or upload a local folder
2. **Customize Templates** - Edit requirement and result templates as needed
3. **Run Evaluation** - Click "Evaluate" to start the 3-pass analysis
4. **Review Results** - View detailed scores, feedback, and export the report

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **AI Providers:** Groq (Llama 3.3 70B) / Google Gemini
- **Package Manager:** Bun

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (evaluate, github)
│   ├── evaluate/          # Evaluation form page
│   └── results/           # Results display page
├── components/            # React components
│   ├── evaluate/          # Evaluation form components
│   ├── layout/            # Header, footer, theme toggle
│   ├── results/           # Report display components
│   └── ui/                # shadcn/ui primitives
├── lib/                   # Core logic
│   ├── ai/                # AI clients and prompts
│   ├── github/            # GitHub API integration
│   ├── hooks/             # React hooks
│   ├── parsers/           # File parsing utilities
│   └── templates/         # Default templates
├── public/                # Static assets
└── docs/                  # Documentation and plans
```

## Development

```bash
bun dev          # Start development server
bun run build    # Build for production
bun start        # Start production server
bun run lint     # Run ESLint
```

## License

MIT © Long Luu
