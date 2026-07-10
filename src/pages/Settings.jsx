import { useState } from "react";
import Navbar from "../components/Navbar";
import { useRelay } from "../context/RelayContext";

export default function Settings() {
  const { currentUserProfile, updateCurrentUserProfile, showToast, isDemoMode, setDemoUnlockModalOpen } = useRelay();
  const [form, setForm] = useState(currentUserProfile);

  function handleSave() {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    updateCurrentUserProfile(form);
    showToast("Profile Updated", "Your Relay profile settings were saved.");
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.32)_0%,rgba(0,0,0,0.55)_100%)]" />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">Settings</p>
        <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white">
          Manage your Relay preferences.
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">Display name</span>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">City</span>
                <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">Email</span>
                <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">Phone</span>
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">Trading preference</span>
              <select value={form.preference} onChange={(event) => setForm((current) => ({ ...current, preference: event.target.value }))} className="w-full rounded-[1rem] border border-white/[0.09] bg-[#08101a] px-4 py-3 text-[0.9rem] text-white outline-none">
                <option>Nearby only</option>
                <option>Open to citywide</option>
                <option>Open to campus</option>
              </select>
            </label>
            <button type="button" onClick={handleSave} className="mt-6 rounded-full border border-white/12 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-5 py-3 text-[0.84rem] font-semibold text-[#081a22]">Save Changes</button>
          </div>

          <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">Account controls</p>
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between rounded-[1rem] border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <span className="text-[0.9rem] text-white/72">Email notifications</span>
                <input type="checkbox" checked={form.notificationsEnabled} onChange={(event) => setForm((current) => ({ ...current, notificationsEnabled: event.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-transparent" />
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
