import React from "react";
import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us - Daddu Charger Store",
  description: "Get in touch with Daddu Charger. Contact us for custom gaming PC quotes, support, and inquiries. We are located in Rawalpindi, Pakistan and ship nationwide.",
};

export default function ContactPage() {
  return <ContactClient />;
}
