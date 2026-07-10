import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  TicketPercent,
  Gift,
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ArrowLeftRight,
  Recycle,
  MessageCircle,
  HandshakeIcon,
} from "lucide-react";

const easing = [0.22, 1, 0.36, 1];

function revealVariants(shouldReduceMotion, delay = 0) {
  return {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.9, delay, ease: easing },
    },
  };
}

function SectionBadge({ children }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
      {children}
    </p>
  );
}

function useRevealRef() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return { ref, inView };
}

// ─── Section 1: How Relay Works ───────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "List a Resource",
    description: "Share books, coupons, gift cards or tools you no longer need.",
    color: "#8dcde4",
    glow: "rgba(141,205,228,0.14)",
  },
  {
    number: "02",
    title: "Relay Finds a Match",
    description: "Nearby requests are intelligently matched to your listing.",
    color: "#ffc75b",
    glow: "rgba(255,199,91,0.12)",
  },
  {
    number: "03",
    title: "Complete the Relay",
    description: "Safely exchange and give your resource a second life.",
    color: "#bb93ff",
    glow: "rgba(187,147,255,0.12)",
  },
];

function HowItWorks() {
  const { ref, inView } = useRevealRef();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      ref={ref}
      aria-labelledby="how-title"
      className="relative flex min-h-[100svh] items-center justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[min(72rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,184,210,0.1)_0%,transparent_68%)] blur-[100px]"
      />

      <div className="mx-auto w-full max-w-[1100px]">
        <motion.div
          variants={revealVariants(shouldReduceMotion, 0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          <SectionBadge>How Relay Works</SectionBadge>
          <h2 className="mt-6 font-serif text-[clamp(2.6rem,4.2vw,4rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Helping valuable things
            <br />
            find their next purpose.
          </h2>
          <p className="mx-auto mt-6 max-w-[34rem] text-[1.05rem] leading-[1.7] text-white/62">
            Relay connects useful resources with nearby people who genuinely need them.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3 lg:mt-20 lg:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={revealVariants(shouldReduceMotion, 0.1 + i * 0.1)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative overflow-hidden rounded-[1.7rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.78),rgba(5,10,18,0.72))] px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[24px]"
            >
              {/* top glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[45%] rounded-[inherit]"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${step.glow} 0%, transparent 72%)`,
                }}
              />
              {/* shimmer top edge */}
              <div
                aria-hidden="true"
                className="absolute inset-x-[8%] top-[1px] h-[38%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.03)_30%,transparent_100%)]"
              />

              <p
                className="relative font-serif text-[2.6rem] leading-none tracking-[-0.04em]"
                style={{ color: step.color, opacity: 0.38 }}
              >
                {step.number}
              </p>
              <h3 className="relative mt-5 text-[1.08rem] font-semibold tracking-[-0.02em] text-white/94">
                {step.title}
              </h3>
              <p className="relative mt-3 text-[0.9rem] leading-[1.65] text-white/58">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Trending Relays ───────────────────────────────────────────────

const trendingCards = [
  {
    icon: BookOpen,
    iconClass: "text-[#8dcde4]",
    blobColor: "bg-[#8dcde4]/20",
    glowColor: "rgba(141,205,228,0.16)",
    title: "Design Thinking",
    description: "Hardcover, like new condition",
    distance: "0.4 km away",
    availability: "Available now",
    availabilityColor: "text-[#8dcde4]",
  },
  {
    icon: TicketPercent,
    iconClass: "text-[#ffc75b]",
    blobColor: "bg-[#ffc75b]/18",
    glowColor: "rgba(255,199,91,0.14)",
    title: "40% Off Coupon",
    description: "Bookstore — expires end of month",
    distance: "1.1 km away",
    availability: "Expires soon",
    availabilityColor: "text-[#ffc75b]",
  },
  {
    icon: Gift,
    iconClass: "text-[#bb93ff]",
    blobColor: "bg-[#bb93ff]/18",
    glowColor: "rgba(187,147,255,0.14)",
    title: "$25 Gift Card",
    description: "Stationery store, unused balance",
    distance: "0.8 km away",
    availability: "Available now",
    availabilityColor: "text-[#8dcde4]",
  },
  {
    icon: Wrench,
    iconClass: "text-[#88c4ff]",
    blobColor: "bg-[#88c4ff]/18",
    glowColor: "rgba(136,196,255,0.14)",
    title: "Power Drill Set",
    description: "Bosch, full kit, barely used",
    distance: "2.3 km away",
    availability: "Available now",
    availabilityColor: "text-[#8dcde4]",
  },
  {
    icon: BookOpen,
    iconClass: "text-[#8dcde4]",
    blobColor: "bg-[#8dcde4]/20",
    glowColor: "rgba(141,205,228,0.16)",
    title: "Atomic Habits",
    description: "Paperback, great condition",
    distance: "0.6 km away",
    availability: "Available now",
    availabilityColor: "text-[#8dcde4]",
  },
  {
    icon: Sparkles,
    iconClass: "text-[#c4e0a8]",
    blobColor: "bg-[#c4e0a8]/16",
    glowColor: "rgba(196,224,168,0.12)",
    title: "More Coming",
    description: "New categories arriving soon",
    distance: "Everywhere",
    availability: "Stay tuned",
    availabilityColor: "text-white/44",
  },
];

function TrendingRelays() {
  const { ref, inView } = useRevealRef();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      aria-labelledby="trending-title"
      className="relative flex min-h-[100svh] items-center justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[40rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(187,147,255,0.07)_0%,transparent_70%)] blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 bottom-1/3 -z-10 h-[36rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(141,205,228,0.07)_0%,transparent_70%)] blur-[110px]"
      />

      <div className="mx-auto w-full max-w-[1100px]">
        <motion.div
          variants={revealVariants(shouldReduceMotion, 0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          <SectionBadge>Trending Relays</SectionBadge>
          <h2 className="mt-6 font-serif text-[clamp(2.6rem,4.2vw,4rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Popular resources
            <br />
            moving through Relay.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {trendingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                variants={revealVariants(shouldReduceMotion, 0.06 + i * 0.07)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="group relative overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.76),rgba(5,10,18,0.7))] px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[22px] transition-transform duration-300 hover:-translate-y-1"
              >
                {/* glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[50%] rounded-[inherit]"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${card.glowColor} 0%, transparent 72%)`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-[8%] top-[1px] h-[36%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_30%,transparent_100%)]"
                />
                {/* blob */}
                <div
                  aria-hidden="true"
                  className={`absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl ${card.blobColor}`}
                />

                <div className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Icon className={`h-[1.05rem] w-[1.05rem] ${card.iconClass}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.98rem] font-semibold tracking-[-0.02em] text-white/94">
                      {card.title}
                    </p>
                    <p className="mt-1 text-[0.82rem] leading-5 text-white/54">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="relative mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[0.78rem] text-white/46">
                    <MapPin className="h-3 w-3" strokeWidth={1.8} />
                    {card.distance}
                  </div>
                  <span className={`text-[0.76rem] font-medium ${card.availabilityColor}`}>
                    {card.availability}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Why Relay ─────────────────────────────────────────────────────

const features = [
  {
    icon: ShieldCheck,
    iconClass: "text-[#8dcde4]",
    glow: "rgba(141,205,228,0.13)",
    title: "Verified community",
    description: "Every member is verified. Trust is built into every exchange.",
  },
  {
    icon: MapPin,
    iconClass: "text-[#ffc75b]",
    glow: "rgba(255,199,91,0.11)",
    title: "Nearby connections",
    description: "Resources stay local. Exchanges happen close to home.",
  },
  {
    icon: ArrowLeftRight,
    iconClass: "text-[#bb93ff]",
    glow: "rgba(187,147,255,0.11)",
    title: "Simple exchanges",
    description: "No complexity. List, match, and hand off in minutes.",
  },
  {
    icon: Recycle,
    iconClass: "text-[#c4e0a8]",
    glow: "rgba(196,224,168,0.1)",
    title: "Purpose over waste",
    description: "Every resource deserves a second life with someone who needs it.",
  },
  {
    icon: MessageCircle,
    iconClass: "text-[#88c4ff]",
    glow: "rgba(136,196,255,0.11)",
    title: "Transparent communication",
    description: "Clear, direct messaging between people — no hidden steps.",
  },
  {
    icon: HandshakeIcon,
    iconClass: "text-[#f0a8c4]",
    glow: "rgba(240,168,196,0.1)",
    title: "Safe handoffs",
    description: "Guided exchange flow ensures every relay completes safely.",
  },
];

function WhyRelay() {
  const { ref, inView } = useRevealRef();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      aria-labelledby="why-title"
      className="relative flex min-h-[100svh] items-center justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[44rem] w-[min(80rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,184,210,0.08)_0%,transparent_64%)] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1100px]">
        <motion.div
          variants={revealVariants(shouldReduceMotion, 0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          <SectionBadge>Why Relay</SectionBadge>
          <h2 className="mt-6 font-serif text-[clamp(2.6rem,4.2vw,4rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Built around trust.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={revealVariants(shouldReduceMotion, 0.08 + i * 0.07)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="relative overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.76),rgba(5,10,18,0.7))] px-6 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[22px]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[48%] rounded-[inherit]"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${feat.glow} 0%, transparent 72%)`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-[8%] top-[1px] h-[34%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.02)_30%,transparent_100%)]"
                />

                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <Icon className={`h-[1.05rem] w-[1.05rem] ${feat.iconClass}`} />
                </div>
                <h3 className="relative mt-5 text-[1rem] font-semibold tracking-[-0.02em] text-white/94">
                  {feat.title}
                </h3>
                <p className="relative mt-2.5 text-[0.88rem] leading-[1.65] text-white/56">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Community ─────────────────────────────────────────────────────

function Community() {
  const { ref, inView } = useRevealRef();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      aria-labelledby="community-title"
      className="relative flex min-h-[100svh] items-center justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[50rem] w-[min(80rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(187,147,255,0.07)_0%,rgba(132,184,210,0.06)_40%,transparent_70%)] blur-[130px]"
      />

      <div className="mx-auto w-full max-w-[860px] text-center">
        <motion.div
          variants={revealVariants(shouldReduceMotion, 0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionBadge>Community</SectionBadge>
        </motion.div>

        <motion.h2
          id="community-title"
          variants={revealVariants(shouldReduceMotion, 0.1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-6 font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[0.96] tracking-[-0.055em] text-white"
        >
          Communities grow
          <br />
          when resources
          <br />
          keep moving.
        </motion.h2>

        <motion.div
          variants={revealVariants(shouldReduceMotion, 0.22)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-8 flex items-center justify-center gap-5"
        >
          <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#95b8c8]/36 sm:w-36" />
          <span className="text-[1.5rem]">🤝</span>
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#95b8c8]/36 sm:w-36" />
        </motion.div>

        <motion.p
          variants={revealVariants(shouldReduceMotion, 0.3)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-10 max-w-[38rem] text-[1.1rem] leading-[1.75] text-white/60"
        >
          Every relay strengthens the people around you. A book passed on becomes
          knowledge shared. A tool lent becomes a project completed. A coupon
          relayed becomes a small act of generosity.
        </motion.p>

        <motion.p
          variants={revealVariants(shouldReduceMotion, 0.38)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-6 max-w-[32rem] text-[1rem] leading-[1.7] text-white/42"
        >
          This is how communities grow — not through transactions, but through
          the quiet act of giving valuable things a second life.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Section 5: Final CTA ─────────────────────────────────────────────────────

function FinalCTA() {
  const { ref, inView } = useRevealRef();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      aria-labelledby="cta-title"
      className="relative flex min-h-[100svh] items-center justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-[15%] -z-10 h-[32rem] w-[min(64rem,88vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,184,210,0.14)_0%,rgba(132,184,210,0.06)_36%,transparent_72%)] blur-[100px]"
      />

      <div className="mx-auto w-full max-w-[820px] text-center">
        <motion.h2
          id="cta-title"
          variants={revealVariants(shouldReduceMotion, 0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="font-serif text-[clamp(2.8rem,5.2vw,5.2rem)] leading-[0.94] tracking-[-0.058em] text-white"
        >
          Someone nearby
          <br />
          is looking for
          <br />
          <span className="bg-gradient-to-r from-[#eff8fc] via-[#b2ccd9] to-[#7893a4] bg-clip-text text-transparent">
            what you no longer use.
          </span>
        </motion.h2>

        <motion.p
          variants={revealVariants(shouldReduceMotion, 0.14)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-8 max-w-[30rem] text-[1.05rem] leading-[1.7] text-white/60"
        >
          Give valuable resources another purpose.
        </motion.p>

        <motion.div
          variants={revealVariants(shouldReduceMotion, 0.24)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5"
        >
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex min-w-[16rem] items-center justify-center gap-3 rounded-full border border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-8 py-4 text-[1rem] font-semibold tracking-[-0.02em] text-[#081a22] shadow-[0_22px_56px_rgba(112,152,174,0.28),inset_0_1px_0_rgba(255,255,255,0.48)] transition-transform duration-200 hover:-translate-y-0.5 sm:min-w-[16.7rem]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/6 bg-black/10">
              <Sparkles className="h-[1rem] w-[1rem]" />
            </span>
            <span>Start Relaying</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/requests")}
            className="inline-flex min-w-[16rem] items-center justify-center gap-3 rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(8,20,31,0.76),rgba(4,12,20,0.56))] px-8 py-4 text-[1rem] font-medium tracking-[-0.02em] text-[#dfedf3] shadow-[0_20px_46px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9ec1d0]/22 sm:min-w-[16.7rem]"
          >
            <ArrowRight className="h-[1.05rem] w-[1.05rem] text-[#a2c8d8]" />
            <span>Explore Requests</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function HomeSections() {
  return (
    <>
      <HowItWorks />
      <TrendingRelays />
      <WhyRelay />
      <Community />
      <FinalCTA />
    </>
  );
}
