import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  Gift,
  ImagePlus,
  IndianRupee,
  MapPin,
  PackageCheck,
  PenLine,
  Sparkles,
  TicketPercent,
  Trash2,
  UploadCloud,
  Wrench,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useRelay } from "../context/RelayContext";
import { api } from "../lib/api";

const easing = [0.22, 1, 0.36, 1];

const categories = [
  {
    name: "Books",
    icon: BookOpen,
    iconClass: "text-[#8dcde4]",
    glow: "rgba(141,205,228,0.15)",
    blob: "bg-[#8dcde4]/18",
    description: "Novels, study guides, notes, references",
  },
  {
    name: "Coupons",
    icon: TicketPercent,
    iconClass: "text-[#ffc75b]",
    glow: "rgba(255,199,91,0.13)",
    blob: "bg-[#ffc75b]/16",
    description: "Shopping, entertainment, learning discounts",
  },
  {
    name: "Gift Cards",
    icon: Gift,
    iconClass: "text-[#ff9f71]",
    glow: "rgba(255,159,113,0.13)",
    blob: "bg-[#ff9f71]/16",
    description: "Unused balances and digital vouchers",
  },
  {
    name: "Tools",
    icon: Wrench,
    iconClass: "text-[#88c4ff]",
    glow: "rgba(136,196,255,0.13)",
    blob: "bg-[#88c4ff]/16",
    description: "Kits, accessories, devices, workspace gear",
  },
  {
    name: "More",
    icon: Sparkles,
    iconClass: "text-[#bb93ff]",
    glow: "rgba(187,147,255,0.12)",
    blob: "bg-[#bb93ff]/14",
    description: "Useful resources that still deserve a second life",
  },
];

const steps = [
  { label: "Category", icon: Sparkles },
  { label: "Images", icon: ImagePlus },
  { label: "Details", icon: PenLine },
  { label: "Preferences", icon: PackageCheck },
  { label: "Review", icon: CheckCircle },
];

const conditions = ["New", "Like New", "Excellent", "Good", "Fair", "Used"];
const preferences = [
  "Books",
  "Coupons",
  "Gift Cards",
  "Tools",
  "Open to Anything",
];

const defaultForm = {
  category: "Books",
  title: "",
  description: "",
  condition: "Like New",
  value: "",
  location: "Visakhapatnam",
  expiry: "",
  lookingFor: ["Open to Anything"],
  lookingForSpecific: "",
};

const specificPreferencePrompts = {
  Books: {
    label: "What book are you looking for?",
    placeholder: "Atomic Habits, Clean Code, Rich Dad Poor Dad",
  },
  Coupons: {
    label: "What coupon are you looking for?",
    placeholder: "Amazon, Myntra, BookMyShow, Ajio",
  },
  "Gift Cards": {
    label: "What gift card are you looking for?",
    placeholder: "Netflix, Amazon, Apple, Flipkart",
  },
  Tools: {
    label: "What tool are you looking for?",
    placeholder: "Arduino Kit, Bosch Drill, Monitor Arm",
  },
};

function reveal(shouldReduceMotion, delay = 0) {
  return {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.7,
        delay,
        ease: easing,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -8,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.22 },
    },
  };
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.78),rgba(5,10,18,0.72))] shadow-[0_24px_70px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[22px] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[1px] h-[36%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.02)_30%,transparent_100%)]"
      />
      {children}
    </div>
  );
}

function Field({ children, icon: Icon, label }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
        {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={1.8} /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

function StepControls({
  currentStep,
  onBack,
  onNext,
  onPublish,
  nextDisabled = false,
  published,
  publishDisabled = false,
}) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="relative mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-[0.86rem] font-medium transition-all duration-200 ${
          isFirst
            ? "cursor-not-allowed border-white/[0.05] bg-white/[0.02] text-white/24"
            : "border-white/[0.09] bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white/90"
        }`}
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back
      </button>

      {isLast ? (
        <button
          type="button"
          onClick={onPublish}
          disabled={published || publishDisabled}
          className={`inline-flex items-center justify-center gap-3 rounded-full border px-6 py-3 text-[0.9rem] font-semibold tracking-[-0.02em] shadow-[0_18px_48px_rgba(112,152,174,0.24),inset_0_1px_0_rgba(255,255,255,0.48)] transition-transform duration-200 ${
            published || publishDisabled
              ? "border-white/12 bg-white/[0.08] text-white/54"
              : "border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] text-[#081a22] hover:-translate-y-0.5"
          }`}
        >
          {published ? (
            <CheckCircle className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
          )}
          {published ? "Published" : "Publish Relay"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`inline-flex items-center justify-center gap-3 rounded-full border px-6 py-3 text-[0.9rem] font-semibold tracking-[-0.02em] shadow-[0_18px_48px_rgba(112,152,174,0.24),inset_0_1px_0_rgba(255,255,255,0.48)] transition-transform duration-200 ${
            nextDisabled
              ? "border-white/12 bg-white/[0.08] text-white/54"
              : "border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] text-[#081a22] hover:-translate-y-0.5"
          }`}
        >
          Continue
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

function createImageItem(file) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${file.name}-${Date.now()}-${Math.random()}`;

  return {
    id,
    name: file.name,
    size: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} MB`,
    url: URL.createObjectURL(file),
    file,
  };
}

function ReviewLine({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/[0.06] py-3 last:border-b-0">
      <span className="text-[0.78rem] uppercase tracking-[0.1em] text-white/34">
        {label}
      </span>
      <span className="max-w-[62%] text-right text-[0.88rem] leading-5 text-white/74">
        {value || "Not added"}
      </span>
    </div>
  );
}

export default function StartRelay() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { createListingFromForm, showToast, isDemoMode, setDemoUnlockModalOpen } = useRelay();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [published, setPublished] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const imagesRef = useRef([]);

  const activeCategory =
    categories.find((category) => category.name === form.category) ||
    categories[0];
  const ActiveIcon = activeCategory.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isExpiringCategory = ["Coupons", "Gift Cards"].includes(form.category);
  const isTitleValid =
    form.title.trim().length >= 3 &&
    form.title.trim().toLowerCase() !== form.category.toLowerCase();
  const selectedSpecificPreference = form.lookingFor.find(
    (item) => item !== "Open to Anything" && specificPreferencePrompts[item]
  );
  const specificPrompt = selectedSpecificPreference
    ? specificPreferencePrompts[selectedSpecificPreference]
    : null;

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setPublished(false);
  }

  function updateCategory(categoryName) {
    setForm((current) => ({
      ...current,
      category: categoryName,
      expiry: ["Coupons", "Gift Cards"].includes(categoryName)
        ? current.expiry
        : "",
    }));
    setPublished(false);
  }

  function inferAiSuggestion(fileList, currentCategory) {
    const nextFiles = Array.from(fileList || []);
    const joinedName = nextFiles.map((file) => file.name.toLowerCase()).join(" ");
    const inferredCategory = /(book|novel|textbook|notes|paper)/i.test(joinedName)
      ? "Books"
      : /(coupon|voucher|discount|offer)/i.test(joinedName)
        ? "Coupons"
        : /(gift|card)/i.test(joinedName)
          ? "Gift Cards"
          : /(drill|kit|tool|arduino|monitor|keyboard|wrench)/i.test(joinedName)
            ? "Tools"
            : currentCategory;

    const guessedTitle = nextFiles[0]
      ? nextFiles[0].name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "New Relay Item";

    const guessedDescription = `Auto-filled from uploaded images. The item looks suitable for a trusted local exchange and is ready for AI-assisted verification.`;
    const guessedCondition = /(like new|excellent|good)/i.test(joinedName) ? "Excellent" : "Good";
    const guessedValue = /(gift|card|coupon)/i.test(joinedName) ? "₹500" : "₹1,200";

    setForm((current) => ({
      ...current,
      category: inferredCategory,
      title: current.title || guessedTitle,
      description: current.description || guessedDescription,
      condition: current.condition === defaultForm.condition ? guessedCondition : current.condition,
      value: current.value || guessedValue,
      location: current.location || "Visakhapatnam",
    }));
  }

  async function runGeminiAnalysis(file) {
    setAnalyzingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("description", form.description);

      const response = await api.analyzeListingDraft(formData);
      if (response?.analysis) {
        const analysis = response.analysis;
        setForm((current) => ({
          ...current,
          title: analysis.suggestedTitle || current.title,
          description: analysis.suggestedDescription || current.description,
          condition: analysis.condition || current.condition,
          category: analysis.category || current.category,
          value: analysis.estimatedValue || current.value,
        }));

        if (response.imageUrl) {
          setImages((current) =>
            current.map((img) =>
              img.name === file.name ? { ...img, url: response.imageUrl } : img
            )
          );
        }

        showToast("AI Auto-fill Ready", "Listing verified and details inferred by Gemini.");
      }
    } catch (err) {
      console.error("Gemini listing analysis failed:", err);
    } finally {
      setAnalyzingImage(false);
    }
  }

  function addImages(fileList) {
    const rawFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    const nextImages = rawFiles
      .slice(0, Math.max(0, 6 - images.length))
      .map(createImageItem);

    if (nextImages.length) {
      setImages((current) => [...current, ...nextImages]);
      setPublished(false);
      
      const firstFile = rawFiles[0];
      if (firstFile) {
        void runGeminiAnalysis(firstFile);
      } else {
        inferAiSuggestion(nextImages, form.category);
      }
    }
  }

  function removeImage(imageId) {
    setImages((current) => {
      const removed = current.find((image) => image.id === imageId);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return current.filter((image) => image.id !== imageId);
    });
    setPublished(false);
  }

  function togglePreference(preference) {
    setForm((current) => {
      if (preference === "Open to Anything") {
        return {
          ...current,
          lookingFor: ["Open to Anything"],
          lookingForSpecific: "",
        };
      }

      const withoutOpen = current.lookingFor.filter(
        (item) => item !== "Open to Anything"
      );
      const exists = withoutOpen.includes(preference);
      const next = exists
        ? withoutOpen.filter((item) => item !== preference)
        : [...withoutOpen, preference];

      return {
        ...current,
        lookingFor: next.length ? next : ["Open to Anything"],
      };
    });
    setPublished(false);
  }

  function goToStep(stepIndex) {
    setCurrentStep(Math.min(Math.max(stepIndex, 0), steps.length - 1));
  }

  function handleNext() {
    if (currentStep === 2 && !isTitleValid) {
      showToast("Resource name required", "Add a specific title like Atomic Habits or Bosch Drill.");
      return;
    }

    goToStep(currentStep + 1);
  }

  function handlePublish() {
    if (!isTitleValid) {
      showToast("Resource name required", "Enter a specific resource name before publishing.");
      goToStep(2);
      return;
    }

    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }

    createListingFromForm(form, images);
    setPublished(true);
    showToast("Relay Published", `${form.title} is now visible in the marketplace.`);
    window.setTimeout(() => navigate("/dashboard/marketplace"), 500);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    addImages(event.dataTransfer.files);
  }

  function renderCategoryStep() {
    return (
      <GlassCard className="px-5 py-6 sm:px-7 sm:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-[inherit]"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${activeCategory.glow} 0%, transparent 74%)`,
          }}
        />
        <div
          aria-hidden="true"
          className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl ${activeCategory.blob}`}
        />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Step 1
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Choose a category.
          </h2>
          <p className="mt-3 max-w-[34rem] text-[0.94rem] leading-[1.7] text-white/54">
            Start with the resource type that best describes what you want to
            relay.
          </p>
        </div>

        <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = form.category === category.name;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => updateCategory(category.name)}
                className={`group relative overflow-hidden rounded-[1.2rem] border px-4 py-4 text-left transition-all duration-300 ${
                  active
                    ? "border-white/20 bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_rgba(141,205,228,0.1)]"
                    : "border-white/[0.08] bg-white/[0.035] hover:border-white/14 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[70%] rounded-[inherit] opacity-80"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${category.glow} 0%, transparent 72%)`,
                  }}
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Icon className={`h-[1.05rem] w-[1.05rem] ${category.iconClass}`} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-[0.98rem] font-semibold tracking-[-0.02em] text-white/94">
                      {category.name}
                      {active ? (
                        <Check className="h-4 w-4 text-[#c4e0a8]" strokeWidth={2} />
                      ) : null}
                    </span>
                    <span className="mt-1 block text-[0.78rem] leading-5 text-white/48">
                      {category.description}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <StepControls
          currentStep={currentStep}
          onBack={() => goToStep(currentStep - 1)}
          onNext={handleNext}
          onPublish={handlePublish}
          published={published}
        />
      </GlassCard>
    );
  }

  function renderImagesStep() {
    return (
      <GlassCard className="px-5 py-6 sm:px-7 sm:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(141,205,228,0.12)_0%,transparent_74%)]"
        />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Step 2
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Upload images.
          </h2>
          <p className="mt-3 max-w-[34rem] text-[0.94rem] leading-[1.7] text-white/54">
            Add clear photos so nearby members can understand the resource
            quickly.
          </p>
        </div>

        <label
          htmlFor="relay-images"
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={`relative mt-7 flex min-h-[14rem] cursor-pointer flex-col items-center justify-center rounded-[1.35rem] border border-dashed px-5 py-8 text-center transition-all duration-300 ${
            isDragging
              ? "border-[#8dcde4]/48 bg-[#8dcde4]/10"
              : "border-white/[0.13] bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]"
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#8dcde4] shadow-[0_10px_26px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <UploadCloud className="h-6 w-6" strokeWidth={1.7} />
          </span>
          <span className="mt-4 text-[0.98rem] font-semibold tracking-[-0.02em] text-white/88">
            Drop images here or choose files
          </span>
          <span className="mt-2 max-w-[26rem] text-[0.82rem] leading-6 text-white/44">
            Add up to six images. PNG, JPG, and WEBP files are supported.
          </span>
          <input
            id="relay-images"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => addImages(event.target.files)}
            className="sr-only"
          />
        </label>

        {analyzingImage && (
          <div className="relative mt-4 flex items-center justify-center gap-3 rounded-[1rem] border border-[#8dcde4]/20 bg-[#8dcde4]/5 py-4 px-5 text-sm font-medium text-[#8dcde4] animate-pulse">
            <Sparkles className="h-4 w-4 text-[#8dcde4]" />
            Analyzing photo with Gemini AI...
          </div>
        )}

        {images.length ? (
          <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-white/[0.08] bg-white/[0.04]"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent px-3 pb-3 pt-8">
                  <p className="truncate text-[0.72rem] font-medium text-white/84">
                    {image.name}
                  </p>
                  <p className="text-[0.64rem] text-white/46">{image.size}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  aria-label={`Remove ${image.name}`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white/70 opacity-100 backdrop-blur-xl transition-colors hover:bg-black/62 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <StepControls
          currentStep={currentStep}
          onBack={() => goToStep(currentStep - 1)}
          onNext={handleNext}
          onPublish={handlePublish}
          published={published}
        />
      </GlassCard>
    );
  }

  function renderDetailsStep() {
    return (
      <GlassCard className="px-5 py-6 sm:px-7 sm:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,159,113,0.1)_0%,transparent_74%)]"
        />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Step 3
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Add the details.
          </h2>
          <p className="mt-3 max-w-[34rem] text-[0.94rem] leading-[1.7] text-white/54">
            Keep the listing specific, transparent, and easy to match.
          </p>
        </div>

        <div className="relative mt-7 grid gap-5">
          <Field label="Title" icon={PenLine}>
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder={
                form.category === "Books"
                  ? "Atomic Habits"
                  : form.category === "Coupons"
                    ? "Amazon 20% Coupon"
                    : form.category === "Gift Cards"
                      ? "Netflix Gift Card"
                      : form.category === "Tools"
                        ? "Bosch Drill"
                        : "Study Table"
              }
              className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(141,205,228,0.16)]"
            />
            {!isTitleValid && form.title ? (
              <p className="mt-2 text-[0.74rem] text-[#ffc75b]">
                Use a specific resource name, not only the category.
              </p>
            ) : null}
          </Field>

          <Field label="Description" icon={Sparkles}>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Condition, usage notes, what is included"
              rows={5}
              className="w-full resize-none rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] leading-6 text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(141,205,228,0.16)]"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Condition" icon={CheckCircle}>
              <select
                value={form.condition}
                onChange={(event) =>
                  updateField("condition", event.target.value)
                }
                className="w-full rounded-[1rem] border border-white/[0.09] bg-[#08101a] px-4 py-3 text-[0.9rem] text-white outline-none transition-all focus:border-white/20 focus:shadow-[0_0_0_1px_rgba(141,205,228,0.16)]"
              >
                {conditions.map((condition) => (
                  <option key={condition}>{condition}</option>
                ))}
              </select>
            </Field>

            <Field label="Approximate Value" icon={IndianRupee}>
              <input
                type="text"
                value={form.value}
                onChange={(event) => updateField("value", event.target.value)}
                placeholder="₹1,000"
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(141,205,228,0.16)]"
              />
            </Field>

            <Field label="Location" icon={MapPin}>
              <input
                type="text"
                value={form.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="Area or campus"
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(141,205,228,0.16)]"
              />
            </Field>

            {isExpiringCategory ? (
              <Field label="Expiry Date" icon={Calendar}>
                <input
                  type="date"
                  value={form.expiry}
                  onChange={(event) => updateField("expiry", event.target.value)}
                  className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none transition-all [color-scheme:dark] focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(141,205,228,0.16)]"
                />
              </Field>
            ) : null}
          </div>
        </div>

        <StepControls
          currentStep={currentStep}
          onBack={() => goToStep(currentStep - 1)}
          onNext={handleNext}
          onPublish={handlePublish}
          nextDisabled={!isTitleValid}
          published={published}
        />
      </GlassCard>
    );
  }

  function renderPreferencesStep() {
    return (
      <GlassCard className="px-5 py-6 sm:px-7 sm:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(187,147,255,0.12)_0%,transparent_74%)]"
        />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Step 4
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Exchange preferences.
          </h2>
          <p className="mt-3 max-w-[34rem] text-[0.94rem] leading-[1.7] text-white/54">
            Choose what you would like in return, or keep the match open.
          </p>
        </div>

        <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
          {preferences.map((preference) => {
            const meta =
              categories.find((category) => category.name === preference) ||
              categories[categories.length - 1];
            const Icon =
              preference === "Open to Anything" ? Sparkles : meta.icon;
            const active = form.lookingFor.includes(preference);

            return (
              <button
                key={preference}
                type="button"
                onClick={() => togglePreference(preference)}
                className={`relative flex items-center justify-between gap-3 rounded-[1.15rem] border px-4 py-4 text-left transition-all duration-300 ${
                  active
                    ? "border-white/20 bg-white/[0.1] text-white"
                    : "border-white/[0.08] bg-white/[0.035] text-white/54 hover:border-white/14 hover:bg-white/[0.06] hover:text-white/82"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Icon className={`h-[1.05rem] w-[1.05rem] ${meta.iconClass}`} />
                  </span>
                  <span className="text-[0.95rem] font-semibold tracking-[-0.02em]">
                    {preference}
                  </span>
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    active
                      ? "border-[#c4e0a8]/34 bg-[#c4e0a8]/14 text-[#c4e0a8]"
                      : "border-white/[0.09] text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
              </button>
            );
          })}
        </div>

        {specificPrompt ? (
          <div className="relative mt-5">
            <Field label={specificPrompt.label} icon={PenLine}>
              <input
                type="text"
                value={form.lookingForSpecific}
                onChange={(event) =>
                  updateField("lookingForSpecific", event.target.value)
                }
                placeholder={specificPrompt.placeholder}
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(141,205,228,0.16)]"
              />
            </Field>
          </div>
        ) : null}

        <StepControls
          currentStep={currentStep}
          onBack={() => goToStep(currentStep - 1)}
          onNext={handleNext}
          onPublish={handlePublish}
          published={published}
        />
      </GlassCard>
    );
  }

  function renderReviewStep() {
    return (
      <GlassCard className="px-5 py-6 sm:px-7 sm:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,224,168,0.11)_0%,transparent_74%)]"
        />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Step 5
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Review and publish.
          </h2>
          <p className="mt-3 max-w-[34rem] text-[0.94rem] leading-[1.7] text-white/54">
            Confirm the listing before it appears for nearby matches.
          </p>
        </div>

        {published ? (
          <div className="relative mt-6 flex items-start gap-3 rounded-[1.1rem] border border-[#c4e0a8]/18 bg-[#c4e0a8]/10 px-4 py-4 text-[#dff3c6]">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} />
            <div>
              <p className="text-[0.92rem] font-semibold">
                Your relay is ready for nearby matches.
              </p>
              <p className="mt-1 text-[0.8rem] leading-5 text-white/52">
                It has been staged in this prototype flow.
              </p>
            </div>
          </div>
        ) : null}

        <div className="relative mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-white/[0.04]">
            <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.14)_0%,rgba(255,255,255,0.04)_48%,transparent_100%)]">
              {images[0] ? (
                <img
                  src={images[0].url}
                  alt={images[0].name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <ActiveIcon className={`h-7 w-7 ${activeCategory.iconClass}`} />
                  </span>
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/28 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/78 backdrop-blur-xl">
                {form.category}
              </span>
            </div>
            <div className="px-4 py-4">
              <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-white/94">
                {form.title || `${form.category} resource`}
              </h3>
              <p className="mt-2 line-clamp-3 text-[0.82rem] leading-6 text-white/50">
                {form.description ||
                  "Add a short description so members know what makes this useful."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.74rem] text-white/44">
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1">
                  {form.condition}
                </span>
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1">
                  {form.value || "Value not added"}
                </span>
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1">
                  {form.location || "Location not added"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.035] px-5 py-4">
            <ReviewLine label="Category" value={form.category} />
            <ReviewLine label="Images" value={`${images.length} uploaded`} />
            <ReviewLine label="Condition" value={form.condition} />
            <ReviewLine label="Value" value={form.value} />
            <ReviewLine label="Location" value={form.location} />
            {isExpiringCategory ? (
              <ReviewLine label="Expiry" value={form.expiry} />
            ) : null}
            <ReviewLine
              label="Looking for"
              value={form.lookingForSpecific || form.lookingFor.join(", ")}
            />

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => goToStep(0)}
                className="rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-[0.78rem] font-medium text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white/88"
              >
                Edit Category
              </button>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-[0.78rem] font-medium text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white/88"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>

        <StepControls
          currentStep={currentStep}
          onBack={() => goToStep(currentStep - 1)}
          onNext={handleNext}
          onPublish={handlePublish}
          publishDisabled={!isTitleValid}
          published={published}
        />
      </GlassCard>
    );
  }

  const stepPanels = [
    renderCategoryStep,
    renderImagesStep,
    renderDetailsStep,
    renderPreferencesStep,
    renderReviewStep,
  ];

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.07)_0%,transparent_48%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <motion.section
          {...reveal(shouldReduceMotion, 0)}
          aria-labelledby="start-relay-title"
          className="mb-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Start Relay
          </p>
          <h1
            id="start-relay-title"
            className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white"
          >
            Share something valuable.
          </h1>
          <p className="mt-3 max-w-[38rem] text-[1.02rem] leading-[1.7] text-white/60">
            Create a polished listing for books, coupons, gift cards, tools, or
            other useful resources in your trusted local community.
          </p>
        </motion.section>

        <section className="grid gap-5 lg:grid-cols-[0.76fr_1.55fr] lg:items-start">
          <motion.aside {...reveal(shouldReduceMotion, 0.08)}>
            <GlassCard className="px-4 py-4 sm:px-5 sm:py-5 lg:sticky lg:top-28">
              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-white/38">
                      Progress
                    </p>
                    <p className="mt-1 text-[0.95rem] font-semibold tracking-[-0.02em] text-white/86">
                      {steps[currentStep].label}
                    </p>
                  </div>
                  <span className="font-serif text-[1.6rem] leading-none tracking-[-0.05em] text-white/82">
                    {currentStep + 1}/{steps.length}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, ease: easing }}
                  />
                </div>

                <div className="mt-5 grid gap-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const active = index === currentStep;
                    const complete = index < currentStep;
                    return (
                      <button
                        key={step.label}
                        type="button"
                        onClick={() => goToStep(index)}
                        className={`flex items-center gap-3 rounded-[1rem] border px-3 py-3 text-left transition-all duration-200 ${
                          active
                            ? "border-white/18 bg-white/[0.09] text-white"
                            : "border-white/[0.06] bg-white/[0.025] text-white/48 hover:bg-white/[0.05] hover:text-white/78"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                            complete
                              ? "border-[#c4e0a8]/24 bg-[#c4e0a8]/12 text-[#c4e0a8]"
                              : active
                                ? "border-[#8dcde4]/26 bg-[#8dcde4]/12 text-[#8dcde4]"
                                : "border-white/[0.08] bg-white/[0.03]"
                          }`}
                        >
                          {complete ? (
                            <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                          ) : (
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.86rem] font-semibold tracking-[-0.01em]">
                            {step.label}
                          </span>
                          <span className="mt-0.5 block text-[0.68rem] text-white/34">
                            Step {index + 1}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </motion.aside>

          <AnimatePresence mode="wait">
            <motion.div key={currentStep} {...reveal(shouldReduceMotion, 0.02)}>
              {stepPanels[currentStep]()}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
