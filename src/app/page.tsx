import ComingSoon from "@/components/ComingSoon";
import Shop from "./shop/page";

// Set to false on launch to bring back the original product grid home page
const COMING_SOON = true;

export default function Home() {
  return COMING_SOON ? <ComingSoon /> : <Shop />;
}
