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
  // Contact details — to be filled in once provided by the owner.
  phone: "",
  whatsapp: "", // e.g. "919999999999" (country code + number, no +)
  address: "",
  mapsUrl: "",
  hours: "",
} as const;

export const HAS_PHONE = SALON.phone.length > 0;
export const HAS_WHATSAPP = SALON.whatsapp.length > 0;
export const HAS_ADDRESS = SALON.address.length > 0;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SALON.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type GalleryImage = {
  src: string;
  alt: string;
  category: "Salon" | "Hair" | "Styling";
};

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: storefrontAsset.url,
    alt: "Sagar Family Salon storefront — internationally certified experts in hair & skin",
    category: "Salon",
  },
  {
    src: interiorChairsAsset.url,
    alt: "Styling chairs and workstations inside Sagar Family Salon",
    category: "Salon",
  },
  {
    src: interiorShelfAsset.url,
    alt: "Professional haircare and skincare product shelves at Sagar Family Salon",
    category: "Salon",
  },
  {
    src: equipmentAsset.url,
    alt: "Advanced skin treatment and Hydra Beauty equipment at Sagar Family Salon",
    category: "Salon",
  },
  {
    src: workBalayageAsset.url,
    alt: "Caramel balayage highlights with soft curls by Sagar Family Salon",
    category: "Hair",
  },
  {
    src: workWomensCutAsset.url,
    alt: "Women's layered haircut and blowout styling at Sagar Family Salon",
    category: "Hair",
  },
  {
    src: workBangsAsset.url,
    alt: "Fresh haircut with curtain bangs styled at Sagar Family Salon",
    category: "Styling",
  },
  {
    src: workFinishAsset.url,
    alt: "Sleek women's haircut finish by the Sagar Family Salon styling team",
    category: "Styling",
  },
  {
    src: workKidsAsset.url,
    alt: "Happy young guest after a kids' haircut at Sagar Family Salon",
    category: "Styling",
  },
];

export type ServiceCategory = {
  title: string;
  description: string;
  services: string[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
    title: "Waxing",
    description: "Gentle, hygienic hair removal for smooth skin.",
    services: ["Full arms", "Full legs", "Underarms", "Face & threading"],
  },
  {
    title: "Manicure & Pedicure",
    description:
      "Relaxing hand and foot care that leaves your nails clean, shaped and polished.",
    services: [
      "Classic manicure",
      "Classic pedicure",
      "Spa manicure",
      "Spa pedicure",
    ],
  },
  {
    title: "Makeup",
    description:
      "Flawless makeup for every occasion — from subtle party looks to full glam.",
    services: [
      "Party makeup",
      "Engagement makeup",
      "Eye makeup",
      "Saree draping",
    ],
  },
  {
    title: "Bridal Makeup",
    description:
      "A complete bridal experience — HD makeup, hairstyling and draping for your big day.",
    services: [
      "Bridal HD makeup",
      "Bridal hairstyle",
      "Pre-bridal packages",
      "Groom styling",
    ],
  },
  {
    title: "Hairstyling",
    description:
      "Occasion-ready hairstyles, from elegant buns to soft curls and braids.",
    services: [
      "Curls & waves",
      "Braids & buns",
      "Occasion hairstyling",
      "Hair ironing & smoothening",
    ],
  },
];
