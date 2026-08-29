import logoAsset from "@/assets/logo.asset.json";
import storefrontAsset from "@/assets/storefront.asset.json";
import interiorShelfAsset from "@/assets/interior-shelf.asset.json";
import equipmentAsset from "@/assets/equipment.asset.json";
import interiorChairsAsset from "@/assets/interior-chairs.asset.json";
import workBalayageAsset from "@/assets/work-balayage.asset.json";
import workKidsAsset from "@/assets/work-kids.asset.json";
import workWomensCutAsset from "@/assets/work-womens-cut.asset.json";
import workBangsAsset from "@/assets/work-bangs.asset.json";
import workFinishAsset from "@/assets/work-finish.asset.json";

export const SALON = {
  name: "Sagar Family Salon",
  tagline: "Expert care in hair & skin for the whole family",
  logo: logoAsset.url,
  phone: "+917841950095",
  whatsapp: "917841950095", // country code + number, no spaces or +
  email: "", // booking notification email, set via SALON_BOOKING_EMAIL secret
  address:
    "Sagar Family Salon, Hakimi Hospital Building, Hanuman Chowk, Near Maharashtra Bank, Malkapur, Maharashtra – 443101",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sagar+Family+Salon+Hakimi+Hospital+Building+Hanuman+Chowk+Malkapur+Maharashtra+443101",
  hours: "Monday – Sunday, 10:00 AM – 8:00 PM",
} as const;

export const HAS_PHONE = SALON.phone.length > 0;
export const HAS_WHATSAPP = SALON.whatsapp.length > 0;
export const HAS_ADDRESS = SALON.address.length > 0;
export const HAS_EMAIL = SALON.email.length > 0;

export function displayPhone(phone: string): string {
  // Format E.164 Indian mobile as +91 78419 50095
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    const digits = cleaned.slice(2);
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SALON.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  category: "Salon" | "Hair" | "Styling";
};

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: storefrontAsset.url,
    alt: "Sagar Family Salon storefront — internationally certified experts in hair & skin",
    caption: "Our storefront — internationally certified experts in hair & skin",
    category: "Salon",
  },
  {
    src: interiorChairsAsset.url,
    alt: "Styling chairs and workstations inside Sagar Family Salon",
    caption: "Modern styling chairs and advanced skincare equipment",
    category: "Salon",
  },
  {
    src: interiorShelfAsset.url,
    alt: "Professional haircare and skincare product shelves at Sagar Family Salon",
    caption: "Professional haircare & skincare products we trust",
    category: "Salon",
  },
  {
    src: equipmentAsset.url,
    alt: "Advanced skin treatment and Hydra Beauty equipment at Sagar Family Salon",
    caption: "Advanced Hydra Beauty skin treatment technology",
    category: "Salon",
  },
  {
    src: workBalayageAsset.url,
    alt: "Caramel balayage highlights with soft curls by Sagar Family Salon",
    caption: "Caramel balayage with soft curls",
    category: "Hair",
  },
  {
    src: workWomensCutAsset.url,
    alt: "Women's layered haircut and blowout styling at Sagar Family Salon",
    caption: "Fresh layered haircut, styled to finish",
    category: "Hair",
  },
  {
    src: workBangsAsset.url,
    alt: "Fresh haircut with curtain bangs styled at Sagar Family Salon",
    caption: "New curtain bangs for a happy guest",
    category: "Styling",
  },
  {
    src: workFinishAsset.url,
    alt: "Sleek women's haircut finish by the Sagar Family Salon styling team",
    caption: "A finished blowout, ready for the day",
    category: "Styling",
  },
  {
    src: workKidsAsset.url,
    alt: "Happy young guest after a kids' haircut at Sagar Family Salon",
    caption: "Thumbs up after a kids' haircut",
    category: "Styling",
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  services: string[];
  faqs: Faq[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "haircut-styling",
    title: "Haircut & Styling",
    description:
      "Precision cuts and styling for men, women and kids — tailored to your face shape and lifestyle.",
    services: [
      "Men's haircut",
      "Women's haircut",
      "Kids' haircut",
      "Blow-dry & styling",
      "Beard trim & shaping",
    ],
    faqs: [
      {
        question: "How often should I get a haircut?",
        answer:
          "For most styles, every 4–6 weeks keeps the shape fresh. Shorter styles and fades may need a tidy-up every 2–3 weeks.",
      },
      {
        question: "Do you cut children's hair?",
        answer:
          "Yes — we're a family salon and love having young guests. Our stylists are patient and make the experience fun and comfortable for kids.",
      },
      {
        question: "Should I wash my hair before my appointment?",
        answer:
          "There's no need — we wash and prep your hair at the salon as part of the service, so just come as you are.",
      },
    ],
  },
  {
    id: "hair-colour",
    title: "Hair Colour",
    description:
      "From natural grey coverage to fashion highlights and balayage, using professional colour ranges.",
    services: [
      "Global hair colour",
      "Highlights & balayage",
      "Root touch-up",
      "Grey coverage",
      "Hair spa & treatments",
    ],
    faqs: [
      {
        question: "How long does hair colour last?",
        answer:
          "Global colour typically stays vibrant for 4–8 weeks depending on the shade and your hair care routine. Balayage grows out softly and can last much longer between visits.",
      },
      {
        question: "Will colouring damage my hair?",
        answer:
          "We use professional-grade colour and always assess your hair's condition first. Pairing colour with a hair spa or treatment keeps it healthy, soft and shiny.",
      },
      {
        question: "Do I need a patch test?",
        answer:
          "Yes — for your safety we recommend a quick patch test at least 24–48 hours before your first colour service with us. It's free and takes only a minute.",
      },
    ],
  },
  {
    id: "facial-cleanup",
    title: "Facial & Cleanup",
    description:
      "Skin care powered by professional products and advanced Hydra Beauty technology.",
    services: [
      "Express cleanup",
      "Signature facial",
      "Hydra facial",
      "De-tan treatment",
      "Skin polishing",
    ],
    faqs: [
      {
        question: "What's the difference between a cleanup and a facial?",
        answer:
          "A cleanup is a quick refresh — cleansing, exfoliation and hydration in about 30 minutes. A facial is a deeper, longer treatment that targets specific concerns like dullness, tanning or dryness.",
      },
      {
        question: "Is the Hydra facial suitable for sensitive skin?",
        answer:
          "Yes. The Hydra Beauty treatment is gentle and non-irritating, and our team adjusts the products and intensity to suit your skin type after a quick consultation.",
      },
      {
        question: "How often should I get a facial?",
        answer:
          "Once every 4–6 weeks is ideal for most skin types, matching your skin's natural renewal cycle.",
      },
    ],
  },
  {
    id: "makeup",
    title: "Makeup",
    description:
      "Flawless makeup for every occasion — from subtle party looks to full glam.",
    services: [
      "Party makeup",
      "Engagement makeup",
      "Eye makeup",
      "Saree draping",
    ],
    faqs: [
      {
        question: "How long does a makeup session take?",
        answer:
          "A party or engagement look usually takes 60–90 minutes. We recommend arriving with a clean, moisturised face for the best result.",
      },
      {
        question: "Can you match a look from a photo?",
        answer:
          "Absolutely — bring a reference photo and our makeup artist will adapt the look to suit your features, outfit and the occasion.",
      },
      {
        question: "Do you offer saree draping on its own?",
        answer:
          "Yes, you can book saree draping separately or together with any makeup service.",
      },
    ],
  },
  {
    id: "bridal-makeup",
    title: "Bridal Makeup",
    description:
      "A complete bridal experience — HD makeup, hairstyling and draping for your big day.",
    services: [
      "Bridal HD makeup",
      "Bridal hairstyle",
      "Pre-bridal packages",
      "Groom styling",
    ],
    faqs: [
      {
        question: "How early should I book my bridal makeup?",
        answer:
          "We recommend booking 4–8 weeks in advance, especially during wedding season, so we can reserve your date and plan a trial session.",
      },
      {
        question: "Do you offer a bridal trial?",
        answer:
          "Yes — a trial lets us finalise your look, test products on your skin and make sure everything is perfect before the big day.",
      },
      {
        question: "What's included in pre-bridal packages?",
        answer:
          "Pre-bridal packages combine facials, de-tan, hair spa and polishing sessions in the weeks leading up to your wedding. We customise the plan after a consultation.",
      },
    ],
  },
  {
    id: "hairstyling",
    title: "Hairstyling",
    description:
      "Occasion-ready hairstyles, from elegant buns to soft curls and braids.",
    services: [
      "Curls & waves",
      "Braids & buns",
      "Occasion hairstyling",
      "Hair ironing & smoothening",
    ],
    faqs: [
      {
        question: "Can you recreate a hairstyle from a photo?",
        answer:
          "Yes — show us a reference and we'll adapt it to your hair length, texture and the occasion.",
      },
      {
        question: "How long does occasion styling take?",
        answer:
          "Most styles take 30–60 minutes. Intricate braids or bridal hairstyles can take a little longer — we'll confirm the timing when you book.",
      },
      {
        question: "How long does hair smoothening last?",
        answer:
          "Smoothening typically lasts 3–6 months depending on your hair type and aftercare. We'll recommend the right aftercare products to make it last.",
      },
    ],
  },
];
export const SERVICE_PRICES = [
  {
    category: "Haircut & Styling",
    services: [
      { name: "Men's Haircut", price: 250 },
      { name: "Women's Haircut", price: 500 },
      { name: "Kids' Haircut", price: 200 },
      { name: "Blow-dry & Styling", price: 400 },
      { name: "Beard Trim & Shaping", price: 200 },
    ],
  },

  {
    category: "Hair Colour",
    services: [
      { name: "Global Hair Colour", price: 1500 },
      { name: "Highlights", price: 1800 },
      { name: "Balayage", price: 2500 },
      { name: "Root Touch-up", price: 800 },
      { name: "Grey Coverage", price: 1000 },
    ],
  },

  {
    category: "Facial & Cleanup",
    services: [
      { name: "Express Cleanup", price: 400 },
      { name: "Signature Facial", price: 800 },
      { name: "Hydra Facial", price: 1200 },
      { name: "De-tan Treatment", price: 600 },
      { name: "Skin Polishing", price: 900 },
    ],
  },

  {
    category: "Makeup",
    services: [
      { name: "Party Makeup", price: 1500 },
      { name: "Engagement Makeup", price: 2500 },
      { name: "Eye Makeup", price: 800 },
      { name: "Saree Draping", price: 500 },
    ],
  },

  {
    category: "Bridal Makeup",
    services: [
      { name: "Bridal HD Makeup", price: 8000 },
      { name: "Bridal Hairstyle", price: 2000 },
      { name: "Pre-Bridal Package", price: 5000 },
      { name: "Groom Styling", price: 1500 },
    ],
  },

  {
    category: "Hairstyling",
    services: [
      { name: "Curls & Waves", price: 800 },
      { name: "Braids & Buns", price: 1000 },
      { name: "Occasion Hairstyling", price: 1200 },
      { name: "Hair Ironing & Smoothening", price: 2500 },
    ],
  },
];
