"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Volume2, VolumeX } from "lucide-react";

const videos = [
  {
    id: "1",
    title: "340K Gaming PC Build",
    videoUrl: "https://cdn.shopify.com/videos/c/vp/93797bda5ea84b2c9852a2316070abcc/93797bda5ea84b2c9852a2316070abcc.HD-720p-1.6Mbps-59232716.mp4",
    thumbnailUrl: "https://cdn.shopify.com/s/files/1/0679/7325/1226/files/preview_images/93797bda5ea84b2c9852a2316070abcc.thumbnail.0000000000.jpg"
  },
  {
    id: "2",
    title: "1.2 Million PKR Gaming & Workstation Beast",
    videoUrl: "https://cdn.shopify.com/videos/c/vp/a1cb0b632a7948909e94cad0cf3e71be/a1cb0b632a7948909e94cad0cf3e71be.HD-720p-1.6Mbps-59232399.mp4",
    thumbnailUrl: "https://cdn.shopify.com/s/files/1/0679/7325/1226/files/preview_images/a1cb0b632a7948909e94cad0cf3e71be.thumbnail.0000000000.jpg"
  },
  {
    id: "3",
    title: "Pac-Man themed gaming PC",
    videoUrl: "https://cdn.shopify.com/videos/c/vp/b44467ba25e74da49177aa0c6ebc926a/b44467ba25e74da49177aa0c6ebc926a.HD-720p-1.6Mbps-59232341.mp4",
    thumbnailUrl: "https://cdn.shopify.com/s/files/1/0679/7325/1226/files/preview_images/b44467ba25e74da49177aa0c6ebc926a.thumbnail.0000000000.jpg"
  },
  {
    id: "4",
    title: "The Perfect Balance – 320K Gaming PC Build",
    videoUrl: "https://cdn.shopify.com/videos/c/vp/9fc5858d46824303ade22280b3674cbf/9fc5858d46824303ade22280b3674cbf.HD-720p-1.6Mbps-59232276.mp4",
    thumbnailUrl: "https://cdn.shopify.com/s/files/1/0679/7325/1226/files/preview_images/9fc5858d46824303ade22280b3674cbf.thumbnail.0000000000.jpg"
  },
  {
    id: "5",
    title: "New Headphones Collection",
    videoUrl: "https://cdn.shopify.com/videos/c/vp/6c3f5127548642aa93f628f1e4a1963d/6c3f5127548642aa93f628f1e4a1963d.HD-720p-1.6Mbps-59232196.mp4",
    thumbnailUrl: "https://cdn.shopify.com/s/files/1/0679/7325/1226/files/preview_images/6c3f5127548642aa93f628f1e4a1963d.thumbnail.0000000000.jpg"
  },
  {
    id: "6",
    title: "14 Lakh Ka Gaming Pc",
    videoUrl: "https://cdn.shopify.com/videos/c/vp/672bf941693f47959382b0bb1551b3f7/672bf941693f47959382b0bb1551b3f7.HD-720p-1.6Mbps-59232084.mp4",
    thumbnailUrl: "https://cdn.shopify.com/s/files/1/0679/7325/1226/files/preview_images/672bf941693f47959382b0bb1551b3f7.thumbnail.0000000000.jpg"
  }
];

export function SocialMediaVideos() {
  const [api, setApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const [activeVideo, setActiveVideo] = useState<typeof videos[0] | null>(null);
  
  // Lightbox States
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto Scroll Effect for Carousel
  useEffect(() => {
    if (!api) return;

    let intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

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

  // Scroll Progress Bar Effect for Carousel
  useEffect(() => {
    if (!api) return;

    const updateProgress = () => {
      const totalSnaps = api.scrollSnapList().length;
      if (totalSnaps === 0) return;
      const activeSnap = api.selectedScrollSnap();
      setScrollProgress(((activeSnap + 1) / totalSnaps) * 100);
    };

    updateProgress();
    api.on("select", updateProgress);
    api.on("reInit", updateProgress);

    return () => {
      api.off("select", updateProgress);
      api.off("reInit", updateProgress);
    };
  }, [api]);

  // Lightbox video logic
  useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.play().catch(e => console.error("Auto-play prevented", e));
      setIsPlaying(true);
    }
  }, [activeVideo]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setVideoProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
      setVideoProgress(val);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full px-4 sm:px-12 py-4 max-w-[1400px] mx-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {videos.map((video) => (
            <CarouselItem
              key={video.id}
              className="pl-4 basis-[60%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <div 
                className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:-translate-y-2 select-none"
                onClick={() => setActiveVideo(video)}
              >
                {/* Autoplay muted video for preview */}
                <video
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  className="w-full h-full object-cover pointer-events-none"
                  loop
                  muted
                  playsInline
                  autoPlay
                  draggable={false}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform transition-transform shadow-lg border border-white/30">
                    <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-tight drop-shadow-md">
                    {video.title}
                  </p>
                </div>
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
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              onClick={() => setActiveVideo(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[450px] aspect-[9/16] max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl group"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside video from closing modal
            >
              <video
                ref={videoRef}
                src={activeVideo.videoUrl}
                poster={activeVideo.thumbnailUrl}
                className="w-full h-full object-contain bg-black cursor-pointer"
                loop
                playsInline
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                controls={false}
                onClick={togglePlay}
              />
              
              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                
                {/* Progress Bar */}
                <div className="w-full px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={videoProgress || 0} 
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full transition-all"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between px-2">
                  <button 
                    onClick={togglePlay}
                    className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
                  </button>

                  <button 
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
