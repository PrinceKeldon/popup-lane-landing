import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAirtable } from "@/hooks/useAirtable";
import { OverviewStats } from "@/components/admin/OverviewStats";
import { MerchantTable } from "@/components/admin/MerchantTable";
import { ShopperTable } from "@/components/admin/ShopperTable";
import { LaneSettings } from "@/components/admin/LaneSettings";
import { TierManagement } from "@/components/admin/TierManagement";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime?: string;
}

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { listRecords, updateRecord, loading: airtableLoading } = useAirtable();
  const navigate = useNavigate();

  const [merchants, setMerchants] = useState<AirtableRecord[]>([]);
  const [shoppers, setShoppers] = useState<AirtableRecord[]>([]);
  const [spotsLimit, setSpotsLimit] = useState(50);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    const [merchantsData, shoppersData] = await Promise.all([
      listRecords('Merchants'),
      listRecords('Shoppers')
    ]);
    setMerchants(merchantsData);
    setShoppers(shoppersData);
  };

  const handleApprove = async (recordId: string) => {
    const success = await updateRecord('Merchants', recordId, {
      'Application Status': 'Approved',
      'Visibility Status': 'Listed'
    });
    if (success) {
      await loadData();
    }
  };

  const handleReject = async (recordId: string) => {
    const success = await updateRecord('Merchants', recordId, {
      'Application Status': 'Rejected',
      'Visibility Status': 'Hidden'
    });
    if (success) {
      await loadData();
    }
  };

  const handleExportShoppers = () => {
    if (!shoppers || shoppers.length === 0) return;

    const rows = [['Email', 'Date Joined']];
    shoppers.forEach((shopper) => {
      const email = shopper.fields['Email Address'] || shopper.fields['Email'] || '';
      const date = shopper.fields['Date Joined'] || shopper.createdTime || '';
      rows.push([email, date]);
    });

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `popuplane_shoppers_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const merchantsTotal = merchants.length;
  const merchantsPending = merchants.filter((m) => {
    const status = (m.fields['Application Status'] || m.fields['Status'] || '').toString().toLowerCase();
    return !status || status === '' || status === 'pending';
  }).length;
  const shoppersTotal = shoppers.length;
  const spotsRemaining = Math.max(spotsLimit - merchantsTotal, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              PL
            </div>
            <div>
              <h1 className="text-xl font-bold">PopUp Lane — Admin</h1>
              <p className="text-sm text-muted-foreground">
                Manage merchants, shoppers, and lane state
              </p>
            </div>
          </div>

          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <OverviewStats
          merchantsTotal={merchantsTotal}
          merchantsPending={merchantsPending}
          shoppersTotal={shoppersTotal}
          spotsRemaining={spotsRemaining}
        />

        <div className="space-y-6">
          <TierManagement />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  Merchant Applications
                </h2>
                <MerchantTable
                  merchants={merchants}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onRefresh={loadData}
                  loading={airtableLoading}
                />
              </Card>
            </div>

            <div className="space-y-6">
              <LaneSettings />

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Shoppers</h3>
                <ShopperTable
                  shoppers={shoppers}
                  onRefresh={loadData}
                  onExport={handleExportShoppers}
                  loading={airtableLoading}
                />
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PopUp Lane — Admin
        </div>
      </footer>
    </div>
  );
}
