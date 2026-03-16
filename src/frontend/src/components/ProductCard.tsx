import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const imageUrl =
    product.imageUrls[0] ||
    "/assets/generated/product-lawn-suit.dim_600x700.jpg";
  const defaultSize = product.sizes[0] || "M";

  const hasOriginalPrice =
    product.originalPrice > 0n && product.originalPrice > product.price;

  const discountPercent = hasOriginalPrice
    ? Math.round(
        (1 - Number(product.price) / Number(product.originalPrice)) * 100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.availability) return;
    addItem(product, defaultSize);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: product.id.toString() }}>
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {!product.availability && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="font-body text-sm font-semibold uppercase tracking-widest text-foreground">
                Out of Stock
              </span>
            </div>
          )}
          {hasOriginalPrice && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <span className="bg-destructive text-destructive-foreground font-body text-[10px] uppercase tracking-wider px-1.5 py-0.5 font-semibold">
                Sale
              </span>
              {discountPercent > 0 && (
                <span className="bg-foreground text-primary-foreground font-body text-[10px] px-1.5 py-0.5 font-bold">
                  -{discountPercent}%
                </span>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={handleAddToCart}
              disabled={!product.availability}
              className="w-full bg-background text-foreground hover:bg-foreground hover:text-primary-foreground font-body text-xs tracking-widest uppercase rounded-none"
              size="sm"
              data-ocid="product.button"
            >
              <ShoppingBag size={14} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        <div className="pt-3 pb-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-0.5 truncate">
                {product.category}
              </p>
              <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2">
                {product.name}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              {hasOriginalPrice && (
                <p className="font-body text-xs text-muted-foreground line-through whitespace-nowrap">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <p className="font-body text-sm font-bold text-foreground whitespace-nowrap">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
          {product.sizes.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {product.sizes.slice(0, 4).map((size) => (
                <Badge
                  key={size}
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 font-body"
                >
                  {size}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
