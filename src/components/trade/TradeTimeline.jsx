import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

const easing = [0.22, 1, 0.36, 1];

const steps = [
  "Trade Requested",
  "Negotiation Started",
  "Offer Accepted",
  "Meeting Scheduled",
  "Resources Exchanged",
  "Trade Completed",
];

const stepCompletes = {
  0: ["pending", "negotiation_started", "negotiation_active", "accepted", "offer_accepted", "meeting_scheduled", "resources_exchanged", "completed"],
  1: ["negotiation_started", "negotiation_active", "accepted", "offer_accepted", "meeting_scheduled", "resources_exchanged", "completed"],
  2: ["accepted", "offer_accepted", "meeting_scheduled", "resources_exchanged", "completed"],
  3: ["meeting_scheduled", "resources_exchanged", "completed"],
  4: ["resources_exchanged", "completed"],
  5: ["completed"],
};

export default function TradeTimeline({ outcome, status = "pending", compact = false }) {
  const shouldReduceMotion = useReducedMotion();
  const currentStatus = status || outcome || "pending";

  return (
    <div className={compact ? "space-y-0" : "rounded-[1rem] border border-white/[0.07] bg-white/[0.03] px-4 py-3"}>
      {!compact ? (
        <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
          Exchange Timeline
        </p>
      ) : null}
      <div className="relative space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isComplete = stepCompletes[index]?.includes(currentStatus) || false;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.4,
                delay: shouldReduceMotion ? 0 : index * 0.06,
                ease: easing,
              }}
              className="relative flex gap-3 pb-3 last:pb-0"
            >
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={`absolute left-[0.55rem] top-5 h-[calc(100%-0.5rem)] w-px ${
                    isComplete
                      ? "bg-gradient-to-b from-[#8dcde4]/40 to-[#8dcde4]/10"
                      : "bg-gradient-to-b from-white/16 to-white/04"
                  }`}
                />
              ) : null}
              <span
                className={`relative z-[1] mt-0.5 flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full border ${
                  isComplete
                    ? "border-[#8dcde4]/30 bg-[#8dcde4]/10 text-[#8dcde4]"
                    : "border-white/08 bg-white/[0.03] text-white/30"
                }`}
              >
                {isComplete ? (
                  <Check className="h-2.5 w-2.5" strokeWidth={2.8} />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                )}
              </span>
              <div className="min-w-0 pt-px">
                <p
                  className={`text-[0.78rem] font-medium leading-5 ${
                    isComplete ? "text-white/82" : "text-white/34"
                  }`}
                >
                  {step}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
