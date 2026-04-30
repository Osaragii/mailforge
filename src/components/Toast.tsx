type Props = {
  show: boolean;
};

export default function Toast({ show }: Props) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-accent text-bg text-sm font-semibold
        px-5 py-2.5 rounded-full pointer-events-none z-50 transition-all duration-300
        ${show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
    >
      Copied to clipboard!
    </div>
  );
}