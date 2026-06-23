import React from "react";
import type { Metadata } from "next";
import DeveloperClient from "./DeveloperClient";

export const metadata: Metadata = {
  title: "Shopify API Developer Console - Daddu Charger",
  description: "Developer tools and API console for inspecting and testing Daddu Charger's Shopify store endpoints, collections, products, and search route payloads.",
};

export default function DeveloperPage() {
  return <DeveloperClient />;
}
