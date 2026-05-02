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
    if (!formData.product || !formData.recipient) return setError("Please fill in at least your product and target recipient.");

    setError("");
    setIsLoading(true);
    setSubject("");
    setBody("");
    setLastForm(formData);
    setLastTone(tone);
    setCurrentTone(tone);

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: formData.product,
          recipient: formData.recipient,
          pain: formData.pain,
          benefit: formData.benefit,
          cta: formData.cta,
          tone,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        subject?: string;
        body?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      const extractedSubject = data.subject ?? "";
      const extractedBody = data.body ?? "";

      if (!extractedSubject && !extractedBody) {
        throw new Error("No response received. Please try again.");
      }

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
      setError("Error: " + message);
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