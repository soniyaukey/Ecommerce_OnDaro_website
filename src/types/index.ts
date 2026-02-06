import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products"> & {
  categories?: Tables<"categories"> | null;
};

export type Category = Tables<"categories">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type Profile = Tables<"profiles">;
export type UserRole = Tables<"user_roles">;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  stock: number;
  slug: string;
}

export interface CheckoutFormData {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  payment_method: "cod" | "card";
}
