import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/store/ProductCard";
import { ProductGridSkeleton } from "@/components/store/ProductSkeleton";

const HomePage = () => {
  const { data: featuredData, isLoading: loadingFeatured } = useProducts({ featured: true, limit: 4 });
  const { data: latestData, isLoading: loadingLatest } = useProducts({ limit: 8 });
  const { data: categories } = useCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-20 md:py-32">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.3), transparent 50%), radial-gradient(circle at 70% 30%, hsl(var(--accent) / 0.2), transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.95] tracking-tight mb-6">
              Shop
              <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Smarter
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Discover curated collections of premium products at unbeatable prices. Quality meets style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Shop by Category</h2>
            <Link to="/categories" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group p-6 bg-card border border-border rounded-xl text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Featured Products</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loadingFeatured ? (
          <ProductGridSkeleton count={4} />
        ) : featuredData?.products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredData.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">No featured products yet.</p>
        )}
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Latest Arrivals</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loadingLatest ? (
          <ProductGridSkeleton />
        ) : latestData?.products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {latestData.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">No products yet. Add some from the Admin panel!</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
