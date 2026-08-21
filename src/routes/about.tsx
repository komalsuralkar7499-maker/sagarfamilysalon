import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { BookAppointmentCta } from "@/components/cta-buttons";
import storefrontAsset from "@/assets/storefront.asset.json";
import interiorShelfAsset from "@/assets/interior-shelf.asset.json";
import equipmentAsset from "@/assets/equipment.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Sagar Family Salon" },
      {
        name: "description",
        content:
          "Learn about Sagar Family Salon — internationally certified experts in hair & skin, serving the whole family with professional care and modern equipment.",
      },
      { property: "og:title", content: "About Us — Sagar Family Salon" },
      {
        property: "og:description",
        content:
          "Internationally certified experts in hair & skin, serving the whole family with professional care.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Award,
    title: "Certified Expertise",
    text: "Our team is internationally certified in hair & skin care, and we keep learning new techniques and trends.",
  },
  {
    icon: Heart,
    title: "Family First",
    text: "We're a true family salon — comfortable for men, women and kids alike, with care tailored to every age.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene & Safety",
    text: "Sanitized tools, clean stations and professional-grade products on every single visit.",
  },
  {
    icon: Sparkles,
    title: "Modern Technology",
    text: "Advanced equipment like our Hydra Beauty skin system brings salon-grade results to every treatment.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            About us
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            The story behind <span className="text-gold-gradient">Sagar Family Salon</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-noir-muted">
            A neighbourhood salon built on skill, honesty and genuine care for
            every guest who sits in our chair.
          </p>
        </div>
        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Expert care for hair &amp; skin
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Sagar Family Salon was founded with a simple goal: to bring
              internationally certified hair and skin expertise to our
              community, in a space where the whole family feels at home.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From everyday haircuts and beard styling to advanced facials,
              hair colour and bridal makeup, every service is delivered with
              the same attention to detail. We listen first, recommend
              honestly, and never rush a guest out of the chair.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our salon is equipped with modern stations, professional product
              ranges and advanced skin-care technology — because great results
              start with great tools.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={storefrontAsset.url}
              alt="Sagar Family Salon storefront — internationally certified experts in hair & skin"
              className="h-full w-full object-cover"
              width={720}
              height={960}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              What we stand for
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <article
                key={v.title}
                className="rounded-2xl bg-card p-6 shadow-elegant"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={interiorShelfAsset.url}
              alt="Professional haircare and skincare product shelves at Sagar Family Salon"
              className="h-full w-full object-cover"
              width={720}
              height={1612}
              loading="lazy"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={equipmentAsset.url}
              alt="Advanced skin treatment and Hydra Beauty equipment at Sagar Family Salon"
              className="h-full w-full object-cover"
              width={720}
              height={1020}
              loading="lazy"
            />
          </div>
        </div>
        <div className="mt-12 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Come experience it yourself
          </h2>
          <div className="mt-6">
            <BookAppointmentCta />
          </div>
        </div>
      </section>
    </>
  );
}
