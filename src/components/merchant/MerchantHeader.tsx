import { useCountdown } from "@/hooks/useCountdown";
import { useMerchantSpots } from "@/hooks/useMerchantSpots";
import { POPUP_LANE_CONFIG } from "@/lib/constants";

interface MerchantHeaderProps {
  brandName: string;
  email: string;
  productCount: number;
}

export const MerchantHeader = ({ brandName, email, productCount }: MerchantHeaderProps) => {
  const countdown = useCountdown(POPUP_LANE_CONFIG.LANE_OPEN_DATE);
  const { spotsRemaining } = useMerchantSpots();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {brandName}!</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Lane Status</p>
          <p className="text-2xl font-bold">
            {countdown.isExpired ? (
              <span className="text-green-500">Live!</span>
            ) : (
              `Opens in ${countdown.days} days`
            )}
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Spots Remaining</p>
          <p className="text-2xl font-bold">{spotsRemaining}</p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Your Products</p>
          <p className="text-2xl font-bold">{productCount}</p>
        </div>
      </div>
    </div>
  );
};
