import { NextRequest, NextResponse } from "next/server";

type Body = {
  product?: string;
  recipient?: string;
  pain?: string;
  benefit?: string;
  cta?: string;
  tone?: string;
};

function buildPrompt(form: Required<Pick<Body, "product" | "recipient">> & Body) {
  const { product, recipient, pain, benefit, cta, tone } = form;
  return `You are an expert cold email copywriter. Write a highly effective cold email for sales outreach.

Details:
- Product/Service: ${product}
- Target recipient: ${recipient}
- Their pain point: ${pain || "not specified"}
- Unique benefit offered: ${benefit || "not specified"}
- Call to action: ${cta || "Schedule a quick call"}
- Tone: ${tone}

Write the email in this EXACT format — nothing else:
SUBJECT: [subject line here]
---
[email body here]

Rules:
- Subject line: curiosity-driven, under 8 words, no clickbait
- Body: under 120 words
- No fluff, no "I hope this email finds you well"
- Mention their pain point in the first line
- One clear CTA at the end
- Sound like a human, not a robot
- Do not use bullet points`;
}

function parseEmailOutput(fullText: string): { subject: string; body: string } {
  const subjectMatch = fullText.match(/SUBJECT:\s*(.+)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "";
  const parts = fullText.split("---");
  const body =
    parts.length > 1
      ? parts.slice(1).join("---").trim()
      : fullText.replace(/SUBJECT:.+/i, "").trim();
  return { subject, body };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "Server is not configured with GROQ_API_KEY." },
      { status: 503 },
    );
  }

  let json: Body;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const product = typeof json.product === "string" ? json.product.trim() : "";
  const recipient = typeof json.recipient === "string" ? json.recipient.trim() : "";
  const pain = typeof json.pain === "string" ? json.pain.trim() : "";
  const benefit = typeof json.benefit === "string" ? json.benefit.trim() : "";
  const cta = typeof json.cta === "string" ? json.cta.trim() : "";
  const tone = typeof json.tone === "string" ? json.tone.trim() : "Professional";

  if (!product || !recipient) {
    return NextResponse.json(
      { error: "product and recipient are required." },
      { status: 400 },
    );
  }

  const prompt = buildPrompt({ product, recipient, pain, benefit, cta, tone });

  let groqResponse: Response;
  try {
    groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 600,
        temperature: 0.8,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach Groq. Check your network and try again." },
      { status: 502 },
    );
  }

  if (!groqResponse.ok) {
    const err = (await groqResponse.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    const message =
      err.error?.message || `Groq API error (${groqResponse.status}).`;
    const status =
      groqResponse.status >= 400 && groqResponse.status < 500
        ? groqResponse.status
        : 502;
    return NextResponse.json({ error: message }, { status });
  }

  const data = (await groqResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const fullText = data.choices?.[0]?.message?.content?.trim() || "";

  if (!fullText) {
    return NextResponse.json(
      { error: "No response received from the model. Please try again." },
      { status: 502 },
    );
  }

  const { subject, body } = parseEmailOutput(fullText);
  return NextResponse.json({ subject, body });
}
