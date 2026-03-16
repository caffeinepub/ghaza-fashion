export function formatPrice(price: number | bigint): string {
  const num = typeof price === "bigint" ? Number(price) : price;
  return `Rs. ${num.toLocaleString("en-PK")}`;
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
