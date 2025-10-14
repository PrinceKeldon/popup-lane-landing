import { Heart } from "lucide-react";

export const Footer = () => {
  const links = {
    shoppers: [
      { label: "Browse Deals", href: "#" },
      { label: "How It Works", href: "#" },
      { label: "Join Newsletter", href: "#" },
    ],
    merchants: [
      { label: "List Your Deal", href: "#" },
      { label: "Merchant Guide", href: "#" },
      { label: "Pricing", href: "#" },
    ],
    company: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gradient">PopUp Lane</h3>
            <p className="text-sm text-muted-foreground">
              A seasonal street for small brands, creators, and indie merchants.
            </p>
          </div>

          {/* Shoppers */}
          <div>
            <h4 className="font-bold mb-4">For Shoppers</h4>
            <ul className="space-y-2">
              {links.shoppers.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Merchants */}
          <div>
            <h4 className="font-bold mb-4">For Merchants</h4>
            <ul className="space-y-2">
              {links.merchants.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 PopUp Lane. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>for small businesses</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
