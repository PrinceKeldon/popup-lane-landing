import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MerchantConfirmationModal } from "./MerchantConfirmationModal";

// Validation schemas matching server-side rules
const shopperSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .trim()
    .toLowerCase(),
});

const merchantSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .trim()
    .toLowerCase(),
  brandName: z.string()
    .trim()
    .min(1, "Brand name is required")
    .max(100, "Brand name must be less than 100 characters"),
  website: z.string()
    .trim()
    .max(500, "Website URL must be less than 500 characters")
    .refine(
      (url) => !url || url.startsWith('http://') || url.startsWith('https://'),
      { message: "Website must start with http:// or https://" }
    )
    .optional()
    .or(z.literal('')),
  socialMedia: z.string()
    .trim()
    .max(200, "Social media must be less than 200 characters")
    .optional()
    .or(z.literal('')),
  category: z.enum(['Fashion', 'Home', 'Beauty & Wellness', 'Art & Lifestyle', 'Other'], {
    required_error: "Please select a category",
  }),
});

type ShopperFormData = z.infer<typeof shopperSchema>;
type MerchantFormData = z.infer<typeof merchantSchema>;

export const SignupForms = () => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [merchantSpots, setMerchantSpots] = useState(50);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    email: string;
    brandName: string;
    spotsRemaining: number;
  } | null>(null);

  // Form hooks
  const shopperForm = useForm<ShopperFormData>({
    resolver: zodResolver(shopperSchema),
    defaultValues: { email: "" },
  });

  const merchantForm = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      email: "",
      brandName: "",
      website: "",
      socialMedia: "",
      category: undefined,
    },
  });

  useEffect(() => {
    const endDate = new Date("2025-11-21T10:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const diffMs = endDate.getTime() - now.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      setDaysRemaining(days > 0 ? days : 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShopperSubmit = async (formData: ShopperFormData) => {
    try {
      const { data, error } = await supabase.functions.invoke('airtable-submit', {
        body: {
          type: 'shopper',
          email: formData.email,
        },
      });

      if (error) throw error;

      toast({
        title: "Welcome to the Lane!",
        description: "We'll notify you when we open.",
      });
      shopperForm.reset();
    } catch (error: any) {
      console.error('Error submitting shopper form:', error);
      toast({
        title: "Error",
        description: error?.message || "Oops! Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMerchantSubmit = async (formData: MerchantFormData) => {
    const now = new Date();
    const openDate = new Date("2025-11-21T10:00:00");
    const closeDate = new Date("2025-11-28T23:59:59");

    if (now >= openDate && now <= closeDate) {
      toast({
        title: "Applications Closed",
        description: "Merchant applications are closed while the Lane is live. Please join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('airtable-submit', {
        body: {
          type: 'merchant',
          email: formData.email,
          brandName: formData.brandName,
          website: formData.website,
          socialMedia: formData.socialMedia,
          category: formData.category,
        },
      });

      if (error) throw error;

      if (data?.success && data?.merchantData) {
        toast({
          title: "Application Received!",
          description: "We'll review your merchant application soon.",
        });

        // Show confirmation modal
        setConfirmationData(data.merchantData);
        setShowConfirmationModal(true);

        // Clear form
        merchantForm.reset();

        // Update spots from server response
        if (data.merchantData.spotsRemaining !== undefined) {
          setMerchantSpots(data.merchantData.spotsRemaining);
        }
      }
    } catch (error: any) {
      console.error('Error submitting merchant form:', error);
      toast({
        title: "Error",
        description: error?.message || "Oops! Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {confirmationData && (
        <MerchantConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          merchantData={confirmationData}
        />
      )}
      
      <section className="py-16 px-4 max-w-[980px] mx-auto">
      {/* Shopper Notify Section */}
      <div
        className="rounded-2xl p-7 mb-7 shadow-[0_8px_20px_rgba(0,0,0,0.05)] border border-border bg-card"
        aria-labelledby="notify-title"
      >
        <h3 id="notify-title" className="text-serif text-xl mb-2">
          Be First in the Lane — Shoppers Welcome
        </h3>
        <p className="text-muted-foreground text-sm mb-3">
          Sign up to get notified! Shoppers get first pick of indie drops in the upcoming PopUp Lane.
        </p>

        <Form {...shopperForm}>
          <form onSubmit={shopperForm.handleSubmit(handleShopperSubmit)} className="mt-4">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[160px]">
                <FormField
                  control={shopperForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="sr-only" htmlFor="shopper-email">
                        Email
                      </label>
                      <FormControl>
                        <Input
                          id="shopper-email"
                          type="email"
                          placeholder="your email"
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="font-bold rounded-xl bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 active:scale-98"
              >
                Get Notified
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2.5">
              We'll only reach out when the Lane opens — no spam, just the drop.
            </p>
          </form>
        </Form>
      </div>

      {/* Merchant Early Access Section */}
      <div
        className="rounded-2xl p-7 shadow-[0_8px_20px_rgba(0,0,0,0.05)] border border-border bg-[hsl(var(--wine))] text-background"
        aria-labelledby="merchant-title"
      >
        <h3 id="merchant-title" className="text-serif text-xl mb-2">
          Merchant Early Access{" "}
          <span className="inline-block text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-md ml-2">
            AI-Assisted
          </span>
        </h3>
        <p className="text-background/90 text-sm mb-4">
          Small brands can apply to feature their products in the upcoming PopUp Lane. Fill in your details and leverage
          AI suggestions for optimal exposure.
        </p>

        {/* Info Counters */}
        <div className="text-[15px] font-semibold mb-2">
          Days Remaining: <span className="font-bold inline-block min-w-[24px] text-center">{daysRemaining}</span>
        </div>
        <div className="text-[15px] font-semibold mb-4">
          Merchant Spots Left: <span className="font-bold inline-block min-w-[24px] text-center">{merchantSpots}</span>
        </div>

        <Form {...merchantForm}>
          <form onSubmit={merchantForm.handleSubmit(handleMerchantSubmit)} className="mt-4">
            <input type="hidden" name="role" value="merchant" />
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[160px]">
                <FormField
                  control={merchantForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="sr-only" htmlFor="merchant-email">
                        Email
                      </label>
                      <FormControl>
                        <Input
                          id="merchant-email"
                          type="email"
                          placeholder="your email"
                          className="rounded-xl mb-2 bg-white text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={merchantForm.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <label className="sr-only" htmlFor="brand_name">
                        Brand Name
                      </label>
                      <FormControl>
                        <Input
                          id="brand_name"
                          type="text"
                          placeholder="Brand Name"
                          className="rounded-xl mb-2 bg-white text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={merchantForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <label className="sr-only" htmlFor="website">
                        Website
                      </label>
                      <FormControl>
                        <Input
                          id="website"
                          type="url"
                          placeholder="Website URL (optional)"
                          className="rounded-xl mb-2 bg-white text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={merchantForm.control}
                  name="socialMedia"
                  render={({ field }) => (
                    <FormItem>
                      <label className="sr-only" htmlFor="social">
                        Social Media
                      </label>
                      <FormControl>
                        <Input
                          id="social"
                          type="text"
                          placeholder="Social Media Handle / Link (optional)"
                          className="rounded-xl mb-2 bg-white text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={merchantForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <label className="sr-only" htmlFor="category">
                        Category
                      </label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl bg-white text-foreground">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fashion">Fashion</SelectItem>
                          <SelectItem value="Home">Home</SelectItem>
                          <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
                          <SelectItem value="Art & Lifestyle">Art & Lifestyle</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center">
                <Button
                  type="submit"
                  className="font-bold rounded-xl bg-[hsl(345_60%_47%)] hover:bg-[hsl(345_60%_42%)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 active:scale-98"
                >
                  Apply
                </Button>
              </div>
            </div>
            <p className="text-xs text-background/80 mt-2.5">
              Merchant applications may be capped — early submissions get priority.
            </p>
          </form>
        </Form>
      </div>
    </section>
    </>
  );
};
