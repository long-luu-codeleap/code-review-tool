export const APP_NAME = "CodeEval";

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const MAX_SOURCE_CODE_LENGTH = 500_000; // chars

export const IGNORED_PATTERNS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  ".cache",
  ".turbo",
  "coverage",
  "__pycache__",
  ".vscode",
  ".idea",
  ".DS_Store",
  "Thumbs.db",
];

export const IGNORED_EXTENSIONS = [
  ".lock",
  ".lockb",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".webp",
  ".mp4",
  ".mp3",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
  ".pdf",
  ".zip",
  ".tar",
  ".gz",
  ".map",
  ".min.js",
  ".min.css",
  ".chunk.js",
  ".chunk.css",
];

export const GEMINI_MODEL = "gemini-2.0-flash";
