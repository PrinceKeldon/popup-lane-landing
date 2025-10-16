import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thanks for joining!",
      description: "We'll notify you when the lane opens.",
    });
    setEmail("");
  };

  return (
    <section className="py-16" aria-labelledby="notify-title">
      <div className="container px-4 mx-auto max-w-7xl">
        <div 
          className="p-8.5 rounded-xl bg-gradient-to-b from-card to-background border border-border flex flex-col md:flex-row items-center gap-6 justify-between"
        >
          <div className="md:max-w-[68%]">
            <h3 id="notify-title" className="text-serif text-xl mb-1.5">
              Be First in the Lane — Shoppers & Small Brands Welcome
            </h3>
            <p className="text-muted-foreground text-sm m-0">
              Sign up for early access! Shoppers get first pick of limited-time indie deals, and merchants secure exclusive visibility for the next PopUp Lane.
            </p>
            <p className="text-muted-foreground m-0 mt-1.5" style={{ fontSize: '13px' }}>
              Merchants: List your brand and be featured during the season — no upfront sales required, just exposure.
            </p>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="flex gap-2.5 items-center"
            aria-label="Notify form"
          >
            <Input
              type="email"
              id="notify-email"
              name="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="min-w-[240px] px-3.5 py-3 rounded-lg border border-input"
              aria-label="Email address"
            />
            <Button 
              type="submit" 
              className="px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
              aria-label="Join the lane"
            >
              Join the Lane
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
