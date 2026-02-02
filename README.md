# CodeEval

**AI-Powered Code Assignment Evaluation Tool**

CodeEval automates the evaluation of coding assignments for hiring using a 3-pass AI evaluation pipeline. It analyzes code structure, requirement fulfillment, and overall quality to help technical recruiters and hiring managers make faster, more consistent evaluation decisions.

## ⚠️ Important Disclaimer

**This tool uses AI models (Groq Llama 3.3 70B / Google Gemini) which may produce inaccurate, incomplete, or biased results.**

- ✅ **Use AI evaluations to assist human review, not replace it**
- ✅ **Always review evaluations manually before making hiring decisions**
- ✅ **Apply your professional judgment and company standards**
- ⚠️ AI outputs should be treated as suggestions, not definitive assessments

## Features

- 🤖 **3-Pass AI Evaluation Pipeline**
  - Pass 1: Structure & quality analysis
  - Pass 2: Requirement-by-requirement review
  - Pass 3: Final scoring & recommendation

- 📦 **Multiple Input Methods**
  - GitHub repository URL
  - Local folder upload

- 🚀 **Dual AI Provider Support**
  - Primary: Groq (free tier, high rate limits)
  - Fallback: Google Gemini

- 📊 **Comprehensive Reports**
  - Code structure & quality assessment
  - Feature completeness evaluation
  - Detailed test analysis
  - Documentation review
  - Final recommendation with candidate level

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (package manager)
- Groq API key (recommended) - [Get free key](https://console.groq.com)
- Google API key (fallback) - [Get free key](https://aistudio.google.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-eval
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:
   ```bash
   # Recommended: Groq API (free tier, high rate limits)
   GROQ_API_KEY=your_groq_api_key_here

   # Required as fallback: Google Gemini API
   GOOGLE_API_KEY=your_google_api_key_here

   # Optional: GitHub token for higher rate limits
   GITHUB_TOKEN=your_github_token_here
   ```

4. **Run the development server**
   ```bash
   bun dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

1. **Load Source Code**
   - Paste a GitHub repository URL, or
   - Upload a local project folder

2. **Review Templates**
   - Customize the Requirement Template (what to evaluate)
   - Customize the Result Template (output format)

3. **Click "Evaluate"**
   - The AI will analyze the code in 3 passes
   - Progress indicator shows current pass

4. **Review Results**
   - Detailed markdown report
   - Section scores and overall recommendation
   - Candidate level assessment

## Project Structure

```
code-eval/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes (evaluate, github)
│   ├── evaluate/          # Main evaluation page
│   └── results/           # Results display page
├── components/            # React components
│   ├── evaluate/         # Evaluation form components
│   ├── results/          # Results display components
│   ├── layout/           # Header, footer components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── ai/               # AI client & prompts (Groq, Gemini)
│   ├── github/           # GitHub API integration
│   ├── parsers/          # File parsing & filtering
│   ├── templates/        # Default evaluation templates
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## Configuration

### AI Provider Priority

The app tries providers in this order:
1. **Groq** (if `GROQ_API_KEY` is set) - faster, higher free tier limits
2. **Gemini** (fallback) - requires `GOOGLE_API_KEY`

### Rate Limits

| Provider | Free Tier Limits | Speed |
|----------|-----------------|-------|
| Groq | 30 req/min, 6K tokens/min | ⚡ Very Fast |
| Gemini | Lower, often overloaded | 🐌 Slower |

### Customization

- **Requirement Template**: Edit at `/lib/templates/default-requirement.ts`
- **Result Template**: Edit at `/lib/templates/default-result.ts`
- **AI Prompts**: Modify at `/lib/ai/prompts.ts`
- **Model Selection**: Change in `/lib/constants.ts`

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- **AI Providers**:
  - [Groq](https://groq.com) (Llama 3.3 70B)
  - [Google Gemini](https://ai.google.dev) (gemini-2.5-flash)
- **Package Manager**: [Bun](https://bun.sh)

## License

MIT License - see [LICENSE](./LICENSE) file for details.

Copyright (c) 2026 Long Luu

## Acknowledgments

This project uses the following open-source libraries and services:

### Core Framework
- [Next.js](https://nextjs.org) - React framework
- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety

### UI & Styling
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com) - Unstyled accessible components
- [shadcn/ui](https://ui.shadcn.com) - Re-usable component library
- [Lucide Icons](https://lucide.dev) - Icon set

### AI & APIs
- [Groq](https://groq.com) - Fast AI inference API
- [Google Generative AI](https://ai.google.dev) - Gemini API
- [Anthropic Claude](https://www.anthropic.com) - Code documentation assistance

### Utilities
- [Zod](https://zod.dev) - Schema validation
- [JSZip](https://stuk.github.io/jszip/) - ZIP file handling
- [Sonner](https://sonner.emilkowal.ski) - Toast notifications

## Contributing

This is an internal tool built for personal use and shared with colleagues.

If you're a colleague and want to suggest improvements:
1. Create an issue describing the enhancement
2. Submit a pull request with your changes
3. Ensure code follows the existing patterns

## Support

For questions or issues:
- Check the [CLAUDE.md](./CLAUDE.md) file for architecture details
- Review the codebase documentation
- Contact the maintainer

## Disclaimer

This tool is provided "as is" without warranty of any kind. See the [LICENSE](./LICENSE) file for full terms.

**Remember**: AI evaluations are meant to assist, not replace, human judgment in hiring decisions. Always apply professional discretion and company-specific standards.

---

**Built with ❤️ for better hiring workflows**
