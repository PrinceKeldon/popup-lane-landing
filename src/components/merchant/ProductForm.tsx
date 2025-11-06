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
import { Loader2, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableImage } from './SortableImage';
import imageCompression from 'browser-image-compression';

const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required").max(100),
  product_description: z.string().min(1, "Description is required").max(500),
  price: z.string().optional(),
  original_price: z.string().optional(),
  discount_percentage: z.string().optional(),
  offer_text: z.string().max(100).optional(),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  social_media: z.string().max(200).optional(),
  images: z.array(z.instanceof(File)).max(4, "Maximum 4 images allowed").optional(),
});

interface ProductFormProps {
  merchantId: string;
  onSuccess: () => void;
  productId?: string;
  initialData?: any;
}

export const ProductForm = ({ merchantId, onSuccess, productId, initialData }: ProductFormProps) => {
  const { toast } = useToast();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const isEditMode = !!productId;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setExistingImages((items) => {
        const oldIndex = items.findIndex((_, idx) => `image-${idx}` === active.id);
        const newIndex = items.findIndex((_, idx) => `image-${idx}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      product_description: "",
      price: "",
      original_price: "",
      discount_percentage: "",
      offer_text: "",
      website_url: "",
      social_media: "",
    },
  });

  // Load initial data when in edit mode
  useEffect(() => {
    if (initialData) {
      form.reset({
        product_name: initialData.product_name || "",
        product_description: initialData.product_description || "",
        price: initialData.price?.toString() || "",
        original_price: initialData.original_price?.toString() || "",
        discount_percentage: initialData.discount_percentage?.toString() || "",
        offer_text: initialData.offer_text || "",
        website_url: initialData.website_url || "",
        social_media: initialData.social_media || "",
      });
      
      // Load existing images
      const existingImgs = initialData.image_urls || [];
      setExistingImages(existingImgs);
    }
  }, [initialData, form]);

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: 'image/webp' as const,
      initialQuality: 0.85,
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      return file;
    }
  };

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      const imageUrls: string[] = [...existingImages];

      // Upload multiple images if provided
      if (values.images && values.images.length > 0) {
        setIsCompressing(true);
        toast({
          title: "Optimizing images...",
          description: "Compressing images for faster loading",
        });

        for (const image of values.images) {
          const compressedImage = await compressImage(image);
          const fileExt = 'webp';
          const fileName = `${merchantId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, compressedImage, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }
        setIsCompressing(false);
      }

      const productData = {
        merchant_id: merchantId,
        product_name: values.product_name,
        product_description: values.product_description,
        price: values.price ? parseFloat(values.price) : null,
        original_price: values.original_price ? parseFloat(values.original_price) : null,
        discount_percentage: values.discount_percentage ? parseInt(values.discount_percentage) : null,
        offer_text: values.offer_text || null,
        website_url: values.website_url || null,
        social_media: values.social_media || null,
        image_url: imageUrls[0] || null,
        image_urls: imageUrls,
      };

      let error;
      if (isEditMode) {
        const result = await supabase
          .from("merchant_products")
          .update(productData)
          .eq("id", productId);
        error = result.error;
      } else {
        const result = await supabase
          .from("merchant_products")
          .insert(productData);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: isEditMode ? "Product updated!" : "Product added!",
        description: isEditMode 
          ? "Your product has been updated." 
          : "Your product has been added to your lane.",
      });

      form.reset();
      setImagePreviews([]);
      setExistingImages([]);
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
              <FormLabel>Current Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="29.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="original_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price (for discount)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="39.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount %</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="100" placeholder="25" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="offer_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Offer Text</FormLabel>
              <FormControl>
                <Input placeholder="Limited time offer!" {...field} />
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

        <FormField
          control={form.control}
          name="images"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Product Images (Max 4 total)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Existing Images (drag to reorder)
                      </p>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={existingImages.map((_, idx) => `image-${idx}`)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            {existingImages.map((url, idx) => (
                              <SortableImage
                                key={`image-${idx}`}
                                id={`image-${idx}`}
                                url={url}
                                index={idx}
                                onRemove={handleRemoveExistingImage}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}
                  
                  {/* New Images Upload */}
                  {existingImages.length < 4 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Add New Images ({existingImages.length}/4 slots used)
                      </p>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const totalImages = existingImages.length + files.length;
                            if (totalImages > 4) {
                              toast({
                                title: "Too many images",
                                description: `Maximum 4 images allowed. You can add ${4 - existingImages.length} more.`,
                                variant: "destructive",
                              });
                              return;
                            }
                            onChange(files);
                            
                            // Generate previews
                            const previews: string[] = [];
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                previews.push(reader.result as string);
                                if (previews.length === files.length) {
                                  setImagePreviews(previews);
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative w-full h-32 rounded-lg overflow-hidden border">
                              <img
                                src={preview}
                                alt={`Preview ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting || isCompressing}>
          {(form.formState.isSubmitting || isCompressing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isCompressing ? "Optimizing images..." : isEditMode ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};
