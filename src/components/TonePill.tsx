type TonePillProps = {
  label: string;
  tone: string;
  selected: boolean;
  onClick: (tone: string) => void;
};

export default function TonePill({ label, tone, selected, onClick }: TonePillProps) {
  return (
    <button
      onClick={() => onClick(tone)}
      className={`px-3.5 py-1.5 rounded-full border text-xs cursor-pointer transition-all duration-150 font-sans
        ${selected
          ? "bg-accent/10 border-accent/35 text-accent"
          : "bg-transparent border-white/7 text-white/50 hover:border-white/20 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}