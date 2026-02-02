import { shouldIncludeFile, formatSourceCode } from "@/lib/parsers/file-filter";
import type { SourceData } from "@/lib/types";

interface GitHubTreeItem {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

function parseGitHubUrl(url: string): { owner: string; repo: string; branch?: string } {
  const cleaned = url.replace(/\/+$/, "").replace(/\.git$/, "");
  const match = cleaned.match(
    /github\.com\/([^/]+)\/([^/]+?)(?:\/tree\/([^/]+.*))?$/
  );
  if (!match) {
    throw new Error("Invalid GitHub URL. Expected format: https://github.com/owner/repo");
  }
  return {
    owner: match[1],
    repo: match[2],
    branch: match[3] || undefined,
  };
}

async function githubFetch(path: string, token?: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`https://api.github.com${path}`, { headers });
}

export async function fetchGitHubRepo(
  url: string,
  token?: string
): Promise<SourceData> {
  const { owner, repo, branch: urlBranch } = parseGitHubUrl(url);

  // Get default branch if not specified
  const repoRes = await githubFetch(`/repos/${owner}/${repo}`, token);
  if (!repoRes.ok) {
    if (repoRes.status === 404) {
      throw new Error(
        "Repository not found or is private. Please ask the candidate to make the repo public or provide a ZIP file instead."
      );
    }
    throw new Error(`GitHub API error: ${repoRes.status} ${repoRes.statusText}`);
  }

  const repoData = await repoRes.json();
  const branch = urlBranch || repoData.default_branch;

  // Get file tree
  const treeRes = await githubFetch(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    token
  );
  if (!treeRes.ok) {
    throw new Error(`Failed to fetch repository tree: ${treeRes.statusText}`);
  }

  const treeData = await treeRes.json();
  const allFiles: GitHubTreeItem[] = treeData.tree || [];

  const blobFiles = allFiles.filter(
    (item) => item.type === "blob" && shouldIncludeFile(item.path)
  );
  const fileTree = allFiles
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .sort();

  // Fetch file contents (limit to reasonable size files < 100KB)
  const filesToFetch = blobFiles.filter(
    (f) => !f.size || f.size < 100_000
  );

  const files: { path: string; content: string }[] = [];

  // Fetch in batches of 10 to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < filesToFetch.length; i += batchSize) {
    const batch = filesToFetch.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (file) => {
        try {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`;
          const headers: Record<string, string> = {};
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
          const res = await fetch(rawUrl, { headers });
          if (!res.ok) return null;
          const content = await res.text();
          // Skip binary-looking content
          if (content.includes("\0")) return null;
          return { path: file.path, content };
        } catch {
          return null;
        }
      })
    );
    files.push(
      ...(results.filter(Boolean) as { path: string; content: string }[])
    );
  }

  return {
    sourceCode: formatSourceCode(files),
    fileTree,
    repoInfo: { owner, repo, branch },
  };
}
