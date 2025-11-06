import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: string[];
  brandName: string;
  discountBadge?: React.ReactNode;
  offerText?: string;
  className?: string;
}

export default function ProductImageCarousel({
  images,
  brandName,
  discountBadge,
  offerText,
  className = "h-40",
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  // Fallback to brand initial if no images
  if (!images || images.length === 0) {
    return (
      <div
        className="relative aspect-[4/3] bg-gradient-to-br from-wine/5 via-wine/10 to-wine/5 flex items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-wine/20 flex items-center justify-center">
          <span className="text-3xl font-bold text-wine">
            {brandName.charAt(0).toUpperCase()}
          </span>
        </div>
        {discountBadge}
        {offerText && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold text-center">
            {offerText}
          </div>
        )}
      </div>
    );
  }

  // Single image - no carousel needed
  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={images[0]}
          alt={brandName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {discountBadge}
        {offerText && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold text-center">
            {offerText}
          </div>
        )}
      </div>
    );
  }

  // Multiple images - show carousel
  return (
    <div className="relative aspect-[4/3] group">
      <Carousel
        className="w-full h-full"
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="w-full h-full">
                <img
                  src={image}
                  alt={`${brandName} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background border-none h-8 w-8" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background border-none h-8 w-8" />
      </Carousel>

      {/* Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all ${
              index === currentIndex
                ? "w-2.5 h-2.5 bg-[hsl(var(--wine))]"
                : "w-2 h-2 bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Overlays */}
      {discountBadge}
      {offerText && (
        <div className="absolute bottom-6 left-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold text-center">
          {offerText}
        </div>
      )}
    </div>
  );
}
