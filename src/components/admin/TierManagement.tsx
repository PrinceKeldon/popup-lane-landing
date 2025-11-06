import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Star, TrendingUp, MoreVertical, Check, X, Mail } from "lucide-react";
import { MerchantEmailComposer } from "./MerchantEmailComposer";

const TIERS = [
  { value: "standard", label: "Standard", icon: null },
  { value: "featured", label: "Featured", icon: Star },
  { value: "trending", label: "Trending", icon: TrendingUp },
];

export function TierManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingChanges, setPendingChanges] = useState<Map<string, string>>(new Map());
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'suspend' | 'delete' | 'restore' | null;
    merchant: any;
  }>({ open: false, action: null, merchant: null });
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    merchantId: string | null;
  }>({ open: false, merchantId: null });

  const { data: merchants, isLoading, refetch } = useQuery({
    queryKey: ["admin-merchants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .eq("application_status", "Approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ merchantId, status }: { merchantId: string; status: string }) => {
      const { error } = await supabase
        .from("merchants")
        .update({ status })
        .eq("id", merchantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-merchants"] });
      toast({
        title: "Status updated",
        description: "Merchant status has been updated successfully.",
      });
      setActionDialog({ open: false, action: null, merchant: null });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTierMutation = useMutation({
    mutationFn: async ({ merchantId, tier }: { merchantId: string; tier: string }) => {
      const { error } = await supabase
        .from("merchants")
        .update({ tier: tier === "standard" ? null : tier })
        .eq("id", merchantId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-merchants"] });
      setPendingChanges(prev => {
        const newMap = new Map(prev);
        newMap.delete(variables.merchantId);
        return newMap;
      });
      toast({
        title: "Tier updated",
        description: "Merchant tier has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTierChange = (merchantId: string, newTier: string) => {
    setPendingChanges(prev => new Map(prev).set(merchantId, newTier));
  };

  const confirmTierChange = (merchantId: string) => {
    const tier = pendingChanges.get(merchantId);
    if (tier) {
      updateTierMutation.mutate({ merchantId, tier });
    }
  };

  const cancelTierChange = (merchantId: string) => {
    setPendingChanges(prev => {
      const newMap = new Map(prev);
      newMap.delete(merchantId);
      return newMap;
    });
  };

  const handleStatusAction = (action: 'suspend' | 'delete' | 'restore', merchant: any) => {
    setActionDialog({ open: true, action, merchant });
  };

  const confirmStatusAction = () => {
    if (!actionDialog.merchant || !actionDialog.action) return;

    let status = 'active';
    if (actionDialog.action === 'suspend') status = 'suspended';
    if (actionDialog.action === 'delete') status = 'deleted';

    updateStatusMutation.mutate({
      merchantId: actionDialog.merchant.id,
      status,
    });
  };

  const getDisplayedTier = (merchant: any) => {
    return pendingChanges.get(merchant.id) || merchant.tier || "standard";
  };

  const filteredMerchants = merchants?.filter((merchant) => {
    const query = searchQuery.toLowerCase();
    return (
      merchant.brand_name.toLowerCase().includes(query) ||
      merchant.email.toLowerCase().includes(query)
    );
  });

  const getTierBadge = (tier: string | null) => {
    const tierInfo = TIERS.find((t) => t.value === (tier || "standard"));
    const Icon = tierInfo?.icon;

    return (
      <Badge
        variant={tier === "featured" ? "default" : tier === "trending" ? "secondary" : "outline"}
        className="flex items-center gap-1 w-fit"
      >
        {Icon && <Icon className="h-3 w-3" />}
        {tierInfo?.label}
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Tier Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage featured and trending brand visibility
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search by brand or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Tier</TableHead>
                <TableHead>Set Tier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading merchants...
                  </TableCell>
                </TableRow>
              ) : filteredMerchants && filteredMerchants.length > 0 ? (
                filteredMerchants.map((merchant) => {
                  const hasPendingChange = pendingChanges.has(merchant.id);
                  const isDeleted = merchant.status === 'deleted';
                  const isSuspended = merchant.status === 'suspended';

                  return (
                    <TableRow key={merchant.id} className={isDeleted || isSuspended ? "opacity-60" : ""}>
                      <TableCell className="font-medium">{merchant.brand_name}</TableCell>
                      <TableCell>{merchant.email}</TableCell>
                      <TableCell>{merchant.category || "—"}</TableCell>
                      <TableCell>
                        {isDeleted ? (
                          <Badge variant="destructive">Deleted</Badge>
                        ) : isSuspended ? (
                          <Badge variant="secondary">Suspended</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasPendingChange ? (
                          <Badge variant="secondary" className="gap-1">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Pending
                          </Badge>
                        ) : (
                          getTierBadge(merchant.tier)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={getDisplayedTier(merchant)}
                            onValueChange={(value) => handleTierChange(merchant.id, value)}
                            disabled={isDeleted || isSuspended}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIERS.map((tier) => (
                                <SelectItem key={tier.value} value={tier.value}>
                                  <div className="flex items-center gap-2">
                                    {tier.icon && <tier.icon className="h-3 w-3" />}
                                    {tier.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {hasPendingChange && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => confirmTierChange(merchant.id)}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => cancelTierChange(merchant.id)}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEmailDialog({ open: true, merchantId: merchant.id })}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            {!isDeleted && !isSuspended && (
                              <DropdownMenuItem
                                onClick={() => handleStatusAction('suspend', merchant)}
                              >
                                Suspend Merchant
                              </DropdownMenuItem>
                            )}
                            {!isDeleted && (
                              <DropdownMenuItem
                                onClick={() => handleStatusAction('delete', merchant)}
                                className="text-destructive"
                              >
                                Delete Merchant
                              </DropdownMenuItem>
                            )}
                            {(isDeleted || isSuspended) && (
                              <DropdownMenuItem
                                onClick={() => handleStatusAction('restore', merchant)}
                              >
                                Restore Merchant
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No merchants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, action: null, merchant: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'suspend' && 'Suspend Merchant'}
              {actionDialog.action === 'delete' && 'Delete Merchant'}
              {actionDialog.action === 'restore' && 'Restore Merchant'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'suspend' && (
                <>Are you sure you want to suspend <strong>{actionDialog.merchant?.brand_name}</strong>? They will be hidden from the public lane but their data will be preserved.</>
              )}
              {actionDialog.action === 'delete' && (
                <>Are you sure you want to delete <strong>{actionDialog.merchant?.brand_name}</strong>? This is a soft delete and can be restored later.</>
              )}
              {actionDialog.action === 'restore' && (
                <>Are you sure you want to restore <strong>{actionDialog.merchant?.brand_name}</strong>? They will become active and visible on the public lane again.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusAction}>
              {actionDialog.action === 'delete' ? 'Delete' : actionDialog.action === 'suspend' ? 'Suspend' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={emailDialog.open} onOpenChange={(open) => setEmailDialog({ open, merchantId: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Email to Merchant</DialogTitle>
          </DialogHeader>
          <MerchantEmailComposer
            preselectedMerchantId={emailDialog.merchantId || undefined}
            onClose={() => setEmailDialog({ open: false, merchantId: null })}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
