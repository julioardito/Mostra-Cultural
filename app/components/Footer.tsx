import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#f0f0f0",
        borderTop: "1px solid #d8c7a1",
        marginTop: "auto",
      }}
    >
      {/* Main footer content */}
      <div
        className="page-section"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12"
        >
          {/* Logo + school name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img
              src="/logo-benjamin.png"
              alt="Colégio Benjamin Constant"
              style={{ width: 200, height: "auto" }}
            />
            <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Há 125 anos formando cidadãos com excelência acadêmica, valores
              humanos e visão global.
            </p>
            {/* Social media */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <SocialLink
                href="https://www.instagram.com/colegiobenjaminconstant/"
                label="Instagram"
                icon="📷"
              />
              <SocialLink
                href="https://www.youtube.com/@colegiobenjaminconstant"
                label="YouTube"
                icon="▶"
              />
              <SocialLink
                href="https://www.facebook.com/colegiobenjaminconstant"
                label="Facebook"
                icon="f"
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <p
              style={{
                margin: "0 0 16px",
                color: "#a6782a",
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              Conheça o Colégio
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FooterLink href="https://www.colegiobenjamin.com.br/" label="Página do Colégio" />
              <FooterLink href="https://www.colegiobenjamin.com.br/cursos" label="Cursos" />
              <FooterLink href="https://www.colegiobenjamin.com.br/infraestrutura" label="Infraestrutura" />
              <FooterLink href="https://www.mostracultural2026.com.br/" label="Plataforma da Mostra" />
            </nav>
          </div>

          {/* Addresses */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p
                style={{
                  margin: "0 0 6px",
                  color: "#a6782a",
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textAlign: "left",
                }}
              >
                JAC — Ed. Infantil e Fund. 1 e 2
              </p>
              <p style={{ margin: 0, color: "#4b5563", fontSize: 14, lineHeight: 1.6 }}>
                Rua José Antônio Coelho, 75<br />
                Vila Mariana — São Paulo/SP<br />
                CEP 04011-060<br />
                <a href="tel:+551150844335" style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}>
                  (11) 5084-4335
                </a>
              </p>
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 6px",
                  color: "#a6782a",
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textAlign: "left",
                }}
              >
                Sede — Fund. 2 e Ensino Médio
              </p>
              <p style={{ margin: 0, color: "#4b5563", fontSize: 14, lineHeight: 1.6 }}>
                Rua Eça de Queiroz, 75<br />
                Vila Mariana — São Paulo/SP<br />
                CEP 04011-030<br />
                <a href="tel:+551150808177" style={{ color: "#173d5c", fontWeight: 700, textDecoration: "none" }}>
                  (11) 5080-8177
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          background: "#173d5c",
          padding: "14px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "#d8ecf7", fontSize: 13, textAlign: "center" }}>
          © {new Date().getFullYear()} Colégio Benjamin Constant · Mostra Cultural e de Itinerários Formativos 2026
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http");
  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#173d5c", textDecoration: "none", fontWeight: 600, fontSize: 15 }}
    >
      {label} ↗
    </a>
  ) : (
    <Link href={href} style={{ color: "#173d5c", textDecoration: "none", fontWeight: 600, fontSize: 15 }}>
      {label}
    </Link>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "#a6782a",
        color: "white",
        fontWeight: 800,
        fontSize: 14,
        textDecoration: "none",
      }}
    >
      {icon}
    </a>
  );
}
