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
  const text = message.toLowerCase();

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
    text.includes("appointment")
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
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
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
    const value = (message ??