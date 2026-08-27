import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Camera,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/ai-consultation")({
  component: AIConsultation,
});

function AIConsultation() {
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState("");
  const [hairType, setHairType] = useState("");
  const [goal, setGoal] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getRecommendation = () => {
    if (concern === "Hair Fall") {
      return "We recommend a gentle hair-care routine, scalp-focused treatments and a professional consultation with our salon experts.";
    }

    if (concern === "Dry & Damaged Hair") {
      return "Your hair would benefit from deep conditioning, repair treatments and a nourishing professional hair-care routine.";
    }

    if (concern === "Dull Skin") {
      return "A hydrating facial and professional skin consultation can help restore freshness, glow and hydration.";
    }

    if (concern === "Acne / Blemishes") {
      return "Choose gentle, non-irritating skin care and speak with a qualified skin professional before selecting intensive treatments.";
    }

    return "Based on your answers, our beauty experts can recommend a personalised salon routine for you.";
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-noir px-4 py-16 text-noir-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/15">
            <CheckCircle2 className="h-10 w-10 text-gold" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            Your Beauty Plan
          </p>

          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Your Personalised Consultation
          </h1>

          <div className="mt-8 rounded-3xl border border-gold/20 bg-white/5 p-6 text-left shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Our Recommendation</h2>
            </div>

            <p className="leading-7 text-noir-muted">
              {getRecommendation()}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gold">
                  Concern
                </p>
                <p className="mt-1 font-medium">{concern || "General"}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gold">
                  Hair Type
                </p>
                <p className="mt-1 font-medium">{hairType || "Not specified"}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gold">
                  Goal
                </p>
                <p className="mt-1 font-medium">{goal || "Not specified"}</p>
              </div>
            </div>

            <a
              href="/contact"
              className="mt-7 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02]"
            >
              Book Your Consultation
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
            }}
            className="mt-6 inline-flex items-center gap-2 text-sm text-noir-muted hover:text-gold"
          >
            <RotateCcw className="h-4 w-4" />
            Start Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-noir text-noir-foreground">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            AI Beauty Consultant
          </p>

          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
            Discover Your Perfect Beauty Routine
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-noir-muted">
            Answer a few simple questions and get a personalised beauty
            recommendation designed around your hair, skin and beauty goals.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3].map((number) => (
              <div key={number} className="flex items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    step >= number
                      ? "bg-gold text-black"
                      : "bg-white/10 text-noir-muted"
                  }`}
                >
                  {number}
                </div>

                {number < 3 && (
                  <div
                    className={`h-px w-10 sm:w-20 ${
                      step > number ? "bg-gold" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-gold/20 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  What would you like help with?
                </h2>

                <p className="mt-2 text-sm text-noir-muted">
                  Choose your main beauty concern.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Hair Fall",
                    "Dry & Damaged Hair",
                    "Dull Skin",
                    "Acne / Blemishes",
                    "Hair Styling",
                    "Bridal / Makeup",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => setConcern(item)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        concern === item
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-white/10 hover:border-gold/40"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!concern}
                  onClick={() => setStep(2)}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  Tell us about your hair
                </h2>

                <p className="mt-2 text-sm text-noir-muted">
                  This helps us make your recommendation more relevant.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["Straight", "Wavy", "Curly", "Very Curly"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setHairType(item)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        hairType === item
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-white/10 hover:border-gold/40"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <label className="mt-6 block cursor-pointer rounded-2xl border border-dashed border-gold/30 p-6 text-center hover:bg-gold/5">
                  <Camera className="mx-auto h-7 w-7 text-gold" />

                  <p className="mt-2 font-medium">
                    {photo ? "Photo selected ✓" : "Upload a photo"}
                  </p>

                  <p className="mt-1 text-xs text-noir-muted">
                    Optional • JPG or PNG
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="hidden"
                  />
                </label>

                {photo && (
                  <img
                    src={photo}
                    alt="Uploaded consultation"
                    className="mx-auto mt-4 h-28 w-28 rounded-2xl object-cover"
                  />
                )}

                <div className="mt-7 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full border border-white/10 px-5 py-3 font-medium"
                  >
                    Back
                  </button>

                  <button
                    disabled={!hairType}
                    onClick={() => setStep(3)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  What is your beauty goal?
                </h2>

                <p className="mt-2 text-sm text-noir-muted">
                  Pick the result you would love to achieve.
                </p>

                <div className="mt-6 grid gap-3">
                  {[
                    "Healthy & Shiny",
                    "Fresh & Natural",
                    "Premium Salon Look",
                    "Bridal / Special Occasion",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => setGoal(item)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        goal === item
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-white/10 hover:border-gold/40"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-7 flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-full border border-white/10 px-5 py-3 font-medium"
                  >
                    Back
                  </button>

                  <button
                    disabled={!goal}
                    onClick={() => setSubmitted(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    Get My Beauty Plan
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-5 text-center text-xs text-noir-muted">
            This consultation provides general beauty guidance and does not
            replace professional medical or dermatological advice.
          </p>
        </div>
      </section>
    </main>
  );
}