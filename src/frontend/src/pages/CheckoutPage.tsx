import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useQueries";
import { formatPrice } from "../lib/format";

const PAYMENT_METHODS = [
  {
    id: "cash",
    label: "Cash on Delivery",
    icon: "\uD83D\uDCB5",
    desc: "Pay when your order arrives",
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    icon: "\uD83D\uDCF1",
    desc: "03201435872 — Syed Muhammad Ali Shah",
  },
  {
    id: "easypaisa",
    label: "EasyPaisa",
    icon: "\uD83D\uDC9A",
    desc: "03201435872 — Syed Muhammad Ali Shah",
  },
  {
    id: "meezan",
    label: "Meezan Bank",
    icon: "\uD83C\uDFE6",
    desc: "02820108082003 — Syed Muhammad Ali Shah",
  },
];

const DELIVERY_THRESHOLD = 5999;
const DELIVERY_FEE = 250;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const placeOrder = usePlaceOrder();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  if (items.length === 0 && !orderSubmitted) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="font-display text-2xl text-muted-foreground italic">
            Your cart is empty
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="mt-6 rounded-none"
          >
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        size: "",
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));

      await placeOrder.mutateAsync({
        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: form.address,
        items: orderItems,
        paymentMethod,
      });

      setOrderSubmitted(true);
      localStorage.setItem("ghaza_customer_phone", form.phone);
      clearCart();
      navigate({ to: "/my-orders" });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-10">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: form */}
            <div className="lg:col-span-3 space-y-8">
              {/* Customer info */}
              <div>
                <h2 className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label className="font-body text-xs uppercase tracking-wider">
                      Full Name *
                    </Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Your full name"
                      className="mt-1.5 rounded-none"
                      data-ocid="checkout.input"
                    />
                    {errors.name && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="checkout.error_state"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="font-body text-xs uppercase tracking-wider">
                      Phone Number *
                    </Label>
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="03XX-XXXXXXX"
                      type="tel"
                      className="mt-1.5 rounded-none"
                      data-ocid="checkout.input"
                    />
                    {errors.phone && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="checkout.error_state"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="font-body text-xs uppercase tracking-wider">
                      Delivery Address *
                    </Label>
                    <Input
                      value={form.address}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, address: e.target.value }))
                      }
                      placeholder="Full delivery address including city"
                      className="mt-1.5 rounded-none"
                      data-ocid="checkout.input"
                    />
                    {errors.address && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="checkout.error_state"
                      >
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <h2 className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`text-left p-4 border-2 transition-all ${
                        paymentMethod === pm.id
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      data-ocid="checkout.radio"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{pm.icon}</span>
                        <span className="font-body text-sm font-semibold">
                          {pm.label}
                        </span>
                        {paymentMethod === pm.id && (
                          <CheckCircle2
                            size={16}
                            className="ml-auto text-foreground"
                          />
                        )}
                      </div>
                      <p className="font-body text-xs text-muted-foreground">
                        {pm.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: order summary */}
            <div className="lg:col-span-2">
              <div className="bg-secondary p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold mb-5">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div
                      key={item.product.id.toString()}
                      className="flex justify-between gap-2"
                    >
                      <span className="font-body text-sm text-muted-foreground truncate">
                        {item.product.name} &times; {item.quantity}
                      </span>
                      <span className="font-body text-sm font-semibold whitespace-nowrap">
                        {formatPrice(
                          Number(item.product.price) * item.quantity,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2 font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span
                      className={
                        deliveryFee === 0 ? "text-green-600 font-semibold" : ""
                      }
                    >
                      {deliveryFee === 0 ? "FREE" : formatPrice(DELIVERY_FEE)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={placeOrder.isPending}
                  className="w-full mt-6 rounded-none bg-foreground text-primary-foreground hover:bg-accent font-body text-xs uppercase tracking-widest py-4 h-auto"
                  data-ocid="checkout.submit_button"
                >
                  {placeOrder.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
