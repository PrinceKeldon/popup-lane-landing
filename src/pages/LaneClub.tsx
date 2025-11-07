import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Upload, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const feedbackSchema = z.object({
  brand_name: z.string().trim().min(1, "Brand name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  first_impression: z.string().trim().min(10, "Please share at least 10 characters").max(1000),
  short_quote: z.string().trim().max(200).optional(),
  excited_feature: z.string().trim().max(200).optional(),
  improvement: z.string().trim().max(500).optional(),
  rating: z.number().int().min(1).max(5),
  consent: z.enum(['yes', 'no']),
  logo: z.any().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const LaneClub = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [consent, setConsent] = useState<'yes' | 'no'>('yes');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FeedbackFormData) => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('brand_name', data.brand_name);
      formData.append('email', data.email);
      formData.append('first_impression', data.first_impression);
      formData.append('short_quote', data.short_quote || '');
      formData.append('excited_feature', data.excited_feature || '');
      formData.append('improvement', data.improvement || '');
      formData.append('rating', rating.toString());
      formData.append('consent', consent);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-lane-club-feedback`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      const result = await response.json();

      setShowSuccessModal(true);
      reset();
      setRating(0);
      setConsent('yes');
      setLogoFile(null);
      setLogoPreview(null);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Join The Lane Club | Share Your Experience"
        description="Join The Lane Club and share your experience with The Lane. Help us improve and get featured as a testimonial."
        canonical={`${window.location.origin}/lane-club`}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-grow container mx-auto px-4 py-16 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Join The Lane Club
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your experience with The Lane and help us improve. Your feedback matters, 
              and you might be featured as a testimonial!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 rounded-lg border">
            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name *</Label>
              <Input
                id="brand_name"
                {...register('brand_name')}
                placeholder="Your Brand"
                className="bg-background"
              />
              {errors.brand_name && (
                <p className="text-sm text-destructive">{errors.brand_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="hello@yourbrand.com"
                className="bg-background"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Your Rating *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* First Impression */}
            <div className="space-y-2">
              <Label htmlFor="first_impression">First Impression *</Label>
              <Textarea
                id="first_impression"
                {...register('first_impression')}
                placeholder="Tell us about your first experience with The Lane..."
                rows={4}
                className="bg-background resize-none"
              />
              {errors.first_impression && (
                <p className="text-sm text-destructive">{errors.first_impression.message}</p>
              )}
            </div>

            {/* Short Quote */}
            <div className="space-y-2">
              <Label htmlFor="short_quote">Short Quote for Testimonial (Optional)</Label>
              <Input
                id="short_quote"
                {...register('short_quote')}
                placeholder="A brief quote we can feature..."
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Max 200 characters</p>
            </div>

            {/* Excited Feature */}
            <div className="space-y-2">
              <Label htmlFor="excited_feature">Most Exciting Feature (Optional)</Label>
              <Input
                id="excited_feature"
                {...register('excited_feature')}
                placeholder="What feature excites you most?"
                className="bg-background"
              />
            </div>

            {/* Improvement */}
            <div className="space-y-2">
              <Label htmlFor="improvement">Suggestions for Improvement (Optional)</Label>
              <Textarea
                id="improvement"
                {...register('improvement')}
                placeholder="How can we make The Lane better?"
                rows={3}
                className="bg-background resize-none"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Upload Your Logo (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="bg-background"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-contain rounded border"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">JPEG, PNG, or WEBP (max 5MB)</p>
            </div>

            {/* Consent Toggle */}
            <div className="space-y-2">
              <Label>Can we feature your feedback?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={consent === 'yes' ? 'default' : 'outline'}
                  onClick={() => setConsent('yes')}
                  className="flex-1"
                >
                  Yes, feature me!
                </Button>
                <Button
                  type="button"
                  variant={consent === 'no' ? 'default' : 'outline'}
                  onClick={() => setConsent('no')}
                  className="flex-1"
                >
                  Keep it private
                </Button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </main>

        <Footer />

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thank You for Joining The Lane Club! 🎉</DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <p>
                  Your feedback has been received and is under review. We appreciate you taking 
                  the time to share your experience with us.
                </p>
                <p>
                  If you consented to being featured, we may showcase your testimonial on our site 
                  after approval.
                </p>
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full">
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LaneClub;
