import { Link } from "react-router-dom";
import { POPUP_LANE_CONFIG } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="mt-15 py-7 text-center text-muted-foreground text-[13px] border-t border-border/50">
      <div className="container px-4 mx-auto">
        <p className="mb-2">
          © 2025 PopUp Lane — A digital lane that opens for moments, and remembers the brands that made them.
        </p>
        <div className="text-xs italic opacity-75 mb-3">
          Built for moments. Remembered forever.
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap" aria-hidden="false">
          <Link to={POPUP_LANE_CONFIG.MERCHANT_LOGIN_ROUTE} className="text-muted-foreground hover:text-foreground transition-colors no-underline">
            Merchant Portal
          </Link>
          <span>·</span>
          <a 
            href="#signup-forms" 
            onClick={(e) => {
              e.preventDefault();
              const formsSection = document.getElementById("signup-forms");
              formsSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Become a Merchant
          </a>
          <span>·</span>
          <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors no-underline">
            Terms
          </a>
          <span>·</span>
          <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors no-underline">
            Privacy
          </a>
          <span>·</span>
          <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors no-underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
