import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchGitHubRepo } from "@/lib/github/fetch-repo";

const RequestSchema = z.object({
  url: z.string().url().refine((u) => u.includes("github.com"), {
    message: "Must be a GitHub URL",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.parse(body);

    const token = process.env.GITHUB_TOKEN || undefined;
    const result = await fetchGitHubRepo(parsed.url, token);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    const message =
      error instanceof Error ? error.message : "Failed to fetch repository";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
