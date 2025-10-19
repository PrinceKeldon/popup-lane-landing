import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface ProductListProps {
  merchantId: string;
}

export const ProductList = ({ merchantId }: ProductListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-lg">{product.product_name}</CardTitle>
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
          </CardHeader>
          <CardContent className="space-y-2">
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
