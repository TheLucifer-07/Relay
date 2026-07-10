import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { useRelay } from "../context/RelayContext";

const easing = [0.22, 1, 0.36, 1];

export default function ToastViewport() {
  const { dismissToast, toasts } = useRelay();

  return (
    <div className="fixed right-4 top-24 z-[100] flex w-[min(23rem,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 18, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 18, scale: 0.98 }}
            transition={{ duration: 0.24, ease: easing }}
            className="relative overflow-hidden rounded-[1.15rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(10,18,30,0.94),rgba(4,10,18,0.9))] px-4 py-4 text-white shadow-[0_20px_70px_rgba(0,0,0,0.44),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[28px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[8%] top-[1px] h-16 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_42%,transparent_100%)]"
            />
            <div className="relative flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c4e0a8]/24 bg-[#c4e0a8]/12 text-[#c4e0a8]">
                <CheckCircle className="h-4 w-4" strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.9rem] font-semibold tracking-[-0.02em] text-white/92">
                  {toast.title}
                </p>
                <p className="mt-1 text-[0.78rem] leading-5 text-white/52">
                  {toast.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/34 transition-colors hover:bg-white/[0.07] hover:text-white/76"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
