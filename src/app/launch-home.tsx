import Shop from "./shop/page";
import { ProductProvider } from "@/lib/product-context";
import { products } from "@/lib/product-data";

// The home page after launch: the original product grid. Kept in its own server
// component so page.tsx can load it lazily, which keeps product data out of the
// coming soon page's scripts.
export default function LaunchHome() {
  return (
    <ProductProvider initialProducts={products}>
      <Shop />
    </ProductProvider>
  );
}
