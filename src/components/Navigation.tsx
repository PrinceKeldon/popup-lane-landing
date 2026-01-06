import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, User, LogOut, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { POPUP_LANE_CONFIG } from "@/lib/constants";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const scrollToMerchantForm = () => {
    const formsSection = document.getElementById("signup-forms");
    if (formsSection) {
      formsSection.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-wine/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with Valentine heart */}
          <Link to="/" className="flex items-center gap-2 text-xl font-serif font-bold hover:opacity-80 transition-opacity group">
            <Heart className="w-5 h-5 text-wine group-hover:scale-110 transition-transform" fill="currentColor" />
            PopUp Lane
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/lane" className="text-sm font-medium hover:text-primary transition-colors">
              The Lane
            </Link>
            <Link to="/backroom" className="text-sm font-medium hover:text-primary transition-colors">
              The Backroom
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            
            {/* For Merchants Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  For Merchants
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                {user ? (
                  <DropdownMenuItem onClick={() => navigate(POPUP_LANE_CONFIG.MERCHANT_DASHBOARD_ROUTE)}>
                    Dashboard
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate(POPUP_LANE_CONFIG.MERCHANT_LOGIN_ROUTE)}>
                      Merchant Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={scrollToMerchantForm}>
                      Apply as Merchant
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover">
                  <DropdownMenuItem onClick={() => navigate(POPUP_LANE_CONFIG.MERCHANT_DASHBOARD_ROUTE)}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate(POPUP_LANE_CONFIG.MERCHANT_LOGIN_ROUTE)}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/lane");
                setMobileMenuOpen(false);
              }}
            >
              The Lane
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/backroom");
                setMobileMenuOpen(false);
              }}
            >
              The Backroom
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/pricing");
                setMobileMenuOpen(false);
              }}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/contact");
                setMobileMenuOpen(false);
              }}
            >
              Contact
            </Button>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(POPUP_LANE_CONFIG.MERCHANT_DASHBOARD_ROUTE);
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(POPUP_LANE_CONFIG.MERCHANT_LOGIN_ROUTE);
                    setMobileMenuOpen(false);
                  }}
                >
                  Merchant Login
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={scrollToMerchantForm}
                >
                  Apply as Merchant
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
