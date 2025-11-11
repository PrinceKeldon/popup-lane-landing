import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAirtable } from "@/hooks/useAirtable";
import { Star, Check, X, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Feedback {
  id: string;
  fields: {
    merchant_name: string;
    brand_website: string;
    rating: number;
    feedback: string;
    allow_quote: boolean;
    status: string;
    admin_notes?: string;
    created_at: string;
  };
}

export const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { listRecords, updateRecord } = useAirtable();
  const { toast } = useToast();

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    const records = await listRecords('Merchant Feedback');
    setFeedbacks(records as Feedback[]);
    setLoading(false);
  };

  const updateStatus = async (recordId: string, status: 'approved' | 'rejected' | 'featured') => {
    const success = await updateRecord('Merchant Feedback', recordId, { status });
    if (success) {
      loadFeedbacks();
    }
  };

  const saveDetails = async () => {
    if (!selectedFeedback) return;
    
    const success = await updateRecord('Merchant Feedback', selectedFeedback.id, {
      admin_notes: adminNotes,
    });
    
    if (success) {
      setSelectedFeedback(null);
      loadFeedbacks();
    }
  };

  const openDetailsModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminNotes(feedback.fields.admin_notes || "");
  };

  const filteredFeedbacks = feedbacks.filter(fb => 
    statusFilter === "all" || fb.fields.status === statusFilter
  );

  if (loading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({feedbacks.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({feedbacks.filter(f => f.fields.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({feedbacks.filter(f => f.fields.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="featured">
            Featured ({feedbacks.filter(f => f.fields.status === 'featured').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{feedback.fields.merchant_name}</CardTitle>
                  <CardDescription>{feedback.fields.brand_website}</CardDescription>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.fields.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant={
                      feedback.fields.status === 'featured' ? 'default' :
                      feedback.fields.status === 'approved' ? 'secondary' :
                      feedback.fields.status === 'pending' ? 'outline' : 'destructive'
                    }>
                      {feedback.fields.status}
                    </Badge>
                    {feedback.fields.allow_quote && (
                      <Badge variant="outline">Quotable</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openDetailsModal(feedback)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  {feedback.fields.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(feedback.id, 'approved')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(feedback.id, 'rejected')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {feedback.fields.status === 'approved' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updateStatus(feedback.id, 'featured')}
                    >
                      Feature
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feedback.fields.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <Label>Merchant Name</Label>
                <p className="text-sm">{selectedFeedback.fields.merchant_name}</p>
              </div>
              <div>
                <Label>Website</Label>
                <p className="text-sm">{selectedFeedback.fields.brand_website}</p>
              </div>
              <div>
                <Label>Rating</Label>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < selectedFeedback.fields.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label>Feedback</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedFeedback.fields.feedback}</p>
              </div>
              <div>
                <Label htmlFor="admin_notes">Admin Notes</Label>
                <Textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes..."
                />
              </div>
              <Button onClick={saveDetails} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
