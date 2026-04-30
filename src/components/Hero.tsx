export default function Hero() {
  return (
    <div className="pb-12">
      {/* Tag line */}
      <div className="inline-flex items-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
        <span className="text-[11px] font-mono text-accent uppercase tracking-widest">
          Cold email generator
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight text-white mb-4">
        Write emails that<br />
        <span className="italic text-accent">actually get replies</span>
      </h1>

      {/* Subtext */}
      <p className="text-base text-white/50 font-light max-w-md">
        Fill in the details below. Our AI crafts a personalised cold email in seconds — ready to send.
      </p>
    </div>
  );
}