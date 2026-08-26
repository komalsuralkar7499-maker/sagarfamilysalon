import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Scissors,
  Sparkles,
  Palette,
  Flower2,
  Heart,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  Bot,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import { SALON, GALLERY_IMAGES } from "@/lib/salon";
import { BookAppointmentCta, WhatsAppCta } from "@/components/cta-buttons";

import storefrontAsset from "@/assets/storefront.asset.json";
import interiorChairsAsset from "@/assets/interior-chairs.asset.json";
import workBalayageAsset from "@/assets/work-balayage.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sagar Family Salon — Expert Hair & Skin Care" },
      {
        name: "description",
        content:
          "Sagar Family Salon — internationally certified experts in hair & skin. Haircuts, hair colour, facials and bridal makeup for the whole family.",
      },
      {
        property: "og:title",
        content: "Sagar Family Salon — Expert Hair & Skin Care",
      },
      {
        property: "og:description",
        content:
          "Internationally certified experts in hair & skin. Haircuts, colour, facials and bridal makeup for the whole family.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const FEATURED_SERVICES = [
  {
    icon: Scissors,
    title: "Haircut & Styling",
    text: "Precision cuts for men, women and kids, finished with professional styling.",
  },
  {
    icon: Palette,
    title: "Hair Colour",
    text: "Global colour, highlights and balayage with professional colour ranges.",
  },
  {
    icon: Sparkles,
    title: "Facial & Cleanup",
    text: "Signature facials and Hydra Beauty treatments for glowing skin.",
  },
  {
    icon: Heart,
    title: "Bridal Makeup",
    text: "Complete bridal looks — HD makeup, hairstyling and draping.",
  },
];

const WHY_US = [
  {
    icon: Award,
    title: "Internationally Certified",
    text: "Trained and certified expertise in hair & skin care.",
  },
  {
    icon: Users,
    title: "For the Whole Family",
    text: "Men, women and kids — everyone is welcome at our family salon.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene First",
    text: "Clean stations, sanitized tools and professional products.",
  },
  {
    icon: Flower2,
    title: "Modern Equipment",
    text: "Advanced skin and hair technology, including Hydra Beauty systems.",
  },
];

type Category = "Hair" | "Skin" | "Makeup" | "Bridal" | "Not Sure" | "";

type Consultation = {
  category: Category;
  service: string;
  concern: string;
  preference: string;
  date: string;
  time: string;
};

const initialConsultation: Consultation = {
  category: "",
  service: "",
  concern: "",
  preference: "",
  date: "",
  time: "",
};

function BeautyConsultation() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Consultation>(initialConsultation);

  const reset = () => {
    setData(initialConsultation);
    setStep(0);
  };

  const selectOption = (value: string) => {
    if (step === 0) {
      setData((old) => ({
        ...old,
        category: value as Category,
      }));
    }

    if (step === 1) {
      setData((old) => ({
        ...old,
        service: value,
      }));
    }

    if (step === 2) {
      setData((old) => ({
        ...old,
        concern: value,
      }));
    }

    if (step === 3) {
      setData((old) => ({
        ...old,
        preference: value,
      }));
    }

    if (step === 4) {
      setData((old) => ({
        ...old,
        date: value,
      }));
    }

    if (step === 5) {
      setData((old) => ({
        ...old,
        time: value,
      }));
    }

    setStep((old) => old + 1);
  };

  const getOptions = (): string[] => {
    if (step === 0) {
      return ["Hair", "Skin", "Makeup", "Bridal", "Not Sure"];
    }

    if (step === 1) {
      if (data.category === "Hair") {
        return [
          "Haircut & Styling",
          "Hair Colour",
          "Highlights",
          "Balayage",
          "Hair Spa",
          "Keratin",
          "Smoothening",
        ];
      }

      if (data.category === "Skin") {
        return [
          "Facial",
          "Cleanup",
          "D-Tan",
          "Hydration",
          "Skin Glow",
          "Party Preparation",
        ];
      }

      if (data.category === "Makeup") {
        return [
          "Party Makeup",
          "Engagement Makeup",
          "Reception Makeup",
          "Photoshoot Makeup",
        ];
      }

      if (data.category === "Bridal") {
        return [
          "Bridal Makeup",
          "Bridal Hair Styling",
          "HD Bridal Makeup",
          "Complete Bridal Package",
        ];
      }

      return [
        "Hair Consultation",
        "Skin Consultation",
        "Makeup Consultation",
        "Complete Beauty Consultation",
      ];
    }

    if (step === 2) {
      if (data.category === "Hair") {
        return [
          "Hair fall",
          "Dry / damaged hair",
          "Frizz",
          "Need a new look",
          "Colour change",
          "No specific concern",
        ];
      }

      if (data.category === "Skin") {
        return [
          "Dullness",
          "Dryness",
          "Oiliness",
          "Tan",
          "Need more glow",
          "No specific concern",
        ];
      }

      if (data.category === "Bridal") {
        return [
          "Natural bridal look",
          "Glam bridal look",
          "HD / camera-ready look",
          "Not sure yet",
        ];
      }

      return [
        "Natural look",
        "Glam look",
        "Fresh / glowing look",
        "Not sure yet",
      ];
    }

    if (step === 3) {
      if (data.category === "Hair") {
        return [
          "Natural finish",
          "Premium / polished finish",
          "Bold transformation",
          "Not sure",
        ];
      }

      if (data.category === "Skin") {
        return [
          "Glow",
          "Hydration",
          "Deep cleansing",
          "Tan removal",
          "Event preparation",
        ];
      }

      return [
        "Natural",
        "Soft glam",
        "Glamorous",
        "Camera-ready",
      ];
    }

    if (step === 4) {
      return [
        "Today",
        "Tomorrow",
        "This Weekend",
        "Next Week",
      ];
    }

    if (step === 5) {
      return [
        "Morning",
        "Afternoon",
        "Evening",
      ];
    }

    return [];
  };

  const getQuestion = () => {
    if (step === 0) {
      return "Hi 👋 I'm Sagar Beauty Concierge. What would you like help with today?";
    }

    if (step === 1) {
      return `Great choice. Which ${data.category.toLowerCase()} service are you interested in?`;
    }

    if (step === 2) {
      return "Tell me what you'd mainly like to improve or achieve.";
    }

    if (step === 3) {
      return "What kind of final look or result do you prefer?";
    }

    if (step === 4) {
      return "When would you like to visit the salon?";
    }

    if (step === 5) {
      return "What time of day would you prefer?";
    }

    return "";
  };

  const getRecommendation = () => {
    if (data.category === "Hair") {
      if (
        data.service === "Balayage" ||
        data.service === "Highlights" ||
        data.concern === "Colour change"
      ) {
        return {
          title: "Personalised Hair Colour Consultation",
          service:
            data.service === "Balayage"
              ? "Balayage"
              : data.service === "Highlights"
                ? "Highlights"
                : "Professional Hair Colour",
          price: "₹2,500 – ₹6,000+",
          duration: "2 – 4 hours",
        };
      }

      if (
        data.concern === "Dry / damaged hair" ||
        data.concern === "Frizz"
      ) {
        return {
          title: "Hair Repair & Smoothening Recommendation",
          service:
            data.service === "Keratin"
              ? "Keratin Treatment"
              : data.service === "Smoothening"
                ? "Hair Smoothening"
                : "Hair Spa & Repair",
          price: "₹1,500 – ₹6,000+",
          duration: "1.5 – 4 hours",
        };
      }

      return {
        title: "Personalised Hair Service",
        service: data.service || "Hair Consultation",
        price: "₹500 – ₹3,500+",
        duration: "45 minutes – 3 hours",
      };
    }

    if (data.category === "Skin") {
      if (data.concern === "Dryness" || data.concern === "Need more glow") {
        return {
          title: "Glow & Hydration Recommendation",
          service: data.service || "Hydrating Facial",
          price: "₹800 – ₹2,500+",
          duration: "60 – 90 minutes",
        };
      }

      if (data.concern === "Tan") {
        return {
          title: "Tan Care Recommendation",
          service: data.service || "D-Tan / Skin Brightening",
          price: "₹500 – ₹1,800+",
          duration: "45 – 75 minutes",
        };
      }

      return {
        title: "Personalised Skin Care",
        service: data.service || "Facial & Cleanup",
        price: "₹500 – ₹2,500+",
        duration: "45 – 90 minutes",
      };
    }

    if (data.category === "Bridal") {
      return {
        title: "Bridal Beauty Recommendation",
        service: data.service || "Complete Bridal Package",
        price: "₹5,000 – ₹15,000+",
        duration: "2 – 5 hours",
      };
    }

    return {
      title: "Personalised Makeup Recommendation",
      service: data.service || "Makeup Consultation",
      price: "₹2,000 – ₹8,000+",
      duration: "1.5 – 3 hours",
    };
  };

  const recommendation = getRecommendation();
  const finished = step > 5;

  if (!open) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-noir p-8 text-noir-foreground shadow-elegant sm:p-12">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Bot className="h-8 w-8" />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-gold">
              AI Beauty Concierge
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Not Sure What to Book?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-noir-muted">
              Answer a few simple questions and get a personalised salon
              recommendation for your hair, skin or makeup needs.
            </p>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              <Sparkles className="h-5 w-5" />
              Start AI Consultation
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="overflow-hidden rounded-3xl bg-card shadow-elegant ring-1 ring-border">
        <div className="flex items-center justify-between bg-noir px-5 py-4 text-noir-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Bot className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold">Sagar Beauty Concierge</p>
              <p className="text-xs text-noir-muted">
                Personalised beauty consultation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="rounded-full p-2 text-noir-muted hover:bg-white/10 hover:text-white"
            aria-label="Restart consultation"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-8">
          {!finished ? (
            <>
              <div className="mb-7 flex items-center gap-3">
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  Step {step + 1} of 6
                </span>

                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${((step + 1) / 6) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div className="rounded-2xl rounded-tl-sm bg-secondary px-5 py-4 text-sm leading-relaxed">
                  {getQuestion()}
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {getOptions().map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => selectOption(option)}
                    className="rounded-xl border border-border bg-background px-5 py-4 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5"
                  >
                    {option}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((old) => Math.max(0, old - 1))}
                  className="mt-6 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-primary">
                Your Personalised Recommendation
              </p>

              <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                {recommendation.title}
              </h3>

              <div className="mt-7 rounded-2xl bg-secondary p-6 text-left">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Recommended Service
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {recommendation.service}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-background p-4">
                    <p className="text-xs text-muted-foreground">
                      Estimated Price
                    </p>
                    <p className="mt-1 font-semibold">
                      {recommendation.price}
                    </p>
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <p className="text-xs text-muted-foreground">
                      Estimated Duration
                    </p>
                    <p className="mt-1 font-semibold">
                      {recommendation.duration}
                    </p>
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <p className="text-xs text-muted-foreground">
                      Preferred Date
                    </p>
                    <p className="mt-1 font-semibold">{data.date}</p>
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <p className="text-xs text-muted-foreground">
                      Preferred Time
                    </p>
                    <p className="mt-1 font-semibold">{data.time}</p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                This is an estimated recommendation for demonstration
                purposes. Final service suitability and pricing will be
                confirmed by the salon professional.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  Start Again
                </button>

                <BookAppointmentCta />
              </div>

              <div className="mt-3">
                <WhatsAppCta />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const galleryPreview = GALLERY_IMAGES.slice(1, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-noir text-noir-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Internationally Certified
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Sagar <span className="text-gold-gradient">Family Salon</span>
            </h1>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-noir-muted">
              {SALON.tagline}. From everyday haircuts to your bridal day — we
              make every visit special.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <BookAppointmentCta />
              <WhatsAppCta />
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="overflow-hidden rounded-2xl shadow-elegant ring-1 ring-gold/30">
              <img
                src={storefrontAsset.url}
                alt="Sagar Family Salon storefront — internationally certified experts in hair & skin"
                className="h-full w-full object-cover"
                width={720}
                height={960}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={interiorChairsAsset.url}
              alt="Styling chairs and workstations inside Sagar Family Salon"
              className="h-full w-full object-cover"
        