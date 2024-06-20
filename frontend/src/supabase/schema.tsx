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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          culture_ref: string | null
          email: string
          export_keys_delay: string | null
          export_keys_window: string | null
          full_name: string | null
          get_notifications: boolean | null
          mfa_s: string | null
          onboarding_completed: boolean | null
          roles: Database["public"]["Enums"]["role"][]
          rt: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          culture_ref?: string | null
          email: string
          export_keys_delay?: string | null
          export_keys_window?: string | null
          full_name?: string | null
          get_notifications?: boolean | null
          mfa_s?: string | null
          onboarding_completed?: boolean | null
          roles?: Database["public"]["Enums"]["role"][]
          rt?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          culture_ref?: string | null
          email?: string
          export_keys_delay?: string | null
          export_keys_window?: string | null
          full_name?: string | null
          get_notifications?: boolean | null
          mfa_s?: string | null
          onboarding_completed?: boolean | null
          roles?: Database["public"]["Enums"]["role"][]
          rt?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_culture_ref_fkey"
            columns: ["culture_ref"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["culture_ref"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          culture_ref: string
        }
        Insert: {
          created_at?: string
          culture_ref: string
        }
        Update: {
          created_at?: string
          culture_ref?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          mfa_s: string | null
          session_data: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          mfa_s?: string | null
          session_data?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          mfa_s?: string | null
          session_data?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_session_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          id: number
          token_address: string | null
          token_amount: number | null
          token_name: string | null
          token_price: number | null
          transaction_type:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          token_address?: string | null
          token_amount?: number | null
          token_name?: string | null
          token_price?: number | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          token_address?: string | null
          token_amount?: number | null
          token_name?: string | null
          token_price?: number | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_mfa_secret: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_session_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      insert_culture_ref: {
        Args: {
          culture_ref: string
        }
        Returns: undefined
      }
      store_mfa_secret: {
        Args: {
          mfa_secret: string
        }
        Returns: undefined
      }
      store_session_data: {
        Args: {
          session_data: string
        }
        Returns: undefined
      }
    }
    Enums: {
      role: "user" | "admin"
      transaction_type: "buy" | "sell"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
