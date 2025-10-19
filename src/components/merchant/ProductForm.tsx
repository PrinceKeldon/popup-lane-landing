import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required").max(100),
  product_description: z.string().min(1, "Description is required").max(500),
  price: z.string().optional(),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  social_media: z.string().max(200).optional(),
});

interface ProductFormProps {
  merchantId: string;
  onSuccess: () => void;
}

export const ProductForm = ({ merchantId, onSuccess }: ProductFormProps) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      product_description: "",
      price: "",
      website_url: "",
      social_media: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      const { error } = await supabase.from("merchant_products").insert({
        merchant_id: merchantId,
        product_name: values.product_name,
        product_description: values.product_description,
        price: values.price ? parseFloat(values.price) : null,
        website_url: values.website_url || null,
        social_media: values.social_media || null,
      });

      if (error) throw error;

      toast({
        title: "Product added!",
        description: "Your product has been added to your lane.",
      });

      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name *</FormLabel>
              <FormControl>
                <Input placeholder="Amazing Product" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell shoppers about this product..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="29.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Media</FormLabel>
              <FormControl>
                <Input placeholder="@yourbrand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Product
        </Button>
      </form>
    </Form>
  );
};
