# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeEval is a Next.js application that automates code assignment evaluation for hiring. It uses a 3-pass AI evaluation pipeline powered by Google's Gemini API to assess code structure, requirement fulfillment, and overall quality.

## Development Commands

```bash
# Development
bun dev              # Start dev server on http://localhost:3000

# Build & Production
bun run build        # Build for production
bun start            # Start production server

# Linting
bun run lint         # Run ESLint
```

Note: This project uses Bun as the package manager (see `bun.lock`).

## Environment Setup

Environment variables (see `.env.example`):

- `GROQ_API_KEY` - **Recommended**. Free API key from <https://console.groq.com> (much higher rate limits than Gemini!)
- `GOOGLE_API_KEY` - **Required as fallback**. Get free API key from <https://aistudio.google.com>
- `GITHUB_TOKEN` - Optional. Increases GitHub API rate limits from 60/hr to 5000/hr

**Note:** The app will try Groq first (if configured), then fall back to Gemini if Groq fails or is not configured.

## Architecture

### AI Provider System

The app supports multiple AI providers with automatic fallback (`lib/ai/gemini-client.ts`):

1. **Primary: Groq** (if `GROQ_API_KEY` is set)
   - Free tier with high rate limits (30 req/min, 6K tokens/min)
   - Uses Llama 3.3 70B model
   - Very fast inference (specialized hardware)
   - Client: `lib/ai/groq-client.ts`

2. **Fallback: Google Gemini** (if Groq fails or not configured)
   - Free tier with lower rate limits
   - Uses gemini-2.5-flash model
   - Auto-retry with exponential backoff for 503/429 errors

The system automatically tries Groq first, then falls back to Gemini if Groq is unavailable or fails.

### Evaluation Pipeline (3-Pass System)

The core evaluation flow is in `lib/ai/evaluate-pipeline.ts`:

1. **Pass 1: Structure Scan** - Analyzes project setup, file organization, architecture patterns, code quality, testing, and documentation. Returns structured assessment with scores 1-10 for each category.

2. **Pass 2: Requirement Review** - Evaluates how well the code meets specific requirements from the template. Returns per-requirement scoring with status (pass/partial/fail), positives, improvements, and evidence.

3. **Pass 3: Final Scoring** - Synthesizes Pass 1 and 2 into a final report. Returns markdown report plus JSON with overall score, candidate level, recommendation, and section scores.

Each pass uses `lib/ai/gemini-client.ts` with prompts from `lib/ai/prompts.ts`.

### Source Code Input Methods

Two ways to provide code for evaluation:

1. **GitHub Repository** (`lib/github/fetch-repo.ts`)
   - Fetches from public GitHub repos via GitHub API
   - Parses URLs to extract owner/repo/branch
   - Uses recursive tree API to get all files
   - Fetches raw file contents (max 100KB per file)
   - Batched fetching (10 files at a time) to avoid rate limits

2. **ZIP Upload** (`lib/parsers/zip-parser.ts`)
   - Client-side unzipping using JSZip
   - Extracts files and creates file tree

Both methods use `lib/parsers/file-filter.ts` to:
- Filter out ignored patterns (node_modules, .git, dist, etc.)
- Filter out binary/generated files (.lock, .png, .min.js, etc.)
- Format source code as structured text for AI consumption

See `lib/constants.ts` for `IGNORED_PATTERNS` and `IGNORED_EXTENSIONS`.

### UI Flow

- `/` - Redirects to `/evaluate`
- `/evaluate` - Main evaluation form (GitHub URL or ZIP upload, requirement/result template editing)
- `/results` - Shows evaluation report (reads from sessionStorage)

The app uses Next.js App Router with client components for interactivity.

### State Management

Evaluation state is managed in `lib/hooks/use-evaluation.ts`:
- Handles source data loading (GitHub/ZIP)
- Manages evaluation progress through 3 passes
- Stores results in sessionStorage for `/results` page
- Tracks loading states and errors

### UI Components

- `components/ui/` - shadcn/ui components (Button, Tabs, Progress, etc.)
- `components/evaluate/` - Evaluation form components
- `components/results/` - Results display components
- `components/layout/` - Layout components (header, theme toggle)

Uses Tailwind CSS v4 with Radix UI primitives.

### Type Safety

All core types are defined in `lib/types.ts`:
- `EvaluationInput` - Input to evaluation pipeline
- `Pass1Output`, `Pass2Output`, `Pass3Output` - Structured outputs from each pass
- `EvaluationResult` - Combined result from all 3 passes
- `SourceData` - Parsed source code and file tree

The app uses Zod for runtime validation in API routes.

## API Routes

- `POST /api/github` - Fetch GitHub repository
  - Input: `{ url: string }`
  - Returns: `SourceData`

- `POST /api/evaluate` - Run 3-pass evaluation
  - Input: `EvaluationInput` (sourceCode, fileTree, requirementTemplate, resultTemplate)
  - Returns: `EvaluationResult`

Both routes validate inputs with Zod and handle errors consistently.

## Key Constraints

- `MAX_SOURCE_CODE_LENGTH`: 500,000 characters (defined in `lib/constants.ts`)
- `MAX_FILE_SIZE_MB`: 50 MB for ZIP uploads
- GitHub: Only fetches files < 100KB to avoid memory issues
- Model: Uses `gemini-2.0-flash` (see `lib/constants.ts`)

## AI Response Parsing

The pipeline includes robust JSON parsing (`cleanJsonResponse` in `evaluate-pipeline.ts`):
- Strips markdown code fences from AI responses
- Pass 3 uses delimiter `---JSON_DATA---` to separate markdown report from JSON
- Includes fallback parsing if delimiter is missing
