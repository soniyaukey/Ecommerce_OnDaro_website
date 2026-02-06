import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useProducts";

const CategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Categories</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : categories?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative p-8 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <h2 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="text-muted-foreground text-sm">{cat.description}</p>
              )}
              <span className="inline-block mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Browse products →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">No categories yet.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
