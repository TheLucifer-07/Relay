import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRelay } from "../context/RelayContext";

export default function DemoUnlockModal() {
  const navigate = useNavigate();
  const { demoUnlockModalOpen, setDemoUnlockModalOpen } = useRelay();

  if (!demoUnlockModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(1,2,4,0.76)] px-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-[1.8rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(14,22,36,0.96),rgba(5,10,18,0.94))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl text-white"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setDemoUnlockModalOpen(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white/80"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>

          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,199,91,0.22)] bg-[rgba(255,199,91,0.12)]">
              <Lock className="h-6 w-6 text-[#ffc75b]" strokeWidth={1.8} />
            </div>

            <h3 className="mt-5 font-serif text-[1.45rem] font-medium tracking-tight text-white">
              Create a free account to continue
            </h3>

            <p className="mt-3 text-[0.88rem] leading-[1.6] text-white/60 px-2">
              You're currently exploring Relay in <strong className="text-[#8dcde4]">Demo Mode</strong>. Sign up to publish listings, negotiate exchanges, participate in auctions, and access the complete Relay experience.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  setDemoUnlockModalOpen(false);
                  navigate("/auth?tab=login");
                }}
                className="w-full sm:w-28 rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(8,20,31,0.76),rgba(4,12,20,0.56))] px-4 py-2.5 text-[0.88rem] font-medium text-[#dfedf3] transition-all hover:bg-white/[0.08]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoUnlockModalOpen(false);
                  navigate("/auth?tab=signup");
                }}
                className="w-full sm:w-36 rounded-full bg-gradient-to-r from-[#ff9f71] via-[#ffc75b] to-[#8dcde4] px-5 py-2.5 text-[0.88rem] font-semibold text-[#010204] shadow-[0_8px_20px_rgba(255,159,113,0.18)] transition-all hover:opacity-90"
              >
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
