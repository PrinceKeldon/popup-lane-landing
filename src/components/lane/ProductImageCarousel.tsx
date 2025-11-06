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
}

export default function ProductImageCarousel({
  images,
  brandName,
  discountBadge,
  offerText,
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
      <div className="relative h-48 bg-white flex items-center justify-center border-b">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-3xl font-bold">
          {brandName.charAt(0).toUpperCase()}
        </div>
        {discountBadge}
      </div>
    );
  }

  // Single image - no carousel needed
  if (images.length === 1) {
    return (
      <div className="relative h-48 overflow-hidden bg-white">
        <img
          src={images[0]}
          alt={brandName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {discountBadge}
      </div>
    );
  }

  // Multiple images - show carousel
  return (
    <div className="relative h-48 group bg-white">
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
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background border-none h-8 w-8 z-20" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background border-none h-8 w-8 z-20" />
      </Carousel>

      {/* Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              if (api) api.scrollTo(index);
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-white shadow-sm"
                : "w-1.5 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {discountBadge}
    </div>
  );
}
