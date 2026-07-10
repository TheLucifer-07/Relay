import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HomeSections from "../components/HomeSections";
import Footer from "../components/Footer";
import { useRelay } from "../context/RelayContext";
import {
  BookOpen,
  CirclePlay,
  Leaf,
  Sparkles,
  TicketPercent,
  Users,
  Gift,
  Wrench,
} from "lucide-react";

const cards = [
  {
    id: "books",
    title: "Books",
    description: "Find a new reader",
    icon: BookOpen,
    iconClass: "text-[#8dcde4]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,rgba(141,205,228,0.22)_0%,rgba(141,205,228,0.05)_42%,transparent_78%)]",
    blobClass: "bg-[#8dcde4]/24",
    desktopPosition: "left-[6.5%] top-[42.8%] w-[11.4rem] -rotate-[6deg]",
    mobilePosition: "left-[2%] top-[6%] w-[8rem] -rotate-[6deg]",
    floatDistance: 8,
    duration: 18,
    delay: 0.12,
  },
  {
    id: "coupons",
    title: "Coupons",
    description: "Turn unused into useful",
    icon: TicketPercent,
    iconClass: "text-[#ffc75b]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,rgba(255,199,91,0.18)_0%,rgba(255,199,91,0.04)_40%,transparent_78%)]",
    blobClass: "bg-[#ffc75b]/22",
    desktopPosition: "left-[10.5%] bottom-[21.6%] w-[12.2rem] rotate-[7deg]",
    mobilePosition: "left-[7%] bottom-[16%] w-[8.9rem] rotate-[6deg]",
    floatDistance: 7,
    duration: 20,
    delay: 0.22,
  },
  {
    id: "giftcards",
    title: "Gift Cards",
    description: "Unlock unused value",
    icon: Gift,
    iconClass: "text-[#ff9f71]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,rgba(255,159,113,0.18)_0%,rgba(255,159,113,0.04)_40%,transparent_78%)]",
    blobClass: "bg-[#ff9f71]/22",
    desktopPosition: "left-1/2 bottom-[10.4%] w-[14.1rem] -translate-x-1/2",
    mobilePosition: "bottom-[-3%] left-1/2 w-[10rem] -translate-x-1/2",
    floatDistance: 6,
    duration: 16,
    delay: 0.32,
  },
  {
    id: "tools",
    title: "Tools",
    description: "Help someone build more",
    icon: Wrench,
    iconClass: "text-[#88c4ff]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,rgba(136,196,255,0.18)_0%,rgba(136,196,255,0.04)_40%,transparent_78%)]",
    blobClass: "bg-[#88c4ff]/22",
    desktopPosition: "right-[6.5%] top-[42.5%] w-[11.6rem] rotate-[6deg]",
    mobilePosition: "right-[2%] top-[6%] w-[8rem] rotate-[6deg]",
    floatDistance: 8,
    duration: 18,
    delay: 0.16,
  },
  {
    id: "more",
    title: "More",
    description: "Everything has a purpose",
    icon: Users,
    iconClass: "text-[#bb93ff]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,rgba(187,147,255,0.18)_0%,rgba(187,147,255,0.04)_40%,transparent_78%)]",
    blobClass: "bg-[#bb93ff]/22",
    desktopPosition: "right-[9.5%] bottom-[21.2%] w-[12.4rem] -rotate-[6deg]",
    mobilePosition: "right-[6%] bottom-[16%] w-[8.9rem] -rotate-[6deg]",
    floatDistance: 7,
    duration: 19,
    delay: 0.26,
  },
];

const easing = [0.22, 1, 0.36, 1];

function revealTransition(shouldReduceMotion, delay = 0) {
  return {
    duration: shouldReduceMotion ? 0.01 : 0.95,
    delay,
    ease: easing,
  };
}

function loopTransition(shouldReduceMotion, duration, delay = 0) {
  if (shouldReduceMotion) {
    return { duration: 0.01 };
  }

  return {
    duration,
    delay,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  };
}

function FloatingCard({
  card,
  className = "",
  compact = false,
  shouldReduceMotion,
}) {
  const Icon = card.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: 0.985 }}
      animate={{
        opacity: 1,
        x: shouldReduceMotion ? 0 : [0, 0.7, -0.5, 0],
        y: shouldReduceMotion ? 0 : [0, -card.floatDistance, 0],
        scale: shouldReduceMotion ? 1 : [1, 1.012, 0.998, 1],
      }}
      whileHover={
        shouldReduceMotion || compact
          ? undefined
          : { y: -6, scale: 1.018 }
      }
      transition={{
        opacity: revealTransition(shouldReduceMotion, card.delay),
        x: loopTransition(
          shouldReduceMotion,
          compact ? 11 : 14,
          card.delay + 0.08
        ),
        y: loopTransition(
          shouldReduceMotion,
          compact ? card.duration - 2 : card.duration,
          card.delay + 0.18
        ),
        scale: loopTransition(
          shouldReduceMotion,
          compact ? card.duration - 4 : card.duration - 3,
          card.delay + 0.12
        ),
      }}
      className={`absolute overflow-hidden border border-white/12 bg-[linear-gradient(180deg,rgba(16,24,38,0.82),rgba(5,10,18,0.78))] shadow-[0_28px_90px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(132,184,210,0.04)] backdrop-blur-[24px] ${
        compact ? "rounded-[1.35rem] px-3 py-3" : "rounded-[1.7rem] px-4 py-4"
      } ${className}`}
    >
      <motion.div
        aria-hidden="true"
        className={`absolute inset-0 ${card.glowClass}`}
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.7, 0.92, 0.74], scale: [1, 1.03, 1] }
        }
        transition={loopTransition(shouldReduceMotion, card.duration + 3, card.delay)}
      />
      <div
        aria-hidden="true"
        className={`absolute -right-8 -top-8 rounded-full blur-3xl ${
          compact ? "h-16 w-16" : "h-20 w-20"
        } ${card.blobClass}`}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -left-1/2 top-0 h-full w-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_50%,transparent_100%)] opacity-30 blur-2xl"
        animate={shouldReduceMotion ? undefined : { x: ["0%", "260%"] }}
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : {
                duration: compact ? 12 : 14,
                delay: card.delay + 0.2,
                repeat: Infinity,
                ease: "linear",
              }
        }
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-[6%] top-[1px] h-[42%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_32%,transparent_100%)]"
      />

      <div className="relative flex items-start gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] shadow-[0_10px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] ${
            compact ? "h-8 w-8" : "h-10 w-10"
          }`}
        >
          <Icon
            className={`${compact ? "h-[0.95rem] w-[0.95rem]" : "h-[1.12rem] w-[1.12rem]"} ${card.iconClass}`}
          />
        </div>

        <div className="min-w-0">
          <p
            className={`font-medium tracking-[-0.02em] text-white/94 ${
              compact ? "text-[0.84rem]" : "text-[1rem]"
            }`}
          >
            {card.title}
          </p>
          <p
            className={`mt-1 text-white/64 ${
              compact
                ? "text-[0.72rem] leading-[1.05rem]"
                : "text-[0.82rem] leading-5"
            }`}
          >
            {card.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { isAuthenticated, enterDemoMode } = useRelay();

  function handleWatchDemo() {
    enterDemoMode();
    navigate("/dashboard");
  }

  return (
    <>
    <main className="relative isolate h-[100svh] min-h-[100svh] overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/background.JPG')] bg-cover bg-center bg-fixed bg-no-repeat"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.26)_0%,rgba(2,7,12,0.18)_18%,rgba(0,0,0,0.28)_54%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(164,207,228,0.08)_0%,transparent_24%),radial-gradient(circle_at_50%_78%,rgba(81,128,156,0.12)_0%,transparent_22%),radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.14)_68%,rgba(0,0,0,0.5)_100%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 bottom-[10%] h-[18rem] w-[40rem] max-w-[92vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,184,210,0.18)_0%,rgba(132,184,210,0.08)_28%,transparent_72%)] blur-[100px]"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.4, 0.58, 0.44, 0.4],
                scale: [1, 1.04, 0.99, 1],
              }
        }
        transition={loopTransition(shouldReduceMotion, 16, 0.2)}
      />

      <section
        aria-labelledby="landing-title"
        className="relative mx-auto h-full w-full max-w-[1600px] overflow-hidden px-4 sm:px-6 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
        >
          {cards.map((card) => (
            <FloatingCard
              key={card.title}
              card={card}
              className={card.desktopPosition}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>

        <div className="relative z-20 mx-auto flex h-full w-full max-w-[940px] flex-col items-center pt-[10.5svh] text-center sm:pt-[11svh]">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition(shouldReduceMotion, 0.04)}
            className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(8,19,31,0.76),rgba(5,13,22,0.54))] px-5 py-2.5 text-[0.82rem] font-medium tracking-[0.01em] text-[#deedf4] shadow-[0_20px_60px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl sm:px-7 sm:py-3 sm:text-[0.95rem]"
          >
            <motion.span
              aria-hidden="true"
              className="text-base"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: [0.78, 1, 0.78], scale: [1, 1.06, 1] }
              }
              transition={loopTransition(shouldReduceMotion, 4)}
            >
              🚀
            </motion.span>
            <span>Now in Early Access</span>
            <span aria-hidden="true" className="text-[#84bfd2]/70">
              •
            </span>
            <span>Every Resource Matters</span>
          </motion.div>

          <motion.h1
            id="landing-title"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition(shouldReduceMotion, 0.12)}
            className="mt-8 max-w-[13.8ch] font-serif text-[clamp(3.5rem,5.4vw,5.25rem)] leading-[0.92] tracking-[-0.068em] text-white drop-shadow-[0_18px_40px_rgba(0,0,0,0.38)]"
          >
            <span className="block whitespace-nowrap">
              <motion.span
                className="inline-block bg-gradient-to-b from-white via-white to-white/82 bg-clip-text text-transparent bg-[length:100%_100%]"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                      }
                }
                transition={loopTransition(shouldReduceMotion, 18, 0.2)}
              >
                Nothing
              </motion.span>{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-[#eff8fc] via-[#b2ccd9] to-[#7893a4] bg-clip-text text-transparent bg-[length:200%_100%]"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                      }
                }
                transition={loopTransition(shouldReduceMotion, 20, 0.4)}
              >
                Wasted,
              </motion.span>
            </span>
            <span className="block whitespace-nowrap">
              <motion.span
                className="inline-block bg-gradient-to-b from-white via-white to-white/82 bg-clip-text text-transparent bg-[length:100%_100%]"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                      }
                }
                transition={loopTransition(shouldReduceMotion, 18, 0.3)}
              >
                Everything
              </motion.span>{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-[#edf7fb] via-[#97bdd0] to-[#6f8998] bg-clip-text text-transparent bg-[length:200%_100%]"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                      }
                }
                transition={loopTransition(shouldReduceMotion, 20, 0.5)}
              >
                Shared.
              </motion.span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.92 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={revealTransition(shouldReduceMotion, 0.22)}
            className="mt-7 flex items-center justify-center gap-4 sm:gap-6"
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#95b8c8]/40 sm:w-32" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(16,35,49,0.74),rgba(7,18,28,0.58))] text-[#a9cbda] shadow-[0_0_22px_rgba(137,201,223,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#95b8c8]/40 sm:w-32" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition(shouldReduceMotion, 0.3)}
            className="mt-6 max-w-[32rem] text-[clamp(1.125rem,1.5vw,1.25rem)] leading-[1.6] text-white/74"
          >
            <span className="block">The premium platform for sharing and exchanging</span>
            <span className="mt-1.5 block">
              valuable unused resources through trusted communities.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition(shouldReduceMotion, 0.4)}
            className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5"
          >
            <motion.button
              type="button"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              whileHover={
                shouldReduceMotion ? undefined : { y: -2, scale: 1.012 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.988 }}
              className="inline-flex min-w-[16rem] items-center justify-center gap-3 rounded-full border border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-8 py-4 text-[1rem] font-semibold tracking-[-0.02em] text-[#081a22] shadow-[0_22px_56px_rgba(112,152,174,0.28),inset_0_1px_0_rgba(255,255,255,0.48)] sm:min-w-[16.7rem]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/6 bg-black/10">
                <Sparkles className="h-[1rem] w-[1rem]" />
              </span>
              <span>Get Started</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleWatchDemo}
              whileHover={
                shouldReduceMotion ? undefined : { y: -2, scale: 1.012 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.988 }}
              className="inline-flex min-w-[16rem] items-center justify-center gap-3 rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(8,20,31,0.76),rgba(4,12,20,0.56))] px-8 py-4 text-[1rem] font-medium tracking-[-0.02em] text-[#dfedf3] shadow-[0_20px_46px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-colors duration-300 hover:border-[#9ec1d0]/22 hover:bg-[linear-gradient(180deg,rgba(9,24,36,0.82),rgba(5,15,24,0.62))] sm:min-w-[16.7rem]"
            >
              <CirclePlay className="h-[1.05rem] w-[1.05rem] text-[#a2c8d8]" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          <div className="relative mt-12 h-[13rem] w-full max-w-[22rem] lg:hidden sm:mt-14 sm:h-[15rem] sm:max-w-[29rem]">
            <div aria-hidden="true" className="absolute inset-0">
              {cards.map((card) => (
                <FloatingCard
                  key={card.title}
                  card={card}
                  className={card.mobilePosition}
                  compact
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
    <HomeSections />
    <Footer />
    </>
  );
}
