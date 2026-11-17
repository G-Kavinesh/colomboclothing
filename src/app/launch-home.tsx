import ProductDetail from "@/components/ProductDetail";
import { ProductProvider } from "@/lib/product-context";
import { products } from "@/lib/product-data";

// The home page after launch: the lead product, shown in full with its colours, sizes
// and size guide. Kept in its own server component so page.tsx can load it lazily,
// which keeps product data out of the coming soon page's scripts.
export default function LaunchHome() {
  return (
    <ProductProvider initialProducts={products}>
      <ProductDetail slug={products[0].slug} featured />
    </ProductProvider>
  );
}
