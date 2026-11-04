import { ProductProvider } from "@/lib/product-context";
import { products } from "@/lib/product-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProductProvider initialProducts={products}>{children}</ProductProvider>;
}
