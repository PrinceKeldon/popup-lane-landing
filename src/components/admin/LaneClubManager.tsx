import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Feedback {
  id: string;
  brand_name: string;
  email: string;
  first_impression: string;
  short_quote: string | null;
  excited_feature: string | null;
  improvement: string | null;
  rating: number;
  consent_to_feature: boolean;
  logo_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  featured_on_site: boolean;
  created_at: string;
}

export const LaneClubManager = () => {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [featuredOnSite, setFeaturedOnSite] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('lane_club_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks((data || []) as Feedback[]);
    } catch (error: any) {
      console.error('Error loading feedbacks:', error);
      toast({
        title: "Error loading feedbacks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('lane_club_feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Feedback ${status}`,
        description: `Successfully ${status} the feedback.`,
      });

      loadFeedbacks();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveDetails = async () => {
    if (!selectedFeedback) return;

    try {
      const { error } = await supabase
        .from('lane_club_feedback')
        .update({
          admin_notes: adminNotes,
          featured_on_site: featuredOnSite,
        })
        .eq('id', selectedFeedback.id);

      if (error) throw error;

      toast({
        title: "Details saved",
        description: "Feedback details updated successfully.",
      });

      setSelectedFeedback(null);
      loadFeedbacks();
    } catch (error: any) {
      console.error('Error saving details:', error);
      toast({
        title: "Error saving details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openDetailsModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminNotes(feedback.admin_notes || "");
    setFeaturedOnSite(feedback.featured_on_site);
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (statusFilter === "all") return true;
    return f.status === statusFilter;
  });

  if (loading) {
    return <div className="p-8 text-center">Loading feedbacks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lane Club Feedback</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedbacks.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell className="font-medium">{feedback.brand_name}</TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {Array.from({ length: feedback.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      feedback.status === 'approved'
                        ? 'default'
                        : feedback.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {feedback.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {feedback.featured_on_site && (
                    <Badge variant="outline">Featured</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(feedback.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetailsModal(feedback)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {feedback.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(feedback.id, 'approved')}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(feedback.id, 'rejected')}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFeedback?.brand_name}</DialogTitle>
            <DialogDescription>{selectedFeedback?.email}</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              {selectedFeedback.logo_url && (
                <div>
                  <Label>Logo</Label>
                  <img
                    src={selectedFeedback.logo_url}
                    alt="Brand logo"
                    className="w-32 h-32 object-contain border rounded mt-2"
                  />
                </div>
              )}

              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: selectedFeedback.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
              </div>

              <div>
                <Label>First Impression</Label>
                <p className="mt-2 text-sm">{selectedFeedback.first_impression}</p>
              </div>

              {selectedFeedback.short_quote && (
                <div>
                  <Label>Short Quote</Label>
                  <p className="mt-2 text-sm italic">"{selectedFeedback.short_quote}"</p>
                </div>
              )}

              {selectedFeedback.excited_feature && (
                <div>
                  <Label>Most Exciting Feature</Label>
                  <p className="mt-2 text-sm">{selectedFeedback.excited_feature}</p>
                </div>
              )}

              {selectedFeedback.improvement && (
                <div>
                  <Label>Suggestions for Improvement</Label>
                  <p className="mt-2 text-sm">{selectedFeedback.improvement}</p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={featuredOnSite}
                  onCheckedChange={setFeaturedOnSite}
                />
                <Label htmlFor="featured">Feature on site</Label>
              </div>

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <Button onClick={saveDetails} className="w-full">
                Save Details
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
