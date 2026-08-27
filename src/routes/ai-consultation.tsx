import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { SALON, whatsappLink } from "@/lib/salon";

export const Route = createFileRoute("/ai-consultation")({
  component: AIBeautyConsultation,
});

type Category = "hair" | "skin" | "makeup";

type Option = {
  label: string;
  value: string;
  price: number;
};

const categories = [
  {
    value: "hair" as Category,
    emoji: "💇",
    title: "Hair Consultation",
    description: "Find the right haircut, colour, spa or styling service.",
  },
  {
    value: "skin" as Category,
    emoji: "✨",
    title: "Skin Consultation",
    description: "Choose a facial or skin-care service for your goal.",
  },
  {
    value: "makeup" as Category,
    emoji: "💄",
    title: "Makeup Consultation",
    description: "Find a makeup look for your special occasion.",
  },
];

const questions: Record<
  Category,
  { question: string; options: Option[] }[]
> = {
  hair: [
    {
      question: "What do you want today?",
      options: [
        { label: "Haircut", value: "haircut", price: 599 },
        { label: "Hair Colour", value: "colour", price: 1499 },
        { label: "Hair Spa", value: "spa", price: 999 },
        { label: "Hair Styling", value: "styling", price: 499 },
      ],
    },
    {
      question: "What is your hair length?",
      options: [
        { label: "Short", value: "short", price: 0 },
        { label: "Medium", value: "medium", price: 200 },
        { label: "Long", value: "long", price: 400 },
      ],
    },
    {
      question: "What result do you prefer?",
      options: [
        { label: "Natural & Simple", value: "natural", price: 0 },
        { label: "Premium Look", value: "premium", price: 300 },
        { label: "Complete Transformation", value: "transform", price: 600 },
      ],
    },
  ],

  skin: [
    {
      question: "What is your main skin goal?",
      options: [
        { label: "Glow & Freshness", value: "glow", price: 899 },
        { label: "De-tan", value: "tan", price: 699 },
        { label: "Deep Cleansing", value: "clean", price: 499 },
        { label: "Hydration", value: "hydra", price: 1499 },
      ],
    },
    {
      question: "How does your skin usually feel?",
      options: [
        { label: "Normal", value: "normal", price: 0 },
        { label: "Dry", value: "dry", price: 100 },
        { label: "Oily", value: "oily", price: 100 },
        { label: "Sensitive", value: "sensitive", price: 150 },
      ],
    },
    {
      question: "What finish do you want?",
      options: [
        { label: "Fresh", value: "fresh", price: 0 },
        { label: "Bright & Glowing", value: "bright", price: 200 },
        { label: "Premium Treatment", value: "premium", price: 400 },
      ],
    },
  ],

  makeup: [
    {
      question: "What is the occasion?",
      options: [
        { label: "Party", value: "party", price: 1499 },
        { label: "Engagement", value: "engagement", price: 2499 },
        { label: "Bridal", value: "bridal", price: 5999 },
        { label: "Special Event", value: "event", price: 1799 },
      ],
    },
    {
      question: "Which style do you prefer?",
      options: [
        { label: "Natural", value: "natural", price: 0 },
        { label: "Elegant", value: "elegant", price: 300 },
        { label: "Glamorous", value: "glam", price: 500 },
      ],
    },
    {
      question: "Do you need hairstyling?",
      options: [
        { label: "No", value: "no", price: 0 },
        { label: "Yes", value: "hair", price: 1499 },
        { label: "Yes + Saree Draping", value: "complete", price: 1999 },
      ],
    },
  ],
};

function AIBeautyConsultation() {
  const [category, setCategory] = useState<Category | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);

  const currentQuestions = category ? questions[category] : [];
  const currentQuestion = currentQuestions[step];

  const total = useMemo(
    () => answers.reduce((sum, answer) => sum + answer.price, 0),
    [answers],
  );

  const recommendation = useMemo(() => {
    if (!category) return "";

    const first = answers[0]?.value;

    if (category === "hair") {
      if (first === "colour")
        return "Based on your answers, we recommend a personalised Hair Colour consultation.";
      if (first === "spa")
        return "A Hair Spa & Treatment is a great match for your selected hair goal.";
      if (first === "styling")
        return "Our stylists can create an occasion-ready look based on your hair length and preference.";
      return "A personalised Haircut & Styling session is recommended for you.";
    }

    if (category === "skin") {
      if (first === "hydra")
        return "A Hydra Beauty / Hydra Facial consultation may suit your hydration goal.";
      if (first === "tan")
        return "A De-tan consultation is recommended for your selected concern.";
      if (first === "clean")
        return "A professional Cleanup / Facial consultation may suit your goal.";
      return "A personalised facial consultation is recommended based on your selected preferences.";
    }

    if (first === "bridal")
      return "We recommend a Bridal Makeup consultation so your makeup, hairstyle and overall look can be planned together.";

    return "A personalised Makeup consultation is recommended for your occasion and preferred style.";
  }, [category, answers]);

  const selectedCategory = categories.find(
    (item) => item.value === category,
  );

  function startCategory(value: Category) {
    setCategory(value);
    setStep(0);
    setAnswers([]);
  }

  function selectOption(option: Option) {
    const updated = [...answers];
    updated[step] = option;
    setAnswers(updated);

    if (step < currentQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(currentQuestions.length);
    }
  }

  function reset() {
    setCategory(null);
    setStep(0);
    setAnswers([]);
  }

  const whatsappMessage = [
    `Hello ${SALON.name}! 👋`,
    "",
    "I completed the AI Beauty Consultation.",
    `Category: ${selectedCategory?.title ?? ""}`,
    "",
    ...answers.map(
      (answer, index) => `${index + 1}. ${answer.label}`,
    ),
    "",
    `Estimated Price: ₹${total.toLocaleString("en-IN")}`,
    "",
    "I would like to book this service.",
  ].join("\n");

  return (
    <main className="min-h-screen bg-noir text-noir-foreground">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-gold">
            AI Beauty Concierge
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Find Your Perfect{" "}
            <span className="text-gold-gradient">Beauty Service</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-noir-muted">
            Answer a few simple questions and get a personalised service
            recommendation with an estimated price.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-3xl bg-card p-6 shadow-elegant sm:p-10">
          {!category && (
            <>
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold">
                  What would you like help with?
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Select one to start your consultation.
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {categories.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => startCategory(item.value)}
                    className="group rounded-2xl border border-border bg-background p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-gold"
                  >
                    <span className="text-4xl">{item.emoji}</span>

                    <h3 className="mt-5 font-display text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Start Consultation
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
                <p className="font-semibold">🤷 Not sure what to book?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start with Hair Consultation and we'll guide you through the
                  options.
                </p>

                <button
                  type="button"
                  onClick={() => startCategory("hair")}
                  className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-105"
                >
                  Help Me Choose
                </button>
              </div>
            </>
          )}

          {category && step < currentQuestions.length && currentQuestion && (
            <>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Start Over
                </button>

                <span className="text-sm text-muted-foreground">
                  Step {step + 1} / {currentQuestions.length}
                </span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${((step + 1) / currentQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-10">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                  {selectedCategory?.emoji} {selectedCategory?.title}
                </p>

                <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                  {currentQuestion.question}
                </h2>

                <div className="mt-7 grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const selected =
                      answers[step]?.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => selectOption(option)}
                        className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300 ${
                          selected
                            ? "border-primary bg-primary/10 shadow-gold"
                            : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/60"
                        }`}
                      >
                        <span className="font-medium">
                          {option.label}
                        </span>

                        {selected ? (
                          <Check className="h-5 w-5 text-primary" />
                        ) : (
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {category && step >= currentQuestions.length && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-primary">
                Consultation Complete
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Your Beauty Plan
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                {recommendation}
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <p className="text-sm text-muted-foreground">
                  Estimated Price
                </p>

                <p className="mt-2 text-4xl font-bold text-primary">
                  ₹{total.toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Final price may vary after consultation and service
                  assessment.
                </p>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-gold transition hover:scale-[1.03]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Book on WhatsApp
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3 font-semibold transition hover:bg-muted"
                >
                  Book Appointment
                </Link>

                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3 font-semibold transition hover:bg-muted"
                >
                  <RotateCcw className="h-4 w-4" />
                  Start Again
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-noir-muted">
          AI-assisted recommendations • Prices shown are estimates
        </p>
      </section>
    </main>
  );
}