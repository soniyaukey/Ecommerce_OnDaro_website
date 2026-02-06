import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Category } from "@/types";

export const useProducts = (options?: {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}) => {
  const { categorySlug, search, featured, page = 1, limit = 12 } = options || {};

  return useQuery({
    queryKey: ["products", categorySlug, search, featured, page, limit],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, categories(*)", { count: "exact" })
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (featured) query = query.eq("is_featured", true);
      if (search) query = query.ilike("name", `%${search}%`);
      if (categorySlug) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .maybeSingle();
        if (cat) query = query.eq("category_id", cat.id);
      }

      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return {
        products: (data as Product[]) || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data as Category[]) || [];
    },
  });
};
