"use client";

import React, { useState } from "react";
import { TransitionLink } from "@/components/TransitionLink";
import { Phone, Mail, Send } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter submission logic here
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 pt-16 pb-8 text-neutral-400">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Information (Header Links) */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "All Products", href: "/products" },
                { name: "Categories", href: "/categories" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <TransitionLink 
                    href={link.href}
                    loaderText={`Navigating to ${link.name}...`}
                    className="text-sm font-semibold hover:text-accent-gold transition-colors inline-block"
                  >
                    {link.name}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Legal (Footer Menu) */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">
              Policies
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "/policies/privacy-policy" },
                { name: "Refund Policy", href: "/policies/refund-policy" },
                { name: "Shipping Policy", href: "/policies/shipping-policy" },
                { name: "Terms of Service", href: "/policies/terms-of-service" },
              ].map((link) => (
                <li key={link.name}>
                  <TransitionLink 
                    href={link.href}
                    loaderText={`Navigating to ${link.name}...`}
                    className="text-sm font-semibold hover:text-accent-gold transition-colors inline-block"
                  >
                    {link.name}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="space-y-4">
              <a 
                href="tel:+92-311-5226682" 
                className="flex items-center gap-3 text-sm font-semibold hover:text-accent-gold transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                +92-311-5226682
              </a>
              <a 
                href="mailto:dadduchargergs@gmail.com" 
                className="flex items-center gap-3 text-sm font-semibold hover:text-accent-gold transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                dadduchargergs@gmail.com
              </a>

              <div className="pt-2 flex flex-wrap gap-3">
                <a href="https://www.facebook.com/DadduCharg3r/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-accent-gold transition-colors group">
                  <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="invert group-hover:invert-0 transition-all" />
                </a>
                <a href="https://www.instagram.com/dadducharg3r/?hl=en" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-accent-gold transition-colors group">
                  <Image src="/instagram.svg" alt="Instagram" width={20} height={20} className="invert group-hover:invert-0 transition-all" />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-accent-gold transition-colors group">
                  <Image src="/x_logo.svg" alt="X/Twitter" width={20} height={20} style={{ height: 'auto' }} className="invert group-hover:invert-0 transition-all" />
                </a>
                <a href="https://www.youtube.com/c/DadduCharger" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-accent-gold transition-colors group">
                  <Image src="/youtube.svg" alt="YouTube" width={20} height={20} className="invert group-hover:invert-0 transition-all" />
                </a>
                <a href="https://www.tiktok.com/@dadducharg3r?lang=en" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-accent-gold transition-colors group">
                  <Image src="/tiktok.svg" alt="TikTok" width={20} height={20} className="invert group-hover:invert-0 transition-all" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">
              Let's Get in Touch
            </h3>
            <p className="text-sm font-semibold leading-relaxed">
              Sign up for our newsletter and receive 10% off your first order!
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-3 pl-5 pr-14 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent-gold transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-10 bg-white rounded-full flex items-center justify-center hover:bg-accent-gold transition-colors text-black"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image 
              src="/DADDUCHARGER-LOGO-ROG.png" 
              alt="Daddu Charger Logo" 
              width={140} 
              height={40} 
              style={{ height: 'auto' }}
              className="object-contain opacity-50 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-xs font-semibold text-neutral-500">
            © {new Date().getFullYear()} Daddu Charger. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
