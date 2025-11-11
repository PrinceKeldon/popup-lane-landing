import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Notice {
  id: string;
  fields: {
    merchant_name: string;
    title: string;
    message: string;
    category: string;
    link?: string;
    visibility: string;
    featured?: boolean;
    intro_text?: string;
    status: string;
    created_at: string;
  };
}

interface NoticeListProps {
  visibility: "Public" | "Merchant-only";
  refreshTrigger?: number;
}

const categoryColors = {
  Update: "bg-blue-500/10 text-blue-700 border-blue-200",
  Offer: "bg-primary/10 text-primary border-primary/20",
  Collab: "bg-purple-500/10 text-purple-700 border-purple-200",
  Event: "bg-green-500/10 text-green-700 border-green-200",
};

export const NoticeList = ({ visibility, refreshTrigger }: NoticeListProps) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, [visibility, refreshTrigger]);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-airtable', {
        body: { action: 'list', table: 'Merchant Notices' }
      });

      if (error) throw error;

      const filtered = (data.records || []).filter((notice: Notice) => 
        notice.fields.visibility === visibility && 
        notice.fields.status === 'approved'
      );

      setNotices(filtered);
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            No notices yet. Be the first to post!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notices.map((notice) => (
        <Card key={notice.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className={categoryColors[notice.fields.category as keyof typeof categoryColors]}
                  >
                    {notice.fields.category}
                  </Badge>
                  {notice.fields.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{notice.fields.title}</CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {notice.fields.merchant_name}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {notice.fields.intro_text && (
              <p className="text-sm text-primary italic border-l-2 border-primary pl-3">
                {notice.fields.intro_text}
              </p>
            )}
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {notice.fields.message}
            </p>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                {format(new Date(notice.fields.created_at), 'MMM d, yyyy')}
              </p>
              {notice.fields.link && (
                <Button variant="outline" size="sm" asChild>
                  <a href={notice.fields.link} target="_blank" rel="noopener noreferrer" className="gap-2">
                    Learn More
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
