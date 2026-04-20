export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          birth_date: string | null;
          gender: string | null;
          avatar_url: string | null;
          background_url: string | null;
          instagram_link: string | null;
          bio: string | null;
          is_onboarded: boolean;
          is_seller: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          birth_date?: string | null;
          gender?: string | null;
          avatar_url?: string | null;
          background_url?: string | null;
          instagram_link?: string | null;
          bio?: string | null;
          is_onboarded?: boolean;
          is_seller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          birth_date?: string | null;
          gender?: string | null;
          avatar_url?: string | null;
          background_url?: string | null;
          instagram_link?: string | null;
          bio?: string | null;
          is_onboarded?: boolean;
          is_seller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone_number: string;
          address: string;
          address_details: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone_number: string;
          address: string;
          address_details?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone_number?: string;
          address?: string;
          address_details?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      seller_applications: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          instagram_link: string;
          height: string;
          intro: string | null;
          sample_photos: string[] | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          instagram_link: string;
          height: string;
          intro?: string | null;
          sample_photos?: string[] | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          instagram_link?: string;
          height?: string;
          intro?: string | null;
          sample_photos?: string[] | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          seller_id: string;
          item_name: string;
          brand: string;
          category: string;
          size: string;
          condition: string;
          price: number;
          description: string | null;
          damage_type: string | null;
          damage_details: string | null;
          material: string | null;
          measurements: string | null;
          status: 'active' | 'sold' | 'reserved' | 'draft';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          item_name: string;
          brand: string;
          category: string;
          size: string;
          condition: string;
          price: number;
          description?: string | null;
          damage_type?: string | null;
          damage_details?: string | null;
          material?: string | null;
          measurements?: string | null;
          status?: 'active' | 'sold' | 'reserved' | 'draft';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          item_name?: string;
          brand?: string;
          category?: string;
          size?: string;
          condition?: string;
          price?: number;
          description?: string | null;
          damage_type?: string | null;
          damage_details?: string | null;
          material?: string | null;
          measurements?: string | null;
          status?: 'active' | 'sold' | 'reserved' | 'draft';
          created_at?: string;
          updated_at?: string;
        };
      };
      item_media: {
        Row: {
          id: string;
          item_id: string;
          url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          url?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          item_id: string;
          address_id: string;
          status: 'to_pay' | 'to_ship' | 'to_receive' | 'completed';
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          seller_id: string;
          item_id: string;
          address_id: string;
          status?: 'to_pay' | 'to_ship' | 'to_receive' | 'completed';
          total_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          seller_id?: string;
          item_id?: string;
          address_id?: string;
          status?: 'to_pay' | 'to_ship' | 'to_receive' | 'completed';
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      seller_status: 'pending' | 'approved' | 'rejected';
      item_status: 'active' | 'sold' | 'reserved' | 'draft';
      order_status: 'to_pay' | 'to_ship' | 'to_receive' | 'completed';
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
