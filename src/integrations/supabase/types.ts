export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_email_logs: {
        Row: {
          admin_id: string | null
          id: string
          merchant_ids: string[] | null
          recipient_count: number
          recipient_mode: string
          sent_at: string | null
          subject: string
          success: boolean | null
        }
        Insert: {
          admin_id?: string | null
          id?: string
          merchant_ids?: string[] | null
          recipient_count: number
          recipient_mode: string
          sent_at?: string | null
          subject: string
          success?: boolean | null
        }
        Update: {
          admin_id?: string | null
          id?: string
          merchant_ids?: string[] | null
          recipient_count?: number
          recipient_mode?: string
          sent_at?: string | null
          subject?: string
          success?: boolean | null
        }
        Relationships: []
      }
      lane_settings: {
        Row: {
          early_access_date: string
          id: string
          lane_status: string
          spots_limit: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          early_access_date: string
          id?: string
          lane_status?: string
          spots_limit?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          early_access_date?: string
          id?: string
          lane_status?: string
          spots_limit?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      merchant_analytics: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          merchant_id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          merchant_id: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          merchant_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_analytics_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_trending_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_analytics_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_analytics_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "public_merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_products: {
        Row: {
          created_at: string
          discount_percentage: number | null
          display_order: number
          id: string
          image_url: string | null
          image_urls: Json | null
          is_featured: boolean | null
          merchant_id: string
          offer_text: string | null
          original_price: number | null
          price: number | null
          product_description: string
          product_name: string
          social_media: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          discount_percentage?: number | null
          display_order?: number
          id?: string
          image_url?: string | null
          image_urls?: Json | null
          is_featured?: boolean | null
          merchant_id: string
          offer_text?: string | null
          original_price?: number | null
          price?: number | null
          product_description: string
          product_name: string
          social_media?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          discount_percentage?: number | null
          display_order?: number
          id?: string
          image_url?: string | null
          image_urls?: Json | null
          is_featured?: boolean | null
          merchant_id?: string
          offer_text?: string | null
          original_price?: number | null
          price?: number | null
          product_description?: string
          product_name?: string
          social_media?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_products_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_trending_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_products_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_products_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "public_merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          airtable_record_id: string | null
          application_status: string
          brand_name: string
          category: string | null
          click_count: number
          created_at: string
          email: string
          id: string
          last_trending_update: string | null
          social_media: string | null
          spots_claimed: number
          status: string | null
          tier: string | null
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          airtable_record_id?: string | null
          application_status?: string
          brand_name: string
          category?: string | null
          click_count?: number
          created_at?: string
          email: string
          id?: string
          last_trending_update?: string | null
          social_media?: string | null
          spots_claimed?: number
          status?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          airtable_record_id?: string | null
          application_status?: string
          brand_name?: string
          category?: string | null
          click_count?: number
          created_at?: string
          email?: string
          id?: string
          last_trending_update?: string | null
          social_media?: string | null
          spots_claimed?: number
          status?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      merchant_trending_stats: {
        Row: {
          brand_name: string | null
          clicks_24h: number | null
          clicks_7d: number | null
          id: string | null
          last_trending_update: string | null
          tier: string | null
          total_clicks: number | null
          views_24h: number | null
          views_7d: number | null
        }
        Relationships: []
      }
      public_merchants: {
        Row: {
          application_status: string | null
          brand_name: string | null
          category: string | null
          click_count: number | null
          created_at: string | null
          id: string | null
          social_media: string | null
          spots_claimed: number | null
          tier: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          application_status?: string | null
          brand_name?: string | null
          category?: string | null
          click_count?: number | null
          created_at?: string | null
          id?: string | null
          social_media?: string | null
          spots_claimed?: number | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          application_status?: string | null
          brand_name?: string | null
          category?: string | null
          click_count?: number | null
          created_at?: string | null
          id?: string | null
          social_media?: string | null
          spots_claimed?: number | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "merchant" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "merchant", "user"],
    },
  },
} as const
