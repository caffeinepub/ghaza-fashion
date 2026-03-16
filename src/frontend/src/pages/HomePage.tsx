import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useQueries";

const CATEGORIES = ["All", "New Arrival", "Eid Sale"];

const SAMPLE_PRODUCTS = [
  {
    id: BigInt(1),
    name: "Embroidered Chiffon Suit",
    price: BigInt(4500),
    category: "New Arrival",
    description:
      "Elegant white and gold embroidered chiffon suit perfect for summer occasions.",
    imageUrls: ["/assets/generated/product-lawn-suit.dim_600x700.jpg"],
    sizes: [],
    availability: true,
    createdAt: BigInt(0),
    originalPrice: 0n,
  },
  {
    id: BigInt(2),
    name: "Formal Black Abaya",
    price: BigInt(6800),
    category: "New Arrival",
    description:
      "Sophisticated black abaya with intricate embroidery at collar and cuffs.",
    imageUrls: ["/assets/generated/product-abaya.dim_600x700.jpg"],
    sizes: [],
    availability: true,
    createdAt: BigInt(0),
    originalPrice: 0n,
  },
  {
    id: BigInt(3),
    name: "Floral Print Kameez",
    price: BigInt(2800),
    category: "Eid Sale",
    description:
      "Bright pink printed kameez with beautiful floral patterns, perfect for Eid celebrations.",
    imageUrls: ["/assets/generated/product-kameez.dim_600x700.jpg"],
    sizes: [],
    availability: true,
    createdAt: BigInt(0),
    originalPrice: 0n,
  },
  {
    id: BigInt(4),
    name: "Embroidered Dupatta",
    price: BigInt(3200),
    category: "Eid Sale",
    description:
      "Luxurious silk dupatta with heavy border embroidery in rose gold and ivory.",
    imageUrls: ["/assets/generated/product-dupatta.dim_600x700.jpg"],
    sizes: [],
    availability: true,
    createdAt: BigInt(0),
    originalPrice: 0n,
  },
  {
    id: BigInt(5),
    name: "Bridal Velvet Dress",
    price: BigInt(18500),
    category: "Eid Sale",
    description:
      "Rich burgundy velvet bridal dress adorned with exquisite zardozi embroidery.",
    imageUrls: ["/assets/generated/product-bridal.dim_600x700.jpg"],
    sizes: [],
    availability: true,
    createdAt: BigInt(0),
    originalPrice: 0n,
  },
  {
    id: BigInt(6),
    name: "Cotton Casual Kurti",
    price: BigInt(1800),
    category: "New Arrival",
    description:
      "Comfortable navy blue cotton kurti with minimal white embroidery for everyday wear.",
    imageUrls: ["/assets/generated/product-kurti.dim_600x700.jpg"],
    sizes: [],
    availability: true,
    createdAt: BigInt(0),
    originalPrice: 0n,
  },
];

export function HomePage() {
  const { data: products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");

  const displayProducts =
    products && products.length > 0 ? products : SAMPLE_PRODUCTS;

  const filtered = useMemo(() => {
    if (activeCategory === "All") return displayProducts;
    return displayProducts.filter((p) => p.category === activeCategory);
  }, [displayProducts, activeCategory]);

  return (
    <Layout>
      {/* Hero — full-width boutique image banner */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "clamp(500px, 65vh, 700px)" }}
      >
        {/* Background image */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src="/assets/uploads/IMG-20260317-WA0000-1.jpg"
            alt="Ghaza Fashion Boutique"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

        {/* Centered text content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8"
          style={{ minHeight: "clamp(500px, 65vh, 700px)" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-xs uppercase tracking-[0.35em] text-white/80 mb-4"
          >
            New Collection 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-none mb-5 drop-shadow-lg"
          >
            Dress with
            <br />
            <span className="italic font-normal">Elegance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-base sm:text-lg text-white/85 max-w-md leading-relaxed mb-8 drop-shadow"
          >
            Discover our curated collection of premium Pakistani women's fashion
            — from everyday elegance to bridal couture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <a
              href="#products"
              data-ocid="hero.primary_button"
              className="inline-block bg-white text-black font-body text-xs uppercase tracking-widest px-10 py-4 hover:bg-white/90 transition-colors duration-300 shadow-xl"
            >
              Shop Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Our Collection
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                Featured Products
              </h2>
            </div>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-body text-xs uppercase tracking-wider px-4 py-2 transition-colors duration-200 border ${
                    activeCategory === cat
                      ? "bg-foreground text-primary-foreground border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                  }`}
                  data-ocid="product.tab"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
              data-ocid="product.loading_state"
            >
              {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
                <div key={k}>
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4 mt-3" />
                  <Skeleton className="h-3 w-1/2 mt-2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" data-ocid="product.empty_state">
              <p className="font-display text-2xl text-muted-foreground italic">
                No products found
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="mt-4 font-body text-sm underline text-foreground"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={filtered.indexOf(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
