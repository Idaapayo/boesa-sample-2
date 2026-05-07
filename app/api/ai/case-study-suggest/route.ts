import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { title, subtitle, description } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here") {
    return Response.json({ error: "ANTHROPIC_API_KEY is not configured." }, { status: 500 });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const aiRes = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are helping write a case study for a biodiversity map publication (BOESA — Biodiversity of Eastern and Southern Africa).

Map details:
Title: ${title || "(none)"}
Subtitle: ${subtitle || "(none)"}
Description: ${description || "(none)"}

Provide a JSON object with exactly this structure:
{
  "sampleStudy": "A structured case study of 400–600 words. Include three clearly labelled sections:\\n\\nPROBLEM\\n...\\n\\nAPPROACH\\n...\\n\\nOUTCOME\\n...",
  "references": [
    {
      "title": "Full title of a real published study, report, or programme relevant to this topic",
      "description": "2–3 sentence summary of what this study found or achieved.",
      "source": "Publishing organisation or journal name"
    }
  ]
}

Include exactly 4 references. Return ONLY valid JSON — no markdown, no extra text.`,
        },
      ],
    });

    const raw = (aiRes.content[0] as { text: string }).text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const suggestion = JSON.parse(match[0]);

    return Response.json(suggestion);
  } catch (err) {
    console.error("case-study-suggest error", err);
    return Response.json({ error: "Failed to generate suggestions." }, { status: 500 });
  }
}
