
export default function UserMarker() {
  return (
    <div className="relative flex h-7 w-7 items-center justify-center">
      {/* Outer pulsing ring */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8dcde4] opacity-50"></span>
      {/* Glow shadow ring */}
      <span className="absolute inline-flex h-5 w-5 rounded-full bg-[#8dcde4]/30 blur-[2px]"></span>
      {/* Center solid core */}
      <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-[#009bde] shadow-[0_2px_6px_rgba(0,0,0,0.3)]"></span>
    </div>
  );
}
