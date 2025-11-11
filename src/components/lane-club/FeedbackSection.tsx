import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const feedbackSchema = z.object({
  merchant_name: z.string().trim().min(1, "Merchant name is required").max(100),
  brand_website: z.string().trim().url("Must be a valid URL").max(500),
  rating: z.number().min(1).max(5),
  feedback: z.string().trim().min(10, "Please share at least 10 characters").max(2000),
  allow_quote: z.boolean(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const FeedbackSection = () => {
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      allow_quote: true,
      rating: 0,
    }
  });

  const allowQuote = watch("allow_quote");

  const handleRatingClick = (value: number) => {
    setRating(value);
    setValue("rating", value);
  };

  const onSubmit = async (data: FeedbackFormData) => {
    setSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('airtable-submit', {
        body: {
          table: 'Merchant Feedback',
          fields: {
            merchant_name: data.merchant_name,
            brand_website: data.brand_website,
            rating: data.rating,
            feedback: data.feedback,
            allow_quote: data.allow_quote,
            status: 'pending',
          }
        }
      });

      if (error) throw error;

      setShowSuccess(true);
      reset();
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Share Your Experience
        </h2>
        <p className="text-muted-foreground">
          Your feedback is <span className="font-semibold text-foreground">required</span> — whether it's love, 
          critique, or something in between.
        </p>
        <p className="text-sm text-muted-foreground italic">
          (We secretly hope it's the first one 😉)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 md:p-8 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="merchant_name">Merchant/Brand Name *</Label>
          <Input
            id="merchant_name"
            placeholder="The brand you're reviewing"
            {...register("merchant_name")}
          />
          {errors.merchant_name && (
            <p className="text-sm text-destructive">{errors.merchant_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_website">Brand Website *</Label>
          <Input
            id="brand_website"
            type="url"
            placeholder="https://theirbrand.com"
            {...register("brand_website")}
          />
          {errors.brand_website && (
            <p className="text-sm text-destructive">{errors.brand_website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Your Rating *</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-sm text-destructive">Please select a rating</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback">Your Feedback *</Label>
          <Textarea
            id="feedback"
            placeholder="Share your honest experience..."
            rows={6}
            {...register("feedback")}
          />
          {errors.feedback && (
            <p className="text-sm text-destructive">{errors.feedback.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
          <div className="space-y-0.5">
            <Label htmlFor="allow_quote" className="text-base font-medium cursor-pointer">
              Allow PopUp Lane to quote my feedback
            </Label>
            <p className="text-sm text-muted-foreground">
              We may feature your feedback on our site or marketing materials
            </p>
          </div>
          <Switch
            id="allow_quote"
            checked={allowQuote}
            onCheckedChange={(checked) => setValue("allow_quote", checked)}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </form>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank You! 🎉</DialogTitle>
            <DialogDescription className="space-y-2 pt-4">
              <p>
                Your feedback has been submitted successfully. We appreciate you taking 
                the time to share your experience!
              </p>
              <p className="text-sm">
                Our team will review your feedback and may reach out if we feature it.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccess(false)} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
