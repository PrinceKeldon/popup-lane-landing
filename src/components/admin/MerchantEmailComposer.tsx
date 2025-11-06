import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MerchantEmailComposerProps {
  preselectedMerchantId?: string;
  onClose?: () => void;
}

export function MerchantEmailComposer({ preselectedMerchantId, onClose }: MerchantEmailComposerProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<'all' | 'individual' | 'tier'>(
    preselectedMerchantId ? 'individual' : 'all'
  );
  const [selectedTier, setSelectedTier] = useState<string>("featured");
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>(
    preselectedMerchantId ? [preselectedMerchantId] : []
  );
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: merchants } = useQuery({
    queryKey: ["admin-merchants-email"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select("id, brand_name, email, tier")
        .eq("application_status", "Approved")
        .or("status.is.null,status.eq.active")
        .order("brand_name");

      if (error) throw error;
      return data;
    },
  });

  const getRecipientCount = () => {
    if (mode === 'all') {
      return merchants?.length || 0;
    } else if (mode === 'tier') {
      return merchants?.filter(m => 
        selectedTier === 'standard' ? !m.tier : m.tier === selectedTier
      ).length || 0;
    } else {
      return selectedMerchants.length;
    }
  };

  const getRecipientList = () => {
    if (mode === 'all') {
      return merchants || [];
    } else if (mode === 'tier') {
      return merchants?.filter(m => 
        selectedTier === 'standard' ? !m.tier : m.tier === selectedTier
      ) || [];
    } else {
      return merchants?.filter(m => selectedMerchants.includes(m.id)) || [];
    }
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'individual' && selectedMerchants.length === 0) {
      toast({
        title: "No recipients",
        description: "Please select at least one merchant",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSendEmail = async () => {
    setShowConfirmDialog(false);
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("admin-send-merchant-email", {
        body: {
          mode,
          merchantIds: mode === 'individual' ? selectedMerchants : undefined,
          tier: mode === 'tier' ? selectedTier : undefined,
          subject,
          message,
        },
      });

      if (error) throw error;

      toast({
        title: "Emails sent successfully",
        description: `Sent ${data.sent} of ${data.total} emails`,
      });

      // Reset form
      setSubject("");
      setMessage("");
      setSelectedMerchants(preselectedMerchantId ? [preselectedMerchantId] : []);
      
      if (onClose) onClose();
    } catch (error: any) {
      console.error("Error sending emails:", error);
      toast({
        title: "Error sending emails",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const toggleMerchant = (merchantId: string) => {
    setSelectedMerchants(prev =>
      prev.includes(merchantId)
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId]
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Email Merchants</h2>
        </div>

        {!preselectedMerchantId && (
          <div className="space-y-3">
            <Label>Recipients</Label>
            <RadioGroup value={mode} onValueChange={(value: any) => setMode(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">
                  All Active Merchants ({merchants?.length || 0})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tier" id="tier" />
                <Label htmlFor="tier" className="cursor-pointer">By Tier</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="cursor-pointer">Select Merchants</Label>
              </div>
            </RadioGroup>

            {mode === 'tier' && (
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            )}

            {mode === 'individual' && (
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {merchants?.map((merchant) => (
                  <div key={merchant.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={merchant.id}
                      checked={selectedMerchants.includes(merchant.id)}
                      onCheckedChange={() => toggleMerchant(merchant.id)}
                    />
                    <Label htmlFor={merchant.id} className="cursor-pointer flex-1">
                      {merchant.brand_name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Recipients: <span className="font-semibold text-foreground">{getRecipientCount()}</span>
          </p>
          {getRecipientCount() > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {getRecipientList().map(m => m.brand_name).join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message to merchants..."
            rows={8}
          />
        </div>

        <div className="flex gap-2 justify-end">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSendEmail} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Send</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send an email to {getRecipientCount()} merchant{getRecipientCount() !== 1 ? 's' : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendEmail}>Send Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
