"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EmailForm from "@/components/EmailForm";
import OutputCard from "@/components/OutputCard";
import Toast from "@/components/Toast";

type FormData = {
  product: string;
  recipient: string;
  pain: string;
  benefit: string;
  cta: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [currentTone, setCurrentTone] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [lastForm, setLastForm] = useState<FormData | null>(null);
  const [lastTone, setLastTone] = useState("");

  async function generate(formData: FormData, tone: string) {
    const apiKey = (document.getElementById("api-key") as HTMLInputElement)?.value.trim();

    if (!apiKey) return setError("Please enter your Anthropic API key.");
    if (!formData.product || !formData.recipient) return setError("Please fill in at least your product and target recipient.");

    setError("");
    setIsLoading(true);
    setSubject("");
    setBody("");
    setLastForm(formData);
    setLastTone(tone);
    setCurrentTone(tone);

    const prompt = `You are an expert cold email copywriter. Write a highly effective cold email for sales outreach.

Details:
- Product/Service: ${formData.product}
- Target recipient: ${formData.recipient}
- Their pain point: ${formData.pain || "not specified"}
- Unique benefit offered: ${formData.benefit || "not specified"}
- Call to action: ${formData.cta || "Schedule a quick call"}
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

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 600,
          temperature: 0.8,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const fullText = data.choices?.[0]?.message?.content || "";

      if (!fullText) throw new Error("No response received. Please try again.");

      // Parse subject and body
      const subjectMatch = fullText.match(/SUBJECT:\s*(.+)/i);
      const extractedSubject = subjectMatch ? subjectMatch[1].trim() : "";
      const parts = fullText.split("---");
      const extractedBody = parts.length > 1
        ? parts.slice(1).join("---").trim()
        : fullText.replace(/SUBJECT:.+/i, "").trim();

      // Animate body word by word
      const words = extractedBody.split(" ");
      let built = "";
      setSubject(extractedSubject);

      for (let i = 0; i < words.length; i++) {
        built += (i === 0 ? "" : " ") + words[i];
        setBody(built);
        await new Promise((r) => setTimeout(r, 18));
      }

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      setError("Error: " + message + "\n\nMake sure your Anthropic API key is correct.");
      setSubject("");
      setBody("");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRegenerate() {
    if (lastForm) generate(lastForm, lastTone);
  }

  function handleCopy() {
    const full = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(full).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  }

  return (
    <main className="bg-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Header />
        <Hero />

        <EmailForm onGenerate={generate} isLoading={isLoading} />

        {/* Error box */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-lg text-sm text-red-400 whitespace-pre-wrap">
            {error}
          </div>
        )}

        {/* Output */}
        {(subject || body) && (
          <div className="mb-12">
            <OutputCard
              subject={subject}
              body={body}
              tone={currentTone}
              onRegenerate={handleRegenerate}
              onCopy={handleCopy}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="py-10 text-center text-[11px] font-mono text-white/20">
          built with claude ai · mailforge v1.0
        </footer>
      </div>

      <Toast show={showToast} />
    </main>
  );
}