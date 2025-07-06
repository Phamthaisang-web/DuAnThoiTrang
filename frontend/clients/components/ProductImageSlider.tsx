"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
interface Image {
  url: string;
  altText?: string;
}

interface ProductImageSliderProps {
  images: Image[];
  productName: string;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
}) => {
  const [index, setIndex] = useState(1); // Start at 1 (first real image)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const imageList = [images[images.length - 1], ...images, images[0]]; // Clone last & first

  const slideTo = (newIndex: number) => {
    if (!sliderRef.current) return;
    setIsTransitioning(true);
    setIndex(newIndex);
  };

  const handleTransitionEnd = () => {
    if (!sliderRef.current) return;

    // Reset to real slide without transition
    setIsTransitioning(false);

    if (index === 0) {
      sliderRef.current.style.transition = "none";
      setIndex(images.length);
      sliderRef.current.style.transform = `translateX(-${
        images.length * 100
      }%)`;
    } else if (index === images.length + 1) {
      sliderRef.current.style.transition = "none";
      setIndex(1);
      sliderRef.current.style.transform = `translateX(-100%)`;
    }
  };

  // Effect to animate transform
  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.style.transition = isTransitioning
      ? "transform 0.5s ease"
      : "none";
    sliderRef.current.style.transform = `translateX(-${index * 100}%)`;
  }, [index, isTransitioning]);

  const goToPrev = () => {
    if (isTransitioning) return;
    slideTo(index - 1);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    slideTo(index + 1);
  };

  const goToSlide = (realIndex: number) => {
    if (isTransitioning) return;
    slideTo(realIndex + 1);
  };

  if (images.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden">
      {/* Slider container */}
      <div className="relative aspect-square rounded-xl overflow-hidden shadow group">
        <div
          className="flex w-full h-full"
          ref={sliderRef}
          onTransitionEnd={handleTransitionEnd}
        >
          {imageList.map((image, i) => (
            <div
              key={i}
              className="min-w-full flex justify-center items-center bg-white"
            >
              <img
                src={`${apiUrl}${image.url}`}
                alt={image.altText || `${productName} ${i}`}
                className="h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight />
        </button>

        {/* Slide Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {((index - 1 + images.length) % images.length) + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide p-2">
        {images.map((img, i) => {
          const isActive = (index - 1 + images.length) % images.length === i;
          return (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition  ${
                isActive
                  ? "border-blue-500 scale-105 shadow"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={`${apiUrl}${img.url}`}
                alt={img.altText || `${productName} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImageSlider;
