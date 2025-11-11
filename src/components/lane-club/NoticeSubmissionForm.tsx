import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const noticeSchema = z.object({
  merchant_name: z.string().trim().min(1, "Merchant name is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
  category: z.enum(["Update", "Offer", "Collab", "Event"]),
  link: z.string().trim().url("Must be a valid URL").max(500).optional().or(z.literal("")),
  visibility: z.enum(["Public", "Merchant-only"]),
});

type NoticeFormData = z.infer<typeof noticeSchema>;

interface NoticeSubmissionFormProps {
  onSuccess?: () => void;
}

export const NoticeSubmissionForm = ({ onSuccess }: NoticeSubmissionFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      category: "Update",
      visibility: "Public",
      link: "",
    }
  });

  const category = watch("category");
  const visibility = watch("visibility");

  const onSubmit = async (data: NoticeFormData) => {
    setSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('airtable-submit', {
        body: {
          table: 'Merchant Notices',
          fields: {
            merchant_name: data.merchant_name,
            title: data.title,
            message: data.message,
            category: data.category,
            link: data.link || undefined,
            visibility: data.visibility,
            status: 'pending',
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Notice Submitted!",
        description: "Your notice is pending admin approval and will appear soon.",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting notice:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="merchant_name">Merchant/Brand Name *</Label>
        <Input
          id="merchant_name"
          placeholder="Your brand name"
          {...register("merchant_name")}
        />
        {errors.merchant_name && (
          <p className="text-sm text-destructive">{errors.merchant_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Notice Title *</Label>
        <Input
          id="title"
          placeholder="What's your announcement?"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Share the details..."
          rows={5}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={category} onValueChange={(value) => setValue("category", value as any)}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Update">Update</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Collab">Collab</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (Optional)</Label>
        <Input
          id="link"
          type="url"
          placeholder="https://yourbrand.com/offer"
          {...register("link")}
        />
        {errors.link && (
          <p className="text-sm text-destructive">{errors.link.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Visibility *</Label>
        <RadioGroup value={visibility} onValueChange={(value) => setValue("visibility", value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Public" id="public" />
            <Label htmlFor="public" className="font-normal cursor-pointer">
              Public — Everyone can see this
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Merchant-only" id="merchant" />
            <Label htmlFor="merchant" className="font-normal cursor-pointer">
              Merchant-only — Only other merchants
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Notice"
        )}
      </Button>
    </form>
  );
};
