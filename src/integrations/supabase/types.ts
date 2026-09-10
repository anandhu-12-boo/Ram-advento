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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability: {
        Row: {
          available_slots: number | null
          booked_slots: number
          created_at: string
          date: string
          id: string
          status: string
          time_slot: string
          total_slots: number
          tour_id: string
          updated_at: string
        }
        Insert: {
          available_slots?: number | null
          booked_slots?: number
          created_at?: string
          date: string
          id?: string
          status?: string
          time_slot: string
          total_slots?: number
          tour_id: string
          updated_at?: string
        }
        Update: {
          available_slots?: number | null
          booked_slots?: number
          created_at?: string
          date?: string
          id?: string
          status?: string
          time_slot?: string
          total_slots?: number
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_id: string
          booking_status: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          guests: number
          id: string
          payment_id: string | null
          payment_status: string
          pickup_location: string
          special_request: string
          time_slot: string
          total_amount: number
          tour_id: string
          updated_at: string
          user_id: string
          vehicle: string
        }
        Insert: {
          booking_date: string
          booking_id: string
          booking_status?: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          guests: number
          id?: string
          payment_id?: string | null
          payment_status?: string
          pickup_location?: string
          special_request?: string
          time_slot: string
          total_amount?: number
          tour_id: string
          updated_at?: string
          user_id: string
          vehicle?: string
        }
        Update: {
          booking_date?: string
          booking_id?: string
          booking_status?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          guests?: number
          id?: string
          payment_id?: string | null
          payment_status?: string
          pickup_location?: string
          special_request?: string
          time_slot?: string
          total_amount?: number
          tour_id?: string
          updated_at?: string
          user_id?: string
          vehicle?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_enquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string
          id: string
          is_active?: boolean
          name?: string
          phone?: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          author_name: string
          booking_id: string | null
          comment: string
          created_at: string
          id: string
          rating: number
          tour_id: string | null
          user_id: string
        }
        Insert: {
          approved?: boolean
          author_name?: string
          booking_id?: string | null
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          tour_id?: string | null
          user_id: string
        }
        Update: {
          approved?: boolean
          author_name?: string
          booking_id?: string | null
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          tour_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          available: boolean
          category: string
          created_at: string
          description: string
          duration: string
          exclusions: string[]
          featured: boolean
          highlights: string[]
          id: string
          images: string[]
          inclusions: string[]
          itinerary: Json
          location: string
          max_guests: number
          pickup_locations: string[]
          price: number
          rating: number
          review_count: number
          slug: string
          tagline: string
          title: string
          updated_at: string
          vehicle: string
        }
        Insert: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string
          duration?: string
          exclusions?: string[]
          featured?: boolean
          highlights?: string[]
          id?: string
          images?: string[]
          inclusions?: string[]
          itinerary?: Json
          location?: string
          max_guests?: number
          pickup_locations?: string[]
          price?: number
          rating?: number
          review_count?: number
          slug: string
          tagline?: string
          title: string
          updated_at?: string
          vehicle?: string
        }
        Update: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string
          duration?: string
          exclusions?: string[]
          featured?: boolean
          highlights?: string[]
          id?: string
          images?: string[]
          inclusions?: string[]
          itinerary?: Json
          location?: string
          max_guests?: number
          pickup_locations?: string[]
          price?: number
          rating?: number
          review_count?: number
          slug?: string
          tagline?: string
          title?: string
          updated_at?: string
          vehicle?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_booking: {
        Args: { p_booking_id: string }
        Returns: {
          booking_date: string
          booking_id: string
          booking_status: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          guests: number
          id: string
          payment_id: string | null
          payment_status: string
          pickup_location: string
          special_request: string
          time_slot: string
          total_amount: number
          tour_id: string
          updated_at: string
          user_id: string
          vehicle: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_booking: {
        Args: {
          p_date: string
          p_guests: number
          p_name?: string
          p_phone?: string
          p_pickup: string
          p_special?: string
          p_time: string
          p_tour_slug: string
          p_vehicle: string
        }
        Returns: {
          booking_date: string
          booking_id: string
          booking_status: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          guests: number
          id: string
          payment_id: string | null
          payment_status: string
          pickup_location: string
          special_request: string
          time_slot: string
          total_amount: number
          tour_id: string
          updated_at: string
          user_id: string
          vehicle: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      ensure_profile: {
        Args: { p_name?: string; p_phone?: string }
        Returns: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["customer", "admin"],
    },
  },
} as const
