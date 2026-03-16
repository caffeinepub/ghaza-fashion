import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ImagePlus,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Order, Product } from "../backend";
import {
  useAddProduct,
  useDeleteProduct,
  useOrders,
  useProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";
import { useUploadImage } from "../hooks/useUploadImage";
import { formatDate, formatPrice } from "../lib/format";

const ADMIN_PASSWORD = "mshd1981!";

const CATEGORIES = [
  "New Arrival",
  "Eid Sale",
  "Bridal",
  "Casual",
  "Accessories",
  "Abaya",
];

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  imageUrls: [] as string[],
  category: "",
  availability: true,
};

type ProductForm = typeof EMPTY_FORM;

/** Safely parse a price string to BigInt (handles decimals, commas, spaces) */
function parsePriceToBigInt(value: string): bigint {
  const cleaned = value.replace(/[,\s]/g, "");
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num) || num < 0) throw new Error("Invalid price");
  return BigInt(Math.round(num));
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImages, uploading } = useUploadImage();

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders(ADMIN_PASSWORD);
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  useEffect(() => {
    const auth = localStorage.getItem("ghaza_admin_auth");
    if (!auth) {
      navigate({ to: "/admin" });
    } else {
      setIsAuth(true);
    }
  }, [navigate]);

  if (!isAuth) return null;

  const handleLogout = () => {
    localStorage.removeItem("ghaza_admin_auth");
    navigate({ to: "/admin" });
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrls: product.imageUrls,
      category: product.category,
      availability: product.availability,
    });
    setDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls = await uploadImages(files);
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      toast.success(
        `${urls.length} photo${urls.length > 1 ? "s" : ""} uploaded!`,
      );
    } catch (err) {
      console.error("Image upload error:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (urlToRemove: string) => {
    setForm((f) => ({
      ...f,
      imageUrls: f.imageUrls.filter((u) => u !== urlToRemove),
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    let priceBigInt: bigint;
    try {
      priceBigInt = parsePriceToBigInt(form.price);
    } catch {
      toast.error("Please enter a valid price (numbers only)");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          name: form.name,
          price: priceBigInt,
          description: form.description,
          imageUrls: form.imageUrls,
          category: form.category,
          sizes: [],
          availability: form.availability,
        });
        toast.success("Product updated!");
      } else {
        await addProduct.mutateAsync({
          name: form.name,
          price: priceBigInt,
          description: form.description,
          imageUrls: form.imageUrls,
          category: form.category,
          sizes: [],
          availability: form.availability,
        });
        toast.success("Product added successfully!");
      }
      setDialogOpen(false);
    } catch (err) {
      console.error("Save product error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save product: ${msg.slice(0, 100)}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Failed to delete product");
    }
  };

  const isSaving = addProduct.isPending || updateProduct.isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="bg-foreground text-primary-foreground sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div>
            <span className="font-display font-bold">GHAZA</span>
            <span className="font-body text-xs ml-2 opacity-60">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 font-body text-xs uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity"
              data-ocid="admin.link"
            >
              <Store size={14} />
              Back to Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 font-body text-xs uppercase tracking-wider opacity-80 hover:opacity-100"
              data-ocid="admin.button"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="rounded-none">
              <TabsTrigger
                value="products"
                className="rounded-none font-body text-xs uppercase tracking-wider"
                data-ocid="admin.tab"
              >
                <Package size={14} className="mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-none font-body text-xs uppercase tracking-wider"
                data-ocid="admin.tab"
              >
                <ShoppingBag size={14} className="mr-2" />
                Orders
              </TabsTrigger>
            </TabsList>
            <Button
              onClick={openAdd}
              className="rounded-none bg-foreground text-primary-foreground font-body text-xs uppercase tracking-wider"
              data-ocid="admin.primary_button"
            >
              <Plus size={14} className="mr-2" />
              Add Product
            </Button>
          </div>

          {/* Products tab */}
          <TabsContent value="products">
            {productsLoading ? (
              <div className="space-y-3" data-ocid="admin.loading_state">
                {["a", "b", "c", "d", "e"].map((k) => (
                  <Skeleton key={k} className="h-16 w-full" />
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-20" data-ocid="admin.empty_state">
                <p className="font-body text-muted-foreground">
                  No products yet. Add your first product!
                </p>
              </div>
            ) : (
              <div className="border border-border">
                <table className="w-full" data-ocid="admin.table">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="font-body text-xs uppercase tracking-wider text-muted-foreground text-left p-3">
                        Image
                      </th>
                      <th className="font-body text-xs uppercase tracking-wider text-muted-foreground text-left p-3">
                        Name
                      </th>
                      <th className="font-body text-xs uppercase tracking-wider text-muted-foreground text-left p-3 hidden sm:table-cell">
                        Price
                      </th>
                      <th className="font-body text-xs uppercase tracking-wider text-muted-foreground text-left p-3 hidden md:table-cell">
                        Category
                      </th>
                      <th className="font-body text-xs uppercase tracking-wider text-muted-foreground text-left p-3 hidden lg:table-cell">
                        Status
                      </th>
                      <th className="font-body text-xs uppercase tracking-wider text-muted-foreground text-right p-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => (
                      <tr
                        key={product.id.toString()}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                        data-ocid={`admin.row.${idx + 1}`}
                      >
                        <td className="p-3">
                          <img
                            src={
                              product.imageUrls[0] ||
                              "/assets/generated/product-lawn-suit.dim_600x700.jpg"
                            }
                            alt=""
                            className="w-12 h-14 object-cover bg-secondary"
                          />
                        </td>
                        <td className="p-3">
                          <p className="font-body text-sm font-semibold text-foreground">
                            {product.name}
                          </p>
                          <p className="font-body text-xs text-muted-foreground sm:hidden">
                            {formatPrice(product.price)}
                          </p>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <p className="font-body text-sm font-semibold">
                            {formatPrice(product.price)}
                          </p>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className="font-body text-xs"
                          >
                            {product.category}
                          </Badge>
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          <Badge
                            variant={
                              product.availability ? "default" : "secondary"
                            }
                            className="font-body text-xs"
                          >
                            {product.availability
                              ? "Available"
                              : "Out of Stock"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(product)}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              data-ocid={`admin.edit_button.${idx + 1}`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                              data-ocid={`admin.delete_button.${idx + 1}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Orders tab */}
          <TabsContent value="orders">
            {ordersLoading ? (
              <div className="space-y-3" data-ocid="admin.loading_state">
                {["a", "b", "c"].map((k) => (
                  <Skeleton key={k} className="h-20 w-full" />
                ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-20" data-ocid="admin.empty_state">
                <p className="font-body text-muted-foreground">
                  No orders yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(orders as Order[]).map((order, idx) => (
                  <div
                    key={order.id.toString()}
                    className="border border-border p-5"
                    data-ocid={`admin.item.${idx + 1}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                          Order #{order.id.toString()}
                        </p>
                        <p className="font-display font-semibold text-foreground">
                          {order.customerName}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          {order.customerPhone} &middot;{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : "secondary"
                          }
                          className="font-body text-xs capitalize"
                        >
                          {order.status}
                        </Badge>
                        <Select
                          defaultValue={order.status}
                          onValueChange={async (val) => {
                            await updateOrderStatus.mutateAsync({
                              orderId: order.id,
                              status: val,
                              password: ADMIN_PASSWORD,
                            });
                            toast.success("Order status updated");
                          }}
                        >
                          <SelectTrigger
                            className="w-36 rounded-none font-body text-xs h-8"
                            data-ocid={`admin.select.${idx + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            {[
                              "pending",
                              "confirmed",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ].map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="font-body text-xs capitalize"
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.productId.toString()}
                          className="flex items-center justify-between font-body text-sm"
                        >
                          <span className="text-foreground">
                            {item.productName} &times;{" "}
                            {item.quantity.toString()}
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between font-body text-sm font-semibold border-t border-border pt-2 mt-2">
                        <span>Total</span>
                        <span>
                          {formatPrice(
                            order.items.reduce(
                              (sum, i) => sum + i.price * i.quantity,
                              BigInt(0),
                            ),
                          )}
                        </span>
                      </div>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mt-3">
                      {order.customerAddress} &bull; {order.paymentMethod}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-none max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Images */}
            <div>
              <Label className="font-body text-xs uppercase tracking-wider">
                Photos
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.imageUrls.map((url) => (
                  <div key={url} className="relative w-20 h-24">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {/* File upload button */}
                <label
                  htmlFor="photo-upload"
                  className="w-20 h-24 border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors cursor-pointer select-none"
                  data-ocid="admin.upload_button"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span className="font-body text-[10px] mt-1 text-center leading-tight">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={16} />
                      <span className="font-body text-[10px] mt-1 text-center leading-tight">
                        Upload Photo
                      </span>
                    </>
                  )}
                </label>
                <input
                  id="photo-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {uploading && (
                <p className="font-body text-xs text-muted-foreground mt-2">
                  Uploading photo to storage, please wait...
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <Label
                htmlFor="pname"
                className="font-body text-xs uppercase tracking-wider"
              >
                Product Name *
              </Label>
              <Input
                id="pname"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="rounded-none mt-1"
                placeholder="e.g. Floral Lawn Suit"
                data-ocid="admin.input"
              />
            </div>

            {/* Price */}
            <div>
              <Label
                htmlFor="pprice"
                className="font-body text-xs uppercase tracking-wider"
              >
                Price (Rs.) *
              </Label>
              <Input
                id="pprice"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="rounded-none mt-1"
                placeholder="e.g. 2500"
                inputMode="numeric"
                data-ocid="admin.input"
              />
            </div>

            {/* Category */}
            <div>
              <Label className="font-body text-xs uppercase tracking-wider">
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  className="rounded-none mt-1"
                  data-ocid="admin.select"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="font-body text-sm">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="pdesc"
                className="font-body text-xs uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="pdesc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="rounded-none mt-1"
                rows={3}
                placeholder="Product description..."
                data-ocid="admin.textarea"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3">
              <Switch
                checked={form.availability}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, availability: v }))
                }
                data-ocid="admin.switch"
              />
              <Label className="font-body text-sm">
                {form.availability ? "Available" : "Out of Stock"}
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || uploading}
                className="flex-1 rounded-none bg-foreground text-primary-foreground font-body text-xs uppercase tracking-wider"
                data-ocid="admin.save_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-none font-body text-xs uppercase tracking-wider"
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm">
              This will permanently delete &ldquo;{deleteTarget?.name}&rdquo;.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-none"
              data-ocid="admin.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
