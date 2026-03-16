import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Layout } from "../components/Layout";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

const DELIVERY_THRESHOLD = 5999;
const DELIVERY_FEE = 250;

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();
  const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <p className="font-display text-2xl text-muted-foreground italic mb-6">
              Your cart is empty
            </p>
            <Link to="/">
              <Button
                className="rounded-none font-body text-xs uppercase tracking-widest"
                data-ocid="cart.primary_button"
              >
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-0">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 py-6 border-b border-border"
                    data-ocid={`cart.item.${idx + 1}`}
                  >
                    <Link
                      to="/product/$id"
                      params={{ id: item.product.id.toString() }}
                      className="flex-shrink-0"
                    >
                      <img
                        src={
                          item.product.imageUrls[0] ||
                          "/assets/generated/product-lawn-suit.dim_600x700.jpg"
                        }
                        alt={item.product.name}
                        className="w-24 h-32 object-cover bg-secondary"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">
                            {item.product.category}
                          </p>
                          <h3 className="font-display font-semibold text-foreground mt-0.5">
                            {item.product.name}
                          </h3>
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            Size: {item.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary"
                            data-ocid={`cart.secondary_button.${idx + 1}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-body text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary"
                            data-ocid={`cart.secondary_button.${idx + 1}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-body font-bold text-foreground">
                          {formatPrice(
                            Number(item.product.price) * item.quantity,
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">
                  Order Summary
                </h2>
                <div className="space-y-3 font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span
                      className={`font-semibold ${deliveryFee === 0 ? "text-green-600" : ""}`}
                    >
                      {deliveryFee === 0 ? "FREE" : formatPrice(DELIVERY_FEE)}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(DELIVERY_THRESHOLD - subtotal)} more for
                      free delivery
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate({ to: "/checkout" })}
                  className="w-full mt-6 rounded-none bg-foreground text-primary-foreground hover:bg-accent font-body text-xs uppercase tracking-widest py-4 h-auto"
                  data-ocid="cart.primary_button"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
