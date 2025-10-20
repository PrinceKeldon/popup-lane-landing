import { Card } from "@/components/ui/card";

interface OverviewStatsProps {
  merchantsTotal: number;
  merchantsPending: number;
  shoppersTotal: number;
  spotsRemaining: number;
}

export const OverviewStats = ({
  merchantsTotal,
  merchantsPending,
  shoppersTotal,
  spotsRemaining
}: OverviewStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
          Merchants — Total
        </h4>
        <div className="text-3xl font-bold text-primary">{merchantsTotal}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Includes pending, approved
        </p>
      </Card>

      <Card className="p-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
          Merchants — Pending
        </h4>
        <div className="text-3xl font-bold text-primary">{merchantsPending}</div>
        <p className="text-xs text-muted-foreground mt-1">Need approval</p>
      </Card>

      <Card className="p-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
          Shoppers Signed Up
        </h4>
        <div className="text-3xl font-bold text-primary">{shoppersTotal}</div>
        <p className="text-xs text-muted-foreground mt-1">Emails collected</p>
      </Card>

      <Card className="p-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
          Spots Remaining
        </h4>
        <div className="text-3xl font-bold text-primary">{spotsRemaining}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Limited slots for this lane
        </p>
      </Card>
    </div>
  );
};
