import { useMemo, useState } from "react";
import { Calculator, CheckCircle2 } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/salon";

export function SmartPriceEstimator() {
  const [service, setService] = useState("");
  const [quantity, setQuantity] = useState("1");

  const selectedService = useMemo(() => {
    for (const category of SERVICE_CATEGORIES) {
      const match = category.services.find(
        (item) => item === service,
      );

      if (match) {
        return {
          category: category.title,
          service: match,
        };
      }
    }

    return null;
  }, [service]);

  return (
    <section className="rounded-3xl bg-noir p-6 text-noir-foreground shadow-elegant sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Calculator className="h-7 w-7" />
        </div>

        <p className="mt-5 text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Smart Price Estimator
        </p>

        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Estimate your service
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-noir-muted">
          Select a service to see its starting price and plan your visit.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-5">
        <div>
          <label
            htmlFor="price-service"
            className="mb-2 block text-sm font-medium"
          >
            Choose a service
          </label>

          <select
            id="price-service"
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-noir-foreground outline-none focus:border-gold"
          >
            <option value="" className="text-black">
              Select a service
            </option>

            {SERVICE_CATEGORIES.map((category) => (
              <optgroup
                key={category.id}
                label={category.title}
                className="text-black"
              >
                {category.services.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="text-black"
                  >
                    {item}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="price-quantity"
            className="mb-2 block text-sm font-medium"
          >
            Number of services
          </label>

          <select
            id="price-quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-noir-foreground outline-none focus:border-gold"
          >
            <option value="1" className="text-black">
              1
            </option>
            <option value="2" className="text-black">
              2
            </option>
            <option value="3" className="text-black">
              3
            </option>
          </select>
        </div>

        {selectedService && (
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />

              <div>
                <p className="font-semibold">
                  {selectedService.service}
                </p>

                <p className="mt-1 text-sm text-noir-muted">
                  Category: {selectedService.category}
                </p>

                <p className="mt-3 text-xs text-noir-muted">
                  Final price may vary depending on hair length,
                  hair condition, skin requirements, product selection
                  and consultation.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            const contact = document.getElementById("booking");

            contact?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="w-full rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02]"
        >
          Request This Service
        </button>
      </div>
    </section>
  );
}