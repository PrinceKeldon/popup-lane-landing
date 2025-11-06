import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { useLaneSettings } from "@/hooks/useLaneSettings";
import { POPUP_LANE_CONFIG } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

interface MerchantConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantData: {
    email: string;
    brandName: string;
    spotsRemaining: number;
  };
}

export const MerchantConfirmationModal = ({
  isOpen,
  onClose,
  merchantData,
}: MerchantConfirmationModalProps) => {
  const navigate = useNavigate();
  const { earlyAccessDate } = useLaneSettings();
  const countdown = useCountdown(earlyAccessDate);

  const handleBuildLane = () => {
    if (!countdown.isExpired) {
      return; // Lane not open yet
    }
    navigate(`${POPUP_LANE_CONFIG.MERCHANT_SIGNUP_ROUTE}?email=${encodeURIComponent(merchantData.email)}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <DialogTitle className="text-2xl">Application Received!</DialogTitle>
          </div>
          <DialogDescription className="text-base space-y-4">
            <p>
              Welcome to PopUp Lane, <strong>{merchantData.brandName}</strong>!
            </p>
            <p>
              We've sent a confirmation to <strong>{merchantData.email}</strong>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Lane Opens In:</p>
            <p className="text-3xl font-bold text-primary">
              {countdown.isExpired ? (
                "Lane is Live!"
              ) : (
                `${countdown.days} Days`
              )}
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Spots Remaining:</p>
            <p className="text-2xl font-bold">{merchantData.spotsRemaining}</p>
          </div>

          {countdown.isExpired ? (
            <Button onClick={handleBuildLane} className="w-full" size="lg">
              Build Your Lane Listing
            </Button>
          ) : (
            <Button disabled className="w-full" size="lg">
              Lane Builder Opens in {countdown.days} Days
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
