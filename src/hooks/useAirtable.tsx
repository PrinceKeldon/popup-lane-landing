import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime?: string;
}

export const useAirtable = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const listRecords = async (table: string): Promise<AirtableRecord[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-airtable', {
        body: { action: 'list', table }
      });

      if (error) throw error;
      return data.records || [];
    } catch (error) {
      console.error('Error listing records:', error);
      toast({
        title: "Error",
        description: "Failed to load data from Airtable",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (
    table: string,
    recordId: string,
    fields: Record<string, any>
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('admin-airtable', {
        body: { action: 'update', table, recordId, fields }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Record updated successfully"
      });
      return true;
    } catch (error) {
      console.error('Error updating record:', error);
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { listRecords, updateRecord, loading };
};
