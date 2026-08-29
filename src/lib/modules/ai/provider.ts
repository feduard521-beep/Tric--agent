/**
 * Fornecedor de IA: OpenAI-compatível se OPENAI_API_KEY existir;
 * caso contrário, heurísticas locais (sem dependências externas).
 *
 * Teste sem chave: classificação deve devolver um SectorId válido.
 * Teste com chave: definir OPENAI_API_KEY e correr o pipeline.
 */
import type { SectorId } from "@/lib/types";
import { SECTORS } from "@/lib/sectors";

export type AiProviderName = "openai" | "heuristic";

const KEYWORDS: Record<SectorId, string[]> = {
  economia: [
    "economia", "banco", "bna", "kwanza", "inflação", "inflacao", "mercado",
    "crédito", "credito", "pme", "finanças", "financas", "orçamento", "orcamento",
    "investimento", "divida", "dívida", "imposto",
  ],
  politica: [
    "política", "politica", "governo", "assembleia", "presidente", "ministro",
    "partido", "eleição", "eleicao", "diplomacia", "parlamento", "autarquia",
  ],
  tecnologia: [
    "tecnologia", "digital", "fintech", "software", "internet", "fibra", "ia",
    "inteligência artificial", "inteligencia artificial", "startup", "app", "dados",
  ],
  energia: [
    "energia", "petróleo", "petroleo", "gás", "gas", "solar", "mina", "mineração",
    "mineracao", "sonangol", "crude", "offshore", "gasoduto",
  ],
  saude: [
    "saúde", "saude", "hospital", "vacina", "médico", "medico", "epidemia",
    "farmácia", "farmacia", "urgência", "urgencia", "oms",
  ],
};

export function getAiProviderName(): AiProviderName {
  return process.env.OPENAI_API_KEY ? "openai" : "heuristic";
}

/** Classificação por palavras-chave (fallback e modo offline). */
export function classifyHeuristic(text: string, hint?: string | null): SectorId {
  const hay = text.toLowerCase();
  let best: SectorId = (hint as SectorId) || "politica";
  let bestScore = 0;

  for (const sector of SECTORS) {
    const score = KEYWORDS[sector.id].reduce(
      (acc, kw) => (hay.includes(kw) ? acc + 1 : acc),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = sector.id;
    }
  }
  return best;
}

/** Resumo extractivo: primeiras frases úteis do texto. */
export function summarizeHeuristic(title: string, body: string): {
  summary: string;
  fullSummary: string;
} {
  const clean = body.replace(/\s+/g, " ").trim();
  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);

  const fullSummary =
    sentences.slice(0, 4).join(" ") ||
    clean.slice(0, 600) ||
    `${title}. Fonte agregada pela Tricô.`;

  const summary =
    sentences[0] ||
    clean.slice(0, 220) ||
    `Resumo de «${title}» tecido automaticamente.`;

  return {
    summary: summary.slice(0, 320),
    fullSummary: fullSummary.slice(0, 1600),
  };
}

type ChatResult = { content: string };

async function openaiChat(system: string, user: string): Promise<ChatResult | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const base = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.warn(`[ai] OpenAI HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content ? { content } : null;
  } catch (err) {
    console.warn("[ai] falha OpenAI:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function classifyArticle(
  title: string,
  body: string,
  hint?: string | null,
): Promise<SectorId> {
  const text = `${title}\n${body}`;
  if (getAiProviderName() === "openai") {
    const sectorList = SECTORS.map((s) => s.id).join(", ");
    const reply = await openaiChat(
      `Classifica notícias de Angola num único sector: ${sectorList}. Responde só com o id.`,
      text.slice(0, 3000),
    );
    const id = reply?.content.toLowerCase().trim() as SectorId | undefined;
    if (id && SECTORS.some((s) => s.id === id)) return id;
  }
  return classifyHeuristic(text, hint);
}

export async function summarizeArticle(
  title: string,
  body: string,
  sectorId: SectorId,
): Promise<{ summary: string; fullSummary: string }> {
  if (getAiProviderName() === "openai") {
    const reply = await openaiChat(
      `És editor da Tricô. Resume notícias do sector ${sectorId} em português de Portugal, tom informativo e curto. Devolve JSON: {"summary":"...","fullSummary":"..."}`,
      `Título: ${title}\n\nTexto:\n${body.slice(0, 4000)}`,
    );
    if (reply) {
      try {
        const jsonMatch = reply.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as {
            summary?: string;
            fullSummary?: string;
          };
          if (parsed.summary && parsed.fullSummary) {
            return {
              summary: parsed.summary.slice(0, 320),
              fullSummary: parsed.fullSummary.slice(0, 1600),
            };
          }
        }
      } catch {
        /* cai no fallback */
      }
    }
  }
  return summarizeHeuristic(title, body);
}
