import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, ChevronLeft, Minus, Plus, ImageOff } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/store/CartContext";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-20 bg-muted rounded w-full" />
            <div className="h-12 bg-muted rounded w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
        <Link to="/products" className="text-primary hover:underline">← Back to products</Link>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.gallery || [])].filter(Boolean) as string[];

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-4">
            {allImages.length > 0 && !imgError ? (
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageOff size={64} />
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setImgError(false); }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                    i === selectedImage ? "border-primary" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.categories && (
            <Link
              to={`/products?category=${product.categories.slug}`}
              className="text-xs text-primary uppercase tracking-wider font-medium hover:underline"
            >
              {product.categories.name}
            </Link>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.compare_at_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">${product.compare_at_price.toFixed(2)}</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-destructive text-destructive-foreground rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
          )}

          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className={product.stock > 0 ? "text-green-400" : "text-destructive"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => {
                  for (let i = 0; i < qty; i++) {
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image_url: product.image_url,
                      stock: product.stock,
                      slug: product.slug,
                    });
                  }
                }}
                className="flex-1 py-3 px-6 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
