import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, Product } from "../backend";
import { createActorWithConfig } from "../config";
import { useActor } from "./useActor";

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrders(password: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders", password],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders(password);
    },
    enabled: !!actor && !isFetching && !!password,
  });
}

export function useOrdersByPhone(phone: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders-by-phone", phone],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrdersByPhone(phone);
    },
    enabled: !!actor && !isFetching && !!phone,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (args: {
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      items: Array<{
        size: string;
        productId: bigint;
        productName: string;
        quantity: bigint;
        price: bigint;
      }>;
      paymentMethod: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.placeOrder(
        args.customerName,
        args.customerPhone,
        args.customerAddress,
        args.items,
        args.paymentMethod,
      );
    },
  });
}

export function useCancelOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { orderId: bigint; customerPhone: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.cancelOrder(args.orderId, args.customerPhone);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["orders-by-phone", vars.customerPhone],
      }),
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      price: bigint;
      description: string;
      imageUrls: string[];
      category: string;
      sizes: string[];
      availability: boolean;
    }) => {
      // Always create a fresh actor to avoid stale actor issues
      const actor = await createActorWithConfig();
      return actor.addProduct(
        args.name,
        args.price,
        args.description,
        args.imageUrls,
        args.category,
        args.sizes,
        args.availability,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      name: string;
      price: bigint;
      description: string;
      imageUrls: string[];
      category: string;
      sizes: string[];
      availability: boolean;
    }) => {
      // Always create a fresh actor to avoid stale actor issues
      const actor = await createActorWithConfig();
      return actor.updateProduct(
        args.id,
        args.name,
        args.price,
        args.description,
        args.imageUrls,
        args.category,
        args.sizes,
        args.availability,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const actor = await createActorWithConfig();
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      orderId: bigint;
      status: string;
      password: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(args.orderId, args.status, args.password);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["orders", vars.password] }),
  });
}

export function useVerifyAdmin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error("No actor");
      return actor.verifyAdminPassword(password);
    },
  });
}
