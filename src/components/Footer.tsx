import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-light)",
        padding: "40px 20px 36px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <nav
        className="footer-nav"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 32px",
          fontSize: 13,
          letterSpacing: "0.02em",
        }}
      >
        <Link href="/contact">Contact</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/accessibility">Accessibility</Link>
        <Link href="/cookies">Cookies</Link>
        <Link href="/preorder/status">Order status</Link>
      </nav>
    </footer>
  );
}
