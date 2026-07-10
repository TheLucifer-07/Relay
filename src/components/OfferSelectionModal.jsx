import { X, Plus, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { useRelay } from "../context/RelayContext";
import { useNavigate } from "react-router-dom";

export default function OfferSelectionModal() {
  const navigate = useNavigate();
  const {
    offerSelectionModalOpen,
    setOfferSelectionModalOpen,
    pendingOfferPayload,
    myListings,
    marketplaceListings,
    backendUserId,
    currentUserProfile,
    completeNegotiationWithOffer,
  } = useRelay();

  if (!offerSelectionModalOpen) return null;

  // Resolve user listings
  const userListings = myListings.length
    ? myListings
    : marketplaceListings.filter(
        (l) => String(l.userId || l.ownerId || "") === String(backendUserId) || l.owner === currentUserProfile.name
      );

  function handleSelect(listing) {
    setOfferSelectionModalOpen(false);
    if (pendingOfferPayload) {
      completeNegotiationWithOffer(pendingOfferPayload, listing);
    }
  }

  function handleNewRelay() {
    setOfferSelectionModalOpen(false);
    navigate("/dashboard/post");
  }

  function handleOpenOffer() {
    setOfferSelectionModalOpen(false);
    if (pendingOfferPayload) {
      completeNegotiationWithOffer(pendingOfferPayload, null);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => setOfferSelectionModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1520]/90 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#8dcde4]" />
            <h3 className="text-lg font-semibold text-white/94">Choose what you want to offer</h3>
          </div>
          <button
            onClick={() => setOfferSelectionModalOpen(false)}
            className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[350px] overflow-y-auto px-6 py-4">
          {userListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="mb-3 h-10 w-10 text-white/20" />
              <p className="text-[0.9rem] text-white/70">You don't have any active listings to offer.</p>
              <p className="mt-1 text-[0.8rem] text-white/40">Create a listing to offer standard items in trade.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {userListings.map((listing) => (
                <div
                  key={listing.id || listing._id}
                  onClick={() => handleSelect(listing)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all hover:border-[#8dcde4]/30 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-[#8dcde4]">
                      {listing.image ? (
                        <img src={listing.image} alt="" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[0.88rem] font-medium text-white/90 transition-colors group-hover:text-white">
                        {listing.title}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-2 text-[0.74rem] text-white/50">
                        <span>{listing.category}</span>
                        <span>•</span>
                        <span className="text-[#8dcde4]">{listing.condition}</span>
                        <span>•</span>
                        <span className="text-[#c4e0a8]">{listing.value}</span>
                      </div>
                    </div>
                  </div>
                  <button className="rounded-lg bg-[#8dcde4]/10 px-3 py-1.5 text-[0.74rem] font-semibold text-[#8dcde4] transition-colors group-hover:bg-[#8dcde4] group-hover:text-[#0b1219]">
                    Offer Resource
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-2 border-t border-white/[0.06] bg-black/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleNewRelay}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[0.8rem] font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Create a New Relay
          </button>
          <button
            onClick={handleOpenOffer}
            className="rounded-xl bg-white/[0.06] px-4 py-2 text-[0.8rem] font-medium text-white/90 transition-colors hover:bg-white/[0.1] hover:text-white"
          >
            Continue with an open offer
          </button>
        </div>
      </div>
    </div>
  );
}
