# Estação CONECTAR — guia rápido

Questionário de afinidades do 7º, 8º e 9º ano, dentro dos Anos Finais do site
da Mostra. Endereço curto para divulgar: **mostracultural2026.com.br/conectar**

| Tela | Endereço | Quem usa |
| --- | --- | --- |
| Início do CONECTAR | `/segmentos/fundamental-2/conectar` | Todos |
| Questionário do aluno | `/segmentos/fundamental-2/conectar/7-ano/aluno` (ou `8-ano`, `9-ano`) | Alunos, **antes** da Mostra |
| Estação de busca | `/segmentos/fundamental-2/conectar/7-ano/estacao` (ou `8-ano`, `9-ano`) | Computadores no dia |
| Formulário dos pais | `/segmentos/fundamental-2/conectar/pais` | Famílias no dia |
| Painel dos professores | `/segmentos/fundamental-2/conectar/painel` | Professores (PIN) |

Cada série tem sua estação: um aluno do 8º ano só recebe indicações do 8º ano.
O questionário também aparece como botão nos cartões do 7º, 8º e 9º ano da
página dos Anos Finais.

Código: `lib/conectar/` (perguntas, motor de afinidades, armazenamento) e
`app/segmentos/fundamental-2/conectar/` (telas). Para mudar turmas ou opções,
edite só `lib/conectar/perguntas.ts`.

## Configuração (uma vez)

1. Abra `supabase/conectar.sql`, troque `TROQUE-ESTE-PIN` pelo PIN dos
   professores (mínimo 6 caracteres).
2. Supabase → SQL Editor → cole o script → **Run**.

Pronto: o site usa a mesma chave pública do Supabase que já está configurada.
As respostas ficam em tabelas protegidas; só saem do banco com o PIN.
Para trocar o PIN, edite a linha e rode o script de novo.

## Dia da Mostra

- Em cada computador da estação, abra o endereço da estação da série e digite
  o PIN uma vez — fica salvo naquele navegador.
- Modo quiosque (tela cheia): `chrome --kiosk https://www.mostracultural2026.com.br/segmentos/fundamental-2/conectar/7-ano/estacao`
- O resultado volta sozinho para a tela inicial depois de 90 segundos.
- No painel, "Baixar cópia (JSON)" guarda um backup das respostas.

## Testar no computador, sem Supabase

```
node scripts/conectar-demo.mjs
```
cria 120 alunos fictícios por série em `data/conectar.json`. Depois rode o site
com `CONECTAR_ARMAZENAMENTO=arquivo CONECTAR_PIN=teste123 npm run dev`.
`node scripts/conectar-demo.mjs --limpar` remove os fictícios.
