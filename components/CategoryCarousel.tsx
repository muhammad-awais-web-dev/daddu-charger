"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CategoryCard } from "./CategoryCard";

interface Category {
  name: string;
  image: string;
  href: string;
  itemCount?: number;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(0);

  // Auto Scroll Effect
  useEffect(() => {
    if (!api) return;

    let intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000); // Scroll every 4 seconds

    const stopAutoScroll = () => clearInterval(intervalId);
    const startAutoScroll = () => {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, 4000);
    };

    api.on("pointerDown", stopAutoScroll);
    api.on("settle", startAutoScroll);

    return () => {
      clearInterval(intervalId);
      api.off("pointerDown", stopAutoScroll);
      api.off("settle", startAutoScroll);
    };
  }, [api]);

  // Scroll Progress Bar Effect
  useEffect(() => {
    if (!api) return;

    const updateProgress = () => {
      const totalSnaps = api.scrollSnapList().length;
      if (totalSnaps === 0) return;
      const activeSnap = api.selectedScrollSnap();
      setProgress(((activeSnap + 1) / totalSnaps) * 100);
    };

    updateProgress();
    api.on("select", updateProgress);
    api.on("reInit", updateProgress);

    return () => {
      api.off("select", updateProgress);
      api.off("reInit", updateProgress);
    };
  }, [api]);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative w-full px-4 sm:px-12 py-4">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="p-1">
                <CategoryCard
                  name={category.name}
                  image={category.image}
                  href={category.href}
                  itemCount={category.itemCount}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Desktop Controls */}
        <div className="hidden sm:block">
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800 hover:text-accent-gold" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800 hover:text-accent-gold" />
        </div>
      </Carousel>

      {/* Center aligned visual progress indicator */}
      <div className="w-full max-w-xs mx-auto mt-8 bg-neutral-800/60 h-[3px] rounded-full overflow-hidden">
        <div
          className="bg-accent-gold h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
