import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";

interface ShopperRecord {
  id: string;
  fields: {
    'Email Address'?: string;
    'Email'?: string;
    'Date Joined'?: string;
    'Created'?: string;
  };
  createdTime?: string;
}

interface ShopperTableProps {
  shoppers: ShopperRecord[];
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
}

export const ShopperTable = ({
  shoppers,
  onRefresh,
  onExport,
  loading
}: ShopperTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={onRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Date Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoppers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  {loading ? 'Loading...' : 'No shoppers yet'}
                </TableCell>
              </TableRow>
            ) : (
              shoppers.map((shopper) => (
                <TableRow key={shopper.id}>
                  <TableCell>
                    {shopper.fields['Email Address'] || shopper.fields['Email'] || '—'}
                  </TableCell>
                  <TableCell>
                    {shopper.fields['Date Joined'] || 
                     shopper.fields['Created'] || 
                     shopper.createdTime || '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
