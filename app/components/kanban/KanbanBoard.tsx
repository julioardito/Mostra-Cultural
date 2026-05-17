"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────
type ChecklistItem = {
  id: string;
  card_id: string;
  texto: string;
  feito: boolean;
};

type Card = {
  id: string;
  coluna_id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  prazo: string | null;
  posicao: number;
  etiqueta_cor: string;
  etiqueta_nome: string;
  checklist?: ChecklistItem[];
};

type Coluna = {
  id: string;
  itinerario_sigla: string;
  nome: string;
  posicao: number;
  cor: string;
};

// ── Sortable Card ──────────────────────────────────────────────────────────
function CardItem({
  card,
  onClick,
}: {
  card: Card;
  onClick: (c: Card) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const hoje = new Date().toISOString().split("T")[0];
  const vencido = card.prazo && card.prazo < hoje;
  const feitos = card.checklist?.filter((i) => i.feito).length ?? 0;
  const total = card.checklist?.length ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.25 : 1,
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: isDragging
          ? "0 10px 28px rgba(0,0,0,0.22)"
          : "0 2px 6px rgba(0,0,0,0.06)",
        marginBottom: 8,
        userSelect: "none",
        cursor: "grab",
        touchAction: "none",
        WebkitUserSelect: "none",
      }}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick(card);
      }}
    >
      {card.etiqueta_nome && (
        <span
          style={{
            display: "inline-block",
            background: card.etiqueta_cor || "#173d5c",
            color: "white",
            borderRadius: 999,
            padding: "2px 10px",
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 7,
          }}
        >
          {card.etiqueta_nome}
        </span>
      )}

      <p
        style={{
          margin: 0,
          fontWeight: 700,
          fontSize: 14,
          color: "#172033",
          lineHeight: 1.4,
        }}
      >
        {card.titulo}
      </p>

      {card.descricao && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 12,
            color: "#9ca3af",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {card.descricao}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {card.responsavel && (
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            👤 {card.responsavel}
          </span>
        )}
        {card.prazo && (
          <span
            style={{
              fontSize: 12,
              color: vencido ? "#dc2626" : "#6b7280",
              fontWeight: vencido ? 700 : 400,
            }}
          >
            📅 {card.prazo}
          </span>
        )}
        {total > 0 && (
          <span style={{ fontSize: 12, color: feitos === total ? "#059669" : "#6b7280" }}>
            ✅ {feitos}/{total}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Droppable Column ───────────────────────────────────────────────────────
function ColunaDroppavel({
  coluna,
  cards,
  onAddCard,
  onClickCard,
}: {
  coluna: Coluna;
  cards: Card[];
  onAddCard: (id: string) => void;
  onClickCard: (card: Card) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.id });
  const cardIds = cards.map((c) => c.id);

  return (
    <div
      style={{
        width: 272,
        minWidth: 272,
        background: isOver ? "#dbeafe" : "#f1f5f9",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 200px)",
        flexShrink: 0,
        transition: "background 0.15s",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 14px 10px",
          position: "sticky",
          top: 0,
          background: isOver ? "#dbeafe" : "#f1f5f9",
          borderRadius: "16px 16px 0 0",
          zIndex: 1,
          transition: "background 0.15s",
        }}
      >
        <div
          style={{
            height: 8,
            borderRadius: 999,
            background: coluna.cor,
            marginBottom: 10,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 14, color: "#172033" }}>
            {coluna.nome}
          </span>
          <span
            style={{
              background: "#e5e7eb",
              borderRadius: 999,
              padding: "2px 9px",
              fontSize: 12,
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            {cards.length}
          </span>
        </div>
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 10px",
          minHeight: 64,
        }}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} onClick={onClickCard} />
          ))}
        </SortableContext>
      </div>

      {/* Add button */}
      <button
        onClick={() => onAddCard(coluna.id)}
        style={{
          margin: "6px 10px 10px",
          background: "transparent",
          border: "1.5px dashed #cbd5e1",
          borderRadius: 10,
          padding: "7px",
          cursor: "pointer",
          color: "#6b7280",
          fontSize: 13,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        + Adicionar card
      </button>
    </div>
  );
}

// ── Main Board ─────────────────────────────────────────────────────────────
export default function KanbanBoard({ sigla }: { sigla: string }) {
  const [colunas, setColunas] = useState<Coluna[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [modalCard, setModalCard] = useState<Card | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [novoTitulo, setNovoTitulo] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 6 },
    })
  );

  useEffect(() => {
    carregar();
  }, [sigla]);

  async function carregar() {
    setLoading(true);
    const { data: cols, error: e1 } = await supabase
      .from("kanban_colunas")
      .select("*")
      .eq("itinerario_sigla", sigla)
      .order("posicao");

    if (e1) {
      setErro(e1.message);
      setLoading(false);
      return;
    }

    // Auto-cria as 4 colunas padrão se o quadro ainda não tiver nenhuma
    if (!cols?.length) {
      const padrao = [
        { itinerario_sigla: sigla, nome: "A Fazer",      posicao: 0, cor: "#6b7280" },
        { itinerario_sigla: sigla, nome: "Em Andamento", posicao: 1, cor: "#2563eb" },
        { itinerario_sigla: sigla, nome: "Revisão",      posicao: 2, cor: "#d97706" },
        { itinerario_sigla: sigla, nome: "Concluído",    posicao: 3, cor: "#059669" },
      ];
      const { data: novasCols, error: e2 } = await supabase
        .from("kanban_colunas")
        .insert(padrao)
        .select();
      if (e2 || !novasCols) {
        setErro(e2?.message ?? "Erro ao criar colunas.");
        setLoading(false);
        return;
      }
      setColunas(novasCols);
      setCards([]);
      setLoading(false);
      return;
    }

    const { data: cs, error: e2 } = await supabase
      .from("kanban_cards")
      .select("*, checklist:kanban_checklist(*)")
      .in(
        "coluna_id",
        cols.map((c) => c.id)
      )
      .order("posicao");

    if (e2) {
      setErro(e2.message);
      setLoading(false);
      return;
    }

    setColunas(cols);
    setCards(cs || []);
    setLoading(false);
  }

  // ── DnD handlers ──────────────────────────────────────────────
  function handleDragStart({ active }: DragStartEvent) {
    setActiveCard(cards.find((c) => c.id === active.id) ?? null);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const dragged = cards.find((c) => c.id === activeId);
    if (!dragged) return;

    const overIsColuna = colunas.some((c) => c.id === overId);
    const overCard = cards.find((c) => c.id === overId);
    const destId = overIsColuna ? overId : overCard?.coluna_id;

    if (destId && dragged.coluna_id !== destId) {
      setCards((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, coluna_id: destId } : c))
      );
    }
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCard(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const card = cards.find((c) => c.id === activeId);
    if (!card) return;

    const overCard = cards.find((c) => c.id === overId);

    if (overCard && overCard.coluna_id === card.coluna_id) {
      // Reorder within same column
      const colCards = cards
        .filter((c) => c.coluna_id === card.coluna_id)
        .sort((a, b) => a.posicao - b.posicao);
      const oldIdx = colCards.findIndex((c) => c.id === activeId);
      const newIdx = colCards.findIndex((c) => c.id === overId);
      if (oldIdx !== newIdx) {
        const reordered = arrayMove(colCards, oldIdx, newIdx).map((c, i) => ({
          ...c,
          posicao: i,
        }));
        setCards((prev) => [
          ...prev.filter((c) => c.coluna_id !== card.coluna_id),
          ...reordered,
        ]);
        await Promise.all(
          reordered.map((c) =>
            supabase
              .from("kanban_cards")
              .update({ posicao: c.posicao })
              .eq("id", c.id)
          )
        );
        return;
      }
    }

    // Persist column change
    await supabase
      .from("kanban_cards")
      .update({ coluna_id: card.coluna_id })
      .eq("id", activeId);
  }

  // ── CRUD ──────────────────────────────────────────────────────
  async function adicionarCard(colunaId: string) {
    if (!novoTitulo.trim()) return;
    const posicao = cards.filter((c) => c.coluna_id === colunaId).length;
    const { data, error } = await supabase
      .from("kanban_cards")
      .insert({
        coluna_id: colunaId,
        titulo: novoTitulo.trim(),
        descricao: "",
        responsavel: "",
        posicao,
        etiqueta_cor: "",
        etiqueta_nome: "",
      })
      .select("*, checklist:kanban_checklist(*)")
      .single();

    if (!error && data) {
      setCards((prev) => [...prev, data]);
      setNovoTitulo("");
      setAddingTo(null);
    }
  }

  async function salvarCard(card: Card) {
    await supabase
      .from("kanban_cards")
      .update({
        titulo: card.titulo,
        descricao: card.descricao,
        responsavel: card.responsavel,
        prazo: card.prazo,
        etiqueta_cor: card.etiqueta_cor,
        etiqueta_nome: card.etiqueta_nome,
      })
      .eq("id", card.id);
    setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
    setModalCard(null);
  }

  async function deletarCard(id: string) {
    await supabase.from("kanban_cards").delete().eq("id", id);
    setCards((prev) => prev.filter((c) => c.id !== id));
    setModalCard(null);
  }

  async function toggleChecklist(
    cardId: string,
    itemId: string,
    feito: boolean
  ) {
    await supabase
      .from("kanban_checklist")
      .update({ feito })
      .eq("id", itemId);
    const atualizar = (cs?: ChecklistItem[]) =>
      cs?.map((i) => (i.id === itemId ? { ...i, feito } : i));
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, checklist: atualizar(c.checklist) } : c
      )
    );
    setModalCard((prev) =>
      prev?.id === cardId
        ? { ...prev, checklist: atualizar(prev.checklist) }
        : prev
    );
  }

  async function adicionarChecklist(cardId: string, texto: string) {
    if (!texto.trim()) return;
    const { data } = await supabase
      .from("kanban_checklist")
      .insert({ card_id: cardId, texto: texto.trim(), feito: false })
      .select()
      .single();
    if (data) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, checklist: [...(c.checklist ?? []), data] }
            : c
        )
      );
      setModalCard((prev) =>
        prev?.id === cardId
          ? { ...prev, checklist: [...(prev.checklist ?? []), data] }
          : prev
      );
    }
  }

  async function deletarChecklist(cardId: string, itemId: string) {
    await supabase.from("kanban_checklist").delete().eq("id", itemId);
    const filtrar = (cs?: ChecklistItem[]) =>
      cs?.filter((i) => i.id !== itemId);
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, checklist: filtrar(c.checklist) } : c
      )
    );
    setModalCard((prev) =>
      prev?.id === cardId
        ? { ...prev, checklist: filtrar(prev.checklist) }
        : prev
    );
  }

  // ── Render ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 260,
        }}
      >
        <p style={{ color: "#6b7280", fontSize: 18, fontWeight: 600 }}>
          Carregando quadro...
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div
        style={{
          padding: 32,
          background: "#fff8e8",
          border: "1px solid #d8c7a1",
          borderRadius: 16,
        }}
      >
        <p style={{ color: "#dc2626", fontWeight: 700 }}>
          Erro ao carregar o Kanban: {erro}
        </p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Verifique se as tabelas foram criadas no Supabase e se as permissões
          (RLS) estão configuradas.
        </p>
      </div>
    );
  }

  if (!colunas.length) {
    return (
      <div
        style={{
          padding: 40,
          background: "white",
          border: "1px solid #d8c7a1",
          borderRadius: 20,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 40, margin: "0 0 12px" }}>📋</p>
        <p style={{ color: "#172033", fontWeight: 700, fontSize: 18 }}>
          Nenhuma coluna encontrada para {sigla}
        </p>
        <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 480, margin: "8px auto 0" }}>
          Execute o SQL de setup no painel do Supabase para criar as 4 colunas
          iniciais do quadro Kanban do ECC3.
        </p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            overflowX: "auto",
            paddingBottom: 16,
            alignItems: "flex-start",
          }}
        >
          {colunas.map((coluna) => {
            const colCards = cards
              .filter((c) => c.coluna_id === coluna.id)
              .sort((a, b) => a.posicao - b.posicao);

            return (
              <div key={coluna.id}>
                <ColunaDroppavel
                  coluna={coluna}
                  cards={colCards}
                  onAddCard={(id) => {
                    setAddingTo(id);
                    setNovoTitulo("");
                  }}
                  onClickCard={setModalCard}
                />
                {addingTo === coluna.id && (
                  <div
                    style={{
                      background: "white",
                      border: "1px solid #d8c7a1",
                      borderRadius: 12,
                      padding: 12,
                      marginTop: 6,
                      width: 272,
                    }}
                  >
                    <textarea
                      autoFocus
                      value={novoTitulo}
                      onChange={(e) => setNovoTitulo(e.target.value)}
                      placeholder="Título do card..."
                      rows={2}
                      style={{
                        width: "100%",
                        border: "1px solid #d8c7a1",
                        borderRadius: 8,
                        padding: 8,
                        fontSize: 14,
                        resize: "none",
                        boxSizing: "border-box",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          adicionarCard(coluna.id);
                        }
                        if (e.key === "Escape") setAddingTo(null);
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => adicionarCard(coluna.id)}
                        style={{
                          background: "#173d5c",
                          color: "white",
                          border: 0,
                          borderRadius: 8,
                          padding: "6px 16px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => setAddingTo(null)}
                        style={{
                          background: "transparent",
                          border: "1px solid #d8c7a1",
                          borderRadius: 8,
                          padding: "6px 12px",
                          cursor: "pointer",
                          color: "#6b7280",
                          fontSize: 13,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeCard && (
            <div
              style={{
                background: "white",
                border: "1px solid #d8c7a1",
                borderRadius: 12,
                padding: "12px 14px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
                width: 260,
                rotate: "2deg",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#172033",
                }}
              >
                {activeCard.titulo}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {modalCard && (
        <CardModal
          card={modalCard}
          onChange={setModalCard}
          onSave={salvarCard}
          onDelete={deletarCard}
          onClose={() => setModalCard(null)}
          onToggleChecklist={toggleChecklist}
          onAddChecklist={adicionarChecklist}
          onDeleteChecklist={deletarChecklist}
        />
      )}
    </>
  );
}

// ── Card Modal ─────────────────────────────────────────────────────────────
const ETIQUETAS = [
  { nome: "Urgente", cor: "#dc2626" },
  { nome: "Em dia", cor: "#059669" },
  { nome: "Atenção", cor: "#d97706" },
  { nome: "Ideia", cor: "#7c3aed" },
  { nome: "Evento", cor: "#2563eb" },
  { nome: "Revisão", cor: "#0891b2" },
];

function CardModal({
  card,
  onChange,
  onSave,
  onDelete,
  onClose,
  onToggleChecklist,
  onAddChecklist,
  onDeleteChecklist,
}: {
  card: Card;
  onChange: (c: Card) => void;
  onSave: (c: Card) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onToggleChecklist: (cardId: string, itemId: string, feito: boolean) => void;
  onAddChecklist: (cardId: string, texto: string) => void;
  onDeleteChecklist: (cardId: string, itemId: string) => void;
}) {
  const [novoItem, setNovoItem] = useState("");
  const feitos = card.checklist?.filter((i) => i.feito).length ?? 0;
  const total = card.checklist?.length ?? 0;
  const progresso = total > 0 ? Math.round((feitos / total) * 100) : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "36px 16px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "28px 28px 24px",
          width: "100%",
          maxWidth: 580,
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Título</label>
          <input
            value={card.titulo}
            onChange={(e) => onChange({ ...card, titulo: e.target.value })}
            style={inp}
          />
        </div>

        {/* Etiquetas */}
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Etiqueta</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ETIQUETAS.map((et) => {
              const ativa = card.etiqueta_nome === et.nome;
              return (
                <button
                  key={et.nome}
                  onClick={() =>
                    onChange({
                      ...card,
                      etiqueta_nome: ativa ? "" : et.nome,
                      etiqueta_cor: ativa ? "" : et.cor,
                    })
                  }
                  style={{
                    background: ativa ? et.cor : "white",
                    color: ativa ? "white" : et.cor,
                    border: `1.5px solid ${et.cor}`,
                    borderRadius: 999,
                    padding: "3px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {et.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsável + Prazo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={lbl}>Responsável</label>
            <input
              value={card.responsavel}
              onChange={(e) => onChange({ ...card, responsavel: e.target.value })}
              placeholder="Nome"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Prazo</label>
            <input
              type="date"
              value={card.prazo ?? ""}
              onChange={(e) =>
                onChange({ ...card, prazo: e.target.value || null })
              }
              style={inp}
            />
          </div>
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Descrição / Observações</label>
          <textarea
            value={card.descricao}
            onChange={(e) => onChange({ ...card, descricao: e.target.value })}
            rows={3}
            placeholder="Detalhes, links, observações..."
            style={{ ...inp, resize: "vertical" }}
          />
        </div>

        {/* Checklist */}
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>
            Checklist
            {total > 0 && (
              <span style={{ marginLeft: 8, fontWeight: 400, color: "#6b7280", fontSize: 13 }}>
                {feitos}/{total} — {progresso}%
              </span>
            )}
          </label>

          {total > 0 && (
            <div
              style={{
                height: 6,
                background: "#e5e7eb",
                borderRadius: 999,
                marginBottom: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progresso}%`,
                  background: progresso === 100 ? "#059669" : "#173d5c",
                  borderRadius: 999,
                  transition: "width 0.3s",
                }}
              />
            </div>
          )}

          {card.checklist?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <input
                type="checkbox"
                checked={item.feito}
                onChange={(e) =>
                  onToggleChecklist(card.id, item.id, e.target.checked)
                }
                style={{ width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 14,
                  color: item.feito ? "#9ca3af" : "#172033",
                  textDecoration: item.feito ? "line-through" : "none",
                  flex: 1,
                  lineHeight: 1.4,
                }}
              >
                {item.texto}
              </span>
              <button
                onClick={() => onDeleteChecklist(card.id, item.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#d1d5db",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
              placeholder="Adicionar item..."
              style={{ ...inp, flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && novoItem.trim()) {
                  onAddChecklist(card.id, novoItem.trim());
                  setNovoItem("");
                }
              }}
            />
            <button
              onClick={() => {
                if (novoItem.trim()) {
                  onAddChecklist(card.id, novoItem.trim());
                  setNovoItem("");
                }
              }}
              style={{
                background: "#173d5c",
                color: "white",
                border: 0,
                borderRadius: 8,
                padding: "0 14px",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Ações */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #f1f5f9",
            paddingTop: 16,
          }}
        >
          <button
            onClick={() => {
              if (window.confirm("Excluir este card permanentemente?"))
                onDelete(card.id);
            }}
            style={{
              background: "white",
              color: "#dc2626",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Excluir
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                background: "white",
                color: "#6b7280",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(card)}
              style={{
                background: "#173d5c",
                color: "white",
                border: 0,
                borderRadius: 8,
                padding: "8px 20px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const lbl: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  fontSize: 13,
  color: "#173d5c",
  marginBottom: 6,
  textAlign: "left",
};
const inp: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d8c7a1",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 14,
  boxSizing: "border-box",
  background: "white",
};
