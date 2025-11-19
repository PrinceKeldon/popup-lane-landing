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
import { useQueryClient } from "@tanstack/react-query";

export const LaneSettings = () => {
  const [earlyAccessDate, setEarlyAccessDate] = useState("");
  const [laneCloseDate, setLaneCloseDate] = useState("");
  const [laneStatus, setLaneStatus] = useState("closed");
  const [spotsLimit, setSpotsLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const openCountdown = useCountdown(
    earlyAccessDate ? new Date(earlyAccessDate) : new Date()
  );
  
  const closeCountdown = useCountdown(
    laneCloseDate ? new Date(laneCloseDate) : new Date()
  );

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

      // Force refetch of lane settings to sync across platform
      await queryClient.invalidateQueries({ queryKey: ['lane-settings'] });
      
      toast({
        title: "Success",
        description: "Lane settings updated successfully"
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
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Lane Settings</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="earlyDate">Early Access Date</Label>
          <Input
            id="earlyDate"
            type="datetime-local"
            value={earlyAccessDate}
            onChange={(e) => setEarlyAccessDate(e.target.value)}
          />
        </div>

        {/* Opening Countdown Display */}
        {earlyAccessDate && (
          <Card className="p-4 bg-muted/50">
            <Label className="text-sm font-medium mb-2 block">
              Opening Countdown Preview
            </Label>
            {openCountdown.isExpired ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">
                  🎉 Lane Opens Now!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{openCountdown.days}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{openCountdown.hours}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{openCountdown.minutes}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{openCountdown.seconds}</p>
                  <p className="text-xs text-muted-foreground">Seconds</p>
                </div>
              </div>
            )}
          </Card>
        )}

        <div className="space-y-2">
          <Label htmlFor="closeDate">Lane Close Date</Label>
          <Input
            id="closeDate"
            type="datetime-local"
            value={laneCloseDate}
            onChange={(e) => setLaneCloseDate(e.target.value)}
          />
        </div>

        {/* Closing Countdown Display */}
        {laneCloseDate && (
          <Card className="p-4 bg-muted/50">
            <Label className="text-sm font-medium mb-2 block">
              Closing Countdown Preview
            </Label>
            {closeCountdown.isExpired ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">
                  🔒 Lane Closed!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{closeCountdown.days}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{closeCountdown.hours}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{closeCountdown.minutes}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div className="bg-background rounded p-2">
                  <p className="text-2xl font-bold">{closeCountdown.seconds}</p>
                  <p className="text-xs text-muted-foreground">Seconds</p>
                </div>
              </div>
            )}
          </Card>
        )}

        <div className="space-y-2">
          <Label htmlFor="laneStatus">Lane Status</Label>
          <Select value={laneStatus} onValueChange={setLaneStatus}>
            <SelectTrigger id="laneStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spotsLimit">Spots Limit</Label>
          <Input
            id="spotsLimit"
            type="number"
            value={spotsLimit}
            onChange={(e) => setSpotsLimit(parseInt(e.target.value))}
            min="1"
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Change the early access date and lane status. Updates will be reflected immediately.
        </p>
      </div>
    </Card>
  );
};
