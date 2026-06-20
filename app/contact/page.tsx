"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTransition } from "@/components/TransitionContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Mail, MessageSquare, Send, AlertTriangle } from "lucide-react";

export default function ContactPage() {
  const { finishTransition } = useTransition();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    finishTransition();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="dark min-h-[90vh] bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-2">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            We'd love to hear from you! Whether you have questions about our custom gaming PCs, need assistance with an order, or just want to chat about the latest in gaming tech, the Daddu Charger team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Info & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Card */}
            <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" /> Direct Contact
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Connect with us instantly on WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href="https://wa.me/923345178948"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-neutral-800/40 rounded-xl hover:bg-neutral-800/80 transition-colors border border-neutral-800 text-white cursor-pointer group"
                >
                  <MessageSquare className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs text-neutral-400 font-medium">WhatsApp Chat</div>
                    <div className="text-sm font-bold tracking-wide">03345178948</div>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Business Hours Card */}
            <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-neutral-400">
                <div className="flex justify-between border-b border-neutral-800/50 pb-2">
                  <span>Monday – Friday:</span>
                  <span className="text-white font-semibold">9:00 AM – 6:00 PM (PKT)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/50 pb-2">
                  <span>Saturday:</span>
                  <span className="text-white font-semibold">10:00 AM – 4:00 PM (PKT)</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Sunday:</span>
                  <span className="text-red-500 font-semibold">Closed</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Social Media</CardTitle>
                <CardDescription className="text-neutral-400">
                  Stay updated with our latest builds and gaming news.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <a
                  href="https://instagram.com/dadducharg3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/60 transition-colors border border-neutral-800/50 text-neutral-300 hover:text-white cursor-pointer group"
                >
                  <Image
                    src="/instagram.svg"
                    alt="Instagram"
                    width={16}
                    height={16}
                    className="w-4 h-4 invert opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <span>@dadducharg3r</span>
                </a>
                <a
                  href="https://facebook.com/DadduCharg3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/60 transition-colors border border-neutral-800/50 text-neutral-300 hover:text-white cursor-pointer group"
                >
                  <Image
                    src="/facebook.svg"
                    alt="Facebook"
                    width={16}
                    height={16}
                    className="w-4 h-4 invert opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <span>@DadduCharg3r</span>
                </a>
                <a
                  href="https://tiktok.com/@dadducharg3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/60 transition-colors border border-neutral-800/50 text-neutral-300 hover:text-white cursor-pointer group"
                >
                  <Image
                    src="/tiktok.svg"
                    alt="TikTok"
                    width={16}
                    height={16}
                    className="w-4 h-4 invert opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <span>@dadducharg3r</span>
                </a>
                <a
                  href="https://www.youtube.com/c/DadduCharger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/60 transition-colors border border-neutral-800/50 text-neutral-300 hover:text-white cursor-pointer group"
                >
                  <Image
                    src="/youtube.svg"
                    alt="YouTube"
                    width={16}
                    height={16}
                    className="w-4 h-4 invert opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <span>YouTube Channel</span>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> Contact Form
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Please fill out the form below, and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {formSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-800/20 border border-neutral-800 rounded-2xl space-y-3">
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500 rounded-full flex items-center justify-center text-green-500">
                      <Send className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Message Sent Successfully!</h3>
                    <p className="text-sm text-neutral-400 max-w-sm">
                      Thank you for contacting Daddu Charger. We have received your inquiry and will respond within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormSubmitted(false)}
                      className="mt-2 cursor-pointer"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold text-neutral-300">Name</label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-neutral-800/40 border-neutral-800 text-white focus-visible:ring-primary focus-visible:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold text-neutral-300">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="yourname@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-neutral-800/40 border-neutral-800 text-white focus-visible:ring-primary focus-visible:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-semibold text-neutral-300">Message</label>
                      <Textarea
                        id="message"
                        placeholder="How can the Daddu Charger team help you today?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="bg-neutral-800/40 border-neutral-800 text-white focus-visible:ring-primary focus-visible:border-primary resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full font-semibold cursor-pointer mt-4">
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Urgent Inquiry Footer Alert */}
        <div className="flex items-center gap-3 p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl max-w-4xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            <span className="font-semibold text-white">Need Immediate Assistance?</span> For urgent inquiries, please call us during our normal business hours.
          </p>
        </div>
      </div>
    </main>
  );
}
