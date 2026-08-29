import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Send,
  Sparkles,
  MessageCircle,
  CalendarCheck,
  RotateCcw,
} from "lucide-react";

import { SALON, whatsappLink } from "@/lib/salon";

export const Route = createFileRoute("/ai-chat")({
  component: AIChatPage,
});

type Message = {
  role: "user" | "assistant";
  text: string;
};

const QUICK_QUESTIONS = [
  "What haircut is best for me?",
  "I have dry and damaged hair",
  "Which facial should I choose?",
  "I need bridal makeup",
  "What services do you offer?",
  "Help me choose a service",
];

function getAIResponse(message: string): string {
  const text = message.toLowerCase().trim();

  if (!text) {
    return "Please type your question and I'll be happy to help. ✨";
  }

  if (
    text.includes("hair fall") ||
    text.includes("hair loss")
  ) {
    return "For hair fall concerns, we recommend starting with a professional scalp and hair consultation. Our team can understand your hair condition and suggest suitable salon treatments.";
  }

  if (
    text.includes("dry") ||
    text.includes("damaged") ||
    text.includes("frizzy")
  ) {
    return "For dry, damaged or frizzy hair, a nourishing hair spa or repair treatment can be a good starting point. Your stylist can assess your hair and recommend the right treatment.";
  }

  if (
    text.includes("haircut") ||
    text.includes("hair cut") ||
    text.includes("cut")
  ) {
    return "We offer men's, women's and kids' haircuts. If you're unsure about the style, our stylist can recommend a cut based on your face shape, hair texture and lifestyle.";
  }

  if (
    text.includes("colour") ||
    text.includes("color") ||
    text.includes("balayage") ||
    text.includes("highlight")
  ) {
    return "We offer global hair colour, root touch-up, grey coverage, highlights and balayage. Colour pricing can vary depending on hair length, thickness and product requirements.";
  }

  if (
    text.includes("facial") ||
    text.includes("skin") ||
    text.includes("cleanup") ||
    text.includes("clean up") ||
    text.includes("hydra")
  ) {
    return "For skin care, we offer express cleanup, signature facial, Hydra facial, de-tan treatment and skin polishing. If you're unsure, a quick consultation can help identify the most suitable option.";
  }

  if (
    text.includes("bridal") ||
    text.includes("wedding")
  ) {
    return "Congratulations! ❤️ We offer bridal HD makeup, bridal hairstyling, pre-bridal packages and groom styling. For wedding dates, we recommend booking early so your preferred slot can be reserved.";
  }

  if (
    text.includes("makeup") ||
    text.includes("party") ||
    text.includes("engagement")
  ) {
    return "We offer party makeup, engagement makeup, eye makeup and saree draping. You can also share a reference look with our makeup artist so the final style can be customised for you.";
  }

  if (
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost") ||
    text.includes("service")
  ) {
    return "You can view our complete services and starting prices on the Services & Pricing page. Prices may vary depending on hair length, product usage, treatment requirements and styling complexity.";
  }

  if (
    text.includes("book") ||
    text.includes("appointment") ||
    text.includes("booking")
  ) {
    return "Absolutely! ❤️ You can book an appointment through our booking form or contact us directly on WhatsApp. We'll confirm whether your preferred date and time are available.";
  }

  if (
    text.includes("where") ||
    text.includes("location") ||
    text.includes("address")
  ) {
    return `We are located at ${SALON.address}. Our salon is open ${SALON.hours}.`;
  }

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("hello")
  ) {
    return "Hello! 👋 Welcome to Sagar Family Salon's Beauty Concierge. I'm here to help you choose the right hair, skin or makeup service. What would you like help with?";
  }

  return "I'd be happy to help! ✨ You can ask me about haircuts, hair colour, facials, skin care, makeup, bridal services, pricing or appointments.";
}

function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! 👋 Welcome to Sagar Family Salon's Beauty Concierge. I'm here to help you choose the right hair, skin or makeup service. What would you like help with?",
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  function sendMessage(message?: string) {
    const value = (message ?? input).trim();

    if (!value || sending) return;

    const userMessage: Message = {
      role: "user",
      text: value,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setSending(true);

    window.setTimeout(() => {
      const response: Message = {
        role: "assistant",
        text: getAIResponse(value),
      };

      setMessages((current) => [
        ...current,
        response,
      ]);

      setSending(false);
    }, 600);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    sendMessage();
  }

  function resetChat() {
    setMessages([
      {
        role: "assistant",
        text: "Hello! 👋 Welcome to Sagar Family Salon's Beauty Concierge. I'm here to help you choose the right hair, skin or makeup service. What would you like help with?",
      },
    ]);

    setInput("");
    setSending(false);
  }

  function bookOnWhatsApp() {
    const message =
      "Hello Sagar Family Salon 👋\n\nI would like help with choosing a beauty service. Please assist me with a suitable service and appointment.";

    window.location.href = whatsappLink(message);
  }

  return (
    <main className="min-h-screen bg-noir text-noir-foreground">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 lg:py-12">
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            AI Beauty Concierge
          </p>

          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            How can we help you?
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-noir-muted">
            Ask anything about hair, skin, makeup, bridal services,
            pricing or appointments.
          </p>
        </div>

        {/* CHAT CARD */}
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-3xl border border-gold/20 bg-white/[0.04] shadow-2xl">
          {/* CHAT HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
                <Bot className="h-5 w-5 text-gold" />
              </div>

              <div>
                <p className="font-semibold">
                  Sagar Beauty Concierge
                </p>

                <p className="text-xs text-noir-muted">
                  Online • Ready to help ✨
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetChat}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-noir-muted transition hover:border-gold/40 hover:text-gold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-white/10 bg-white/5 text-noir-foreground"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gold">
                      <Bot className="h-3.5 w-3.5" />
                      Beauty Concierge
                    </div>
                  )}

                  {message.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-bl-md border border-white/10 bg-white/5 px-5 py-3 text-sm text-noir-muted">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce [animation-delay:150ms]">
                      •
                    </span>
                    <span className="animate-bounce [animation-delay:300ms]">
                      •
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* QUICK QUESTIONS */}
          <div className="border-t border-white/10 px-5 py-4 sm:px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-noir-muted">
              Quick questions
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={sending}
                  onClick={() => sendMessage(question)}
                  className="whitespace-nowrap rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-xs font-medium text-gold transition hover:border-gold/50 hover:bg-gold/10 disabled:opacity-40"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-4 sm:p-5"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 focus-within:border-gold/40">
              <input
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                disabled={sending}
                placeholder="Ask your beauty question..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-noir-muted"
                maxLength={500}
                autoComplete="off"
              />

              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mx-auto mt-5 grid w-full max-w-4xl gap-3 sm:grid-cols-2">
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Appointment
          </a>

          <button
            type="button"
            onClick={bookOnWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition hover:scale-[1.01]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </button>
        </div>

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-noir-muted">
          AI Beauty Concierge provides general beauty guidance.
          For medical, dermatological or serious hair/skin concerns,
          please consult a qualified professional.
        </p>
      </section>
    </main>
  );
}