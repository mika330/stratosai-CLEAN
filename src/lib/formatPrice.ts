export type PriceType = "fixed" | "negotiable" | "free" | "swap";

export function formatPrice(price: number, priceType: PriceType): string {
  if (priceType === "free") return "Free";
  if (priceType === "swap") return "Swap";
  return `£${price.toLocaleString()}`;
}
