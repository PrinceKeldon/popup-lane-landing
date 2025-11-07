import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: string;
  brand_name: string;
  short_quote: string | null;
  rating: number;
  logo_url: string | null;
  created_at: string;
}

export const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('lane_club_feedback')
        .select('id, brand_name, short_quote, rating, logo_url, created_at')
        .eq('status', 'approved')
        .eq('consent_to_feature', true)
        .eq('featured_on_site', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What The Lane Club Says
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real feedback from merchants who've experienced The Lane
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-6 h-full bg-card rounded-lg border shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    {testimonial.logo_url ? (
                      <img
                        src={testimonial.logo_url}
                        alt={testimonial.brand_name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {getInitials(testimonial.brand_name)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {testimonial.brand_name}
                      </h3>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {testimonial.short_quote && (
                    <p className="text-muted-foreground italic text-sm">
                      "{testimonial.short_quote}"
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
