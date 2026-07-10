import { Zap } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: ["How Relay Works", "Explore", "Community"],
  },
  {
    title: "Resources",
    links: ["Books", "Coupons", "Gift Cards", "Tools", "More"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Contact"],
  },
];

const socialLinks = ["GitHub", "LinkedIn", "Instagram"];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden px-3 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-6 -z-10 h-[34rem] w-[min(72rem,92vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,184,210,0.18)_0%,rgba(132,184,210,0.07)_36%,transparent_76%)] blur-[96px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-10rem] left-1/2 -z-10 h-[30rem] w-[min(64rem,88vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(151,189,208,0.12)_0%,rgba(0,0,0,0.08)_42%,transparent_78%)] blur-[110px]"
      />

      <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[2rem] bg-black/[0.08] px-5 py-12 shadow-[0_42px_140px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(255,255,255,0.04)] backdrop-blur-[24px] sm:rounded-[2.25rem] sm:px-8 lg:rounded-[2.5rem] lg:px-12 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.09)_0%,transparent_70%)]"
        />

        <div className="relative z-10">
          {/* Logo + links */}
          <section className="grid gap-12 lg:grid-cols-[1.05fr_1.4fr] lg:items-start">
            <div>
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-black/[0.1] text-[#a9cbda] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_46px_rgba(0,0,0,0.22)] backdrop-blur-md">
                  <Zap className="h-8 w-8" fill="currentColor" />
                </span>
                <span className="font-serif text-5xl leading-none text-white sm:text-6xl">
                  Relay
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                Nothing Valuable Should End Unused.
              </p>
              <p className="mt-5 max-w-[31rem] text-lg leading-8 text-white/66">
                The premium platform for sharing, exchanging, and redistributing
                valuable unused resources through trusted local communities.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerLinks.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                    {group.title}
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-base leading-6 text-white/66 transition-colors duration-150 hover:text-white/88"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </section>

          {/* Bottom bar */}
          <div className="mt-14 grid gap-6 text-sm text-white/56 sm:grid-cols-[1fr_auto] sm:items-center lg:mt-16">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
              <p>&copy; 2026 Relay</p>
              <p>Built with purpose.</p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {socialLinks.map((link) => (
                <a key={link} href="#" className="text-white/62 transition-colors hover:text-white/88">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
