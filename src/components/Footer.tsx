import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { POPUP_LANE_CONFIG } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="mt-15 py-7 text-center text-muted-foreground text-[13px] border-t border-wine/10 bg-gradient-to-t from-valentine-cream/30 to-transparent">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-wine" fill="currentColor" />
          <p>
            © 2026 PopUp Lane — A digital lane that opens for moments, and remembers the brands that made them.
          </p>
          <Heart className="w-4 h-4 text-wine" fill="currentColor" />
        </div>
        <div className="text-xs italic opacity-75 mb-3 text-wine/70">
          Made with love for small brands.
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap" aria-hidden="false">
          <Link to={POPUP_LANE_CONFIG.MERCHANT_LOGIN_ROUTE} className="text-muted-foreground hover:text-wine transition-colors no-underline">
            Merchant Portal
          </Link>
          <span className="text-wine/30">♥</span>
          <a 
            href="#signup-forms" 
            onClick={(e) => {
              e.preventDefault();
              const formsSection = document.getElementById("signup-forms");
              formsSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-muted-foreground hover:text-wine transition-colors no-underline"
          >
            Become a Merchant
          </a>
          <span className="text-wine/30">♥</span>
          <a href="#terms" className="text-muted-foreground hover:text-wine transition-colors no-underline">
            Terms
          </a>
          <span className="text-wine/30">♥</span>
          <a href="#privacy" className="text-muted-foreground hover:text-wine transition-colors no-underline">
            Privacy
          </a>
          <span className="text-wine/30">♥</span>
          <Link to="/contact" className="text-muted-foreground hover:text-wine transition-colors no-underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
