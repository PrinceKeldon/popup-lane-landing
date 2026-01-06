import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCountdown } from "@/hooks/useCountdown";
import { Heart } from "lucide-react";

export const LaneSettings = () => {
  const [earlyAccessDate, setEarlyAccessDate] = useState("");
  const [laneCloseDate, setLaneCloseDate] = useState("");
  const [laneStatus, setLaneStatus] = useState("closed");
  const [spotsLimit, setSpotsLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Show countdown to open date when closed, countdown to close date when open
  const isOpen = laneStatus === "open";
  const countdownTargetDate = isOpen ? laneCloseDate : earlyAccessDate;
  const countdown = useCountdown(countdownTargetDate || "");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('lane_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setEarlyAccessDate(new Date(data.early_access_date).toISOString().slice(0, 16));
        if (data.lane_close_date) {
          setLaneCloseDate(new Date(data.lane_close_date).toISOString().slice(0, 16));
        }
        setLaneStatus(data.lane_status);
        setSpotsLimit(data.spots_limit);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: existingSettings } = await supabase
        .from('lane_settings')
        .select('id')
        .limit(1)
        .single();

      const settingsData = {
        early_access_date: new Date(earlyAccessDate).toISOString(),
        lane_close_date: laneCloseDate ? new Date(laneCloseDate).toISOString() : null,
        lane_status: laneStatus,
        spots_limit: spotsLimit,
        updated_at: new Date().toISOString()
      };

      if (existingSettings) {
        const { error } = await supabase
          .from('lane_settings')
          .update(settingsData)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lane_settings')
          .insert([settingsData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Lane settings updated successfully. Changes reflect immediately on the website."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4 border-wine/10">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-wine" fill="currentColor" />
        <h3 className="text-lg font-semibold">Lane Settings</h3>
      </div>
      
      <p className="text-sm text-muted-foreground bg-valentine-blush/20 p-3 rounded-lg">
        <strong>Single Source of Truth:</strong> These settings control the countdown timer and lane status displayed on the entire website. All pages read from this database.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="earlyDate">Lane Opens (Early Access Date)</Label>
            <Input
              id="earlyDate"
              type="datetime-local"
              value={earlyAccessDate}
              onChange={(e) => setEarlyAccessDate(e.target.value)}
              className="border-wine/20"
            />
            <p className="text-xs text-muted-foreground">
              When the lane opens for shopping
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="closeDate">Lane Closes Date</Label>
            <Input
              id="closeDate"
              type="datetime-local"
              value={laneCloseDate}
              onChange={(e) => setLaneCloseDate(e.target.value)}
              className="border-wine/20"
            />
            <p className="text-xs text-muted-foreground">
              When the lane closes (shown when lane is open)
            </p>
          </div>
        </div>

        {/* Countdown Display */}
        {countdownTargetDate && (
          <Card className="p-4 bg-gradient-to-r from-valentine-blush/20 to-valentine-rose/10 border-wine/10">
            <Label className="text-sm font-medium mb-2 block text-wine">
              {isOpen ? "⏰ Countdown to Close (Shown on Website)" : "⏰ Countdown to Open (Shown on Website)"}
            </Label>
            {countdown.isExpired ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-wine">
                  {isOpen ? "🔒 Lane Should Be Closed" : "🎉 Lane Should Be Open!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-background/80 rounded p-2 border border-wine/10">
                  <p className="text-2xl font-bold text-wine">{countdown.days}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="bg-background/80 rounded p-2 border border-wine/10">
                  <p className="text-2xl font-bold text-wine">{countdown.hours}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="bg-background/80 rounded p-2 border border-wine/10">
                  <p className="text-2xl font-bold text-wine">{countdown.minutes}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div className="bg-background/80 rounded p-2 border border-wine/10">
                  <p className="text-2xl font-bold text-wine">{countdown.seconds}</p>
                  <p className="text-xs text-muted-foreground">Seconds</p>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This exact countdown is displayed to all visitors
            </p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="laneStatus">Lane Status</Label>
            <Select value={laneStatus} onValueChange={setLaneStatus}>
              <SelectTrigger id="laneStatus" className="border-wine/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="closed">Closed (Countdown to Open)</SelectItem>
                <SelectItem value="open">Open (Countdown to Close)</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spotsLimit">Merchant Spots Limit</Label>
            <Input
              id="spotsLimit"
              type="number"
              value={spotsLimit}
              onChange={(e) => setSpotsLimit(parseInt(e.target.value))}
              min="1"
              className="border-wine/20"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full bg-wine hover:bg-wine-light">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Changes apply immediately. The website polls for updates every 5 seconds.
        </p>
      </div>
    </Card>
  );
};
