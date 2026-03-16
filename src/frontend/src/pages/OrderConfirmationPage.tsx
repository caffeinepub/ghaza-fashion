import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import type { Order } from "../backend";
import { Layout } from "../components/Layout";
import { useActor } from "../hooks/useActor";
import { formatPrice } from "../lib/format";

export function OrderConfirmationPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { actor, isFetching } = useActor();

  const { data: order } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getOrder(BigInt(id));
    },
    enabled: !!actor && !isFetching && !!id,
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Order Placed!
          </h1>
          <p className="font-body text-muted-foreground mb-2">
            Thank you for shopping with Ghaza Fashion
          </p>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Order ID:{" "}
            <span className="font-semibold text-foreground">#{id}</span>
          </p>

          {order && (
            <div className="bg-secondary p-6 text-left mb-8">
              <h2 className="font-display text-lg font-bold mb-4">
                Order Details
              </h2>
              <div className="space-y-2 font-body text-sm mb-4">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between"
                  >
                    <span className="text-muted-foreground">
                      {item.productName} × {Number(item.quantity)} ({item.size})
                    </span>
                    <span className="font-semibold">
                      {formatPrice(Number(item.price) * Number(item.quantity))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>
                    {Number(order.deliveryFee) === 0
                      ? "FREE"
                      : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total Paid</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-secondary/60 border border-border p-4 mb-8 text-left">
            <p className="font-body text-sm text-muted-foreground">
              📦 Your order has been received and will be processed shortly. Our
              team will contact you on your provided phone number to confirm.
            </p>
          </div>

          <Link to="/">
            <Button
              className="rounded-none bg-foreground text-primary-foreground hover:bg-accent font-body text-xs uppercase tracking-widest px-10 py-4 h-auto"
              data-ocid="order.primary_button"
            >
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
