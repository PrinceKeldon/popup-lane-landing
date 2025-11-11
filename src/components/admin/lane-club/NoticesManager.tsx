import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAirtable } from "@/hooks/useAirtable";
import { Check, X, Eye, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notice {
  id: string;
  fields: {
    merchant_name: string;
    title: string;
    message: string;
    category: string;
    link?: string;
    visibility: string;
    featured: boolean;
    intro_text?: string;
    status: string;
    created_at: string;
  };
}

export const NoticesManager = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [introText, setIntroText] = useState("");
  const [featured, setFeatured] = useState(false);
  const { listRecords, updateRecord } = useAirtable();

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    const records = await listRecords('Merchant Notices');
    setNotices(records as Notice[]);
    setLoading(false);
  };

  const updateStatus = async (recordId: string, status: 'approved' | 'rejected') => {
    const success = await updateRecord('Merchant Notices', recordId, { status });
    if (success) {
      loadNotices();
    }
  };

  const saveDetails = async () => {
    if (!selectedNotice) return;
    
    const success = await updateRecord('Merchant Notices', selectedNotice.id, {
      intro_text: introText,
      featured: featured,
    });
    
    if (success) {
      setSelectedNotice(null);
      loadNotices();
    }
  };

  const openDetailsModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setIntroText(notice.fields.intro_text || "");
    setFeatured(notice.fields.featured || false);
  };

  const filteredNotices = notices.filter(notice => 
    statusFilter === "all" || notice.fields.status === statusFilter
  );

  if (loading) {
    return <div className="text-center py-8">Loading notices...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({notices.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({notices.filter(n => n.fields.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({notices.filter(n => n.fields.status === 'approved').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {filteredNotices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{notice.fields.category}</Badge>
                    <Badge variant={notice.fields.visibility === 'Public' ? 'default' : 'secondary'}>
                      {notice.fields.visibility}
                    </Badge>
                    {notice.fields.featured && (
                      <Badge variant="default" className="gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={
                      notice.fields.status === 'approved' ? 'secondary' :
                      notice.fields.status === 'pending' ? 'outline' : 'destructive'
                    }>
                      {notice.fields.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{notice.fields.title}</CardTitle>
                  <CardDescription>{notice.fields.merchant_name}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openDetailsModal(notice)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  {notice.fields.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(notice.id, 'approved')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(notice.id, 'rejected')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{notice.fields.message}</p>
              {notice.fields.link && (
                <a href={notice.fields.link} target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-primary hover:underline mt-2 inline-block">
                  {notice.fields.link}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notice Details</DialogTitle>
          </DialogHeader>
          {selectedNotice && (
            <div className="space-y-4">
              <div>
                <Label>Merchant Name</Label>
                <p className="text-sm">{selectedNotice.fields.merchant_name}</p>
              </div>
              <div>
                <Label>Title</Label>
                <p className="text-sm font-medium">{selectedNotice.fields.title}</p>
              </div>
              <div>
                <Label>Category</Label>
                <Badge variant="outline">{selectedNotice.fields.category}</Badge>
              </div>
              <div>
                <Label>Message</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedNotice.fields.message}</p>
              </div>
              {selectedNotice.fields.link && (
                <div>
                  <Label>Link</Label>
                  <a href={selectedNotice.fields.link} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-primary hover:underline block">
                    {selectedNotice.fields.link}
                  </a>
                </div>
              )}
              <div>
                <Label>Visibility</Label>
                <p className="text-sm">{selectedNotice.fields.visibility}</p>
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium">Admin Controls</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Feature this notice</Label>
                    <p className="text-xs text-muted-foreground">
                      Featured notices appear at the top
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>

                <div>
                  <Label htmlFor="intro_text">Admin Intro Text (Optional)</Label>
                  <Textarea
                    id="intro_text"
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    rows={3}
                    placeholder="Add context for why this is featured..."
                  />
                </div>
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
