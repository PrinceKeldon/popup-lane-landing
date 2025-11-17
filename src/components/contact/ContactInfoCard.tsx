import { Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const ContactInfoCard = () => {
  return <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Get in Touch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-wine mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">Email</p>
            <a href="mailto:founder@popuplane.com" className="text-sm text-muted-foreground hover:text-wine transition-colors">
              founder@popuplane.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-wine mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">Response Time</p>
            <p className="text-sm text-muted-foreground">
              We typically respond within 24-48 hours
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-wine mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">Location</p>
            <p className="text-sm text-muted-foreground">
              Based in the EU, serving brands worldwide
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MessageCircle className="h-5 w-5 text-wine mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">Office Hours</p>
            <p className="text-sm text-muted-foreground">
              Monday - Friday, 9 AM - 5 PM EST
            </p>
          </div>
        </div>
      </CardContent>
    </Card>;
};