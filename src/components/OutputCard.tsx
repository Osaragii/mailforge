type Props = {
  subject: string;
  body: string;
  tone: string;
  onRegenerate: () => void;
  onCopy: () => void;
};

export default function OutputCard({ subject, body, tone, onRegenerate, onCopy }: Props) {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const readSec = Math.ceil(wordCount / 3.5);

  if (!subject && !body) return null;

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="text-[11px] font-mono text-white/25 uppercase tracking-wider">
          Generated email
        </span>
        <div className="flex gap-2">
          <button
            onClick={onRegenerate}
            className="px-3.5 py-1.5 rounded-lg border border-white/7 text-xs text-white/50
              hover:border-white/20 hover:text-white transition-all duration-150 cursor-pointer"
          >
            Regenerate
          </button>
          <button
            onClick={onCopy}
            className="px-3.5 py-1.5 rounded-lg border border-accent/30 bg-accent/10
              text-xs text-accent hover:bg-accent/20 transition-all duration-150 cursor-pointer"
          >
            Copy email
          </button>
        </div>
      </div>

      {/* Email card */}
      <div className="bg-surface border border-white/7 rounded-2xl overflow-hidden">
        {/* Subject line */}
        <div className="px-5 py-3.5 border-b border-white/7 flex items-center gap-3">
          <span className="text-[11px] font-mono text-white/25 uppercase tracking-wider whitespace-nowrap">
            Subject
          </span>
          <span className="text-sm text-white font-medium">{subject}</span>
        </div>

        {/* Body */}
        <div className="px-5 py-6 text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans min-h-30">
          {body}
          {!body && (
            <span className="inline-block w-0.5 h-4 bg-accent align-middle animate-blink" />
          )}
        </div>

        {/* Stats */}
        <div className="px-5 py-3 border-t border-white/7 flex gap-4 flex-wrap">
          <span className="text-[11px] font-mono text-white/25">
            Words: <span className="text-accent">{wordCount || "—"}</span>
          </span>
          <span className="text-[11px] font-mono text-white/25">
            Reading time: <span className="text-accent">{wordCount ? `${readSec}s` : "—"}</span>
          </span>
          <span className="text-[11px] font-mono text-white/25">
            Tone: <span className="text-accent">{tone || "—"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}