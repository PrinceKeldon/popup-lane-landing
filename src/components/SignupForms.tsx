import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export const SignupForms = () => {
  const [shopperEmail, setShopperEmail] = useState("");
  const [merchantEmail, setMerchantEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [social, setSocial] = useState("");
  const [category, setCategory] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [merchantSpots, setMerchantSpots] = useState(50);

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

  const handleShopperSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to the Lane!",
      description: "We'll notify you when we open.",
    });
    setShopperEmail("");
  };

  const handleMerchantSubmit = (e: FormEvent) => {
    e.preventDefault();

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

    if (merchantSpots > 0) {
      setMerchantSpots((prev) => prev - 1);
    }

    toast({
      title: "Application Received!",
      description: "We'll review your merchant application soon.",
    });

    setMerchantEmail("");
    setBrandName("");
    setWebsite("");
    setSocial("");
    setCategory("");
  };

  return (
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

        <form onSubmit={handleShopperSubmit} className="mt-4">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <label className="sr-only" htmlFor="shopper-email">
                Email
              </label>
              <Input
                id="shopper-email"
                type="email"
                placeholder="your email"
                value={shopperEmail}
                onChange={(e) => setShopperEmail(e.target.value)}
                required
                className="rounded-xl"
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

        <form onSubmit={handleMerchantSubmit} className="mt-4">
          <input type="hidden" name="role" value="merchant" />
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <label className="sr-only" htmlFor="merchant-email">
                Email
              </label>
              <Input
                id="merchant-email"
                type="email"
                placeholder="your email"
                value={merchantEmail}
                onChange={(e) => setMerchantEmail(e.target.value)}
                required
                className="rounded-xl mb-2 bg-white text-foreground"
              />

              <label className="sr-only" htmlFor="brand_name">
                Brand Name
              </label>
              <Input
                id="brand_name"
                type="text"
                placeholder="Brand Name (optional)"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="rounded-xl mb-2 bg-white text-foreground"
              />

              <label className="sr-only" htmlFor="website">
                Website
              </label>
              <Input
                id="website"
                type="url"
                placeholder="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="rounded-xl mb-2 bg-white text-foreground"
              />

              <label className="sr-only" htmlFor="social">
                Social Media
              </label>
              <Input
                id="social"
                type="text"
                placeholder="Social Media Handle / Link"
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                className="rounded-xl mb-2 bg-white text-foreground"
              />

              <label className="sr-only" htmlFor="category">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl bg-white text-foreground">
                  <SelectValue placeholder="Category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
                  <SelectItem value="Art & Lifestyle">Art & Lifestyle</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
      </div>
    </section>
  );
};
