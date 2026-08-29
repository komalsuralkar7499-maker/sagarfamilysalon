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

import {
  SALON,
  SERVICE_PRICES,
  whatsappLink,
} from "@/lib/salon";

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
  "Show me pricing",
];

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function getAllPricingText() {
  return SERVICE_PRICES.map((category) => {
    const services = category.services
      .map(
        (service) =>
          `• ${service.name} — ${formatPrice(service.price)}`,
      )
      .join("\n");

    return `\n${category.category}\n${services}`;
  }).join("\n");
}

function getCategoryPricing(
  categoryName: string,
) {
  const category = SERVICE_PRICES.find(
    (item) =>
      item.category.toLowerCase() ===
      categoryName.toLowerCase(),
  );

  if (!category) {
    return null;
  }

  return `${category.category}\n\n${category.services
    .map(
      (service) =>
        `• ${service.name} — ${formatPrice(service.price)}`,
    )
    .join("\n")}`;
}

function getSpecificServicePrice(
  message: string,
) {
  const text = message.toLowerCase();

  const aliases: Record<string, string[]> = {
    "men's haircut": [
      "men haircut",
      "men's haircut",
      "mens haircut",
      "male haircut",
      "gents haircut",
    ],

    "women's haircut": [
      "women haircut",
      "women's haircut",
      "womens haircut",
      "ladies haircut",
      "female haircut",
    ],

    "kids' haircut": [
      "kids haircut",
      "kid haircut",
      "children haircut",
      "child haircut",
    ],

    "blow-dry & styling": [
      "blow dry",
      "blow-dry",
      "blow dry styling",
    ],

    "beard trim & shaping": [
      "beard trim",
      "beard shaping",
      "beard",
    ],

    "global hair colour": [
      "global colour",
      "global color",
      "global hair colour",
      "global hair color",
    ],

    highlights: [
      "highlights",
      "highlight",
    ],

    balayage: [
      "balayage",
    ],

    "root touch-up": [
      "root touch up",
      "root touch-up",
      "root colour",
      "root color",
    ],

    "grey coverage": [
      "grey coverage",
      "gray coverage",
      "grey colour",
      "gray color",
    ],

    "express cleanup": [
      "express cleanup",
      "cleanup",
      "clean up",
    ],

    "signature facial": [
      "signature facial",
    ],

    "hydra facial": [
      "hydra facial",
      "hydrafacial",
      "hydra",
    ],

    "de-tan treatment": [
      "de-tan",
      "detan",
      "de tan",
    ],

    "skin polishing": [
      "skin polishing",
      "skin polish",
    ],

    "party makeup": [
      "party makeup",
    ],

    "engagement makeup": [
      "engagement makeup",
      "engagement",
    ],

    "eye makeup": [
      "eye makeup",
    ],

    "saree draping": [
      "saree draping",
      "saree",
      "sari draping",
    ],

    "bridal hd makeup": [
      "bridal makeup",
      "bridal hd makeup",
      "bridal hd",
      "bride makeup",
    ],

    "bridal hairstyle": [
      "bridal hairstyle",
      "bridal hair",
    ],

    "pre-bridal package": [
      "pre bridal",
      "pre-bridal",
      "pre bridal package",
    ],

    "groom styling": [
      "groom styling",
      "groom",
    ],

    "curls & waves": [
      "curls",
      "waves",
      "curls and waves",
    ],

    "braids & buns": [
      "braids",
      "buns",
      "braids and buns",
    ],

    "occasion hairstyling": [
      "occasion hairstyling",
      "occasion hair",
      "hairstyling",
    ],

    "hair ironing & smoothening": [
      "hair ironing",
      "ironing",
      "smoothening",
      "hair smoothening",
    ],
  };

  for (const category of SERVICE_PRICES) {
    for (const service of category.services) {
      const serviceName = service.name.toLowerCase();

      const matchedAlias = aliases[serviceName]?.some(
        (alias) => text.includes(alias),
      );

      if (
        text.includes(serviceName) ||
        matchedAlias
      ) {
        return {
          name: service.name,
          price: service.price,
          category: category.category,
        };
      }
    }
  }

  return null;
}

function getAIResponse(message: string): string {
  const text = message.toLowerCase().trim();

  if (!text) {
    return "Please type your question and I'll be happy to help. ✨";
  }

  /*
   * =========================================================
   * PRICING
   * =========================================================
   */

  const isPriceQuestion =
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost") ||
    text.includes("charge") ||
    text.includes("rate") ||
    text.includes("how much") ||
    text.includes("kitna") ||
    text.includes("kitne") ||
    text.includes("rupay") ||
    text.includes("₹");

  if (isPriceQuestion) {
    const specificService =
      getSpecificServicePrice(text);

    if (specificService) {
      return `💰 ${specificService.name}\n\nPrice: ${formatPrice(
        specificService.price,
      )}\n\nCategory: ${specificService.category}\n\nPlease note: final pricing may vary for certain services depending on hair length, thickness, product usage or styling requirements.\n\nWould you like to book this service? ❤️`;
    }

    /*
     * CATEGORY-SPECIFIC PRICING
     */

    if (
      text.includes("haircut") ||
      text.includes("hair cut") ||
      text.includes("cut price")
    ) {
      return `✂️ Haircut & Styling Prices\n\n${getCategoryPricing(
        "Haircut & Styling",
      )}`;
    }

    if (
      text.includes("colour") ||
      text.includes("color") ||
      text.includes("balayage") ||
      text.includes("highlight")
    ) {
      return `🎨 Hair Colour Prices\n\n${getCategoryPricing(
        "Hair Colour",
      )}`;
    }

    if (
      text.includes("facial") ||
      text.includes("skin") ||
      text.includes("cleanup") ||
      text.includes("hydra")
    ) {
      return `✨ Facial & Cleanup Prices\n\n${getCategoryPricing(
        "Facial & Cleanup",
      )}`;
    }

    if (
      text.includes("makeup") ||
      text.includes("party") ||
      text.includes("engagement")
    ) {
      return `💄 Makeup Prices\n\n${getCategoryPricing(
        "Makeup",
      )}`;
    }

    if (
      text.includes("bridal") ||
      text.includes("wedding") ||
      text.includes("bride")
    ) {
      return `👰 Bridal Makeup Prices\n\n${getCategoryPricing(
        "Bridal Makeup",
      )}`;
    }

    if (
      text.includes("hairstyling") ||
      text.includes("hairstyle") ||
      text.includes("hair style")
    ) {
      return `💇 Hairstyling Prices\n\n${getCategoryPricing(
        "Hairstyling",
      )}`;
    }

    /*
     * COMPLETE PRICE LIST
     */

    return `💰 Sagar Family Salon — Services & Pricing\n\nHere are our current service prices:${getAllPricingText()}\n\n✨ Prices may vary for certain services depending on hair length, thickness, product usage and styling requirements.\n\nWould you like help choosing a service?`;
  }

  /*
   * =========================================================
   * HAIR FALL
   * =========================================================
   */

  if (
    text.includes("hair fall") ||
    text.includes("hair loss") ||
    text.includes("hairfall")
  ) {
    return "For hair fall concerns, we recommend starting with a professional scalp and hair consultation. Our team can understand your hair condition and suggest suitable salon treatments.";
  }

  /*
   * =========================================================
   * DRY / DAMAGED / FRIZZY HAIR
   * =========================================================
   */

  if (
    text.includes("dry") ||
    text.includes("damaged") ||
    text.includes("frizzy") ||
    text.includes("rough hair")
  ) {
    return "For dry, damaged or frizzy hair, a nourishing hair spa or repair treatment can be a good starting point. Your stylist can assess your hair and recommend the right treatment.";
  }

  /*
   * =========================================================
   * HAIRCUT
   * =========================================================
   */

  if (
    text.includes("haircut") ||
    text.includes("hair cut") ||
    text === "cut"
  ) {
    return "✂️ We offer men's, women's and kids' haircuts.\n\nIf you're unsure about the right style, our stylist can recommend a cut based on your face shape, hair texture and lifestyle.\n\nStarting prices:\n• Men's Haircut — ₹250\n• Women's Haircut — ₹500\n• Kids' Haircut — ₹200";
  }

  /*
   * =========================================================
   * HAIR COLOUR
   * =========================================================
   */

  if (
    text.includes("colour") ||
    text.includes("color") ||
    text.includes("balayage") ||
    text.includes("highlight")
  ) {
    return "🎨 We offer global hair colour, highlights, balayage, root touch-up and grey coverage.\n\nStarting prices:\n• Global Hair Colour — ₹1,500\n• Highlights — ₹1,800\n• Balayage — ₹2,500\n• Root Touch-up — ₹800\n• Grey Coverage — ₹1,000\n\nColour pricing may vary depending on hair length, thickness and product requirements.";
  }

  /*
   * =========================================================
   * FACIAL / SKIN
   * =========================================================
   */

  if (
    text.includes("facial") ||
    text.includes("skin") ||
    text.includes("cleanup") ||
    text.includes("clean up") ||
    text.includes("hydra")
  ) {
    return "✨ For skin care, we offer express cleanup, signature facial, Hydra facial, de-tan treatment and skin polishing.\n\nPrices:\n• Express Cleanup — ₹400\n• Signature Facial — ₹800\n• Hydra Facial — ₹1,200\n• De-tan Treatment — ₹600\n• Skin Polishing — ₹900\n\nIf you're unsure which facial is right for you, our team can help after a quick consultation.";
  }

  /*
   * =========================================================
   * BRIDAL
   * =========================================================
   */

  if (
    text.includes("bridal") ||
    text.includes("wedding") ||
    text.includes("bride")
  ) {
    return "Congratulations! ❤️ We offer bridal HD makeup, bridal hairstyling, pre-bridal packages and groom styling.\n\nBridal prices:\n• Bridal HD Makeup — ₹8,000\n• Bridal Hairstyle — ₹2,000\n• Pre-Bridal Package — ₹5,000\n• Groom Styling — ₹1,500\n\nFor wedding dates, we recommend booking early so your preferred slot can be reserved.";
  }

  /*
   * =========================================================
   * MAKEUP
   * =========================================================
   */

  if (
    text.includes("makeup") ||
    text.includes("party") ||
    text.includes("engagement")
  ) {
    return "💄 We offer party makeup, engagement makeup, eye makeup and saree draping.\n\nPrices:\n• Party Makeup — ₹1,500\n• Engagement Makeup — ₹2,500\n• Eye Makeup — ₹800\n• Saree Draping — ₹500\n\nYou can also share a reference look with our makeup artist so the final style can be customised for you.";
  }

  /*
   * =========================================================
   * HAIRSTYLING
   * =========================================================
   */

  if (
    text.includes("hairstyle") ||
    text.includes("hair style") ||
    text.includes("hairstyling") ||
    text.includes("curls") ||
    text.includes("braids") ||
    text.includes("buns")
  ) {
    return "💇 Our hairstyling services include:\n\n• Curls & Waves — ₹800\n• Braids & Buns — ₹1,000\n• Occasion Hairstyling — ₹1,200\n• Hair Ironing & Smoothening — ₹2,500\n\nShow us a reference photo and our stylist can adapt the hairstyle to your hair length and texture.";
  }

  /*
   * =========================================================
   * SERVICES
   * =========================================================
   */

  if (
    text.includes("service") ||
    text.includes("services") ||
    text.includes("what do you offer")
  ) {
    return "✨ Sagar Family Salon offers:\n\n✂️ Haircut & Styling\n🎨 Hair Colour\n✨ Facial & Cleanup\n💄 Makeup\n👰 Bridal Makeup\n💇 Hairstyling\n\nYou can ask me something like:\n\n• What is the price of a haircut?\n• How much is a facial?\n• What is the bridal makeup price?\n• Show me all prices.";
  }

  /*
   * =========================================================
   * BOOKING
   * =========================================================
   */

  if (
    text.includes("book") ||
    text.includes("appointment") ||
    text.includes("booking")
  ) {
    return "Absolutely! ❤️ You can book an appointment through our booking form or contact us directly on WhatsApp. We'll confirm whether your preferred date and time are available.";
  }

  /*
   * =========================================================
   * LOCATION
   * =========================================================
   */

  if (
    text.includes("where") ||
    text.includes("location") ||
    text.includes("address")
  ) {
    return `📍 We are located at:\n\n${SALON.address}\n\n🕐 Opening Hours:\n${SALON.hours}`;
  }

  /*
   * =========================================================
   * GREETING
   * =========================================================
   */

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("hello")
  ) {
    return "Hello! 👋 Welcome to Sagar Family Salon's Beauty Concierge. I'm here to help you choose the right hair, skin or makeup service. What would you like help with?";
  }

  /*
   * =========================================================
   * DEFAULT
   * =========================================================
   */

  return "I'd be happy to help! ✨ You can ask me about:\n\n✂️ Haircuts\n🎨 Hair Colour\n✨ Facials & Skin Care\n💄 Makeup\n👰 Bridal Services\n💇 Hairstyling\n💰 Pricing\n📅 Appointments";
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
                  className={`max-w-[85%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
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
                    <span className="animate-bounce">
                      •
                    </span>

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