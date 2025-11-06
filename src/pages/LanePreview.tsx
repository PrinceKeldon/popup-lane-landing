import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, ExternalLink, Heart, Loader2, Share2, Store } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductImageCarousel from "@/components/lane/ProductImageCarousel";
import { getProductImages, getProductImagesFromMultiple } from "@/lib/image-utils";
export default function LanePreview() {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    data: merchants,
    isLoading
  } = useQuery({
    queryKey: ["preview-merchants"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("merchants").select(`
          id,
          brand_name,
          website_url,
          social_media,
          category,
          application_status,
          tier,
          click_count,
          created_at,
          updated_at,
          spots_claimed,
          airtable_record_id,
          merchant_products (*)
        `).eq("application_status", "Approved").order("click_count", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const featuredMerchants = merchants?.filter(m => m.tier === "featured").slice(0, 2) || [];
  const trendingMerchants = merchants?.filter(m => m.tier === "trending").slice(0, 3) || [];
  const selectedMerchant = merchants?.find(m => m.id === selectedMerchantId);
  const selectedProducts = selectedMerchant?.merchant_products || [];
  const carouselImages = getProductImagesFromMultiple(selectedProducts);
  const handleNext = () => {
    if (carouselImages.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % carouselImages.length);
    }
  };
  const handlePrev = () => {
    if (carouselImages.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + carouselImages.length) % carouselImages.length);
    }
  };
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-wine" />
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero */}
        <section className="text-center py-12 px-4 rounded-2xl mb-8 bg-gradient-to-b from-wine/5 to-background/50 border border-wine/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wine to-wine-light" />
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Black Friday Preview</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Small Brands with Big Energy
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            A living preview of PopUp Lane — featured brands, trending names, and the full multi-row Lane. 
            Each tile shows sale products, discounts, and offers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-wine hover:bg-wine-light">Explore the Lane</Button>
            <Button variant="outline">Get Notified</Button>
          </div>
        </section>

        {/* Featured Brands */}
        {featuredMerchants.length > 0 && <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Featured Brands</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredMerchants.map(merchant => {
            const mainProduct = merchant.merchant_products?.[0];
            const images = mainProduct ? getProductImages(mainProduct) : [];
            return <div key={merchant.id} className="group relative bg-card border rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col min-h-[420px]" onClick={() => setSelectedMerchantId(merchant.id)}>
                  <div className="flex-shrink-0">
                    <ProductImageCarousel images={images} brandName={merchant.brand_name} discountBadge={mainProduct?.discount_percentage && <div className="absolute top-3 left-3 bg-white text-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                            {mainProduct.discount_percentage}% OFF
                          </div>} />
                  </div>
                  <div className="p-6 space-y-2 flex-1 flex flex-col bg-white">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      BY {merchant.brand_name}
                    </p>
                    {mainProduct && <>
                        <h4 className="text-base font-bold leading-tight text-foreground">
                          {mainProduct.product_name}
                        </h4>
                        {mainProduct.discount_percentage && mainProduct.original_price ? <div className="flex items-baseline gap-2 text-sm pt-1">
                            <span className="text-lg font-bold">
                              ${(parseFloat(String(mainProduct.original_price)) * (1 - mainProduct.discount_percentage / 100)).toFixed(2)}
                            </span>
                            <span className="line-through text-muted-foreground text-sm">
                              ${parseFloat(String(mainProduct.original_price)).toFixed(2)}
                            </span>
                            <span className="text-red-600 font-bold text-sm">
                              {mainProduct.discount_percentage}% Off
                            </span>
                          </div> : mainProduct.price ? <div className="flex items-baseline gap-2 text-sm pt-1">
                            <span className="font-semibold text-muted-foreground">Starting at</span>
                            <span className="text-lg font-bold">
                              ${parseFloat(String(mainProduct.price)).toFixed(2)}
                            </span>
                          </div> : null}
                      </>}
                    {merchant.category && <Badge variant="secondary" className="text-xs w-fit">
                        {merchant.category}
                      </Badge>}
                    <div className="flex gap-2 pt-4 mt-auto">
                      <Button size="sm" className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
                        <Store className="h-4 w-4 mr-1" />
                        Visit Store
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-muted">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>;
          })}
            </div>
          </section>}

        {/* Trending Now */}
        {trendingMerchants.length > 0 && <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">🔥 Trending Now</h3>
              <p className="text-sm text-muted-foreground">What shoppers are saving most</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {trendingMerchants.map(merchant => {
            const mainProduct = merchant.merchant_products?.[0];
            const images = mainProduct ? getProductImages(mainProduct) : [];
            return <div key={merchant.id} className="group relative bg-card border rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col min-h-[340px]" onClick={() => setSelectedMerchantId(merchant.id)}>
                  <div className="flex-shrink-0">
                    <ProductImageCarousel images={images} brandName={merchant.brand_name} discountBadge={mainProduct?.discount_percentage && <div className="absolute top-3 right-3 bg-white text-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                            {mainProduct.discount_percentage}% OFF
                          </div>} />
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col bg-white">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      BY {merchant.brand_name}
                    </p>
                    {mainProduct && <h4 className="text-sm font-bold leading-tight text-foreground">
                        {mainProduct.product_name}
                      </h4>}
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <Badge variant="secondary" className="text-xs bg-red-50 text-red-600">
                        {merchant.click_count || 0} views
                      </Badge>
                      {merchant.category && <span className="text-xs text-muted-foreground">{merchant.category}</span>}
                    </div>
                  </div>
                </div>;
          })}
            </div>
          </section>}

        {/* Main Feed */}
        <section>
          <h3 className="text-2xl font-bold mb-6">All Brands in The Lane</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {merchants?.map(merchant => {
            const mainProduct = merchant.merchant_products?.[0];
            const images = mainProduct ? getProductImages(mainProduct) : [];
            return <div key={merchant.id} className="group relative bg-card border rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col min-h-[380px]" onClick={() => setSelectedMerchantId(merchant.id)}>
                  <div className="flex-shrink-0">
                    <ProductImageCarousel images={images} brandName={merchant.brand_name} discountBadge={mainProduct?.discount_percentage && <div className="absolute top-3 left-3 bg-white text-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                            {mainProduct.discount_percentage}% OFF
                          </div>} />
                  </div>
                  <div className="px-6 pb-6 pt-3 space-y-1 flex-1 flex flex-col justify-end bg-[#f8fcf8]/50">
                    <div className="flex items-center justify-between rounded-none mx-0 px-[6px] bg-transparent">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        BY {merchant.brand_name}
                      </p>
                      {merchant.category && <Badge variant="secondary" className="text-xs bg-transparent">
                          {merchant.category}
                        </Badge>}
                    </div>
                    {mainProduct && <h4 className="leading-tight text-sm font-medium text-slate-50">
                        {mainProduct.product_name}
                      </h4>}
                    <div className="flex gap-2 pt-4 mt-auto">
                      <Button size="sm" variant="default" className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Store
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-muted">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>;
          })}
          </div>
        </section>

        {/* Merchant Apply CTA */}
        <div className="mt-12 text-center p-6 bg-muted/30 rounded-xl">
          <p className="font-semibold mb-2">
            <strong>Merchants:</strong> Want a featured or trending spot?
          </p>
          <p className="text-sm text-muted-foreground mb-4">Apply to be featured this season.</p>
          <Button variant="outline">Apply for a Spot</Button>
        </div>
      </main>

      {/* Modal / Spotlight */}
      <Dialog open={!!selectedMerchantId} onOpenChange={() => setSelectedMerchantId(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedMerchant && <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Carousel */}
              <div>
                <div className="relative rounded-xl overflow-hidden bg-muted">
                  <img src={carouselImages[currentImageIndex]} alt={selectedMerchant.brand_name} className="w-full h-96 object-cover" />
                  {carouselImages.length > 1 && <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                      <Button size="icon" variant="secondary" onClick={handlePrev} className="rounded-full">
                        ←
                      </Button>
                      <Button size="icon" variant="secondary" onClick={handleNext} className="rounded-full">
                        →
                      </Button>
                    </div>}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {currentImageIndex + 1} / {carouselImages.length}
                </p>
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedMerchant.brand_name}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{selectedMerchant.category}</p>
                </DialogHeader>

                {selectedProducts.length > 0 && <div className="space-y-3">
                    <h4 className="font-semibold">Products & Offers:</h4>
                    {selectedProducts.map((product: any) => <div key={product.id} className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold">{product.product_name}</h5>
                          {product.discount_percentage && <Badge className="bg-red-500 text-white">
                              {product.discount_percentage}% OFF
                            </Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{product.product_description}</p>
                        {product.offer_text && <p className="text-sm font-semibold text-wine">{product.offer_text}</p>}
                      </div>)}
                  </div>}

                <div className="flex gap-2">
                  <Button className="flex-1 bg-wine hover:bg-wine-light" onClick={() => window.open(selectedMerchant.website_url || "#", "_blank")}>
                    <Store className="h-4 w-4 mr-2" />
                    Visit Store
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>;
}