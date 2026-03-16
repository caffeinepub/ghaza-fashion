import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useQueries";
import { formatPrice } from "../lib/format";

export function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(BigInt(id || "0"));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, "", quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="font-display text-2xl text-muted-foreground italic">
            Product not found
          </p>
          <Button onClick={() => navigate({ to: "/" })} className="mt-6">
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  const images =
    product.imageUrls.length > 0
      ? product.imageUrls
      : ["/assets/generated/product-lawn-suit.dim_600x700.jpg"];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 font-body transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="space-y-3">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-secondary overflow-hidden"
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img) => (
                  <button
                    type="button"
                    key={img}
                    onClick={() => setActiveImage(images.indexOf(img))}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${
                      activeImage === images.indexOf(img)
                        ? "border-foreground"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <Badge
              variant="outline"
              className="w-fit mb-3 font-body text-xs tracking-widest uppercase"
            >
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {product.name}
            </h1>
            <p className="font-body text-2xl font-bold text-foreground mb-6">
              {formatPrice(product.price)}
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`w-2 h-2 rounded-full ${product.availability ? "bg-green-500" : "bg-red-400"}`}
              />
              <span className="font-body text-sm text-muted-foreground">
                {product.availability ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 border-t border-b border-border py-6">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-0 border border-border w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  data-ocid="product.secondary_button"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-body text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  data-ocid="product.secondary_button"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.availability}
              size="lg"
              className="w-full bg-foreground text-primary-foreground hover:bg-accent rounded-none font-body text-xs uppercase tracking-widest py-4 h-auto"
              data-ocid="product.primary_button"
            >
              <ShoppingBag size={16} className="mr-2" />
              {product.availability ? "Add to Cart" : "Out of Stock"}
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
