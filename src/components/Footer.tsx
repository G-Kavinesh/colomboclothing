import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "2px solid #ebe7de",
        padding: "48px 20px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
      }}
    >
      <nav
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
      <Link href="/" style={{ display: "block" }}>
        <Image
          src="/images/colombo-logo.png"
          alt="Colombo"
          width={220}
          height={80}
          style={{
            width: 220,
            height: "auto",
            display: "block",
            mixBlendMode: "multiply",
          }}
        />
      </Link>
      <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "#6b6b6b" }}>
        &copy; 2026 COLOMBOCLOTHING.COM
      </div>
    </footer>
  );
}
