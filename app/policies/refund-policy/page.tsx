import React from "react";
import { Mail, Phone } from "lucide-react";
import { PageTransitionCompleter } from "@/components/PageTransitionCompleter";

export const metadata = {
  title: "Refund Policy - Daddu Charger",
  description: "Refund and return policy for Daddu Charger Gaming Store.",
};

export default function RefundPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 sm:px-12 py-24 text-neutral-300 space-y-12 leading-relaxed">
      <PageTransitionCompleter />
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Refund Policy</h1>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. General Policy</h2>
          <p>
            At Daddu Charger Gaming Store, we aim to deliver high-quality products and excellent service. Please note that due to the nature of custom PC builds and electronic components, our return and refund policy has certain limitations to ensure fairness and transparency.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Eligibility for Returns</h2>
          <p>A product is eligible for return or replacement only if:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>An incorrect item was shipped.</li>
            <li>The product has a manufacturer-recognized fault within the warranty period.</li>
          </ul>
          
          <p className="font-bold text-white mt-4">Not Eligible for Return/Refund:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Products damaged due to customer mishandling (e.g., burns, liquid damage, scratches, broken parts).</li>
            <li>Change of mind or performance dissatisfaction (e.g., "not as fast as expected").</li>
            <li>Custom-built PCs once assembled and delivered, unless a component is faulty.</li>
            <li>Damage caused by courier/carrier during shipment (we pack securely, but transit risk lies with the courier).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Return Process</h2>
          <p>To initiate a return:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact us within 24 hours of receiving the product at <a href="mailto:support@dadducharger.com" className="text-accent-gold hover:underline">support@dadducharger.com</a> or Whatsapp at +92 311 5226682.</li>
            <li>Provide your order number, pictures/videos of the issue, and original invoice.</li>
            <li>Our team will verify the claim and guide you on the return shipping process.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Refunds</h2>
          <p>If your return is approved, you may choose between:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Replacement with the same or other product (if available).</li>
            <li>Refund to your original payment method.</li>
          </ul>
          <p>
            Refunds typically take 7–21 working days after inspection and approval.
            Shipping charges are non-refundable, unless the return is due to our error (wrong or defective item).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. Warranty Claims</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All components and accessories carry their official manufacturer or distributor warranty.</li>
            <li>Warranty handling times depend on the manufacturer/importer and may take 2–6 weeks.</li>
            <li>Warranty does not cover: physical damage, overclocking, power surges, liquid damage, or unauthorized repairs.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">6. Shipping Costs for Returns</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>If the product is defective or incorrect due to DadduCharger's error, we will cover the return shipping.</li>
            <li>If the return is due to other reasons (e.g., customer mishandling, change of mind), the customer bears the shipping cost.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">7. Order Cancellation</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders can only be cancelled before shipping/assembly begins.</li>
            <li>Once a custom PC build is assembled, the order cannot be cancelled.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">8. Contact Us</h2>
          <p className="flex flex-col gap-2 mt-4">
            For return and refund inquiries, please contact:<br />
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent-gold" /> <a href="mailto:support@dadducharger.com" className="text-accent-gold hover:underline">support@dadducharger.com</a></span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent-gold" /> +92 311 5226682</span>
          </p>
        </section>
      </div>
    </main>
  );
}
