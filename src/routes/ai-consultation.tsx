import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
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

const categories: {
  value: Category;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    value: "hair",
    title: "Hair Consultation",
    description: "Find the right haircut, colour or treatment.",
    emoji: "💇",
  },
  {
    value: "skin",
    title: "Skin Consultation",
    description: "Choose a treatment based on your skin concern.",
    emoji: "✨",
  },
  {
    value: "makeup",
    title: "Makeup Consultation",
    description: "Find your perfect makeup look.",
    emoji: "💄",
  },
];

const questions: Record<
  Category,
  { question: string; options: Option[] }[]
> = {
  hair: [
    {
      question: "What are you looking for?",
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
        { label: "Medium", value: "medium", price: 300 },
        { label: "Long", value: "long", price: 600 },
      ],
    },
    {
      question: "What result do you want?",
      options: [
        { label: "Fresh & Natural", value: "natural", price: 0 },
        { label: "Premium Look", value: "premium", price: 300 },
        { label: "Complete Transformation", value: "transform", price: 600 },
      ],
    },
  ],

  skin: [
    {
      question: "What is your main skin concern?",
      options: [
        { label: "Dullness / Glow", value: "glow", price: 899 },
        { label: "Tanning", value: "tan", price: 699 },
        { label: "Deep Cleansing", value: "clean", price: 499 },
        { label: "Hydration", value: "hydration", price: 1499 },
      ],
    },
    {
      question: "How would you describe your skin?",
      options: [
        { label: "Normal", value: "normal", price: 0 },
        { label: "Dry", value: "dry", price: 100 },
        { label: "Oily", value: "oily", price: 100 },
        { label: "Sensitive", value: "sensitive", price: 150 },
      ],
    },
    {
      question: "What result do you want?",
      options: [
        { label: "Fresh Skin", value: "fresh", price: 0 },
        { label: "Brighter Glow", value: "bright", price: 200 },
        { label: "Deep Treatment", value: "deep", price: 400 },
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
        { label: "Just Glam", value: "glam", price: 1799 },
      ],
    },
    {
      question: "What style do you prefer?",
      options: [
        { label: "Natural", value: "natural", price: 0 },
        { label: "Elegant", value: "elegant", price: 300 },
        { label: "Glamorous", value: "glam", price: 500 },
      ],
    },
    {
      question: "Would you like hair styling?",
      options: [
        { label: "No", value: "no-hair", price: 0 },
        { label: "Yes", value: "hair", price: 1499 },
        { label: "Yes + Saree Draping", value: "complete", price: 1998 },
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

    if (category === "hair") {
      const first = answers[0]?.value;

      if (first === "colour")
        return "Our AI recommends a professional Hair Colour consultation with a personalised colour selection.";

      if (first === "spa")
        return "Our AI recommends a Hair Spa & Treatment for healthier, softer-looking hair.";

      return "Our AI recommends a personalised Haircut & Styling session based on your preferences.";
    }

    if (category === "skin") {
      const first = answers[0]?.value;

      if (first === "hydration")
        return "Our AI recommends a Hydra Facial for hydration and a refreshed appearance.";

      if (first === "tan")
        return "Our AI recommends a De-tan treatment based on your selected concern.";

      return "Our AI recommends a personalised facial/cleanup based on your skin goals.";
    }

    const occasion = answers[0]?.value;

    if (occasion === "bridal")
      return "Our AI recommends a complete Bridal Makeup consultation so your makeup, hairstyle and overall look can be planned together.";

    return "Our AI recommends a makeup look customised to your occasion, preferred style and hairstyle.";
  }, [category, answers]);

  function chooseCategory(value: Category) {
    setCategory(value);
    setStep(0);
    setAnswers([]);
  }

  function chooseOption(option: Option) {
    const updated = [...answers];
    updated[step] = option;
    setAnswers(updated);

    if (step < currentQuestions.length - 1) {
      setStep(step + 1);
    }
  }

  function reset() {
    setCategory(null);
    setStep(0);
    setAnswers([]);
  }

  const whatsappMessage = [
    "Hello Sagar Family Salon! 👋",
    "",
    "I used the AI Beauty Consultation.",
    `Category: ${category ?? ""}`,
    ...answers.map((answer, index) => `Q${index + 1}: ${answer.label}`),
    "",
    `Estimated Price: ₹${total.toLocaleString("en-IN")}`,
    "",
    "I would like to book a consultation.",
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
            Find the right <span className="text-gold-gradient">beauty service</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-noir-muted">
            Answer a few simple questions and get a personalised recommendation
            with an estimated price.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-card p-6 shadow-elegant sm:p-10">
          {!category && (
            <>
              <h2 className="text-center font-display text-2xl font-bold">
                What would you like help with?
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {categories.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => chooseCategory(item.value)}
                    className="group rounded-2xl border border-border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-gold"
                  >
                    <span className="text-4xl">{item.emoji}</span>
                    <h3 className="mt-4 font-display text-xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Start <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => chooseCategory("hair")}
                className="mt-6 w-full rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                🤷 Not Sure What to Book? — Let us help you
              </button>
            </>
          )}

          {category && step < currentQuestions.length && (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Start over
                </button>

                <span>
                  Step {step + 1} of {currentQuestions.length}
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

              <h2 className="mt-10 font-display text-2xl font-bold sm:text-3xl">
                {currentQuestion.question}
              </h2>

              <div className="mt-7 grid gap-3">
                {currentQuestion.options.map((option) => {
                  const selected = answers[step]?.value === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => chooseOption(option)}
                      className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                        selected
                          ? "border-primary bg-primary/10 shadow-gold"
                          : "border-border bg-background hover:border-primary/60"
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>

                      {selected ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : (
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {category && step >= currentQuestions.length && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-primary">
                Your personalised recommendation
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold">
                Your Beauty Plan
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
                {recommendation}
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <p className="text-sm text-muted-foreground">
                  Estimated starting price
                </p>

                <p className="mt-2 text-4xl font-bold text-primary">
                  ₹{total.toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Final price may vary after an in-person consultation.
                </p>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Book on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full border border-border px-7 py-3 font-semibold transition hover:bg-muted"
                >
                  Start Again
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-noir-muted">
          {SALON.name} • AI-assisted recommendations • Prices are estimates
        </p>
      </section>
    </main>
  );
}