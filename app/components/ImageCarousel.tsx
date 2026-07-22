"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-zinc-800 rounded-xl flex items-center justify-center ${className}`}>
        <span className="text-zinc-500">Sem imagem</span>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Imagem principal */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-800">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - imagem ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority={currentIndex === 0}
        />
        
        {/* Indicador de contagem */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Setas (visíveis no hover) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots (indicadores) */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-pink-500"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}