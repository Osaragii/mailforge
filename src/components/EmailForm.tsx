"use client";

import { useState } from "react";
import TonePill from "./TonePill";

const TONES = [
  { label: "Professional", tone: "Professional" },
  { label: "Friendly", tone: "Friendly & casual" },
  { label: "Direct", tone: "Direct & bold" },
  { label: "Humble", tone: "Curious & humble" },
  { label: "Story-driven", tone: "Storytelling" },
];

type FormData = {
  product: string;
  recipient: string;
  pain: string;
  benefit: string;
  cta: string;
};

type Props = {
  onGenerate: (formData: FormData, tone: string) => void;
  isLoading: boolean;
};

export default function EmailForm({ onGenerate, isLoading }: Props) {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [formData, setFormData] = useState<FormData>({
    product: "",
    recipient: "",
    pain: "",
    benefit: "",
    cta: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onGenerate(formData, selectedTone);
  };

  const inputClass = `
    w-full bg-surface2 border border-white/7 rounded-lg px-3.5 py-2.5
    font-sans text-sm text-white outline-none transition-all duration-200
    placeholder:text-white/25
    focus:border-accent/40 focus:bg-accent/[0.03]
  `;

  return (
    <div className="bg-surface border border-white/7 rounded-2xl overflow-hidden mb-6 animate-fade-up">

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              Your product / service
            </label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="e.g. CRM software for restaurants"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              Target recipient
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="e.g. Restaurant owners in Mumbai"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              Their biggest pain point
            </label>
            <input
              type="text"
              name="pain"
              value={formData.pain}
              onChange={handleChange}
              placeholder="e.g. Losing track of customer orders"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              Your unique benefit
            </label>
            <input
              type="text"
              name="benefit"
              value={formData.benefit}
              onChange={handleChange}
              placeholder="e.g. 2x more repeat customers in 30 days"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              Call to action
            </label>
            <input
              type="text"
              name="cta"
              value={formData.cta}
              onChange={handleChange}
              placeholder="e.g. Book a free 15-min demo"
              className={inputClass}
            />
          </div>

          {/* Tone pills */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              Email tone
            </label>
            <div className="flex gap-2 flex-wrap">
              {TONES.map((t) => (
                <TonePill
                  key={t.tone}
                  label={t.label}
                  tone={t.tone}
                  selected={selectedTone === t.tone}
                  onClick={setSelectedTone}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Generate button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-2 py-4 bg-accent text-bg rounded-lg font-sans font-semibold text-sm
            flex items-center justify-center gap-2 cursor-pointer transition-all duration-200
            hover:bg-accent/90 hover:-translate-y-px active:translate-y-0
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-bg/20 border-t-bg rounded-full animate-spin-slow" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate cold email →</span>
          )}
        </button>

      </div>
    </div>
  );
}