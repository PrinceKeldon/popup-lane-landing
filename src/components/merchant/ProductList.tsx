import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2, Edit, Star } from "lucide-react";
import { useState } from "react";
import { ProductForm } from "./ProductForm";

interface ProductListProps {
  merchantId: string;
}

export const ProductList = ({ merchantId }: ProductListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["merchant-products", merchantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchant_products")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (productId: string) => {
    setDeletingId(productId);
    try {
      const { error } = await supabase
        .from("merchant_products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Product removed",
        description: "The product has been removed from your lane.",
      });

      queryClient.invalidateQueries({ queryKey: ["merchant-products", merchantId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      // If setting as featured, first unset all other featured products for this merchant
      if (!currentStatus) {
        await supabase
          .from("merchant_products")
          .update({ is_featured: false })
          .eq("merchant_id", merchantId);
      }

      // Toggle the featured status
      const { error } = await supabase
        .from("merchant_products")
        .update({ is_featured: !currentStatus })
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Removed from featured" : "Set as featured",
        description: currentStatus 
          ? "This product is no longer featured on your lane card."
          : "This product will now display on your lane card.",
      });

      queryClient.invalidateQueries({ queryKey: ["merchant-products", merchantId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No products yet. Add your first product above!</p>
      </div>
    );
  }

  // If editing a product, show the form
  if (editingProduct) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Product</h3>
          <Button variant="outline" onClick={() => setEditingProduct(null)}>
            Cancel
          </Button>
        </div>
        <ProductForm
          merchantId={merchantId}
          productId={editingProduct.id}
          initialData={editingProduct}
          onSuccess={() => {
            setEditingProduct(null);
            queryClient.invalidateQueries({ queryKey: ["merchant-products", merchantId] });
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map((product) => (
        <Card key={product.id} className={product.is_featured ? "ring-2 ring-wine" : ""}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {product.product_name}
                {product.is_featured && (
                  <Star className="h-4 w-4 fill-wine text-wine" />
                )}
              </CardTitle>
              {product.is_featured && (
                <p className="text-xs text-wine font-semibold">Featured Product</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={product.is_featured ? "default" : "ghost"}
                size="icon"
                onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                title={product.is_featured ? "Remove from featured" : "Set as featured"}
                className={product.is_featured ? "bg-wine hover:bg-wine-light" : ""}
              >
                <Star className={`h-4 w-4 ${product.is_featured ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingProduct(product)}
              >
                <Edit className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(product.id)}
                disabled={deletingId === product.id}
              >
                {deletingId === product.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {product.image_url && (
              <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                <img 
                  src={product.image_url} 
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">{product.product_description}</p>
            {product.price && (
              <p className="text-lg font-semibold">${Number(product.price).toFixed(2)}</p>
            )}
            {product.website_url && (
              <p className="text-xs text-muted-foreground truncate">
                <a href={product.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {product.website_url}
                </a>
              </p>
            )}
            {product.social_media && (
              <p className="text-xs text-muted-foreground">{product.social_media}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
