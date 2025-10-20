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

export const LaneSettings = () => {
  const [earlyAccessDate, setEarlyAccessDate] = useState("");
  const [laneStatus, setLaneStatus] = useState("closed");
  const [spotsLimit, setSpotsLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
