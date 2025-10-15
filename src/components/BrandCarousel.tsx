import { useEffect, useRef } from "react";

export const BrandCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const brands = [
    { name: "Loom & Found", logo: "https://placehold.co/140x56/ffffff/111?text=Loom+%26+Found" },
    { name: "Bright Studio", logo: "https://placehold.co/140x56/ffffff/111?text=Bright+Studio" },
    { name: "Thread Theory", logo: "https://placehold.co/140x56/ffffff/111?text=Thread+Theory" },
    { name: "Indie Flame", logo: "https://placehold.co/140x56/ffffff/111?text=Indie+Flame" },
    { name: "Velvet Arc", logo: "https://placehold.co/140x56/ffffff/111?text=Velvet+Arc" },
    { name: "Echo Haus", logo: "https://placehold.co/140x56/ffffff/111?text=Echo+Haus" },
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let scrollPos = 0;
    let animationId: number;

    const scroll = () => {
      scrollPos += 0.5;
      const itemWidth = 196; // 180px width + 16px gap
      const totalWidth = itemWidth * brands.length;

      if (scrollPos >= totalWidth) {
        scrollPos = 0;
      }

      track.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className="py-16" aria-labelledby="memory-title">
      <div className="container px-4 mx-auto max-w-7xl">
        <h4 
          id="memory-title" 
          className="uppercase text-muted-foreground tracking-[1.6px] text-xs mb-4.5 text-left"
        >
          Brands That Made Last Season
        </h4>
        
        <div 
          className="relative overflow-hidden rounded-xl p-4.5 bg-gradient-to-b from-[hsl(220_15%_8%/0.01)] to-[hsl(220_15%_8%/0.01)] border border-border"
          style={{
            maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
          aria-hidden="false"
        >
          <div 
            ref={trackRef}
            className="flex gap-4 items-center will-change-transform"
            aria-hidden="false"
          >
            {/* First set of brands */}
            {brands.map((brand, index) => (
              <div
                key={`brand-1-${index}`}
                className="flex-shrink-0 w-[180px] h-20 flex items-center justify-center rounded-xl bg-gradient-to-b from-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.5)] shadow-[var(--shadow-card)] border border-input backdrop-blur-sm p-3"
              >
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="max-w-[140px] max-h-14 object-contain opacity-95 grayscale-[0.15]"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <div
                key={`brand-2-${index}`}
                className="flex-shrink-0 w-[180px] h-20 flex items-center justify-center rounded-xl bg-gradient-to-b from-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.5)] shadow-[var(--shadow-card)] border border-input backdrop-blur-sm p-3"
              >
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="max-w-[140px] max-h-14 object-contain opacity-95 grayscale-[0.15]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
