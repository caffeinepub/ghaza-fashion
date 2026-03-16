import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ClipboardList, Loader2, ShoppingBag, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend";
import { Layout } from "../components/Layout";
import { useCancelOrder, useMyOrders } from "../hooks/useQueries";
import { formatDate, formatPrice } from "../lib/format";

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

function canCancel(order: Order): boolean {
  if (order.status === "Cancelled" || order.status === "Delivered")
    return false;
  const createdMs = Number(order.createdAt) / 1_000_000;
  return Date.now() - createdMs < FOUR_HOURS_MS;
}

function statusColor(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    case "shipped":
      return "secondary";
    default:
      return "outline";
  }
}

export function MyOrdersPage() {
  const navigate = useNavigate();
  const [cancellingId, setCancellingId] = useState<bigint | null>(null);
  const { data: orders, isLoading, isFetching } = useMyOrders();
  const cancelOrder = useCancelOrder();

  const storedIds: string[] = JSON.parse(
    localStorage.getItem("ghaza_order_ids") ?? "[]",
  );
  const hasOrders = storedIds.length > 0;

  const handleCancel = async (order: Order) => {
    setCancellingId(order.id);
    try {
      await cancelOrder.mutateAsync(order.id);
      toast.success(`Order #${order.id} has been cancelled.`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel order.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const sorted = orders
    ? [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList size={24} className="text-foreground" />
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Orders
          </h1>
        </div>

        {!hasOrders && (
          <div
            className="text-center py-20 border border-border"
            data-ocid="myorders.empty_state"
          >
            <ShoppingBag
              size={40}
              className="mx-auto text-muted-foreground mb-4"
            />
            <p className="font-display text-xl text-foreground mb-2">
              No orders yet
            </p>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Your orders will appear here automatically after you place them.
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              className="rounded-none bg-foreground text-primary-foreground font-body text-xs uppercase tracking-widest"
              data-ocid="myorders.primary_button"
            >
              Go to Shop
            </Button>
          </div>
        )}

        {hasOrders && (isLoading || isFetching) && sorted.length === 0 && (
          <div className="space-y-4" data-ocid="myorders.loading_state">
            {[1, 2, 3].map((k) => (
              <Skeleton key={k} className="h-28 w-full" />
            ))}
          </div>
        )}

        {sorted.length > 0 && (
          <div className="space-y-4">
            {sorted.map((order, idx) => (
              <div
                key={order.id.toString()}
                className="border border-border p-5"
                data-ocid={`myorders.item.${idx + 1}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                      Order #{order.id.toString()}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5 capitalize">
                      Payment: {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={statusColor(order.status)}
                      className="font-body text-xs capitalize"
                    >
                      {order.status}
                    </Badge>
                    {canCancel(order) && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order)}
                        disabled={cancellingId === order.id}
                        className="flex items-center gap-1.5 font-body text-xs text-destructive hover:text-destructive/80 border border-destructive/40 px-2.5 py-1 transition-colors disabled:opacity-50"
                        data-ocid={`myorders.delete_button.${idx + 1}`}
                      >
                        {cancellingId === order.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <XCircle size={12} />
                        )}
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                <Separator className="mb-3" />

                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div
                      key={`${String(item.productId)}-${item.size}`}
                      className="flex justify-between font-body text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.productName} × {Number(item.quantity)}
                      </span>
                      <span className="font-semibold">
                        {formatPrice(
                          Number(item.price) * Number(item.quantity),
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-body text-sm font-bold border-t border-border pt-2">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>

                {canCancel(order) && (
                  <p className="font-body text-xs text-amber-600 mt-3">
                    You can cancel this order within 4 hours of placing it.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
