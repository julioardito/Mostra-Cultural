"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

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

const SESSAO_ADMIN = "programacao_admin_auth";

// ─── Sementes iniciais (usadas se o banco estiver vazio) ──────────────────────

const SEMENTES: Omit<Evento, "id">[] = [
  { titulo: "Abertura Oficial da Mostra", descricao: "Cerimônia de abertura com apresentação do tema, fala da coordenação e performances iniciais.", inicio: "08:00", fim: "09:00", espaco: "Auditório", segmento: "Geral", responsavel: "Coordenação Pedagógica", destaque: true },
  { titulo: "1º Ano — Exposição de Arte", descricao: "Trabalhos plásticos e pinturas sobre Socioecologia.", inicio: "09:00", fim: "11:00", espaco: "Corredor Principal", segmento: "EF1", turma: "1º Ano", responsavel: "Profa. Ana Lima" },
  { titulo: "2º Ano — Horta Viva", descricao: "Os alunos apresentam a horta que cultivaram ao longo do ano.", inicio: "09:00", fim: "11:00", espaco: "Pátio / Refeitório", segmento: "EF1", turma: "2º Ano", responsavel: "Profa. Carla" },
  { titulo: "5º Ano — Maquetes Sustentáveis", descricao: "Modelos de cidades sustentáveis construídos com material reciclado.", inicio: "11:00", fim: "12:00", espaco: "Corredor Principal", segmento: "EF1", turma: "5º Ano", responsavel: "Profa. Juliana" },
  { titulo: "6º Ano — Podcast Ecológico", descricao: "Episódios produzidos pelos alunos sobre biomas brasileiros.", inicio: "13:00", fim: "15:00", espaco: "Salas de Aula", segmento: "EF2", turma: "6º Ano", responsavel: "Profa. Mariana" },
  { titulo: "9º Ano — Debate Científico", descricao: "Mesa-redonda sobre mudanças climáticas mediada pelos alunos.", inicio: "15:00", fim: "16:00", espaco: "Auditório", segmento: "EF2", turma: "9º Ano", responsavel: "Prof. Marcos" },
  { titulo: "EMA3 — Sessões do Planetário", descricao: "Apresentações de astronomia e astrofotografia no planetário construído pela turma.", inicio: "09:00", fim: "16:00", espaco: "Pátio / Refeitório", segmento: "EM", turma: "EMA3", responsavel: "Prof. Julio Ardito / Lucas Muzio" },
  { titulo: "ECC2 — Restaurante da Mostra", descricao: "Funcionamento do restaurante criado pelos alunos.", inicio: "11:00", fim: "15:00", espaco: "Rooftop", segmento: "EM", turma: "ECC2", responsavel: "Profa. Graziela Maeda / Prof. Eduardo Ulian", destaque: true },
  { titulo: "EMA1 — Jardim Bioclimático", descricao: "Instalação ao ar livre com espécies nativas catalogadas pela turma.", inicio: "09:00", fim: "16:00", espaco: "Quadra Poliesportiva", segmento: "EM", turma: "EMA1", responsavel: "Profa. Renata" },
  { titulo: "Intervalo para Almoço", inicio: "12:00", fim: "13:00", espaco: "Pátio / Refeitório", segmento: "Geral" },
  { titulo: "Encerramento e Premiação", descricao: "Cerimônia de encerramento com premiação dos projetos e confraternização.", inicio: "16:00", fim: "17:00", espaco: "Auditório", segmento: "Geral", responsavel: "Coordenação Pedagógica", destaque: true },
];

// ─── Utilitários ──────────────────────────────────────────────────────────────

function eventoNoSlot(eventos: Evento[], slot: string, espaco: string): Evento[] {
  return eventos.filter((e) => e.espaco === espaco && e.inicio === slot);
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function BadgeSegmento({ seg }: { seg: Segmento }) {
  const s = SEG[seg];
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", background: s.tag, color: "#fff" }}>
      {s.label}
    </span>
  );
}

function EventoCard({ evento, compact = false, onClick, admin, onEdit, onDelete }: { evento: Evento; compact?: boolean; onClick?: () => void; admin: boolean; onEdit: () => void; onDelete: () => void }) {
  const s = SEG[evento.segmento];
  return (
    <div
      onClick={onClick}
      style={{ background: evento.destaque ? s.border : s.bg, border: `1.5px solid ${s.border}`, borderRadius: 10, padding: compact ? "6px 8px" : "10px 12px", cursor: onClick ? "pointer" : "default", marginBottom: compact ? 4 : 0, position: "relative" }}
    >
      <p style={{ margin: 0, fontSize: compact ? 11 : 13, fontWeight: 700, color: evento.destaque ? "#fff" : s.text, lineHeight: 1.3, whiteSpace: compact ? "nowrap" : "normal", overflow: "hidden", textOverflow: compact ? "ellipsis" : "unset" }}>
        {evento.titulo}
      </p>
      {!compact && evento.turma && (
        <p style={{ margin: "4px 0 0", fontSize: 11, color: evento.destaque ? "rgba(255,255,255,0.8)" : s.text, opacity: 0.8 }}>{evento.turma}</p>
      )}
      {!compact && (
        <div style={{ marginTop: 6 }}><BadgeSegmento seg={evento.segmento} /></div>
      )}
      {admin && !compact && (
        <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 4 }}>
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Editar" style={btnIcon}>✏️</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Excluir" style={btnIcon}>🗑️</button>
        </div>
      )}
    </div>
  );
}

const btnIcon: React.CSSProperties = { background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 6, width: 24, height: 24, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ evento, onClose }: { evento: Evento; onClose: () => void }) {
  const s = SEG[evento.segmento];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", maxWidth: 480, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", borderTop: `6px solid ${s.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <BadgeSegmento seg={evento.segmento} />
            {evento.turma && <span style={{ marginLeft: 6, fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{evento.turma}</span>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", lineHeight: 1 }}>×</button>
        </div>
        <h2 style={{ margin: "12px 0 0", fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{evento.titulo}</h2>
        {evento.descricao && <p style={{ margin: "10px 0 0", fontSize: 15, color: "#374151", lineHeight: 1.6 }}>{evento.descricao}</p>}
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

// ─── Modal de edição (admin) ─────────────────────────────────────────────────

function ModalEditar({ evento, onClose, onSave }: { evento: Partial<Evento>; onClose: () => void; onSave: (e: Omit<Evento, "id"> & { id?: string }) => void }) {
  const [form, setForm] = useState<Omit<Evento, "id">>({
    titulo: evento.titulo || "",
    descricao: evento.descricao || "",
    inicio: evento.inicio || "08:00",
    fim: evento.fim || "09:00",
    espaco: evento.espaco || ESPACOS[0],
    segmento: evento.segmento || "Geral",
    turma: evento.turma || "",
    responsavel: evento.responsavel || "",
    destaque: evento.destaque || false,
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflow: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", maxWidth: 560, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", maxHeight: "90vh", overflow: "auto" }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{evento.id ? "Editar evento" : "Novo evento"}</h2>

        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, id: evento.id }); }} style={{ display: "grid", gap: 14, marginTop: 18 }}>
          <Campo label="Título" valor={form.titulo} onChange={(v) => setForm({ ...form, titulo: v })} obrigatorio />
          <Campo label="Descrição" valor={form.descricao || ""} onChange={(v) => setForm({ ...form, descricao: v })} multilinha />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Campo label="Início" valor={form.inicio} onChange={(v) => setForm({ ...form, inicio: v })} placeholder="08:00" />
            <Campo label="Fim" valor={form.fim} onChange={(v) => setForm({ ...form, fim: v })} placeholder="09:30" />
          </div>
          <div>
            <label style={lbl}>Espaço</label>
            <select value={form.espaco} onChange={(e) => setForm({ ...form, espaco: e.target.value })} style={inp}>
              {ESPACOS.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Segmento</label>
            <select value={form.segmento} onChange={(e) => setForm({ ...form, segmento: e.target.value as Segmento })} style={inp}>
              <option value="Geral">Geral</option>
              <option value="EF1">Fundamental 1</option>
              <option value="EF2">Fundamental 2</option>
              <option value="EM">Ensino Médio</option>
            </select>
          </div>
          <Campo label="Turma (opcional)" valor={form.turma || ""} onChange={(v) => setForm({ ...form, turma: v })} />
          <Campo label="Responsável (opcional)" valor={form.responsavel || ""} onChange={(v) => setForm({ ...form, responsavel: v })} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151", cursor: "pointer" }}>
            <input type="checkbox" checked={form.destaque} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} />
            Destacar este evento
          </label>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button type="button" onClick={onClose} style={btnSec}>Cancelar</button>
            <button type="submit" style={btnPri}>{evento.id ? "Salvar" : "Criar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, valor, onChange, placeholder, obrigatorio, multilinha }: { label: string; valor: string; onChange: (v: string) => void; placeholder?: string; obrigatorio?: boolean; multilinha?: boolean }) {
  return (
    <div>
      <label style={lbl}>{label}{obrigatorio && " *"}</label>
      {multilinha ? (
        <textarea value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inp, resize: "vertical" }} required={obrigatorio} />
      ) : (
        <input value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inp} required={obrigatorio} />
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontWeight: 700, fontSize: 13, color: "#173d5c", marginBottom: 6, textAlign: "left" };
const inp: React.CSSProperties = { width: "100%", border: "1px solid #d8c7a1", borderRadius: 10, padding: "10px 14px", fontSize: 15, boxSizing: "border-box", background: "white" };
const btnPri: React.CSSProperties = { background: "#173d5c", color: "white", border: 0, borderRadius: 999, padding: "10px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer" };
const btnSec: React.CSSProperties = { background: "white", color: "#173d5c", border: "1.5px solid #173d5c", borderRadius: 999, padding: "10px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer" };

// ─── Modal de login admin ────────────────────────────────────────────────────

function ModalLoginAdmin({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const res = await fetch("/api/area/ADMIN/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro || "Senha incorreta.");
      } else {
        sessionStorage.setItem(SESSAO_ADMIN, "ok");
        onLogin();
      }
    } catch {
      setErro("Erro de conexão.");
    }
    setCarregando(false);
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "32px", maxWidth: 380, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, textAlign: "center" }}>🔐 Acesso administrativo</h2>
        <p style={{ margin: "0 0 22px", fontSize: 14, color: "#6b7280", textAlign: "center" }}>
          Digite a senha de admin para editar a programação.
        </p>
        <form onSubmit={enviar} style={{ display: "grid", gap: 14 }}>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" required autoFocus style={inp} />
          {erro && <p style={{ margin: 0, padding: "10px 12px", background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, color: "#dc2626", fontSize: 13 }}>{erro}</p>}
          <button type="submit" disabled={carregando} style={{ ...btnPri, padding: "12px", opacity: carregando ? 0.7 : 1 }}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
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
          <div key={seg} style={{ display: "flex", alignItems: "center", gap: 6, background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 99, padding: "4px 12px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.tag }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: s.text }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Visão: Grade ─────────────────────────────────────────────────────────────

function VizGrade({ eventos, onSelect, admin, onEdit, onDelete }: { eventos: Evento[]; onSelect: (e: Evento) => void; admin: boolean; onEdit: (e: Evento) => void; onDelete: (e: Evento) => void }) {
  const colWidth = 170;
  const timeWidth = 70;
  return (
    <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #e5e7eb" }}>
      <div style={{ minWidth: timeWidth + ESPACOS.length * colWidth }}>
        <div style={{ display: "grid", gridTemplateColumns: `${timeWidth}px repeat(${ESPACOS.length}, ${colWidth}px)`, position: "sticky", top: 0, zIndex: 10, background: "#172033" }}>
          <div style={{ padding: "12px 8px", fontSize: 11, color: "#9ca3af", fontWeight: 700, textAlign: "center" }}>HORÁRIO</div>
          {ESPACOS.map((esp) => (
            <div key={esp} style={{ padding: "12px 8px", fontSize: 11, fontWeight: 800, color: "#d8ecf7", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>{esp.toUpperCase()}</div>
          ))}
        </div>
        {SLOTS.map((slot, si) => (
          <div key={slot} style={{ display: "grid", gridTemplateColumns: `${timeWidth}px repeat(${ESPACOS.length}, ${colWidth}px)`, borderTop: "1px solid #e5e7eb", background: si % 2 === 0 ? "#fff" : "#fafafa", minHeight: 72 }}>
            <div style={{ padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#172033" }}>{slot}</span>
              {SLOTS[si + 1] && <span style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>→ {SLOTS[si + 1]}</span>}
            </div>
            {ESPACOS.map((esp) => {
              const evs = eventoNoSlot(eventos, slot, esp);
              return (
                <div key={esp} style={{ padding: "6px", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 4 }}>
                  {evs.map((ev) => (
                    <EventoCard key={ev.id} evento={ev} compact onClick={() => onSelect(ev)} admin={admin} onEdit={() => onEdit(ev)} onDelete={() => onDelete(ev)} />
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

function VizLista({ eventos, onSelect, admin, onEdit, onDelete }: { eventos: Evento[]; onSelect: (e: Evento) => void; admin: boolean; onEdit: (e: Evento) => void; onDelete: (e: Evento) => void }) {
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ background: "#172033", color: "#d8ecf7", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", padding: "4px 14px", borderRadius: 99 }}>{slot}</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {grupos[slot].map((ev) => (
              <div key={ev.id} onClick={() => onSelect(ev)} style={{ background: "#fff", border: `2px solid ${SEG[ev.segmento].border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <BadgeSegmento seg={ev.segmento} />
                  {ev.turma && <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{ev.turma}</span>}
                </div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#111827", lineHeight: 1.3 }}>{ev.titulo}</p>
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>🕐 {ev.inicio}–{ev.fim}</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>📍 {ev.espaco}</span>
                </div>
                {admin && (
                  <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(ev); }} title="Editar" style={btnIcon}>✏️</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(ev); }} title="Excluir" style={btnIcon}>🗑️</button>
                  </div>
                )}
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
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [visao, setVisao] = useState<Visao>("lista");
  const [filtroSeg, setFiltroSeg] = useState<Segmento | "Todos">("Todos");
  const [busca, setBusca] = useState("");
  const [modalEvento, setModalEvento] = useState<Evento | null>(null);

  // Admin
  const [admin, setAdmin] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [editandoEvento, setEditandoEvento] = useState<Partial<Evento> | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSAO_ADMIN) === "ok") setAdmin(true);
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("programacao_eventos")
      .select("*")
      .order("inicio");

    if (error) {
      console.error("Erro carregando eventos:", error);
      setCarregando(false);
      return;
    }

    // Seed automático se a tabela estiver vazia
    if (!data || data.length === 0) {
      const { data: inseridos } = await supabase
        .from("programacao_eventos")
        .insert(SEMENTES)
        .select();
      setEventos((inseridos || []) as Evento[]);
    } else {
      setEventos(data as Evento[]);
    }
    setCarregando(false);
  }

  async function salvarEvento(ev: Omit<Evento, "id"> & { id?: string }) {
    if (ev.id) {
      const { error } = await supabase
        .from("programacao_eventos")
        .update({ titulo: ev.titulo, descricao: ev.descricao, inicio: ev.inicio, fim: ev.fim, espaco: ev.espaco, segmento: ev.segmento, turma: ev.turma, responsavel: ev.responsavel, destaque: ev.destaque })
        .eq("id", ev.id);
      if (error) { alert("Erro ao salvar: " + error.message); return; }
    } else {
      const { error } = await supabase
        .from("programacao_eventos")
        .insert({ titulo: ev.titulo, descricao: ev.descricao, inicio: ev.inicio, fim: ev.fim, espaco: ev.espaco, segmento: ev.segmento, turma: ev.turma, responsavel: ev.responsavel, destaque: ev.destaque });
      if (error) { alert("Erro ao criar: " + error.message); return; }
    }
    setEditandoEvento(null);
    carregar();
  }

  async function excluirEvento(ev: Evento) {
    if (!confirm(`Excluir "${ev.titulo}"?`)) return;
    const { error } = await supabase.from("programacao_eventos").delete().eq("id", ev.id);
    if (error) { alert("Erro ao excluir: " + error.message); return; }
    carregar();
  }

  function sairAdmin() {
    sessionStorage.removeItem(SESSAO_ADMIN);
    setAdmin(false);
  }

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      const segOk = filtroSeg === "Todos" || ev.segmento === filtroSeg;
      const buscaOk =
        busca.trim() === "" ||
        ev.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        (ev.turma || "").toLowerCase().includes(busca.toLowerCase()) ||
        (ev.responsavel || "").toLowerCase().includes(busca.toLowerCase()) ||
        ev.espaco.toLowerCase().includes(busca.toLowerCase());
      return segOk && buscaOk;
    });
  }, [eventos, filtroSeg, busca]);

  const btnStyle = (ativo: boolean): React.CSSProperties => ({
    padding: "8px 18px", borderRadius: 99, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
    background: ativo ? "#172033" : "#e5e7eb", color: ativo ? "#d8ecf7" : "#6b7280",
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#172033" }}>
      <header className="page-header" style={{ background: "#d8ecf7", borderBottom: "1px solid #d8c7a1" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <Link href="/" style={{ color: "#173d5c", textDecoration: "none", fontWeight: 700 }}>
              ← Voltar para a página inicial
            </Link>
            <p style={{ margin: "24px 0 0", color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Mostra Cultural e de Itinerários Formativos 2026
            </p>
            <h1 className="text-3xl sm:text-5xl" style={{ margin: "10px 0 0", lineHeight: 1.05, fontWeight: 800, color: "#111827" }}>
              Programação do Evento
            </h1>
            <p className="text-base sm:text-lg" style={{ margin: "12px 0 0", maxWidth: 780, lineHeight: 1.5, color: "#111827" }}>
              Confira os horários, atrações e espaços da Mostra Cultural e de Itinerários Formativos 2026.
            </p>

            {/* Admin bar */}
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {admin ? (
                <>
                  <button onClick={() => setEditandoEvento({})} style={{ background: "#059669", color: "white", border: 0, borderRadius: 999, padding: "8px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                    ＋ Novo evento
                  </button>
                  <button onClick={sairAdmin} style={{ background: "white", color: "#173d5c", border: "1.5px solid #173d5c", borderRadius: 999, padding: "8px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                    Sair admin
                  </button>
                </>
              ) : (
                <button onClick={() => setMostrarLogin(true)} style={{ background: "white", color: "#173d5c", border: "1.5px solid #173d5c", borderRadius: 999, padding: "8px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                  🔐 Admin
                </button>
              )}
            </div>
          </div>

          <div className="hidden sm:block" style={{ background: "white", borderRadius: 20, padding: 14, boxShadow: "0 12px 30px rgba(0,0,0,0.12)", flexShrink: 0 }}>
            <img src="/logo-benjamin.png" alt="Logo do Colégio Benjamin Constant" style={{ width: 200, height: "auto", display: "block" }} />
          </div>
        </div>
      </header>

      <section className="page-section" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 24, padding: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: 28 }}>
          <p style={{ margin: "0 0 4px", color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>Espaços</p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 20px", fontWeight: 800 }}>Mapa do Colégio Benjamin Constant</h2>
          <div style={{ background: "#f7f4ef", borderRadius: 16, padding: "16px", display: "flex", justifyContent: "center" }}>
            <img src="/mapa-escola.png" alt="Mapa do Colégio Benjamin Constant" style={{ width: "100%", maxWidth: 860, height: "auto", borderRadius: 12, border: "1px solid #d8c7a1" }} />
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid #d8c7a1", borderRadius: 24, padding: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p style={{ margin: "0 0 4px", color: "#a6782a", fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>Horários</p>
          <h2 className="text-2xl sm:text-3xl" style={{ margin: "0 0 20px", fontWeight: 800 }}>Grade de Programação</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
              <input type="text" placeholder="Buscar por título, turma, espaço..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: "100%", padding: "9px 12px 9px 38px", borderRadius: 99, border: "1.5px solid #d8c7a1", fontSize: 14, background: "#f7f4ef", outline: "none", boxSizing: "border-box", color: "#172033" }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["Todos", "Geral", "EF1", "EF2", "EM"] as const).map((seg) => (
                <button key={seg} onClick={() => setFiltroSeg(seg)} style={btnStyle(filtroSeg === seg)}>
                  {seg === "Todos" ? "Todos" : seg === "Geral" ? "Geral" : SEG[seg as Segmento]?.label ?? seg}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 99, padding: 4 }}>
              <button onClick={() => setVisao("lista")} style={btnStyle(visao === "lista")}>☰ Lista</button>
              <button onClick={() => setVisao("grade")} style={btnStyle(visao === "grade")}>⊞ Grade</button>
            </div>
          </div>

          <Legenda />

          {carregando ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}><p>Carregando programação...</p></div>
          ) : eventosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <p style={{ fontSize: 32 }}>🔎</p>
              <p style={{ fontWeight: 700, marginTop: 8 }}>Nenhum evento encontrado</p>
            </div>
          ) : visao === "grade" ? (
            <VizGrade eventos={eventosFiltrados} onSelect={setModalEvento} admin={admin} onEdit={setEditandoEvento} onDelete={excluirEvento} />
          ) : (
            <VizLista eventos={eventosFiltrados} onSelect={setModalEvento} admin={admin} onEdit={setEditandoEvento} onDelete={excluirEvento} />
          )}
        </div>
      </section>

      {modalEvento && <Modal evento={modalEvento} onClose={() => setModalEvento(null)} />}
      {editandoEvento !== null && <ModalEditar evento={editandoEvento} onClose={() => setEditandoEvento(null)} onSave={salvarEvento} />}
      {mostrarLogin && <ModalLoginAdmin onClose={() => setMostrarLogin(false)} onLogin={() => { setAdmin(true); setMostrarLogin(false); }} />}
    </main>
  );
}
