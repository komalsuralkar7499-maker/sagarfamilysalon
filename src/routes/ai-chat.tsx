import { useState, type FormEvent } from "react";
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

const WELCOME_MESSAGE =
  "Hello! 👋 Welcome to Sagar Family Salon's Beauty Concierge. I'm here to help you choose the right hair, skin or makeup service. What would you like help with?";

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
    return WELCOME_MESSAGE;
  }

  return "I'd be happy to help! ✨ You can ask me about haircuts, hair colour, facials, skin care, makeup, bridal services, pricing or appointments.";
}

function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: WELCOME_MESSAGE,
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  function sendMessage(message?: string) {
    const value = (message ?? input).trim();

    if (!value || sending) {
      return;
    }

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
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    sendMessage();
  }

  function resetChat() {
    setMessages([
      {
        role: "assistant",
        text: WELCOME_MESSAGE,
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
                 