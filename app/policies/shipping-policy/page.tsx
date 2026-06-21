import React from "react";
import { Mail, Phone } from "lucide-react";
import { PageTransitionCompleter } from "@/components/PageTransitionCompleter";

export const metadata = {
  title: "Shipping Policy - Daddu Charger",
  description: "Shipping and delivery policy for Daddu Charger Gaming Store.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 sm:px-12 py-24 text-neutral-300 space-y-12 leading-relaxed">
      <PageTransitionCompleter />
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Shipping Policy</h1>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Delivery Coverage</h2>
          <p>
            We deliver orders all across Pakistan through trusted courier partners. For remote areas, delivery timelines may be longer depending on courier availability.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Order Processing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are processed within 1–3 working days after payment confirmation.</li>
            <li>Custom PC builds may require additional time (typically 5–10 working days) for assembly and testing before dispatch.</li>
            <li>Customers will be notified via email/phone once the order has been shipped.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Delivery Timelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard Delivery:</strong> 3–7 working days (after dispatch).</li>
            <li><strong>Custom PCs:</strong> 7–14 working days depending on availability of components.</li>
            <li>Delays may occur due to public holidays, courier issues, or unforeseen circumstances.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Shipping Charges</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Shipping costs are calculated at checkout based on order weight, size, and delivery location.</li>
            <li>Any additional charges by courier companies (e.g., remote area surcharge) will be borne by the customer.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. Packaging & Handling</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All products are packed in secure and protective packaging to minimize risk of damage.</li>
            <li>For PC builds, systems are carefully tested, packed, and secured with internal protective material (where applicable).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">6. Responsibility & Risk</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Once the order is handed over to the courier, the risk of damage, delay, or loss passes to the customer.</li>
            <li>Daddu Charger Gaming Store is not responsible for courier/carrier damages, mishandling, or delays.</li>
            <li>Customers must inspect the parcel at delivery and report any visible damage directly to the courier.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">7. Courier Insurance</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We offer optional shipping insurance (where available) through the courier.</li>
            <li>Customers who wish to insure their order must request it at checkout or via support before shipment.</li>
            <li>Any claims for courier-related damage/loss must be filed directly with the courier service.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">8. Tracking Orders</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>A tracking number will be shared once the order is dispatched.</li>
            <li>Customers can track their parcels directly through the courier's website/app.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">9. Failed Deliveries</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>If delivery fails due to incorrect address, unavailability of the customer, or refusal to accept, the order will be returned to us.</li>
            <li>Customers will be responsible for re-delivery charges.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">10. Contact Us</h2>
          <p className="flex flex-col gap-2 mt-4">
            For shipping-related inquiries, please reach out at:<br />
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent-gold" /> <a href="mailto:support@dadducharger.com" className="text-accent-gold hover:underline">support@dadducharger.com</a></span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent-gold" /> +92 311 5226682</span>
          </p>
        </section>
      </div>
    </main>
  );
}
