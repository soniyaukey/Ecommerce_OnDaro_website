import { Link } from "react-router-dom";
import { ShoppingCart, ImageOff } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/CartContext";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-muted">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageOff size={48} />
          </div>
        )}
      </Link>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-2">
        {product.is_featured && (
          <span className="px-2.5 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
            Featured
          </span>
        )}
        {discount > 0 && (
          <span className="px-2.5 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        {product.categories && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.categories.name}
          </p>
        )}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                stock: product.stock,
                slug: product.slug,
              })
            }
            disabled={product.stock < 1}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
        {product.stock < 1 && (
          <p className="text-xs text-destructive mt-1 font-medium">Out of stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
