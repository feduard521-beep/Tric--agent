import type { Piece } from "./types";

/** Peças mock focadas em Angola — conteúdo editorial de demonstração. */
export const PIECES: Piece[] = [
  {
    id: "eco-kwanza-dia",
    sectorId: "economia",
    title: "Kwanza estabiliza após intervenção do BNA no mercado cambial",
    summary:
      "O Banco Nacional de Angola reforçou a oferta de divisas. Analistas apontam alívio temporário para importadores e banca.",
    fullSummary:
      "O BNA injectou liquidez em divisas na sessão desta manhã, após pressão sobre o kwanza nas últimas 48 horas. Bancos comerciais reportam menor fila de pedidos de importação. Economistas alertam que o alívio depende da manutenção das reservas e do ritmo das exportações de petróleo. O tema cruza finanças públicas e confiança do sector privado.",
    timeWindow: "dia",
    sourceCount: 5,
    sources: [
      { name: "Jornal de Angola", url: "https://jornaldeangola.ao" },
      { name: "Expansão", url: "https://expansao.co.ao" },
      { name: "Valor Económico", url: "https://valoreconomico.co.ao" },
    ],
    publishedAt: "2026-08-29T07:20:00+01:00",
    themeId: "cambial-bna",
    impact: "alto",
  },
  {
    id: "eco-inflacao-semana",
    sectorId: "economia",
    title: "Inflação abranda pelo segundo mês consecutivo em Luanda",
    summary:
      "Preços de alimentos e transporte moderam. Famílias ainda sentem pressão no cabaz básico.",
    fullSummary:
      "Dados regionais sugerem abrandamento da inflação em Luanda pelo segundo mês. O transporte informal e alguns alimentos processados puxaram a descida. Especialistas pedem continuidade da política monetária e maior transparência nos preços dos combustíveis. A peça agrega leituras de mercado e reação do comércio retalhista.",
    timeWindow: "semana",
    sourceCount: 4,
    sources: [
      { name: "INE Angola", url: "https://www.ine.gov.ao" },
      { name: "Expansão", url: "https://expansao.co.ao" },
    ],
    publishedAt: "2026-08-27T10:00:00+01:00",
    themeId: "inflacao-luanda",
    impact: "medio",
  },
  {
    id: "eco-pme-hora",
    sectorId: "economia",
    title: "Linha de crédito para PMEs: banca confirma novas vagas esta manhã",
    summary:
      "Três bancos comerciais abriram janelas de candidatura para microempresas até ao final do dia.",
    fullSummary:
      "Uma linha de apoio a PMEs, anunciada em parceria com instituições financeiras, passou a aceitar candidaturas esta manhã. O foco são empresas com faturação até um limiar definido e histórico fiscal regularizado. Associações empresariais pedem prazos mais longos e menos burocracia documental.",
    timeWindow: "hora",
    sourceCount: 3,
    sources: [
      { name: "Angola24Horas", url: "https://angola24horas.com" },
      { name: "Expansão", url: "https://expansao.co.ao" },
    ],
    publishedAt: "2026-08-29T08:45:00+01:00",
    themeId: "credito-pme",
    impact: "medio",
    isBreaking: true,
  },
  {
    id: "pol-orcamento-dia",
    sectorId: "politica",
    title: "Assembleia debate prioridade social no Orçamento rectificativo",
    summary:
      "Oposição e maioria divergem sobre verbas para saúde e educação. Votação prevista para a tarde.",
    fullSummary:
      "O debate do Orçamento rectificativo centrou-se em transferências sociais e reforço hospitalar. A maioria defende equilíbrio fiscal; a oposição exige mais execução real nas províncias. Observadores políticos destacam o tom construtivo, mas alertam para o risco de atrasos na execução se não houver calendário claro.",
    timeWindow: "dia",
    sourceCount: 6,
    sources: [
      { name: "Jornal de Angola", url: "https://jornaldeangola.ao" },
      { name: "Novo Jornal", url: "https://novojornal.co.ao" },
      { name: "Rádio Nacional", url: "https://rna.ao" },
    ],
    publishedAt: "2026-08-29T06:50:00+01:00",
    themeId: "orcamento-rectificativo",
    impact: "alto",
  },
  {
    id: "pol-autarquias-semana",
    sectorId: "politica",
    title: "Autarquias: calendário técnico avança, mas dúvidas legais persistem",
    summary:
      "Comissão técnica publica roteiro. Juristas pedem clareza sobre competências municipais.",
    fullSummary:
      "A comissão técnica responsável pelo processo autárquico publicou um roteiro de etapas. Partidos e sociedade civil pedem mais detalhe sobre competências fiscais e serviços municipais. A peça sintetiza posições oficiais e análises jurídicas da semana.",
    timeWindow: "semana",
    sourceCount: 5,
    sources: [
      { name: "Novo Jornal", url: "https://novojornal.co.ao" },
      { name: "DW África", url: "https://www.dw.com" },
    ],
    publishedAt: "2026-08-26T16:00:00+01:00",
    themeId: "autarquias",
    impact: "alto",
  },
  {
    id: "pol-diplomacia-hora",
    sectorId: "politica",
    title: "Chancelaria anuncia agenda bilateral com parceiros da SADC",
    summary:
      "Comunicado oficial confirma reuniões sobre comércio e segurança alimentar.",
    fullSummary:
      "O Ministério das Relações Exteriores confirmou uma série de contactos bilaterais no âmbito da SADC. Em foco: corredores comerciais e cooperação em segurança alimentar. A agenda reforça o posicionamento regional de Angola sem anúncios concretos de acordos hoje.",
    timeWindow: "hora",
    sourceCount: 2,
    sources: [
      { name: "Angop", url: "https://www.angop.ao" },
      { name: "Jornal de Angola", url: "https://jornaldeangola.ao" },
    ],
    publishedAt: "2026-08-29T08:10:00+01:00",
    themeId: "sadc-diplomacia",
    impact: "baixo",
    isBreaking: true,
  },
  {
    id: "tec-fibra-dia",
    sectorId: "tecnologia",
    title: "Expansão de fibra óptica chega a mais três municípios do norte",
    summary:
      "Operadoras aceleram cobertura. PME digitais esperam latência mais estável para serviços cloud.",
    fullSummary:
      "Três municípios do norte passam a ter fibra de backbone alargada, segundo operadoras e autoridades setoriais. Startups e centros de formação local destacam potencial para educação à distância e fintech. Especialistas pedem preços acessíveis e qualidade de serviço mensurável.",
    timeWindow: "dia",
    sourceCount: 4,
    sources: [
      { name: "TechAngola", url: "https://example.com/techangola" },
      { name: "Expansão", url: "https://expansao.co.ao" },
    ],
    publishedAt: "2026-08-29T05:30:00+01:00",
    themeId: "fibra-norte",
    impact: "medio",
  },
  {
    id: "tec-fintech-semana",
    sectorId: "tecnologia",
    title: "Fintechs angolanas batem recorde de transações móveis na semana",
    summary:
      "Pagamentos via mobile money crescem. Regulador acompanha riscos de fraude e KYC.",
    fullSummary:
      "Volumes de pagamento móvel subiram de forma acentuada esta semana, impulsionados por campanhas comerciais e maior adesão de pequenos comerciantes. O regulador reitera requisitos de identificação e monitorização de fraude. A peça cruza números operacionais e leitura de risco.",
    timeWindow: "semana",
    sourceCount: 3,
    sources: [
      { name: "TechAngola", url: "https://example.com/techangola" },
      { name: "BNA", url: "https://www.bna.ao" },
    ],
    publishedAt: "2026-08-28T12:00:00+01:00",
    themeId: "mobile-money",
    impact: "alto",
  },
  {
    id: "tec-ia-hora",
    sectorId: "tecnologia",
    title: "Universidades lançam hackathon de IA aplicada a serviços públicos",
    summary:
      "Inscrições abertas até ao fim da manhã. Projetos focam saúde e administração digital.",
    fullSummary:
      "Um consórcio universitário abriu um hackathon de IA com desafios em triagem de saúde e digitalização administrativa. Mentores do sector privado acompanham as equipas. O objectivo é protótipos utilizáveis, não apenas demos.",
    timeWindow: "hora",
    sourceCount: 2,
    sources: [
      { name: "Universidade Agostinho Neto", url: "https://uan.ao" },
      { name: "TechAngola", url: "https://example.com/techangola" },
    ],
    publishedAt: "2026-08-29T08:55:00+01:00",
    themeId: "hackathon-ia",
    impact: "baixo",
    isBreaking: true,
  },
  {
    id: "ene-producao-dia",
    sectorId: "energia",
    title: "Produção petrolífera mantém-se estável apesar de paragem programada",
    summary:
      "Operadora confirma manutenção offshore sem impacto material nas exportações do mês.",
    fullSummary:
      "Uma paragem programada numa unidade offshore foi concluída sem desvios significativos face ao plano mensal de exportação. Fontes do sector sublinham a importância da manutenção preventiva. Analistas de commodities acompanham o efeito no mix de crude angolano.",
    timeWindow: "dia",
    sourceCount: 5,
    sources: [
      { name: "Angop", url: "https://www.angop.ao" },
      { name: "Reuters", url: "https://www.reuters.com" },
      { name: "Expansão", url: "https://expansao.co.ao" },
    ],
    publishedAt: "2026-08-29T04:40:00+01:00",
    themeId: "producao-petroleo",
    impact: "alto",
  },
  {
    id: "ene-solar-semana",
    sectorId: "energia",
    title: "Projecto solar no sul entra em fase de testes de ligação à rede",
    summary:
      "Primeiros megawatts em ensaio. Comunidades locais pedem emprego e formação técnica.",
    fullSummary:
      "Um parque solar no sul iniciou testes de ligação à rede nacional. Autoridades energéticas falam em diversificação da matriz. Comunidades próximas pedem prioridade em emprego e formação. A peça agrega comunicados oficiais e vozes locais da semana.",
    timeWindow: "semana",
    sourceCount: 4,
    sources: [
      { name: "Ministério da Energia", url: "https://example.com/minea" },
      { name: "Jornal de Angola", url: "https://jornaldeangola.ao" },
    ],
    publishedAt: "2026-08-25T09:00:00+01:00",
    themeId: "solar-sul",
    impact: "medio",
  },
  {
    id: "ene-gas-hora",
    sectorId: "energia",
    title: "Gasoduto: actualização técnica confirma prazo de inspecção",
    summary:
      "Comunicado desta hora afasta rumores de atraso estrutural no troço em análise.",
    fullSummary:
      "Uma actualização técnica do consórcio responsável pelo gasoduto confirma o calendário de inspecção. Rumores de atraso estrutural foram desmentidos. Investidores acompanham o impacto em projectos de gás associado.",
    timeWindow: "hora",
    sourceCount: 3,
    sources: [
      { name: "Angop", url: "https://www.angop.ao" },
      { name: "Bloomberg", url: "https://www.bloomberg.com" },
    ],
    publishedAt: "2026-08-29T08:30:00+01:00",
    themeId: "gasoduto",
    impact: "medio",
    isBreaking: true,
  },
  {
    id: "sau-vacinas-dia",
    sectorId: "saude",
    title: "Campanha de vacinação infantil reforçada em seis províncias",
    summary:
      "Ministério da Saúde amplia brigadas móveis. Foco em cobertura em zonas remotas.",
    fullSummary:
      "Brigadas móveis reforçam a vacinação infantil em seis províncias, com prioridade a zonas de difícil acesso. Parceiros internacionais apoiam logística de cadeia de frio. Pediatras pedem comunicação clara para combater hesitação vacinal.",
    timeWindow: "dia",
    sourceCount: 4,
    sources: [
      { name: "Ministério da Saúde", url: "https://minsa.gov.ao" },
      { name: "OMS África", url: "https://www.afro.who.int" },
    ],
    publishedAt: "2026-08-29T06:10:00+01:00",
    themeId: "vacinacao-infantil",
    impact: "alto",
  },
  {
    id: "sau-hospitais-semana",
    sectorId: "saude",
    title: "Hospitais centrais reduzem tempo médio de espera nas urgências",
    summary:
      "Nova triagem e turnos alargados mostram ganhos na semana. Utentes pedem consistência.",
    fullSummary:
      "Unidades hospitalares centrais reportam redução do tempo médio de espera após nova triagem e reforço de turnos. Profissionais de saúde alertam para fadiga das equipas. Utentes valorizam a melhoria, mas pedem que se mantenha nos fins-de-semana.",
    timeWindow: "semana",
    sourceCount: 3,
    sources: [
      { name: "Jornal de Angola", url: "https://jornaldeangola.ao" },
      { name: "Rádio Nacional", url: "https://rna.ao" },
    ],
    publishedAt: "2026-08-27T14:20:00+01:00",
    themeId: "urgencias",
    impact: "medio",
  },
  {
    id: "sau-agua-hora",
    sectorId: "saude",
    title: "Alerta sanitário: qualidade da água sob vigilância em bairro de Luanda",
    summary:
      "Autoridades locais pedem fervura preventiva enquanto laboratórios concluem análises.",
    fullSummary:
      "Um alerta sanitário local recomenda precaução no consumo de água num bairro de Luanda enquanto decorrem análises laboratoriais. Equipas de saúde ambiental estão no terreno. Não há confirmação de surto — apenas vigilância reforçada.",
    timeWindow: "hora",
    sourceCount: 3,
    sources: [
      { name: "Ministério da Saúde", url: "https://minsa.gov.ao" },
      { name: "Angola24Horas", url: "https://angola24horas.com" },
    ],
    publishedAt: "2026-08-29T08:05:00+01:00",
    themeId: "agua-luanda",
    impact: "alto",
    isBreaking: true,
  },
  {
    id: "eco-ano-dividas",
    sectorId: "economia",
    title: "Retrospectiva: gestão da dívida externa moldou o ano económico",
    summary:
      "Renegociações, spreads e confiança dos investidores — o fio que ligou 2026.",
    fullSummary:
      "Ao longo do ano, a gestão da dívida externa foi o padrão dominante na economia angolana: renegociações, comunicação com mercados e impacto no financiamento interno. Esta peça anual tece os resumos mensais num quadro único para decisores.",
    timeWindow: "ano",
    sourceCount: 12,
    sources: [
      { name: "FMI", url: "https://www.imf.org" },
      { name: "Expansão", url: "https://expansao.co.ao" },
      { name: "BNA", url: "https://www.bna.ao" },
    ],
    publishedAt: "2026-08-01T00:00:00+01:00",
    themeId: "divida-externa",
    impact: "alto",
  },
  {
    id: "ene-ano-transicao",
    sectorId: "energia",
    title: "Retrospectiva energética: petróleo ainda manda, solar ganha fio",
    summary:
      "Produção de crude, novos blocos e primeiros megawatts solares definem o padrão do ano.",
    fullSummary:
      "O ano energético em Angola manteve o petróleo no centro, mas os fios da transição — solar, gás e eficiência — ganharam densidade. Esta retrospectiva liga decisões de investimento, manutenção offshore e primeiros testes de ligação renovável.",
    timeWindow: "ano",
    sourceCount: 10,
    sources: [
      { name: "Angop", url: "https://www.angop.ao" },
      { name: "IEA", url: "https://www.iea.org" },
    ],
    publishedAt: "2026-08-01T00:00:00+01:00",
    themeId: "transicao-energetica",
    impact: "alto",
  },
];

export function getPiece(id: string) {
  return PIECES.find((p) => p.id === id);
}

export function getPiecesByTheme(themeId: string) {
  return PIECES.filter((p) => p.themeId === themeId).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function filterPieces(opts: {
  sectorId?: string;
  timeWindow?: string;
  query?: string;
  sectorIds?: string[];
}) {
  const q = opts.query?.trim().toLowerCase();
  return PIECES.filter((p) => {
    if (opts.sectorId && p.sectorId !== opts.sectorId) return false;
    if (opts.sectorIds && !opts.sectorIds.includes(p.sectorId)) return false;
    if (opts.timeWindow && p.timeWindow !== opts.timeWindow) return false;
    if (q) {
      const hay = `${p.title} ${p.summary} ${p.fullSummary}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Resumo Geral do Dia — cruza os 5 sectores. */
export function getDailyDigest() {
  return filterPieces({ timeWindow: "dia" }).slice(0, 5);
}
