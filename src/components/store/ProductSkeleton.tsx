const ProductSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="flex justify-between items-center">
        <div className="h-5 bg-muted rounded w-16" />
        <div className="h-8 w-8 bg-muted rounded-full" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export default ProductSkeleton;
