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
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Star, TrendingUp } from "lucide-react";

const TIERS = [
  { value: "standard", label: "Standard", icon: null },
  { value: "featured", label: "Featured", icon: Star },
  { value: "trending", label: "Trending", icon: TrendingUp },
];

export function TierManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

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

  const updateTierMutation = useMutation({
    mutationFn: async ({ merchantId, tier }: { merchantId: string; tier: string }) => {
      const { error } = await supabase
        .from("merchants")
        .update({ tier: tier === "standard" ? null : tier })
        .eq("id", merchantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-merchants"] });
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
                <TableHead>Current Tier</TableHead>
                <TableHead>Set Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Loading merchants...
                  </TableCell>
                </TableRow>
              ) : filteredMerchants && filteredMerchants.length > 0 ? (
                filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.brand_name}</TableCell>
                    <TableCell>{merchant.email}</TableCell>
                    <TableCell>{merchant.category || "—"}</TableCell>
                    <TableCell>{getTierBadge(merchant.tier)}</TableCell>
                    <TableCell>
                      <Select
                        value={merchant.tier || "standard"}
                        onValueChange={(value) => {
                          updateTierMutation.mutate({
                            merchantId: merchant.id,
                            tier: value,
                          });
                        }}
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No merchants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
