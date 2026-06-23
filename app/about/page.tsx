import React from "react";
import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us - Daddu Charger Store",
  description: "Learn more about Daddu Charger. Based in Rawalpindi, Pakistan, we are dedicated to assembling high-performance custom gaming PCs and offering premium gaming accessories.",
};

export default function AboutPage() {
  return <AboutClient />;
}
