import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/store/ProductCard";
import { ProductGridSkeleton } from "@/components/store/ProductSkeleton";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || undefined;
  const searchQuery = searchParams.get("search") || undefined;
  const page = Number(searchParams.get("page") || 1);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  const { data, isLoading } = useProducts({ categorySlug, search: searchQuery, page, limit: 12 });
  const { data: categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          {categorySlug
            ? categories?.find((c) => c.slug === categorySlug)?.name || "Products"
            : searchQuery
            ? `Results for "${searchQuery}"`
            : "All Products"}
        </h1>
        {categorySlug && (
          <button onClick={clearCategory} className="text-sm text-primary hover:underline">
            ← All Products
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-11 px-4 pr-12 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <Search size={18} />
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal size={16} className="text-muted-foreground flex-shrink-0" />
          <Link
            to="/products"
            className={`px-4 py-2 text-xs font-medium rounded-full border whitespace-nowrap transition-colors ${
              !categorySlug ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            All
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className={`px-4 py-2 text-xs font-medium rounded-full border whitespace-nowrap transition-colors ${
                categorySlug === cat.slug ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : data?.products.length ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">{data.total} product{data.total !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    p === page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No products found.</p>
          <p className="text-sm mt-2">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
