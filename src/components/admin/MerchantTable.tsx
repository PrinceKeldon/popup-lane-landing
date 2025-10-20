import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RefreshCw } from "lucide-react";

interface MerchantRecord {
  id: string;
  fields: {
    'Brand Name'?: string;
    'Email'?: string;
    'Category'?: string;
    'Application Status'?: string;
    'Status'?: string;
    'Website URL'?: string;
    'Website'?: string;
    'Social Media'?: string;
    'Social'?: string;
  };
}

interface MerchantTableProps {
  merchants: MerchantRecord[];
  onApprove: (recordId: string) => Promise<void>;
  onReject: (recordId: string) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
}

export const MerchantTable = ({
  merchants,
  onApprove,
  onReject,
  onRefresh,
  loading
}: MerchantTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantRecord | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view' | null>(null);

  const filteredMerchants = merchants.filter((merchant) => {
    const query = searchQuery.toLowerCase();
    const brandName = (merchant.fields['Brand Name'] || '').toLowerCase();
    const email = (merchant.fields['Email'] || '').toLowerCase();
    return brandName.includes(query) || email.includes(query);
  });

  const handleAction = async () => {
    if (!selectedMerchant || !actionType) return;

    if (actionType === 'approve') {
      await onApprove(selectedMerchant.id);
    } else if (actionType === 'reject') {
      await onReject(selectedMerchant.id);
    }

    setSelectedMerchant(null);
    setActionType(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search by email or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMerchants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {loading ? 'Loading...' : 'No merchant applications found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredMerchants.map((merchant) => {
                const status = merchant.fields['Application Status'] || merchant.fields['Status'] || 'Pending';
                return (
                  <TableRow key={merchant.id}>
                    <TableCell>{merchant.fields['Brand Name'] || '—'}</TableCell>
                    <TableCell>{merchant.fields['Email'] || '—'}</TableCell>
                    <TableCell>{merchant.fields['Category'] || '—'}</TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell className="space-x-2">
                      {status !== 'Approved' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMerchant(merchant);
                            setActionType('approve');
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      {status !== 'Rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedMerchant(merchant);
                            setActionType('reject');
                          }}
                        >
                          Reject
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setActionType('view');
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!actionType} onOpenChange={() => {
        setActionType(null);
        setSelectedMerchant(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' && 'Approve Merchant'}
              {actionType === 'reject' && 'Reject Merchant'}
              {actionType === 'view' && 'Merchant Details'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'view' ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Brand:</strong> {selectedMerchant?.fields['Brand Name']}</p>
                  <p><strong>Email:</strong> {selectedMerchant?.fields['Email']}</p>
                  <p><strong>Website:</strong> {selectedMerchant?.fields['Website URL'] || selectedMerchant?.fields['Website']}</p>
                  <p><strong>Social:</strong> {selectedMerchant?.fields['Social Media'] || selectedMerchant?.fields['Social']}</p>
                  <p><strong>Category:</strong> {selectedMerchant?.fields['Category']}</p>
                  <p><strong>Status:</strong> {selectedMerchant?.fields['Application Status'] || selectedMerchant?.fields['Status']}</p>
                </div>
              ) : (
                `Are you sure you want to ${actionType} this merchant application?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {actionType === 'view' ? 'Close' : 'Cancel'}
            </AlertDialogCancel>
            {actionType !== 'view' && (
              <AlertDialogAction onClick={handleAction}>
                Confirm
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
