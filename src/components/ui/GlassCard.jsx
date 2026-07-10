export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.78),rgba(5,10,18,0.72))] shadow-[0_24px_70px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[22px] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[1px] h-[36%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.02)_30%,transparent_100%)]"
      />
      {children}
    </div>
  );
}
