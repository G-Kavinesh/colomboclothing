import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "2px solid var(--border)",
        padding: "48px 20px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
      }}
    >
      <nav
        className="footer-nav"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px 48px",
          fontSize: 15,
          letterSpacing: "0.04em",
        }}
      >
        <Link href="/contact">CONTACT</Link>
        <Link href="/terms">TERMS</Link>
        <Link href="/privacy">PRIVACY</Link>
        <Link href="/accessibility">ACCESSIBILITY</Link>
        <Link href="/cookies">COOKIES</Link>
        <Link href="/order-status">ORDER STATUS</Link>
      </nav>
    </footer>
  );
}
