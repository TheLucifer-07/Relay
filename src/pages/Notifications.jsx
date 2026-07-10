import Navbar from "../components/Navbar";
import { useRelay } from "../context/RelayContext";

export default function Notifications() {
  const { notifications, markAllNotificationsRead } = useRelay();

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.32)_0%,rgba(0,0,0,0.55)_100%)]" />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">Notifications</p>
            <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white">
              Exchange updates.
            </h1>
          </div>
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[0.8rem] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white/90"
          >
            Mark all as read
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {notifications.map((notification) => (
            <div key={`${notification.title}-${notification.time}`} className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.04] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.95rem] font-semibold text-white/90">{notification.title}</p>
                  <p className="mt-1 text-[0.82rem] leading-6 text-white/54">{notification.detail}</p>
                </div>
                <div className="flex items-center gap-2">
                  {notification.unread ? <span className="h-2.5 w-2.5 rounded-full bg-[#8dcde4]" /> : null}
                  <span className="text-[0.72rem] text-white/38">{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
