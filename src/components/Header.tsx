export default function Header() {
  return (
    <header className="py-12 pb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4l6 4 6-4" stroke="#0a0a0f" strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="1" y="3" width="14" height="10" rx="2" stroke="#0a0a0f" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Logo name */}
        <span className="font-serif text-xl text-white tracking-tight">
          MailForge
        </span>

        {/* Badge */}
        <span className="text-[10px] font-mono bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20 tracking-wide">
          AI-powered
        </span>
      </div>
    </header>
  );
}