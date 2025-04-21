export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_profiles: {
        Row: {
          address: string | null
          business_name: string
          created_at: string | null
          dark_mode: boolean | null
          default_tax: number | null
          email: string | null
          enable_stripe: boolean | null
          id: string
          inventory_on: boolean | null
          logo: string | null
          phone: string | null
          updated_at: string | null
          weather_cache: Json | null
        }
        Insert: {
          address?: string | null
          business_name: string
          created_at?: string | null
          dark_mode?: boolean | null
          default_tax?: number | null
          email?: string | null
          enable_stripe?: boolean | null
          id?: string
          inventory_on?: boolean | null
          logo?: string | null
          phone?: string | null
          updated_at?: string | null
          weather_cache?: Json | null
        }
        Update: {
          address?: string | null
          business_name?: string
          created_at?: string | null
          dark_mode?: boolean | null
          default_tax?: number | null
          email?: string | null
          enable_stripe?: boolean | null
          id?: string
          inventory_on?: boolean | null
          logo?: string | null
          phone?: string | null
          updated_at?: string | null
          weather_cache?: Json | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          phone: string | null
          photo_url: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          phone?: string | null
          photo_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_logs: {
        Row: {
          created_at: string | null
          date: string
          gallons: number
          id: string
          price_per_gallon: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          gallons: number
          id?: string
          price_per_gallon: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          gallons?: number
          id?: string
          price_per_gallon?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          avg_cost: number | null
          created_at: string | null
          id: string
          name: string
          qty: number
          reorder_level: number | null
          supplier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_cost?: number | null
          created_at?: string | null
          id?: string
          name: string
          qty?: number
          reorder_level?: number | null
          supplier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_cost?: number | null
          created_at?: string | null
          id?: string
          name?: string
          qty?: number
          reorder_level?: number | null
          supplier?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string | null
          pdf_invoice_url: string | null
          pdf_receipt_url: string | null
          service_id: string
          status: string | null
          stripe_checkout_url: string | null
          stripe_session_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          pdf_invoice_url?: string | null
          pdf_receipt_url?: string | null
          service_id: string
          status?: string | null
          stripe_checkout_url?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          pdf_invoice_url?: string | null
          pdf_receipt_url?: string | null
          service_id?: string
          status?: string | null
          stripe_checkout_url?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          kid_reply: string | null
          rating: number | null
          service_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          kid_reply?: string | null
          rating?: number | null
          service_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          kid_reply?: string | null
          rating?: number | null
          service_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          after_url: string | null
          before_url: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string
          frequency: string | null
          id: string
          notes: string | null
          scheduled_at: string
          service_type: string
          updated_at: string | null
          user_id: string
          weather_json: Json | null
        }
        Insert: {
          after_url?: string | null
          before_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id: string
          frequency?: string | null
          id?: string
          notes?: string | null
          scheduled_at: string
          service_type: string
          updated_at?: string | null
          user_id: string
          weather_json?: Json | null
        }
        Update: {
          after_url?: string | null
          before_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string
          frequency?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string
          service_type?: string
          updated_at?: string | null
          user_id?: string
          weather_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "services_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          google_id: string | null
          google_refresh_token: string | null
          id: string
          name: string | null
          push_token: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          google_id?: string | null
          google_refresh_token?: string | null
          id: string
          name?: string | null
          push_token?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          google_id?: string | null
          google_refresh_token?: string | null
          id?: string
          name?: string | null
          push_token?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      belongs_to_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
