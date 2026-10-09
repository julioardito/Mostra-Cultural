-- ==============================================================
-- CONECTAR — estação de afinidades do 6º ao 9º ano
-- ==============================================================
-- Como aplicar:
--   1. TROQUE o PIN na linha marcada com  >>>  (logo abaixo).
--      É a senha dos professores para a estação e o painel.
--   2. Cole tudo no SQL Editor do Supabase e clique em "Run".
-- Idempotente: pode rodar de novo. Para trocar o PIN depois, edite
-- a linha e rode outra vez.
--
-- DADO DE CRIANÇA: as tabelas têm RLS ligado e nenhuma policy — a chave
-- pública (anon) não lê nem grava nelas diretamente. O site só acessa
-- pelas funções abaixo (SECURITY DEFINER):
--   • salvar respostas (aberto: os alunos respondem de casa);
--   • ler respostas / apagar (só com o PIN dos professores).
-- ==============================================================

-- 1. TABELAS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conectar_config (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conectar_alunos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave         TEXT NOT NULL UNIQUE,          -- "7º A|nome normalizado" (1 resposta por aluno)
  nome          TEXT NOT NULL,
  turma         TEXT NOT NULL,
  ano           TEXT NOT NULL,                 -- "6-ano", "7-ano", "8-ano", "9-ano"
  interesses    JSONB NOT NULL DEFAULT '{}'::jsonb,
  viagem        TEXT NOT NULL DEFAULT '',
  posso_ensinar TEXT NOT NULL DEFAULT '',
  aparecer      BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Quem rodou a primeira versão deste script tem a tabela sem a coluna "ano".
ALTER TABLE public.conectar_alunos ADD COLUMN IF NOT EXISTS ano TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS conectar_alunos_ano_idx ON public.conectar_alunos (ano);

CREATE TABLE IF NOT EXISTS public.conectar_pais (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_responsavel TEXT NOT NULL DEFAULT '',
  nome_aluno       TEXT NOT NULL DEFAULT '',
  turma            TEXT NOT NULL DEFAULT '',
  interesses       JSONB NOT NULL DEFAULT '{}'::jsonb,
  avaliacao        SMALLINT NOT NULL DEFAULT 0,
  mensagem         TEXT NOT NULL DEFAULT '',
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.conectar_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conectar_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conectar_pais   ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.conectar_config, public.conectar_alunos, public.conectar_pais FROM anon, authenticated;

-- 2. PIN DOS PROFESSORES
-- ----------------------------------------------------------------
-- >>> Troque TROQUE-ESTE-PIN pelo PIN de vocês (mínimo 6 caracteres).
--     Enquanto estiver TROQUE-ESTE-PIN, a estação e o painel ficam travados.
INSERT INTO public.conectar_config (chave, valor)
VALUES ('pin', 'TROQUE-ESTE-PIN')
ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor;

-- 3. FUNÇÕES
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.conectar_pin_ok(p_pin TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conectar_config
    WHERE chave = 'pin'
      AND valor = p_pin
      AND valor <> 'TROQUE-ESTE-PIN'
      AND length(valor) >= 6
  );
$$;

-- Todas as respostas (estação e painel). Exige PIN.
CREATE OR REPLACE FUNCTION public.conectar_dados(p_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT conectar_pin_ok(p_pin) THEN
    RAISE EXCEPTION 'PIN_INVALIDO';
  END IF;
  RETURN jsonb_build_object(
    'alunos', COALESCE((SELECT jsonb_agg(to_jsonb(a) - 'chave') FROM conectar_alunos a), '[]'::jsonb),
    'pais',   COALESCE((SELECT jsonb_agg(to_jsonb(p)) FROM conectar_pais p), '[]'::jsonb)
  );
END;
$$;

-- Formulário do aluno. Mesma chave = a resposta nova substitui a antiga.
CREATE OR REPLACE FUNCTION public.conectar_salvar_aluno(p JSONB)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO conectar_alunos (chave, nome, turma, ano, interesses, viagem, posso_ensinar, aparecer, criado_em)
  VALUES (
    p->>'chave',
    left(p->>'nome', 80),
    p->>'turma',
    p->>'ano',
    COALESCE(p->'interesses', '{}'::jsonb),
    COALESCE(p->>'viagem', ''),
    left(COALESCE(p->>'posso_ensinar', ''), 120),
    COALESCE((p->>'aparecer')::boolean, TRUE),
    NOW()
  )
  ON CONFLICT (chave) DO UPDATE SET
    nome          = EXCLUDED.nome,
    turma         = EXCLUDED.turma,
    ano           = EXCLUDED.ano,
    interesses    = EXCLUDED.interesses,
    viagem        = EXCLUDED.viagem,
    posso_ensinar = EXCLUDED.posso_ensinar,
    aparecer      = EXCLUDED.aparecer,
    criado_em     = NOW();
END;
$$;

-- Formulário dos pais. Se achar o(a) filho(a) (um único nome que começa
-- com o que foi digitado, na turma), devolve SÓ os interesses em comum.
CREATE OR REPLACE FUNCTION public.conectar_salvar_pais(p JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_prefixo TEXT := COALESCE(p->>'chave_prefixo', '');
  v_filho   conectar_alunos;
  v_qtd     INT;
  v_comuns  JSONB;
BEGIN
  INSERT INTO conectar_pais (nome_responsavel, nome_aluno, turma, interesses, avaliacao, mensagem)
  VALUES (
    left(COALESCE(p->>'nome_responsavel', ''), 80),
    left(COALESCE(p->>'nome_aluno', ''), 80),
    COALESCE(p->>'turma', ''),
    COALESCE(p->'interesses', '{}'::jsonb),
    LEAST(5, GREATEST(0, COALESCE((p->>'avaliacao')::int, 0))),
    left(COALESCE(p->>'mensagem', ''), 500)
  );

  IF length(v_prefixo) < 6 THEN
    RETURN NULL;
  END IF;

  SELECT count(*) INTO v_qtd FROM conectar_alunos WHERE starts_with(chave, v_prefixo);
  IF v_qtd <> 1 THEN
    RETURN NULL;
  END IF;
  SELECT * INTO v_filho FROM conectar_alunos WHERE starts_with(chave, v_prefixo);

  SELECT jsonb_object_agg(cat, itens) INTO v_comuns
  FROM (
    SELECT e.key AS cat, jsonb_agg(item) AS itens
    FROM jsonb_each(v_filho.interesses) AS e
    CROSS JOIN LATERAL jsonb_array_elements_text(e.value) AS item
    WHERE jsonb_typeof(p->'interesses'->e.key) = 'array'
      AND (p->'interesses'->e.key) ? item
    GROUP BY e.key
  ) t;

  RETURN jsonb_build_object('nome', v_filho.nome, 'comuns', COALESCE(v_comuns, '{}'::jsonb));
END;
$$;

-- Painel: apagar uma resposta de aluno. Exige PIN.
CREATE OR REPLACE FUNCTION public.conectar_apagar_aluno(p_pin TEXT, p_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT conectar_pin_ok(p_pin) THEN
    RAISE EXCEPTION 'PIN_INVALIDO';
  END IF;
  DELETE FROM conectar_alunos WHERE id = p_id;
END;
$$;

-- 4. PERMISSÕES DAS FUNÇÕES
-- ----------------------------------------------------------------
REVOKE ALL ON FUNCTION public.conectar_pin_ok(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.conectar_dados(TEXT)              TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.conectar_salvar_aluno(JSONB)      TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.conectar_salvar_pais(JSONB)       TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.conectar_apagar_aluno(TEXT, UUID) TO anon, authenticated;

-- Faz a API do Supabase enxergar as funções novas na hora.
NOTIFY pgrst, 'reload schema';
