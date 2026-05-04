"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Segmento = "EF1" | "EF2" | "EM" | "Geral";
type Visao = "grade" | "lista";

interface Evento {
  id: string;
  titulo: string;
  descricao?: string;
  inicio: string;   // "08:00"
  fim: string;      // "09:30"
  espaco: string;
  segmento: Segmento;
  turma?: string;
  responsavel?: string;
  destaque?: boolean;
}

// ─── Paleta por segmento ──────────────────────────────────────────────────────

const SEG: Record<Segmento, { bg: string; border: string; text: string; tag: string; label: string }> = {
  Geral: { bg: "#fff8e8", border: "#d8a630", text: "#6b4e16", tag: "#a6782a",  label: "Geral" },
  EF1:   { bg: "#eaf7ee", border: "#4caf50", text: "#1b5e20", tag: "#388e3c",  label: "Fund. 1" },
  EF2:   { bg: "#e8f3fc", border: "#2196f3", text: "#0d47a1", tag: "#1565c0",  label: "Fund. 2" },
  EM:    { bg: "#fce8f3", border: "#e91e63", text: "#880e4f", tag: "#c2185b",  label: "Ens. Médio" },
};

// ─── Espaços / trilhas ────────────────────────────────────────────────────────

const ESPACOS = [
  "Auditório",
  "Pátio / Refeitório",
  "Rooftop",
  "Quadra Poliesportiva",
  "Salas de Aula",
  "Corredor Principal",
];

// ─── Horários da grade ────────────────────────────────────────────────────────

const SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
];

// ─── Dados de exemplo ─────────────────────────────────────────────────────────
// Substitua este array pelos dados reais quando a programação estiver confirmada.

const EVENTOS: Evento[] = [
  // — Abertura —
  {
    id: "a1",
    titulo: "Abertura Oficial da Mostra",
    descricao: "Cerimônia de abertura com apresentação do tema, fala da coordenação e performances iniciais.",
    inicio: "08:00", fim: "09:00",
    espaco: "Auditório",
    segmento: "Geral",
    responsavel: "Coordenação Pedagógica",
    destaque: true,
  },

  // — EF1 —
  {
    id: "ef1a",
    titulo: "1º Ano — Exposição de Arte",
    descricao: "Trabalhos plásticos e pinturas sobre Socioecologia.",
    inicio: "09:00", fim: "11:00",
    espaco: "Corredor Principal",
    segmento: "EF1",
    turma: "1º Ano",
    responsavel: "Profa. Ana Lima",
  },
  {
    id: "ef1b",
    titulo: "2º Ano — Horta Viva",
    descricao: "Os alunos apresentam a horta que cultivaram ao longo do ano.",
    inicio: "09:00", fim: "11:00",
    espaco: "Pátio / Refeitório",
    segmento: "EF1",
    turma: "2º Ano",
    responsavel: "Profa. Carla Mota",
  },
  {
    id: "ef1c",
    titulo: "3º Ano — Livro de Histórias",
    descricao: "Apresentação do livro coletivo ilustrado e escrito pela turma.",
    inicio: "09:00", fim: "11:00",
    espaco: "Salas de Aula",
    segmento: "EF1",
    turma: "3º Ano",
    responsavel: "Profa. Fernanda Souza",
  },
  {
    id: "ef1d",
    titulo: "4º Ano — Teatro Ambiental",
    descricao: "Peça teatral sobre resiliência dos ecossistemas.",
    inicio: "11:00", fim: "12:00",
    espaco: "Auditório",
    segmento: "EF1",
    turma: "4º Ano",
    responsavel: "Prof. Roberto Dias",
  },
  {
    id: "ef1e",
    titulo: "5º Ano — Maquetes Sustentáveis",
    descricao: "Modelos de cidades sustentáveis construídos com material reciclado.",
    inicio: "11:00", fim: "12:00",
    espaco: "Corredor Principal",
    segmento: "EF1",
    turma: "5º Ano",
    responsavel: "Profa. Juliana Reis",
  },

  // — EF2 —
  {
    id: "ef2a",
    titulo: "6º Ano — Podcast Ecológico",
    descricao: "Episódios produzidos pelos alunos sobre biomas brasileiros.",
    inicio: "13:00", fim: "15:00",
    espaco: "Salas de Aula",
    segmento: "EF2",
    turma: "6º Ano",
    responsavel: "Profa. Mariana Braga",
  },
  {
    id: "ef2b",
    titulo: "7º Ano — Exposição Fotográfica",
    descricao: "Série fotográfica sobre resiliência urbana e natureza na cidade.",
    inicio: "13:00", fim: "15:00",
    espaco: "Corredor Principal",
    segmento: "EF2",
    turma: "7º Ano",
    responsavel: "Prof. André Faria",
  },
  {
    id: "ef2c",
    titulo: "8º Ano — Documentário",
    descricao: "Exibição do curta-metragem produzido pela turma sobre o bairro.",
    inicio: "14:00", fim: "15:00",
    espaco: "Auditório",
    segmento: "EF2",
    turma: "8º Ano",
    responsavel: "Profa. Sílvia Torres",
  },
  {
    id: "ef2d",
    titulo: "9º Ano — Debate Científico",
    descricao: "Mesa-redonda sobre mudanças climáticas mediada pelos alunos.",
    inicio: "15:00", fim: "16:00",
    espaco: "Auditório",
    segmento: "EF2",
    turma: "9º Ano",
    responsavel: "Prof. Marcos Alves",
  },

  // — Ensino Médio —
  {
    id: "ema3",
    titulo: "EMA3 — Sessões do Planetário",
    descricao: "Apresentações de astronomia e astrofotografia no planetário construído pela turma.",
    inicio: "09:00", fim: "16:00",
    espaco: "Pátio / Refeitório",
    segmento: "EM",
    turma: "EMA3",
    responsavel: "Prof. Julio Ardito / Lucas Muzio",
  },
  {
    id: "ecc2",
    titulo: "ECC2 — Restaurante da Mostra",
    descricao: "Funcionamento do restaurante criado pelos alunos. Pré-venda de kits disponível.",
    inicio: "11:00", fim: "15:00",
    espaco: "Rooftop",
    segmento: "EM",
    turma: "ECC2",
    responsavel: "Profa. Graziela Maeda / Prof. Eduardo Ulian",
    destaque: true,
  },
  {
    id: "cs1",
    titulo: "CS1 — Identidades em Cena",
    descricao: "Instalação artística sobre identidade, cultura e cidadania.",
    inicio: "10:00", fim: "14:00",
    espaco: "Corredor Principal",
    segmento: "EM",
    turma: "CS1",
    responsavel: "Profa. Beatriz Nunes",
  },
  {
    id: "cs2",
    titulo: "CS2 — Memória e Território",
    descricao: "Exposição sobre memória histórica e ocupação do espaço urbano.",
    inicio: "10:00", fim: "14:00",
    espaco: "Salas de Aula",
    segmento: "EM",
    turma: "CS2",
    responsavel: "Prof. Henrique Costa",
  },
  {
    id: "ema1",
    titulo: "EMA1 — Jardim Bioclimático",
    descricao: "Instalação ao ar livre com espécies nativas catalogadas pela turma.",
    inicio: "09:00", fim: "16:00",
    espaco: "Quadra Poliesportiva",
    segmento: "EM",
    turma: "EMA1",
    responsavel: "Profa. Renata Pires",
  },

  // — Almoço —
  {
    id: "al",
    titulo: "Intervalo para Almoço",
    inicio: "12:00", fim: "13:00",
    espaco: "Pátio / Refeitório",
    segmento: "Geral",
  },

  // — Encerramento —
  {
    id: "enc",
    titulo: "Encerramento e Premiação",
    descricao: "Cerimônia de encerramento com premiação dos projetos e confraternização.",
    inicio: "16:00", fim: "17:00",
    espaco: "Auditório",
    segmento: "Geral",
    responsavel: "Coordenação Pedagógica",
    destaque: true,
  },
];

// ─── Utilitários ──────────────────────────────────────────────────────────────

function minutosDesde800(h: string): number {
  const [hh, mm] = h.split(":").map(Number);
  return (hh - 8) * 60 + mm;
}

/** Retorna eventos que cobrem o slot (início do slot, mas não exclusivamente) */
function eventoNoSlot(eventos: Evento[], slot: string, espaco: string): Evento[] {
  return eventos.filter((e) => e.espaco === espaco && e.inicio === slot);
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function BadgeSegmento({ seg }: { seg: Segmento }) {
  const s = SEG[seg];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        background: s.tag,
        color: "#fff",
      }}
    >
      {s.label}
    </span>
  );
}

function EventoCard({
  evento,
  compact = false,
  onClick,
}: {
  evento: Evento;
  compact?: boolean;
  onClick?: () => void;
}) {
  const s = SEG[evento.segmento];
  return (
    <div
      onClick={onClick}
      title={evento.titulo}
      style={{
        background: evento.destaque ? s.border : s.bg,
        border: `1.5px solid ${s.border}`,
        borderRadius: 10,
        padding: compact ? "6px 8px" : "10px 12px",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.15s, box-shadow 0.15s",
        marginBottom: compact ? 4 : 0,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: compact ? 11 : 13,
          fontWeight: 700,
          color: evento.destaque ? "#fff" : s.text,
          lineHeight: 1.3,
          whiteSpace: compact ? "nowrap" : "normal",
          overflow: "hidden",
          textOverflow: compact ? "ellipsis" : "unset",
        }}
      >
        {evento.titulo}
      </p>
      {!compact && evento.turma && (
        <p style={{ margin: "4px 0 0", fontSize: 11, color: evento.destaque ? "rgba(255,255,255,0.8)" : s.text, opacity: 0.8 }}>
          {evento.turma}
        </p>
      )}
      {!compact && (
        <div style={{ marginTop: 6 }}>
          <BadgeSegmento seg={evento.segmento} />
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ evento, onClose }: { evento: Evento; onClose: () => void }) {
  const s = SEG[evento.segmento];
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, padding: "28px 32px",
          maxWidth: 480, width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          borderTop: `6px solid ${s.border}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <BadgeSegmento seg={evento.segmento} />
            {evento.turma && (
              <span style={{ marginLeft: 6, fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                {evento.turma}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <h2 style={{ margin: "12px 0 0", fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
          {evento.titulo}
        </h2>

        {evento.descricao && (
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "#374151", lineHeight: 1.6 }}>
            {evento.descricao}
          </p>
        )}

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <InfoRow icon="🕐" label={`${evento.inicio} – ${evento.fim}`} />
          <InfoRow icon="📍" label={evento.espaco} />
          {evento.responsavel && <InfoRow icon="👤" label={evento.responsavel} />}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontSize: 14, color: "#4b5563" }}>{label}</span>
    </div>
  );
}

// ─── Legenda ─────────────────────────────────────────────────────────────────

function Legenda() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {(Object.keys(SEG) as Segmento[]).map((seg) => {
        const s = SEG[seg];
        return (
          <div
            key={seg}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: s.bg, border: `1.5px solid ${s.border}`,
              borderRadius: 99, padding: "4px 12px",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.tag }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: s.text }}>{s.label}</span>
          </div>
        );
      })}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "#f3f4f6", border: "1.5px solid #d1d5db",
        borderRadius: 99, padding: "4px 12px",
      }}>
        <span style={{ fontSize: 11, color: "#6b7280" }}>Clique em qualquer evento para detalhes</span>
      </div>
    </div>
  );
}

// ─── Visão: Grade ─────────────────────────────────────────────────────────────

function VizGrade({
  eventos,
  onSelect,
}: {
  eventos: Evento[];
  onSelect: (e: Evento) => void;
}) {
  const colWidth = 170;
  const timeWidth = 70;

  return (
    <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #e5e7eb" }}>
      <div style={{ minWidth: timeWidth + ESPACOS.length * colWidth }}>
        {/* Cabeçalho */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${timeWidth}px repeat(${ESPACOS.length}, ${colWidth}px)`,
            position: "sticky", top: 0, zIndex: 10,
            background: "#172033",
          }}
        >
          <div style={{ padding: "12px 8px", fontSize: 11, color: "#9ca3af", fontWeight: 700, textAlign: "center" }}>
            HORÁRIO
          </div>
          {ESPACOS.map((esp) => (
            <div
              key={esp}
              style={{
                padding: "12px 8px",
                fontSize: 11, fontWeight: 800, color: "#d8ecf7",
                textAlign: "center",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                letterSpacing: "0.02em",
              }}
            >
              {esp.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Linhas por horário */}
        {SLOTS.map((slot, si) => (
          <div
            key={slot}
            style={{
              display: "grid",
              gridTemplateColumns: `${timeWidth}px repeat(${ESPACOS.length}, ${colWidth}px)`,
              borderTop: "1px solid #e5e7eb",
              background: si % 2 === 0 ? "#fff" : "#fafafa",
              minHeight: 72,
            }}
          >
            {/* Horário */}
            <div
              style={{
                padding: "10px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: "#172033" }}>{slot}</span>
              {SLOTS[si + 1] && (
                <span style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>→ {SLOTS[si + 1]}</span>
              )}
            </div>

            {/* Células por espaço */}
            {ESPACOS.map((esp) => {
              const evs = eventoNoSlot(eventos, slot, esp);
              return (
                <div
                  key={esp}
                  style={{
                    padding: "6px",
                    borderLeft: "1px solid #e5e7eb",
                    display: "flex", flexDirection: "column", gap: 4,
                  }}
                >
                  {evs.map((ev) => (
                    <EventoCard key={ev.id} evento={ev} compact onClick={() => onSelect(ev)} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Visão: Lista ─────────────────────────────────────────────────────────────

function VizLista({ eventos, onSelect }: { eventos: Evento[]; onSelect: (e: Evento) => void }) {
  // Agrupa por horário de início
  const grupos = useMemo(() => {
    const mapa: Record<string, Evento[]> = {};
    SLOTS.forEach((s) => { mapa[s] = []; });
    eventos.forEach((ev) => {
      if (mapa[ev.inicio]) mapa[ev.inicio].push(ev);
      else mapa[ev.inicio] = [ev];
    });
    return mapa;
  }, [eventos]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {SLOTS.filter((slot) => (grupos[slot] || []).length > 0).map((slot) => (
        <div key={slot}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
            }}
          >
            <span
              style={{
                background: "#172033", color: "#d8ecf7",
                fontWeight: 800, fontSize: 13, letterSpacing: "0.08em",
                padding: "4px 14px", borderRadius: 99,
              }}
            >
              {slot}
            </span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {grupos[slot].map((ev) => (
              <div
                key={ev.id}
                onClick={() => onSelect(ev)}
                style={{
                  background: "#fff",
                  border: `2px solid ${SEG[ev.segmento].border}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <BadgeSegmento seg={ev.segmento} />
                  {ev.turma && (
                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{ev.turma}</span>
                  )}
                </div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#111827", lineHeight: 1.3 }}>
                  {ev.titulo}
                </p>
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>🕐 {ev.inicio}–{ev.fim}</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>📍 {ev.espaco}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProgramacaoPage() {
  const [visao, setVisao] = useState<Visao>("lista");
  const [filtroSeg, setFiltroSeg] = useState<Segmento | "Todos">("Todos");
  const [busca, setBusca] = useState("");
  const [modalEvento, setModalEvento] = useState<Evento | null>(null);

  const eventosFiltrados = useMemo(() => {
    return EVENTOS.filter((ev) => {
      const segOk = filtroSeg === "Todos" || ev.segmento === filtroSeg;
      const buscaOk =
        busca.trim() === "" ||
        ev.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        (ev.turma || "").toLowerCase().includes(busca.toLowerCase()) ||
        (ev.responsavel || "").toLowerCase().includes(busca.toLowerCase()) ||
        ev.espaco.toLowerCase().includes(busca.toLowerCase());
      return segOk && buscaOk;
    });
  }, [filtroSeg, busca]);

  const btnStyle = (ativo: boolean): React.CSSProperties => ({
    padding: "8px 18px",
    borderRadius: 99,
    fontWeight: 700,
    fontSize: 13,
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s",
    background: ativo ? "#172033" : "#e5e7eb",
    color: ativo ? "#d8ecf7" : "#6b7280",
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      {/* ── Cabeçalho ── */}
      <header
        className="page-header"
        style={{ background: "#d8ecf7", borderBottom: "1px solid #d8c7a1" }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: 24,
          }}
        >
          <div>
            <Link href="/" style={{ color: "#173d5c", textDecoration: "none", fontWeight: 700 }}>
              ← Voltar para a página inicial
            </Link>
            <p
              style={{
                margin: "24px 0 0", color: "#a6782a", fontSize: 13,
                fontWeight: 800, letterSpacing: "0.22em",
                textTransform: "uppercase", textAlign: "left",
              }}
            >
              Mostra Cultural e de Itinerários Formativos 2026
            </p>
            <h1
              className="text-3xl sm:text-5xl"
              style={{ margin: "10px 0 0", lineHeight: 1.05, fontWeight: 800, color: "#111827" }}
            >
              Programação do Evento
            </h1>
            <p
              className="text-base sm:text-lg"
              style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5, color: "#111827" }}
            >
              Confira os horários, atrações e espaços da Mostra Cultural e de
              Itinerários Formativos 2026 do Colégio Benjamin Constant.
            </p>
          </div>

          <div
            className="hidden sm:block"
            style={{
              background: "white", borderRadius: 20, padding: 14,
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)", flexShrink: 0,
            }}
          >
            <img
              src="/logo-benjamin.png"
              alt="Logo do Colégio Benjamin Constant"
              style={{ width: 200, height: "auto", display: "block" }}
            />
          </div>
        </div>
      </header>

      <section className="page-section" style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Banner em construção ── */}
        <div
          style={{
            background: "#fff8e8", border: "1px solid #d8c7a1",
            borderRadius: 20, padding: "20px 24px",
            marginBottom: 32, display: "flex", alignItems: "center", gap: 16,
          }}
        >
          <span style={{ fontSize: 28 }}>🚧</span>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: "#a6782a", textAlign: "left" }}>
              Programação preliminar
            </p>
            <p style={{ margin: "4px 0 0", color: "#6b4e16", fontSize: 15 }}>
              Os dados abaixo são exemplos. Substitua o array{" "}
              <code style={{ background: "#f3e8d0", padding: "1px 6px", borderRadius: 4, fontSize: 13 }}>
                EVENTOS
              </code>{" "}
              no topo do arquivo com os dados reais quando a programação for confirmada.
            </p>
          </div>
        </div>

        {/* ── Mapa da escola ── */}
        <div
          style={{
            background: "white", border: "1px solid #d8c7a1",
            borderRadius: 24, padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: 28,
          }}
        >
          <p
            style={{
              margin: "0 0 4px", color: "#a6782a", fontSize: 13,
              fontWeight: 800, letterSpacing: "0.22em",
              textTransform: "uppercase", textAlign: "left",
            }}
          >
            Espaços
          </p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 20px", fontWeight: 800 }}>
            Mapa do Colégio Benjamin Constant
          </h2>
          <div style={{ background: "#f7f4ef", borderRadius: 16, padding: "16px", display: "flex", justifyContent: "center" }}>
            <img
              src="/mapa-escola.png"
              alt="Mapa do Colégio Benjamin Constant com os espaços da Mostra Cultural 2026"
              style={{ width: "100%", maxWidth: 860, height: "auto", borderRadius: 12, border: "1px solid #d8c7a1" }}
            />
          </div>
        </div>

        {/* ── Grade de programação ── */}
        <div
          style={{
            background: "white", border: "1px solid #d8c7a1",
            borderRadius: 24, padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              margin: "0 0 4px", color: "#a6782a", fontSize: 13,
              fontWeight: 800, letterSpacing: "0.22em",
              textTransform: "uppercase", textAlign: "left",
            }}
          >
            Horários
          </p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 20px", fontWeight: 800 }}>
            Grade de Programação
          </h2>

          {/* Barra de controles */}
          <div
            style={{
              display: "flex", flexWrap: "wrap", gap: 12,
              marginBottom: 20, alignItems: "center",
            }}
          >
            {/* Busca */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200 }}>
              <span
                style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Buscar por título, turma, espaço..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px 9px 38px",
                  borderRadius: 99, border: "1.5px solid #d8c7a1",
                  fontSize: 14, background: "#f7f4ef",
                  outline: "none", boxSizing: "border-box",
                  color: "#172033",
                }}
              />
            </div>

            {/* Filtro por segmento */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["Todos", "Geral", "EF1", "EF2", "EM"] as const).map((seg) => (
                <button
                  key={seg}
                  onClick={() => setFiltroSeg(seg)}
                  style={btnStyle(filtroSeg === seg)}
                >
                  {seg === "Todos" ? "Todos" : seg === "Geral" ? "Geral" : SEG[seg as Segmento]?.label ?? seg}
                </button>
              ))}
            </div>

            {/* Alternador de visão */}
            <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 99, padding: 4 }}>
              <button onClick={() => setVisao("lista")} style={btnStyle(visao === "lista")}>
                ☰ Lista
              </button>
              <button onClick={() => setVisao("grade")} style={btnStyle(visao === "grade")}>
                ⊞ Grade
              </button>
            </div>
          </div>

          {/* Legenda */}
          <Legenda />

          {/* Contador de resultados */}
          {(busca || filtroSeg !== "Todos") && (
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
              {eventosFiltrados.length === 0
                ? "Nenhum evento encontrado para esse filtro."
                : `${eventosFiltrados.length} evento${eventosFiltrados.length > 1 ? "s" : ""} encontrado${eventosFiltrados.length > 1 ? "s" : ""}.`}
            </p>
          )}

          {/* Conteúdo */}
          {eventosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <p style={{ fontSize: 32 }}>🔎</p>
              <p style={{ fontWeight: 700, marginTop: 8 }}>Nenhum evento encontrado</p>
              <p style={{ fontSize: 14, marginTop: 4 }}>Tente ajustar os filtros ou a busca.</p>
            </div>
          ) : visao === "grade" ? (
            <VizGrade eventos={eventosFiltrados} onSelect={setModalEvento} />
          ) : (
            <VizLista eventos={eventosFiltrados} onSelect={setModalEvento} />
          )}

          <p style={{ marginTop: 20, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
            Horários e atrações serão confirmados e atualizados até a data do evento.
          </p>
        </div>
      </section>

      {/* ── Modal de detalhes ── */}
      {modalEvento && (
        <Modal evento={modalEvento} onClose={() => setModalEvento(null)} />
      )}
    </main>
  );
}
