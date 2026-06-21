import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageTransitionCompleter } from "@/components/PageTransitionCompleter";

export const metadata = {
  title: "Terms of Service - Daddu Charger",
  description: "Terms of service and user agreements for Daddu Charger Gaming Store.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 sm:px-12 py-24 text-neutral-300 space-y-12 leading-relaxed">
      <PageTransitionCompleter />
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Terms of Service</h1>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to DadduCharger.com ("we", "our", "us"). By accessing or purchasing from our website, you ("customer", "user") agree to comply with the following Terms of Service. These Terms are governed by the laws of Islamic Republic of Pakistan.
          </p>
          <p>
            If you do not agree, please do not use our website or services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be 18 years or older to place an order.</li>
            <li>You confirm that all information provided during purchase is true, accurate, and complete.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Products & Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We specialize in custom-built PCs, gaming desktops, and related accessories.</li>
            <li>All product images are for illustration purposes. Actual products may vary depending on availability.</li>
            <li>Specifications may be upgraded or adjusted depending on market availability and compatibility.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Pricing & Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Prices are listed in Pakistani Rupees (PKR) and are subject to change without notice.</li>
            <li>Full or partial advance payment may be required to confirm an order.</li>
            <li>We accept bank transfer, Raast, Easypaisa, JazzCash, and cash on delivery (where available).</li>
            <li>DadduCharger reserves the right to cancel an order if payment is not verified or the product is out of stock.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. Shipping & Delivery</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are delivered across Pakistan via reliable courier partners.</li>
            <li>Delivery timelines may vary (typically 3–10 working days depending on product availability).</li>
            <li>Shipping charges may apply and will be shown at checkout.</li>
            <li>DadduCharger is not responsible for courier delays or damages during transit, though we will assist in resolving disputes.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">6. Returns, Refunds & Warranty</h2>
          <p><strong>Custom PC Builds:</strong> Non-refundable once assembled, unless defective.</p>
          
          <p><strong>Refund Policy:</strong> Refunds are only applicable if the product is:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Has a manufacturer defect, or</li>
            <li>Incorrect item was delivered.</li>
          </ul>
          <p>Refunds may take 7–21 working days after verification.</p>

          <p><strong>Warranty:</strong></p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Components carry their respective manufacturer warranties.</li>
            <li>Warranty claims must be processed as per manufacturer/distributor policies.</li>
            <li>Physical damage, burns, or liquid damage are not covered.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">7. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You agree not to misuse our website (including hacking, spreading malware, or unauthorized access).</li>
            <li>You agree not to use our products for illegal activities under Pakistani law.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">8. Limitation of Liability</h2>
          <p>DadduCharger will not be held liable for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Delays beyond our control (courier, import, supplier issues).</li>
            <li>Data loss, software issues, or third-party damages caused by use of products.</li>
            <li>Any indirect, incidental, or consequential damages.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">9. Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All content, logos, images, and text on DadduCharger.com are owned by us and protected under Pakistani copyright laws.</li>
            <li>You may not copy, reproduce, or redistribute our content without written permission.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">10. Privacy Policy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We collect necessary personal data (name, contact, address, payment details) only for order processing.</li>
            <li>Data is protected and not shared with third parties except courier and payment providers.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">11. Governing Law & Dispute Resolution</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>These Terms are governed by the laws of Pakistan.</li>
            <li>In case of dispute, parties will first attempt to resolve amicably.</li>
            <li>If unresolved, disputes shall fall under the jurisdiction of the Courts of Rawalpindi/Islamabad.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">12. Changes to Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We reserve the right to update these Terms of Service at any time.</li>
            <li>Continued use of our website means you accept the updated Terms.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-12 pt-8 border-t border-neutral-800">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><MapPin className="w-6 h-6 text-accent-gold" /> Contact Us</h2>
          <p className="flex flex-col gap-2 mt-4">
            For support, please reach out at:<br />
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent-gold" /> <a href="mailto:support@dadducharger.com" className="text-accent-gold hover:underline">support@dadducharger.com</a></span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent-gold" /> +92 311 5226682</span>
          </p>
        </section>
      </div>
    </main>
  );
}
