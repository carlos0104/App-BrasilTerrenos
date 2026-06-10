import { useState } from "react";

const LOGO_SRC = "/logo_branca.png";

const GLOBAL_CSS = `
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    display: block !important;
    place-items: unset !important;
    overflow: hidden;
    background: #F4F6F8;
    color: #0F172A;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100% !important;
    max-width: none !important;
    min-height: 100vh;
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
  }

  button,
  select,
  input,
  textarea {
    font-family: inherit;
  }

  /* Rolagem minimalista */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(15, 23, 42, .18) transparent;
  }

  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, .16);
    border-radius: 999px;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(15, 23, 42, .28);
  }

  *::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const GlobalStyles = () => <style>{GLOBAL_CSS}</style>;

// Paleta Brasil Terrenos + design tokens
const BT = {
  // Marca
  azulMenu: "#00174A",
  azulMenuHover: "#0A2A68",
  azulMenuAtivo: "#18396F",
  azul: "#2563EB",
  azulClaro: "#DBEAFE",

  verde: "#587810",
  verdeClaro: "#E6EFD4",
  amarelo: "#F2A900",
  amareloClaro: "#FFF4CC",
  vermelho: "#C00000",
  vermelhoClaro: "#FEE2E2",

  // Neutros modernos
  branco: "#FFFFFF",
  fundo: "#F4F6F8",
  card: "#FFFFFF",
  borda: "#E2E8F0",
  linha: "#EEF2F7",
  cinza: "#E5E7EB",
  cinzaClaro: "#F8FAFC",

  texto: "#0F172A",
  textoMedio: "#334155",
  textoSuave: "#64748B",
  textoMuitoSuave: "#94A3B8",
};

const alpha = (hex, opacity = 0.12) => {
  const clean = String(hex).replace("#", "");
  const value = parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ── DATA ────────────────────────────────────────────────────────────────────
const ETAPAS = ["Prospecção","Viabilidade","Novos Negócios","Land Bank","Projetos","Licenciamento","Aprov. Prefeitura","Registro Cartório","Lançamento","Obras","Doação","TVO"];

const EMPREENDIMENTOS = [
  { id:1, nome:"Jardim das Águas", cidade:"Campinas", regiao:"Campinas", area:"120 ha", lotes:1200, responsavel:"Ana Martins", etapa:"Licenciamento", status:"risco", pendencias:4, avanco:52, lancamento:2028, proximo:"Licença ambiental", segmento:"Loteamento" },
  { id:2, nome:"Parque Horizonte", cidade:"Sorocaba", regiao:"Sorocaba", area:"85 ha", lotes:870, responsavel:"Carlos Lima", etapa:"Projetos", status:"atencao", pendencias:2, avanco:38, lancamento:2027, proximo:"Protocolo Prefeitura", segmento:"Loteamento" },
  { id:3, nome:"Reserva Santa Clara", cidade:"Ribeirão Preto", regiao:"Ribeirão Preto", area:"200 ha", lotes:2100, responsavel:"Fernanda Rocha", etapa:"Aprov. Prefeitura", status:"atrasado", pendencias:7, avanco:61, lancamento:2026, proximo:"Aprovação final", segmento:"Condomínio" },
  { id:4, nome:"Vila Ipês", cidade:"Jundiaí", regiao:"Jundiaí", area:"50 ha", lotes:520, responsavel:"Rafael Souza", etapa:"Lançamento", status:"emdia", pendencias:0, avanco:95, lancamento:2025, proximo:"Stand de vendas", segmento:"Loteamento" },
  { id:5, nome:"Terras do Sol", cidade:"São José dos Campos", regiao:"São José dos Campos", area:"160 ha", lotes:1600, responsavel:"Mariana Costa", etapa:"Land Bank", status:"emdia", pendencias:1, avanco:22, lancamento:2029, proximo:"Due diligence", segmento:"Loteamento" },
  { id:6, nome:"Nova Campinas", cidade:"Campinas", regiao:"Campinas", area:"75 ha", lotes:780, responsavel:"Ana Martins", etapa:"Registro Cartório", status:"risco", pendencias:3, avanco:78, lancamento:2026, proximo:"Registro matrícula", segmento:"Condomínio" },
  { id:7, nome:"Bosque Imperial", cidade:"Sorocaba", regiao:"Sorocaba", area:"140 ha", lotes:1450, responsavel:"Lucas Ferreira", etapa:"Obras", status:"atencao", pendencias:5, avanco:44, lancamento:2024, proximo:"Conclusão infraestrutura", segmento:"Loteamento" },
  { id:8, nome:"Portal dos Lagos", cidade:"Campinas", regiao:"Campinas", area:"95 ha", lotes:980, responsavel:"Beatriz Alves", etapa:"Viabilidade", status:"emdia", pendencias:0, avanco:15, lancamento:2030, proximo:"Estudo de mercado", segmento:"Condomínio" },
  { id:9, nome:"Serra Verde", cidade:"Ribeirão Preto", regiao:"Ribeirão Preto", area:"65 ha", lotes:640, responsavel:"Fernanda Rocha", etapa:"Novos Negócios", status:"emdia", pendencias:1, avanco:28, lancamento:2028, proximo:"Aprovação diretoria", segmento:"Loteamento" },
  { id:10, nome:"Alameda das Flores", cidade:"Jundiaí", regiao:"Jundiaí", area:"42 ha", lotes:410, responsavel:"Rafael Souza", etapa:"Doação", status:"atrasado", pendencias:6, avanco:88, lancamento:2023, proximo:"TVO", segmento:"Loteamento" },
  { id:11, nome:"Recanto dos Ipês", cidade:"São José dos Campos", regiao:"São José dos Campos", area:"110 ha", lotes:1100, responsavel:"Mariana Costa", etapa:"Projetos", status:"risco", pendencias:3, avanco:33, lancamento:2027, proximo:"Projeto elétrico", segmento:"Condomínio" },
  { id:12, nome:"Jardim Palmeiras", cidade:"Sorocaba", regiao:"Sorocaba", area:"88 ha", lotes:860, responsavel:"Carlos Lima", etapa:"TVO", status:"emdia", pendencias:1, avanco:97, lancamento:2022, proximo:"Encerramento formal", segmento:"Loteamento" },
];

const STATUS_MAP = {
  emdia:     { label:"Em dia",    color:BT.verde,    bg:BT.verdeClaro,    text:"#3F5F0A" },
  atencao:   { label:"Atenção",   color:BT.amarelo,  bg:BT.amareloClaro,  text:"#7A5600" },
  risco:     { label:"Em risco",  color:BT.amarelo,  bg:BT.amareloClaro,  text:"#7A5600" },
  atrasado:  { label:"Atrasado",  color:BT.vermelho, bg:BT.vermelhoClaro, text:"#9F1239" },
  concluido: { label:"Concluído", color:BT.azul,     bg:BT.azulClaro,     text:BT.azul },
};

const REVISOES = [
  { id:1, emp:"Jardim das Águas", projeto:"Drenagem", rev:3, motivo:"Cota topográfica incorreta", origem:"Prefeitura", resp:"Ana Martins", inicio:"2024-01-10", fim:"2024-02-14", dias:35, impacto:35 },
  { id:2, emp:"Parque Horizonte", projeto:"Urbanismo", rev:2, motivo:"Alteração no traçado viário", origem:"Diretoria", resp:"Carlos Lima", inicio:"2024-02-20", fim:"2024-03-18", dias:27, impacto:27 },
  { id:3, emp:"Reserva Santa Clara", projeto:"Elétrico", rev:4, motivo:"Norma técnica desatualizada", origem:"Prefeitura", resp:"Fernanda Rocha", inicio:"2023-11-05", fim:"2024-01-10", dias:66, impacto:66 },
  { id:4, emp:"Bosque Imperial", projeto:"Esgoto", rev:2, motivo:"Interferência com APP", origem:"Ambiental", resp:"Lucas Ferreira", inicio:"2024-03-01", fim:"2024-04-02", dias:32, impacto:32 },
  { id:5, emp:"Nova Campinas", projeto:"Urbanismo", rev:1, motivo:"Mudança de recuo", origem:"Prefeitura", resp:"Ana Martins", inicio:"2024-04-15", fim:"2024-05-10", dias:25, impacto:25 },
  { id:6, emp:"Recanto dos Ipês", projeto:"Paisagismo", rev:3, motivo:"Espécie não aprovada", origem:"Ambiental", resp:"Mariana Costa", inicio:"2024-05-01", fim:"2024-06-20", dias:50, impacto:50 },
];

const DOCUMENTOS = [
  { id:1, emp:"Jardim das Águas", doc:"Licença Ambiental Prévia", status:"pendente", versao:"v1.0", atualizado:"2024-05-10", resp:"Ana Martins", origem:"Ambiental", sistema:"—" },
  { id:2, emp:"Jardim das Águas", doc:"Projeto de Urbanismo", status:"revisao", versao:"v3.2", atualizado:"2024-06-01", resp:"Escritório BKN", origem:"Terceiro", sistema:"Construcode" },
  { id:3, emp:"Parque Horizonte", doc:"Memorial Descritivo", status:"aprovado", versao:"v2.0", atualizado:"2024-04-15", resp:"Carlos Lima", origem:"Interno", sistema:"AutoDoc" },
  { id:4, emp:"Reserva Santa Clara", doc:"Projeto de Drenagem", status:"bloqueado", versao:"v1.1", atualizado:"2024-02-20", resp:"Fernanda Rocha", origem:"Terceiro", sistema:"Construcode" },
  { id:5, emp:"Nova Campinas", doc:"Matrícula do Imóvel", status:"aguardando", versao:"v1.0", atualizado:"2024-06-05", resp:"Rafael Souza", origem:"Cartório", sistema:"—" },
  { id:6, emp:"Bosque Imperial", doc:"ART Responsável Técnico", status:"aprovado", versao:"v1.0", atualizado:"2024-03-30", resp:"Lucas Ferreira", origem:"Interno", sistema:"AutoDoc" },
  { id:7, emp:"Jardim das Águas", doc:"Projeto Elétrico", status:"obsoleto", versao:"v2.1", atualizado:"2023-12-01", resp:"Escritório BKN", origem:"Terceiro", sistema:"Construcode" },
  { id:8, emp:"Recanto dos Ipês", doc:"Licença de Instalação", status:"pendente", versao:"v1.0", atualizado:"2024-06-10", resp:"Mariana Costa", origem:"Ambiental", sistema:"—" },
];

const DOC_STATUS = {
  aprovado:   { label:"Aprovado",   bg:BT.verdeClaro,    text:"#3F5F0A" },
  pendente:   { label:"Pendente",   bg:BT.amareloClaro,  text:"#7A5600" },
  revisao:    { label:"Em revisão", bg:BT.azulClaro,     text:BT.azul },
  bloqueado:  { label:"Bloqueado",  bg:BT.vermelhoClaro, text:"#9F1239" },
  obsoleto:   { label:"Obsoleto",   bg:BT.cinza,         text:"#6b7280" },
  aguardando: { label:"Aguardando", bg:BT.azulClaro,     text:BT.azul },
};

const OBRAS = [
  { id:1, emp:"Bosque Imperial", etapa:"Terraplanagem", pct:72, pendencias:3, previsto:"2024-09-30", realizado:"—", doacao:"Pendente", tvo:"Não iniciado", resp:"Lucas Ferreira" },
  { id:2, emp:"Vila Ipês", etapa:"Infraestrutura", pct:95, pendencias:0, previsto:"2025-03-15", realizado:"—", doacao:"Em andamento", tvo:"Não iniciado", resp:"Rafael Souza" },
  { id:3, emp:"Alameda das Flores", etapa:"Concluída", pct:100, pendencias:2, previsto:"2023-12-31", realizado:"2024-01-10", doacao:"Concluída", tvo:"Em análise", resp:"Rafael Souza" },
  { id:4, emp:"Jardim Palmeiras", etapa:"Concluída", pct:100, pendencias:0, previsto:"2022-12-31", realizado:"2023-01-05", doacao:"Concluída", tvo:"Concluído", resp:"Carlos Lima" },
];

// ── HELPERS ─────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.emdia;
  return (
    <span
      style={{
        display:"inline-flex",
        alignItems:"center",
        gap:6,
        padding:"4px 9px",
        borderRadius:999,
        fontSize:11,
        lineHeight:1,
        fontWeight:700,
        letterSpacing:".01em",
        background:s.bg,
        color:s.text,
      }}
    >
      <span style={{ width:6, height:6, borderRadius:999, background:s.color, display:"inline-block" }} />
      {s.label}
    </span>
  );
};

const DocBadge = ({ status }) => {
  const s = DOC_STATUS[status] || DOC_STATUS.pendente;
  return (
    <span
      style={{
        display:"inline-flex",
        alignItems:"center",
        gap:6,
        padding:"4px 9px",
        borderRadius:999,
        fontSize:11,
        lineHeight:1,
        fontWeight:700,
        background:s.bg,
        color:s.text,
      }}
    >
      <span style={{ width:6, height:6, borderRadius:999, background:s.text, display:"inline-block", opacity:.75 }} />
      {s.label}
    </span>
  );
};

const ProgressBar = ({ pct, color = BT.azul }) => (
  <div style={{ background:BT.linha, borderRadius:999, height:6, width:"100%", overflow:"hidden" }}>
    <div style={{ width:`${pct}%`, background:color, height:"100%", borderRadius:999, transition:"width .4s" }} />
  </div>
);

const MetricIcon = ({ name, color = BT.azul, size = 18 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { display: "block" },
  };

  const icons = {
    portfolio: <svg {...common}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V19H4Z"/><path d="M8 5V3.8A1.8 1.8 0 0 1 9.8 2h4.4A1.8 1.8 0 0 1 16 3.8V5"/><path d="M4 11h16"/><path d="M10 11v2h4v-2"/></svg>,
    check: <svg {...common}><path d="M20 6 9 17l-5-5"/></svg>,
    risk: <svg {...common}><path d="m12 3 9 16H3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
    delay: <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
    launch: <svg {...common}><path d="M7 17 17 7"/><path d="M9 7h8v8"/><path d="M5 19h14"/></svg>,
    lots: <svg {...common}><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16V9"/><path d="M12 16V6"/><path d="M16 16v-4"/></svg>,
    calendar: <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M3 10h18"/></svg>,
    license: <svg {...common}><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>,
    registry: <svg {...common}><path d="M6 3h9l5 5v13H6z"/><path d="M14 3v6h6"/><path d="M9 13h7"/><path d="M9 17h5"/></svg>,
    average: <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></svg>,
    target: <svg {...common}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M22 12h-3"/></svg>,
    pending: <svg {...common}><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="9"/></svg>,
    revision: <svg {...common}><path d="M21 12a9 9 0 0 1-15.2 6.5"/><path d="M3 12A9 9 0 0 1 18.2 5.5"/><path d="M6 18H3v3"/><path d="M18 6h3V3"/></svg>,
    time: <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5"/><path d="M12 12h4"/></svg>,
    impact: <svg {...common}><path d="M4 19h16"/><path d="M6 15l4-4 3 3 5-7"/><path d="M16 7h2v2"/></svg>,
    cause: <svg {...common}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12c.7.6 1 1.4 1 2h6c0-.6.3-1.4 1-2a7 7 0 0 0-4-12Z"/></svg>,
    document: <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></svg>,
    locked: <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>,
    works: <svg {...common}><path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/></svg>,
    donation: <svg {...common}><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7"/><path d="M12 21V8"/><path d="M5 8h14v4H5z"/><path d="M12 8c-2.7 0-4-1-4-2.5S9.5 3 12 8Z"/><path d="M12 8c2.7 0 4-1 4-2.5S14.5 3 12 8Z"/></svg>,
    seal: <svg {...common}><path d="M12 3 4 7v6c0 5 3.5 7.5 8 8 4.5-.5 8-3 8-8V7z"/><path d="m9 12 2 2 4-4"/></svg>,
  };

  return <span style={{ color, display:"inline-flex" }}>{icons[name] || icons.portfolio}</span>;
};

const MiniCard = ({ label, value, sub, accent = BT.azul, icon }) => (
  <div
    style={{
      background:BT.card,
      border:`1px solid ${BT.borda}`,
      borderRadius:16,
      padding:"18px 20px",
      flex:1,
      minWidth:190,
      boxShadow:"0 1px 2px rgba(15,23,42,.04)",
    }}
  >
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      {icon && (
        <div
          style={{
            width:34,
            height:34,
            borderRadius:12,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            background:alpha(accent, .10),
            border:`1px solid ${alpha(accent, .16)}`,
            flexShrink:0,
          }}
        >
          <MetricIcon name={icon} color={accent} size={17} />
        </div>
      )}
      <div style={{ fontSize:12, color:BT.textoSuave, fontWeight:500, letterSpacing:"0" }}>{label}</div>
    </div>
    <div style={{ fontSize:28, fontWeight:650, color:BT.texto, lineHeight:1.05, letterSpacing:"-.015em", fontFeatureSettings:"'tnum' 1" }}>{value}</div>
    {sub && <div style={{ fontSize:12, color:BT.textoMuitoSuave, marginTop:9, fontWeight:400 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom:22 }}>
    <h2 style={{ fontSize:21, fontWeight:650, color:BT.texto, margin:0, letterSpacing:"-.012em" }}>{title}</h2>
    {sub && <p style={{ fontSize:13, color:BT.textoSuave, margin:"6px 0 0", fontWeight:400 }}>{sub}</p>}
  </div>
);

const Dot = ({ color }) => <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:color, marginRight:6 }} />;

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function VigaoGeral({ onCard }) {
  const total = EMPREENDIMENTOS.length;
  const emdia = EMPREENDIMENTOS.filter(e => e.status === "emdia").length;
  const risco = EMPREENDIMENTOS.filter(e => e.status === "risco").length;
  const atrasado = EMPREENDIMENTOS.filter(e => e.status === "atrasado").length;
  const lancamentos2026 = EMPREENDIMENTOS.filter(e => e.lancamento === 2026).length;

  const byEtapa = ETAPAS.map(et => ({ name:et, count: EMPREENDIMENTOS.filter(e=>e.etapa===et).length }));
  const maxCount = Math.max(...byEtapa.map(b=>b.count));

  const alertas = [
    { tipo:"risco", msg:"Jardim das Águas — Licença Ambiental vence em 45 dias", icon:"•" },
    { tipo:"atrasado", msg:"Reserva Santa Clara — Aprovação na Prefeitura com 72 dias de atraso", icon:"•" },
    { tipo:"risco", msg:"Nova Campinas — Registro em Cartório travado por pendência documental", icon:"•" },
    { tipo:"atrasado", msg:"Alameda das Flores — TVO ainda não iniciado, doação concluída há 4 meses", icon:"•" },
    { tipo:"atencao", msg:"Parque Horizonte — Projetos com 2 revisões no último mês", icon:"•" },
  ];

  return (
    <div>
      <SectionTitle title="Visão Geral" sub="Resumo executivo de todos os empreendimentos" />

      {/* KPI CARDS */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:28 }}>
        <MiniCard label="Portfólio total" value={total} icon="portfolio" accent={BT.azul} sub="portfólio ativo" />
        <MiniCard label="Em dia" value={emdia} icon="check" accent={BT.verde} sub="sem pendências críticas" />
        <MiniCard label="Em risco" value={risco} icon="risk" accent={BT.amarelo} sub="requer atenção imediata" />
        <MiniCard label="Atrasados" value={atrasado} icon="delay" accent={BT.vermelho} sub="prazo extrapolado" />
        <MiniCard label="Lançamentos 2026" value={lancamentos2026} icon="launch" accent={BT.azul} sub="previstos para este ano" />
        <MiniCard label="Volume aprovado" value="4.320 lotes" icon="lots" accent={BT.azul} sub="vs. 6.100 planejados" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        {/* CHART */}
        <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, color:BT.textoMedio, marginBottom:16 }}>Empreendimentos por Etapa</div>
          {byEtapa.map((b,i) => (
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:BT.textoMedio, marginBottom:3 }}>
                <span>{b.name}</span><span style={{ fontWeight:600 }}>{b.count}</span>
              </div>
              <div style={{ background:BT.cinzaClaro, borderRadius:6, height:8 }}>
                <div style={{ width:`${b.count/maxCount*100}%`, background:BT.azul, height:"100%", borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>

        {/* ALERTAS */}
        <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, color:BT.textoMedio, marginBottom:14 }}>⚡ Alertas Críticos</div>
          {alertas.map((a,i) => (
            <div key={i} style={{ padding:"10px 12px", borderRadius:8, marginBottom:8, background: a.tipo==="atrasado"?BT.vermelhoClaro: a.tipo==="risco"?BT.amareloClaro:BT.amareloClaro, border:`1px solid ${a.tipo==="atrasado"?BT.vermelhoClaro:a.tipo==="risco"?BT.amareloClaro:BT.amareloClaro}` }}>
              <span style={{ fontSize:13, color:BT.textoMedio }}>{a.icon} {a.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LISTA RÁPIDA */}
      <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
        <div style={{ fontWeight:600, fontSize:14, color:BT.textoMedio, marginBottom:14 }}>Empreendimentos Recentes</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${BT.borda}` }}>
              {["Empreendimento","Cidade","Etapa","Responsável","Lançamento","Status","Avanço"].map(h=>(
                <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:BT.textoMuitoSuave, padding:"0 8px 8px", textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EMPREENDIMENTOS.slice(0,8).map(e=>(
              <tr key={e.id} onClick={()=>onCard(e)} style={{ borderBottom:`1px solid ${BT.linha}`, cursor:"pointer" }} onMouseEnter={ev=>ev.currentTarget.style.background=BT.cinzaClaro} onMouseLeave={ev=>ev.currentTarget.style.background=""}>
                <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600, color:BT.texto }}>{e.nome}</td>
                <td style={{ padding:"10px 8px", fontSize:13, color:BT.textoMedio }}>{e.cidade}</td>
                <td style={{ padding:"10px 8px" }}><span style={{ fontSize:12, background:BT.azulClaro, color:BT.azul, padding:"2px 9px", borderRadius:12, fontWeight:500 }}>{e.etapa}</span></td>
                <td style={{ padding:"10px 8px", fontSize:13, color:BT.textoMedio }}>{e.responsavel}</td>
                <td style={{ padding:"10px 8px", fontSize:13, color:BT.textoMedio }}>{e.lancamento}</td>
                <td style={{ padding:"10px 8px" }}><Badge status={e.status} /></td>
                <td style={{ padding:"10px 8px", width:100 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <ProgressBar pct={e.avanco} />
                    <span style={{ fontSize:12, color:BT.textoSuave, minWidth:32 }}>{e.avanco}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EsteiraKanban({ onCard }) {
  return (
    <div>
      <SectionTitle title="Esteira de Empreendimentos" sub="Visão kanban por fase do empreendimento" />
      <div
        style={{
          width:"100%",
          maxWidth:"100%",
          overflowX:"auto",
          overflowY:"hidden",
          padding:"6px 0 14px",
        }}
      >
        <div
          style={{
            display:"flex",
            gap:14,
            minWidth:ETAPAS.length * 238,
            padding:"0 4px 10px 0",
            alignItems:"stretch",
          }}
        >
          {ETAPAS.map((et, ci) => {
            const cards = EMPREENDIMENTOS.filter(e=>e.etapa===et);
            return (
              <div
                key={ci}
                style={{
                  flex:"0 0 224px",
                  minWidth:224,
                  background:"rgba(255,255,255,.62)",
                  border:"1px solid #dfe5ef",
                  borderRadius:16,
                  padding:10,
                  minHeight:560,
                }}
              >
                <div
                  style={{
                    minHeight:38,
                    padding:"8px 8px 10px",
                    marginBottom:10,
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    gap:8,
                    borderBottom:"1px solid #e6ebf3",
                  }}
                >
                  <span style={{ fontSize:12, fontWeight:700, color:BT.azulMenu, lineHeight:1.2 }}>{et}</span>
                  <span
                    style={{
                      minWidth:24,
                      height:24,
                      display:"inline-flex",
                      alignItems:"center",
                      justifyContent:"center",
                      fontSize:11,
                      background:BT.azul,
                      color:"#fff",
                      borderRadius:999,
                      padding:"0 7px",
                      fontWeight:700,
                    }}
                  >
                    {cards.length}
                  </span>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {cards.map(e=>(
                    <div
                      key={e.id}
                      onClick={()=>onCard(e)}
                      style={{
                        background:BT.card,
                        border:"1px solid #dfe5ef",
                        borderRadius:14,
                        padding:14,
                        cursor:"pointer",
                        transition:"box-shadow .15s, transform .15s, border-color .15s",
                        boxShadow:"0 8px 18px rgba(15, 23, 42, .055)",
                        minHeight:190,
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"space-between",
                      }}
                      onMouseEnter={ev=>{
                        ev.currentTarget.style.boxShadow="0 12px 24px rgba(15, 23, 42, .11)";
                        ev.currentTarget.style.transform="translateY(-1px)";
                        ev.currentTarget.style.borderColor="#c7d2e5";
                      }}
                      onMouseLeave={ev=>{
                        ev.currentTarget.style.boxShadow="0 8px 18px rgba(15, 23, 42, .055)";
                        ev.currentTarget.style.transform="translateY(0)";
                        ev.currentTarget.style.borderColor="#dfe5ef";
                      }}
                    >
                      <div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:8 }}>
                          <div style={{ fontWeight:700, fontSize:13, color:BT.texto, lineHeight:1.25 }}>{e.nome}</div>
                        </div>

                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:BT.textoSuave, marginBottom:9 }}>
                          <span>📍</span>
                          <span>{e.cidade}</span>
                        </div>

                        <div style={{ marginBottom:10 }}><Badge status={e.status} /></div>

                        <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:5, fontSize:11, color:BT.textoSuave, marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}><span>👤</span><span>{e.responsavel}</span></div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}><span>🚀</span><span>Lançamento: {e.lancamento}</span></div>
                        </div>

                        {e.pendencias>0 && (
                          <div style={{ fontSize:11, background:BT.vermelhoClaro, color:BT.vermelho, padding:"4px 8px", borderRadius:999, display:"inline-flex", fontWeight:700, marginBottom:10 }}>
                            {e.pendencias} pendências
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                          <span style={{ fontSize:10, color:"#8a94a6" }}>Avanço</span>
                          <span style={{ fontSize:10, color:BT.textoSuave, fontWeight:700 }}>{e.avanco}%</span>
                        </div>
                        <ProgressBar pct={e.avanco} />
                        <div style={{ fontSize:10, color:BT.azul, marginTop:9, borderTop:"1px solid #edf1f7", paddingTop:8, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {e.proximo}
                        </div>
                      </div>
                    </div>
                  ))}

                  {cards.length===0 && (
                    <div
                      style={{
                        minHeight:146,
                        border:"1px dashed #d7deea",
                        borderRadius:14,
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        color:"#aab3c2",
                        fontSize:12,
                        background:"rgba(255,255,255,.45)",
                        textAlign:"center",
                        padding:14,
                      }}
                    >
                      Nenhum empreendimento
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetalheEmp({ emp, onClose }) {
  const [aba, setAba] = useState("resumo");
  const abas = ["resumo","cronograma","pendencias","documentos","revisoes","licencas"];
  const timeline = [
    { fase:"Prospecção", prev:"2022-03-01", real:"2022-04-05", var:35, resp:"Ana Martins", status:"concluido" },
    { fase:"Viabilidade", prev:"2022-06-01", real:"2022-07-20", var:49, resp:"Ana Martins", status:"concluido" },
    { fase:"Novos Negócios", prev:"2022-09-01", real:"2022-09-15", var:14, resp:"Novos Neg.", status:"concluido" },
    { fase:"Land Bank", prev:"2022-12-01", real:"2023-01-10", var:40, resp:"Land Bank", status:"concluido" },
    { fase:"Desenvolvimento Projeto", prev:"2023-06-01", real:"2023-09-20", var:111, resp:"BKN Arq.", status:"concluido" },
    { fase:"Protocolo Prefeitura", prev:"2023-10-01", real:"2023-10-18", var:17, resp:"Ana Martins", status:"concluido" },
    { fase:"Aprovação Prefeitura", prev:"2024-04-01", real:"—", var:"Em andamento", resp:"Ana Martins", status:"atencao" },
    { fase:"Licenciamento Ambiental", prev:"2024-08-01", real:"—", var:"Aguardando", resp:"Ambiental", status:"risco" },
    { fase:"Registro em Cartório", prev:"2025-01-01", real:"—", var:"—", resp:"Jurídico", status:"pendente" },
    { fase:"Lançamento", prev:"2025-06-01", real:"—", var:"—", resp:"Comercial", status:"pendente" },
  ];

  const pendencias = [
    { item:"Licença Ambiental Prévia", area:"Ambiental", prazo:"2024-08-30", criticidade:"Alta" },
    { item:"Projeto de Drenagem revisado", area:"Projetos", prazo:"2024-07-15", criticidade:"Alta" },
    { item:"Certidão negativa de débitos", area:"Jurídico", prazo:"2024-07-01", criticidade:"Média" },
    { item:"ART do responsável técnico", area:"Projetos", prazo:"2024-08-01", criticidade:"Média" },
  ];

  const licencas = [
    { nome:"Licença Ambiental Prévia (LP)", status:"pendente", emissao:"—", validade:"—", orgao:"CETESB" },
    { nome:"Licença de Instalação (LI)", status:"pendente", emissao:"—", validade:"—", orgao:"CETESB" },
    { nome:"Alvará de Aprovação", status:"revisao", emissao:"—", validade:"—", orgao:"Prefeitura Campinas" },
    { nome:"CONAMA — Supressão Vegetal", status:"aprovado", emissao:"2024-02-15", validade:"2027-02-15", orgao:"IBAMA" },
  ];

  const s = STATUS_MAP[emp.status];
  const FASE_STATUS = { concluido:{bg:BT.verdeClaro,text:"#3F5F0A",label:"Concluído"}, atencao:{bg:BT.amareloClaro,text:"#7A5600",label:"Atenção"}, risco:{bg:BT.amareloClaro,text:"#7A5600",label:"Em risco"}, pendente:{bg:BT.cinzaClaro,text:"#6b7280",label:"Não iniciado"} };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:BT.cinzaClaro, borderRadius:16, width:"100%", maxWidth:900, maxHeight:"90vh", overflowY:"auto" }}
        onClick={e=>e.stopPropagation()}>
        {/* HEADER */}
        <div style={{ background:BT.azul, padding:"24px 28px", borderRadius:"16px 16px 0 0", color:"#fff" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:22, fontWeight:700 }}>{emp.nome}</div>
              <div style={{ fontSize:14, opacity:.85 }}>📍 {emp.cidade}, {emp.regiao} · {emp.area} · {emp.lotes} lotes</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", fontSize:20, borderRadius:8, padding:"4px 10px", cursor:"pointer" }}>✕</button>
          </div>
          <div style={{ display:"flex", gap:20, marginTop:14, flexWrap:"wrap" }}>
            {[["Responsável", emp.responsavel],["Lançamento", emp.lancamento],["Etapa", emp.etapa],["Avanço", emp.avanco+"%"]].map(([l,v])=>(
              <div key={l}><div style={{ fontSize:11, opacity:.7 }}>{l}</div><div style={{ fontWeight:700, fontSize:15 }}>{v}</div></div>
            ))}
            <div><div style={{ fontSize:11, opacity:.7 }}>Status</div><div style={{ marginTop:2 }}><span style={{ padding:"3px 12px", borderRadius:12, background:s.bg, color:s.text, fontSize:12, fontWeight:700 }}>{s.label}</span></div></div>
          </div>
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:11, opacity:.7, marginBottom:4 }}>Progresso geral</div>
            <div style={{ background:"rgba(255,255,255,.3)", borderRadius:8, height:8 }}>
              <div style={{ width:`${emp.avanco}%`, background:BT.card, height:"100%", borderRadius:8 }} />
            </div>
          </div>
        </div>

        {/* ABAS */}
        <div style={{ display:"flex", gap:0, background:BT.card, borderBottom:`1px solid ${BT.borda}`, padding:"0 24px" }}>
          {abas.map(a=>(
            <button key={a} onClick={()=>setAba(a)} style={{ padding:"12px 16px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:aba===a?700:400, color:aba===a?BT.azul:"#6b7280", borderBottom:aba===a?`2px solid ${BT.azul}`:"2px solid transparent", textTransform:"capitalize" }}>{a}</button>
          ))}
        </div>

        <div style={{ padding:24 }}>
          {aba==="resumo" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                ["Etapa Atual", emp.etapa, BT.azulClaro,BT.azul],
                ["Próximo Marco", emp.proximo, BT.azulClaro,BT.azul],
                ["Status Documental", "Pendências em 2 documentos", BT.amareloClaro,"#7A5600"],
                ["Status Licenciamento", "LP aguardando análise CETESB", BT.amareloClaro,"#7A5600"],
                ["Previsão de Lançamento", emp.lancamento, BT.verdeClaro,BT.verde],
                ["Pendências Abertas", emp.pendencias, BT.vermelhoClaro,BT.vermelho],
              ].map(([l,v,bg,c])=>(
                <div key={l} style={{ background:bg, borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:11, color:c, fontWeight:600, marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
                  <div style={{ fontSize:16, fontWeight:700, color:c }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {aba==="cronograma" && (
            <div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ borderBottom:`2px solid ${BT.borda}` }}>
                  {["Fase","Previsto","Realizado","Variação","Responsável","Status"].map(h=>(
                    <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:BT.textoMuitoSuave, padding:"0 8px 10px", textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{timeline.map((t,i)=>{
                  const fs = FASE_STATUS[t.status];
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${BT.linha}` }}>
                      <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{t.fase}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color:BT.textoMedio }}>{t.prev}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color:t.real==="—"?"#9ca3af":BT.verde }}>{t.real}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color: typeof t.var==="number"&&t.var>30?BT.vermelho:"#4b5563" }}>{typeof t.var==="number" ? `+${t.var}d` : t.var}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color:BT.textoMedio }}>{t.resp}</td>
                      <td style={{ padding:"10px 8px" }}><span style={{ fontSize:11, padding:"2px 9px", borderRadius:10, background:fs.bg, color:fs.text, fontWeight:600 }}>{fs.label}</span></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          )}

          {aba==="pendencias" && (
            <div>
              {pendencias.map((p,i)=>(
                <div key={i} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:10, padding:14, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:BT.texto }}>{p.item}</div>
                    <div style={{ fontSize:12, color:BT.textoSuave, marginTop:2 }}>Área: {p.area} · Prazo: {p.prazo}</div>
                  </div>
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:10, background:p.criticidade==="Alta"?BT.vermelhoClaro:BT.amareloClaro, color:p.criticidade==="Alta"?BT.vermelho:"#7A5600", fontWeight:700 }}>{p.criticidade}</span>
                </div>
              ))}
            </div>
          )}

          {aba==="documentos" && (
            <div>
              {DOCUMENTOS.filter(d=>d.emp===emp.nome).map((d,i)=>(
                <div key={i} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:10, padding:14, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{d.doc}</div>
                      <div style={{ fontSize:12, color:BT.textoSuave, marginTop:2 }}>Versão: {d.versao} · Atualizado: {d.atualizado} · {d.resp}</div>
                      {d.sistema!=="—" && <div style={{ fontSize:11, marginTop:4, color:BT.azul }}>🔗 {d.sistema}</div>}
                    </div>
                    <DocBadge status={d.status} />
                  </div>
                  {d.status==="obsoleto" && <div style={{ marginTop:8, background:BT.amareloClaro, border:"1px solid #fde68a", borderRadius:6, padding:"6px 10px", fontSize:12, color:"#7A5600" }}>⚠️ Atenção: pode haver versão mais recente no Construcode. Verifique antes de usar na obra.</div>}
                </div>
              ))}
              {DOCUMENTOS.filter(d=>d.emp===emp.nome).length===0 && <div style={{ color:BT.textoMuitoSuave, textAlign:"center", padding:40 }}>Nenhum documento cadastrado</div>}
            </div>
          )}

          {aba==="revisoes" && (
            <div>
              {REVISOES.filter(r=>r.emp===emp.nome).map((r,i)=>(
                <div key={i} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:10, padding:14, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{r.projeto} — Revisão #{r.rev}</div>
                      <div style={{ fontSize:12, color:BT.textoSuave, marginTop:2 }}>Motivo: {r.motivo}</div>
                      <div style={{ fontSize:12, color:BT.textoSuave }}>Origem: {r.origem} · {r.inicio} → {r.fim}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:18, fontWeight:700, color:BT.vermelho }}>{r.dias}d</div>
                      <div style={{ fontSize:11, color:BT.textoMuitoSuave }}>impacto</div>
                    </div>
                  </div>
                </div>
              ))}
              {REVISOES.filter(r=>r.emp===emp.nome).length===0 && <div style={{ color:BT.textoMuitoSuave, textAlign:"center", padding:40 }}>Sem revisões registradas</div>}
            </div>
          )}

          {aba==="licencas" && (
            <div>
              {licencas.map((l,i)=>(
                <div key={i} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:10, padding:14, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{l.nome}</div>
                    <div style={{ fontSize:12, color:BT.textoSuave, marginTop:2 }}>Órgão: {l.orgao} · Emissão: {l.emissao} · Validade: {l.validade}</div>
                  </div>
                  <DocBadge status={l.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MapaPrazos() {
  const regioes = [
    { reg:"Campinas",           pmAprov:195, pmCartorio:85, pmLicen:220, status:"atrasado" },
    { reg:"Sorocaba",           pmAprov:160, pmCartorio:70, pmLicen:180, status:"atencao" },
    { reg:"Ribeirão Preto",     pmAprov:210, pmCartorio:90, pmLicen:245, status:"atrasado" },
    { reg:"São José dos Campos",pmAprov:145, pmCartorio:65, pmLicen:160, status:"emdia" },
    { reg:"Jundiaí",            pmAprov:170, pmCartorio:75, pmLicen:195, status:"atencao" },
  ];

  return (
    <div>
      <SectionTitle title="Mapa de Prazos por Região" sub="Comparativo de prazos previstos e realizados por município/etapa" />
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
        <MiniCard label="Maior prazo de aprovação" value="210d" sub="Ribeirão Preto" accent={BT.vermelho} icon="calendar" />
        <MiniCard label="Maior prazo de licença" value="245d" sub="Ribeirão Preto" accent={BT.amarelo} icon="license" />
        <MiniCard label="Menor prazo de cartório" value="65d" sub="São José dos Campos" accent={BT.verde} icon="registry" />
        <MiniCard label="Média geral de aprovação" value="176d" sub="todas as regiões" accent={BT.azul} icon="time" />
      </div>

      <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20, marginBottom:20 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Tabela Comparativa por Região</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:`2px solid ${BT.borda}` }}>
            {["Região","Prazo Aprovação (dias)","Prazo Cartório (dias)","Prazo Licenciamento (dias)","Ranking","Status"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:BT.textoMuitoSuave, padding:"0 10px 10px", textTransform:"uppercase" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{regioes.map((r,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${BT.linha}` }}>
              <td style={{ padding:"12px 10px", fontWeight:600, fontSize:13 }}>{r.reg}</td>
              <td style={{ padding:"12px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:BT.cinzaClaro, borderRadius:6, height:8, width:120 }}>
                    <div style={{ width:`${r.pmAprov/250*100}%`, background: r.pmAprov>190?BT.vermelho:BT.amarelo, height:"100%", borderRadius:6 }} />
                  </div>
                  <span style={{ fontSize:13 }}>{r.pmAprov}d</span>
                </div>
              </td>
              <td style={{ padding:"12px 10px", fontSize:13 }}>{r.pmCartorio}d</td>
              <td style={{ padding:"12px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:BT.cinzaClaro, borderRadius:6, height:8, width:120 }}>
                    <div style={{ width:`${r.pmLicen/280*100}%`, background: r.pmLicen>210?BT.vermelho:BT.amarelo, height:"100%", borderRadius:6 }} />
                  </div>
                  <span style={{ fontSize:13 }}>{r.pmLicen}d</span>
                </div>
              </td>
              <td style={{ padding:"12px 10px", fontSize:13, fontWeight:700, color:BT.azul }}>#{i+1}</td>
              <td style={{ padding:"12px 10px" }}><Badge status={r.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <div style={{ background:BT.amareloClaro, border:"1px solid #fed7aa", borderRadius:10, padding:14 }}>
        <div style={{ fontWeight:600, fontSize:13, color:"#7A5600", marginBottom:4 }}>ℹ️ Nota sobre comparação entre municípios</div>
        <div style={{ fontSize:12, color:"#7A5600" }}>Municípios como Ribeirão Preto e Campinas possuem ciclos de aprovação naturalmente mais longos por exigirem mais etapas técnicas. Evite comparação direta sem contextualização do porte do empreendimento e complexidade ambiental.</div>
      </div>
    </div>
  );
}

function PlanejamentoLancamentos() {
  const anos = [
    { ano:2026, plan:1800, aprov:1800, emAprov:0, risco:0 },
    { ano:2027, plan:3200, aprov:870, emAprov:1450, risco:880 },
    { ano:2028, plan:5000, aprov:1800, emAprov:2400, risco:800 },
    { ano:2029, plan:4200, aprov:0, emAprov:1600, risco:2600 },
  ];

  return (
    <div>
      <SectionTitle title="Planejamento de Lançamentos" sub="Viabilidade dos lançamentos planejados por ano" />
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
        <MiniCard label="Meta total 2026-2029" value="14.200" sub="lotes planejados" accent={BT.azul} icon="target" />
        <MiniCard label="Volume aprovado" value="4.470" sub="lotes com aprovação" accent={BT.verde} icon="check" />
        <MiniCard label="Volume em aprovação" value="5.450" sub="aguardando aprovação" accent={BT.amarelo} icon="pending" />
        <MiniCard label="Volume em risco" value="4.280" sub="sem garantia de prazo" accent={BT.vermelho} icon="risk" />
      </div>

      {anos.map((a,i) => {
        const total = a.aprov + a.emAprov + a.risco;
        const gap = a.plan - total;
        const status = a.aprov >= a.plan ? "emdia" : a.aprov + a.emAprov >= a.plan * .9 ? "atencao" : "risco";
        return (
          <div key={i} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontWeight:700, fontSize:18, color:BT.texto }}>Lançamentos {a.ano}</div>
              <Badge status={status} />
            </div>
            <div style={{ display:"flex", gap:20, marginBottom:14 }}>
              {[["Planejado",a.plan,BT.azul],["Aprovado",a.aprov,BT.verde],["Em aprovação",a.emAprov,BT.amarelo],["Em risco",a.risco,BT.vermelho],["Gap",gap>0?gap:"—",gap>0?BT.vermelho:BT.verde]].map(([l,v,c])=>(
                <div key={l}><div style={{ fontSize:11, color:BT.textoMuitoSuave, marginBottom:2 }}>{l}</div><div style={{ fontSize:20, fontWeight:700, color:c }}>{typeof v==="number" ? v.toLocaleString("pt-BR") : v}</div><div style={{ fontSize:11, color:BT.textoMuitoSuave }}>lotes</div></div>
              ))}
            </div>
            {/* STACKED BAR */}
            <div style={{ background:BT.cinzaClaro, borderRadius:8, height:14, overflow:"hidden", display:"flex" }}>
              {[[a.aprov,BT.verde],[a.emAprov,BT.amarelo],[a.risco,BT.vermelho]].map(([v,c],ii)=>(
                <div key={ii} style={{ width:`${v/a.plan*100}%`, background:c, height:"100%", transition:"width .4s" }} />
              ))}
            </div>
            <div style={{ display:"flex", gap:16, marginTop:6 }}>
              {[["Aprovado",BT.verde],["Em aprovação",BT.amarelo],["Em risco",BT.vermelho]].map(([l,c])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:BT.textoSuave }}><Dot color={c} />{l}</div>
              ))}
            </div>
            {gap > 0 && <div style={{ marginTop:10, background:BT.vermelhoClaro, borderRadius:8, padding:"8px 12px", fontSize:12, color:BT.vermelho }}>⚠️ Gap de {gap.toLocaleString("pt-BR")} lotes para atingir a meta de {a.ano}. Aceleração de processos necessária.</div>}
          </div>
        );
      })}
    </div>
  );
}

function Revisoes() {
  const motivos = [
    { m:"Cota topográfica", n:8 },
    { m:"Norma desatualizada", n:12 },
    { m:"Interferência ambiental", n:6 },
    { m:"Alteração de traçado", n:5 },
    { m:"Mudança de recuo", n:9 },
    { m:"Espécie não aprovada", n:4 },
  ];
  const max = Math.max(...motivos.map(m=>m.n));

  return (
    <div>
      <SectionTitle title="Revisões e Retrabalho" sub="Controle de revisões de projeto e impacto no cronograma" />
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
        <MiniCard label="Total de revisões" value={REVISOES.length} icon="revision" accent={BT.azul} />
        <MiniCard label="Dias médios por revisão" value="39d" icon="time" accent={BT.amarelo} />
        <MiniCard label="Maior impacto" value="66d" sub="Reserva Santa Clara" icon="impact" accent={BT.vermelho} />
        <MiniCard label="Principal causa" value="Norma desatualizada" icon="cause" accent={BT.amarelo} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Revisões por Motivo</div>
          {motivos.map((m,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:BT.textoMedio, marginBottom:3 }}>
                <span>{m.m}</span><span style={{ fontWeight:600 }}>{m.n}</span>
              </div>
              <div style={{ background:BT.cinzaClaro, borderRadius:6, height:8 }}>
                <div style={{ width:`${m.n/max*100}%`, background:BT.amarelo, height:"100%", borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Impacto por Empreendimento (dias)</div>
          {REVISOES.map((r,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${BT.linha}` }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{r.emp}</div>
                <div style={{ fontSize:11, color:BT.textoMuitoSuave }}>{r.projeto} — Rev. #{r.rev}</div>
              </div>
              <div style={{ fontSize:16, fontWeight:700, color: r.dias>50?BT.vermelho:r.dias>30?BT.amarelo:BT.amarelo }}>{r.dias}d</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Registro Detalhado de Revisões</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:`2px solid ${BT.borda}` }}>
            {["Empreendimento","Projeto","Rev.","Motivo","Origem","Responsável","Início","Fim","Dias","Impacto"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:BT.textoMuitoSuave, padding:"0 8px 10px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{REVISOES.map((r,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${BT.linha}` }}>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{r.emp}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{r.projeto}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>#{r.rev}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:BT.textoMedio }}>{r.motivo}</td>
              <td style={{ padding:"10px 8px" }}><span style={{ fontSize:11, background:BT.azulClaro, color:BT.azul, padding:"2px 8px", borderRadius:8 }}>{r.origem}</span></td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{r.resp}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:BT.textoSuave }}>{r.inicio}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:BT.textoSuave }}>{r.fim}</td>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:700, color: r.dias>50?BT.vermelho:r.dias>30?BT.amarelo:"#4b5563" }}>{r.dias}d</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:BT.vermelho }}>+{r.impacto}d</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Documentos() {
  return (
    <div>
      <SectionTitle title="Gestão de Documentos" sub="Controle documental e integrações simuladas (AutoDoc · Construcode)" />

      <div style={{ background:BT.amareloClaro, border:"1px solid #fed7aa", borderRadius:10, padding:14, marginBottom:20 }}>
        <div style={{ fontWeight:700, fontSize:13, color:"#7A5600" }}>⚠️ Alerta de Versão Desatualizada</div>
        <div style={{ fontSize:12, color:"#7A5600", marginTop:4 }}>Jardim das Águas — Projeto Elétrico (v2.1) está marcado como <b>Obsoleto</b> no Construcode. Existe versão v3.0 disponível. A versão utilizada na obra pode estar desatualizada. <span style={{ color:BT.azul, cursor:"pointer", textDecoration:"underline" }}>Ver documento →</span></div>
      </div>

      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        <MiniCard label="Total de documentos" value={DOCUMENTOS.length} icon="document" accent={BT.azul} />
        <MiniCard label="Aprovados" value={DOCUMENTOS.filter(d=>d.status==="aprovado").length} icon="check" accent={BT.verde} />
        <MiniCard label="Pendentes" value={DOCUMENTOS.filter(d=>d.status==="pendente").length} icon="pending" accent={BT.amarelo} />
        <MiniCard label="Bloqueados / Obsoletos" value={DOCUMENTOS.filter(d=>["bloqueado","obsoleto"].includes(d.status)).length} icon="locked" accent={BT.vermelho} />
      </div>

      <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:`2px solid ${BT.borda}` }}>
            {["Empreendimento","Documento","Status","Versão","Atualizado","Responsável","Origem","Sistema"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:BT.textoMuitoSuave, padding:"0 8px 10px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{DOCUMENTOS.map((d,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${BT.linha}`, background: d.status==="obsoleto"?BT.amareloClaro:"" }}>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{d.emp}</td>
              <td style={{ padding:"10px 8px", fontSize:13 }}>{d.doc}</td>
              <td style={{ padding:"10px 8px" }}><DocBadge status={d.status} /></td>
              <td style={{ padding:"10px 8px", fontSize:12, color:BT.textoSuave }}>{d.versao}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:BT.textoSuave }}>{d.atualizado}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{d.resp}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{d.origem}</td>
              <td style={{ padding:"10px 8px" }}>{d.sistema!=="—" ? <span style={{ fontSize:11, background:BT.azulClaro, color:BT.azul, padding:"2px 8px", borderRadius:8, fontWeight:600 }}>{d.sistema}</span> : <span style={{ color:"#d1d5db" }}>—</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Obras() {
  return (
    <div>
      <SectionTitle title="Obras, Doações e TVO" sub="Fases finais de execução e encerramento formal" />
      <div style={{ display:"flex", gap:14, marginBottom:24 }}>
        <MiniCard label="Obras em andamento" value={OBRAS.filter(o=>o.pct<100).length} icon="works" accent={BT.azul} />
        <MiniCard label="Obras concluídas" value={OBRAS.filter(o=>o.pct===100).length} icon="check" accent={BT.verde} />
        <MiniCard label="Doações pendentes" value={OBRAS.filter(o=>o.doacao!=="Concluída").length} icon="donation" accent={BT.amarelo} />
        <MiniCard label="TVOs pendentes" value={OBRAS.filter(o=>o.tvo!=="Concluído").length} icon="seal" accent={BT.amarelo} />
      </div>

      {OBRAS.map((o,i)=>(
        <div key={i} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20, marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:BT.texto }}>{o.emp}</div>
              <div style={{ fontSize:12, color:BT.textoSuave }}>Responsável: {o.resp} · Etapa: {o.etapa}</div>
            </div>
            {o.pct===100 ? <Badge status="emdia" /> : o.pendencias>0 ? <Badge status="atencao" /> : <Badge status="emdia" />}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:14 }}>
            {[["Previsto",o.previsto],["Realizado",o.realizado],["Doação",o.doacao],["TVO",o.tvo],["Pendências",o.pendencias]].map(([l,v])=>(
              <div key={l} style={{ background:BT.cinzaClaro, borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:BT.textoMuitoSuave, marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:700, color:BT.texto }}>{v}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:BT.textoMedio, marginBottom:4 }}>
              <span>Avanço físico</span><span style={{ fontWeight:700 }}>{o.pct}%</span>
            </div>
            <ProgressBar pct={o.pct} color={o.pct===100?BT.verde:BT.azul} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Indicadores() {
  const byEtapa = ETAPAS.map(et => ({ name:et, count: EMPREENDIMENTOS.filter(e=>e.etapa===et).length }));
  const byStatus = [
    { name:"Em dia", value: EMPREENDIMENTOS.filter(e=>e.status==="emdia").length, color:BT.verde },
    { name:"Atenção", value: EMPREENDIMENTOS.filter(e=>e.status==="atencao").length, color:BT.amarelo },
    { name:"Em risco", value: EMPREENDIMENTOS.filter(e=>e.status==="risco").length, color:BT.amarelo },
    { name:"Atrasado", value: EMPREENDIMENTOS.filter(e=>e.status==="atrasado").length, color:BT.vermelho },
  ];
  const max = Math.max(...byEtapa.map(b=>b.count));

  return (
    <div>
      <SectionTitle title="Indicadores Executivos" sub="Painel estratégico para tomada de decisão" />
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
        <MiniCard label="Portfólio total" value={EMPREENDIMENTOS.length} icon="portfolio" accent={BT.azul} sub="empreendimentos" />
        <MiniCard label="% Em dia" value={`${Math.round(EMPREENDIMENTOS.filter(e=>e.status==="emdia").length/EMPREENDIMENTOS.length*100)}%`} icon="check" accent={BT.verde} />
        <MiniCard label="Revisões totais" value={REVISOES.length} icon="revision" accent={BT.amarelo} sub="projetos" />
        <MiniCard label="Dias médios/revisão" value="39d" icon="time" accent={BT.vermelho} />
        <MiniCard label="Lançamentos 2026" value="2" icon="launch" accent={BT.azul} sub="empreendimentos" />
        <MiniCard label="Lotes aprovados em 2028" value="1.800" icon="lots" accent={BT.azul} sub="de 5.000 planejados" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Distribuição por Status</div>
          {byStatus.map((s,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><Dot color={s.color} />{s.name}</span>
                <span style={{ fontWeight:700 }}>{s.value}</span>
              </div>
              <div style={{ background:BT.cinzaClaro, borderRadius:6, height:10 }}>
                <div style={{ width:`${s.value/EMPREENDIMENTOS.length*100}%`, background:s.color, height:"100%", borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Empreendimentos por Etapa</div>
          {byEtapa.filter(b=>b.count>0).map((b,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:BT.textoMedio, marginBottom:3 }}>
                <span>{b.name}</span><span style={{ fontWeight:700 }}>{b.count}</span>
              </div>
              <div style={{ background:BT.cinzaClaro, borderRadius:6, height:7 }}>
                <div style={{ width:`${b.count/max*100}%`, background:BT.azul, height:"100%", borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
        {[
          ["Tempo médio — Aprovação Prefeitura","176 dias","normal"],
          ["Tempo médio — Licenciamento Ambiental","200 dias","atencao"],
          ["Tempo médio — Registro em Cartório","77 dias","emdia"],
          ["Revisões por projeto (média)","2,4","atencao"],
          ["Pendências documentais abertas","24","risco"],
          ["% obras no prazo","50%","atencao"],
        ].map(([l,v,s],i)=>(
          <div key={i} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:12, color:BT.textoSuave, marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:700, color: s==="risco"?BT.vermelho:s==="atencao"?BT.amarelo:BT.verde }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ background:BT.azul, borderRadius:12, padding:20, color:"#fff" }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:12 }}>Recomendações Executivas</div>
        {[
          "Ribeirão Preto e Campinas concentram os maiores atrasos em aprovação — avaliar apoio jurídico/técnico dedicado.",
          "Revisões por norma desatualizada representam 27% do retrabalho — atualizar biblioteca de normas técnicas.",
          "Gap de 3.200 lotes para meta 2028 — acelerar processos de licenciamento em pelo menos 3 empreendimentos.",
          "Alameda das Flores com TVO pendente por 4 meses — risco jurídico e financeiro crescente.",
        ].map((r,i)=>(
          <div key={i} style={{ display:"flex", gap:10, marginBottom:8 }}>
            <span style={{ fontSize:14, opacity:.7 }}>→</span>
            <span style={{ fontSize:13, opacity:.9 }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Configuracoes() {
  const regras = [
    { municipio:"Campinas", etapa:"Aprovação Prefeitura", padrao:180, amarelo:150, vermelho:180 },
    { municipio:"Campinas", etapa:"Licenciamento Ambiental", padrao:240, amarelo:210, vermelho:240 },
    { municipio:"Sorocaba", etapa:"Aprovação Prefeitura", padrao:160, amarelo:130, vermelho:160 },
    { municipio:"Ribeirão Preto", etapa:"Aprovação Prefeitura", padrao:210, amarelo:180, vermelho:210 },
  ];
  return (
    <div>
      <SectionTitle title="Configurações" sub="Parametrização de regras, prazos e alertas do sistema" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        {["Regiões","Municípios","Etapas","Responsáveis","Tipos de Documentos","Motivos de Revisão"].map(item=>(
          <div key={item} style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:10, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:14, fontWeight:600, color:BT.textoMedio }}>{item}</span>
            <button style={{ fontSize:12, background:BT.azul, color:"#fff", border:"none", borderRadius:6, padding:"6px 14px", cursor:"pointer" }}>Gerenciar</button>
          </div>
        ))}
      </div>
      <div style={{ background:BT.card, border:`1px solid ${BT.borda}`, borderRadius:12, padding:20 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Regras de Alerta por Município / Etapa</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:`2px solid ${BT.borda}` }}>
            {["Município","Etapa","Prazo Padrão","Alerta Amarelo","Alerta Vermelho","Ação"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:BT.textoMuitoSuave, padding:"0 8px 10px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{regras.map((r,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${BT.linha}` }}>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{r.municipio}</td>
              <td style={{ padding:"10px 8px", fontSize:13 }}>{r.etapa}</td>
              <td style={{ padding:"10px 8px", fontSize:13 }}>{r.padrao}d</td>
              <td style={{ padding:"10px 8px" }}><span style={{ background:BT.amareloClaro, color:"#7A5600", padding:"2px 9px", borderRadius:8, fontSize:12 }}>🟡 {r.amarelo}d</span></td>
              <td style={{ padding:"10px 8px" }}><span style={{ background:BT.vermelhoClaro, color:BT.vermelho, padding:"2px 9px", borderRadius:8, fontSize:12 }}>🔴 {r.vermelho}d</span></td>
              <td style={{ padding:"10px 8px" }}><button style={{ fontSize:12, background:"none", color:BT.azul, border:`1px solid ${BT.azul}`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Editar</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
const SidebarIcon = ({ name }) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { display: "block" },
  };

  const icons = {
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    pipeline: (
      <svg {...common}>
        <path d="M4 6h6" />
        <path d="M14 6h6" />
        <path d="M4 12h16" />
        <path d="M4 18h10" />
        <circle cx="10" cy="6" r="2" />
        <circle cx="14" cy="18" r="2" />
      </svg>
    ),
    schedule: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M3 10h18" />
        <path d="M8 15h.01" />
        <path d="M12 15h.01" />
        <path d="M16 15h.01" />
      </svg>
    ),
    launch: (
      <svg {...common}>
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
        <path d="M5 19h14" />
      </svg>
    ),
    revisions: (
      <svg {...common}>
        <path d="M21 12a9 9 0 0 1-15.2 6.5" />
        <path d="M3 12A9 9 0 0 1 18.2 5.5" />
        <path d="M6 18H3v3" />
        <path d="M18 6h3V3" />
      </svg>
    ),
    documents: (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </svg>
    ),
    works: (
      <svg {...common}>
        <path d="M3 21h18" />
        <path d="M5 21V8l7-4 7 4v13" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
      </svg>
    ),
    analytics: (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 3 5-7" />
        <path d="M17 7h2v2" />
      </svg>
    ),
    settings: (
      <svg {...common}>
        <path d="M4 7h10" />
        <path d="M18 7h2" />
        <circle cx="16" cy="7" r="2" />
        <path d="M4 17h2" />
        <path d="M10 17h10" />
        <circle cx="8" cy="17" r="2" />
      </svg>
    ),
  };

  return icons[name] || icons.dashboard;
};

const MENU = [
  { id:"visao", label:"Visão Geral", icon:"dashboard" },
  { id:"esteira", label:"Esteira", icon:"pipeline" },
  { id:"prazos", label:"Mapa de Prazos", icon:"schedule" },
  { id:"lancamentos", label:"Lançamentos", icon:"launch" },
  { id:"revisoes", label:"Revisões", icon:"revisions" },
  { id:"documentos", label:"Documentos", icon:"documents" },
  { id:"obras", label:"Obras / TVO", icon:"works" },
  { id:"indicadores", label:"Indicadores", icon:"analytics" },
  { id:"config", label:"Configurações", icon:"settings" },
];

export default function App() {
  const [page, setPage] = useState("visao");
  const [detail, setDetail] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);

  return (
    <>
      <GlobalStyles />
      <div style={{ display:"flex", width:"100vw", minWidth:0, height:"100vh", fontFamily:"'Segoe UI', Roboto, Arial, sans-serif", background:BT.cinzaClaro, overflow:"hidden" }}>
      {/* SIDEBAR */}
      <div style={{ width: sideOpen ? 244 : 64, background:BT.azulMenu, transition:"width .25s", display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0, boxShadow:"6px 0 24px rgba(17,24,39,.12)" }}>
        <div style={{ padding:sideOpen ? "20px 18px 18px" : "14px 10px", display:"flex", alignItems:"center", justifyContent:sideOpen ? "center" : "center", borderBottom:"1px solid rgba(255,255,255,.14)", minHeight:96 }}>
          {sideOpen ? (
            <div style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img
                src="/logo_branca.png"
                alt="Brasil Terrenos"
                style={{ display:"block", width:"100%", maxWidth:196, height:64, objectFit:"contain", objectPosition:"center center" }}
                onError={(e)=>{ e.currentTarget.style.display = "none"; }}
              />
            </div>
          ) : (
            <div
              style={{
                width:44,
                height:44,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                overflow:"hidden",
                flexShrink:0,
              }}
            >
              <img
                src="/logo_casinha.png"
                alt=""
                style={{
                  width:40,
                  height:40,
                  objectFit:"contain",
                  display:"block",
                }}
              />
            </div>
          )}
        </div>

        <nav style={{ flex:1, padding:"16px 10px", overflowY:"auto" }}>
          {MENU.map(m=>{
            const active = page === m.id;
            return (
              <button
                key={m.id}
                onClick={()=>setPage(m.id)}
                title={m.label}
                style={{
                  position:"relative",
                  display:"flex",
                  alignItems:"center",
                  gap:sideOpen ? 11 : 0,
                  width:"100%",
                  minHeight:44,
                  padding:sideOpen ? "8px 11px" : "8px 9px",
                  border:active ? "1px solid rgba(255,255,255,.24)" : "1px solid transparent",
                  background:active ? "rgba(255,255,255,.12)" : "transparent",
                  borderRadius:12,
                  cursor:"pointer",
                  marginBottom:6,
                  color:active ? "#ffffff" : "rgba(255,255,255,.70)",
                  fontWeight:active ? 700 : 500,
                  fontSize:13,
                  transition:"background .15s ease, color .15s ease, border .15s ease, transform .15s ease",
                  textAlign:"left",
                  boxShadow:active ? "inset 3px 0 0 rgba(255,255,255,.95), 0 8px 18px rgba(0,0,0,.12)" : "none",
                  justifyContent:sideOpen ? "flex-start" : "center",
                }}
                onMouseEnter={ev=>{
                  if (!active) ev.currentTarget.style.background = "rgba(255,255,255,.07)";
                }}
                onMouseLeave={ev=>{
                  if (!active) ev.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width:28,
                    height:28,
                    borderRadius:9,
                    display:"inline-flex",
                    alignItems:"center",
                    justifyContent:"center",
                    flexShrink:0,
                    background:active ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.06)",
                    color:"currentColor",
                    border:active ? "1px solid rgba(255,255,255,.18)" : "1px solid rgba(255,255,255,.07)",
                  }}
                >
                  <SidebarIcon name={m.icon} />
                </span>
                {sideOpen && <span style={{ whiteSpace:"nowrap", lineHeight:1 }}>{m.label}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding:12, borderTop:"1px solid rgba(255,255,255,.12)" }}>
          <button onClick={()=>setSideOpen(v=>!v)} style={{ width:"100%", background:"rgba(255,255,255,.10)", border:"1px solid rgba(255,255,255,.18)", color:"rgba(255,255,255,.78)", borderRadius:9, padding:"8px", cursor:"pointer", fontSize:13 }}>
            {sideOpen ? "← Recolher" : "→"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, minWidth:0, width:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* TOPBAR */}
        <div style={{ height:56, background:BT.card, borderBottom:`1px solid ${BT.borda}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:14, fontWeight:600, color:BT.texto }}>{MENU.find(m=>m.id===page)?.label}</div>
            <div style={{ fontSize:12, color:BT.textoMuitoSuave }}>/ {EMPREENDIMENTOS.length} empreendimentos</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <select style={{ fontSize:12, border:`1px solid ${BT.borda}`, borderRadius:6, padding:"5px 10px", color:BT.textoMedio, background:BT.card }}>
              <option>Todas as regiões</option>
              {["Campinas","Sorocaba","Ribeirão Preto","São José dos Campos","Jundiaí"].map(r=><option key={r}>{r}</option>)}
            </select>
            <select style={{ fontSize:12, border:`1px solid ${BT.borda}`, borderRadius:6, padding:"5px 10px", color:BT.textoMedio, background:BT.card }}>
              <option>Todos os status</option>
              <option>Em dia</option><option>Atenção</option><option>Em risco</option><option>Atrasado</option>
            </select>
            <div style={{ width:34, height:34, background:BT.azul, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>AC</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, minWidth:0, overflowY:"auto", overflowX:"hidden", padding:24 }}>
          {page==="visao"        && <VigaoGeral onCard={setDetail} />}
          {page==="esteira"      && <EsteiraKanban onCard={setDetail} />}
          {page==="prazos"       && <MapaPrazos />}
          {page==="lancamentos"  && <PlanejamentoLancamentos />}
          {page==="revisoes"     && <Revisoes />}
          {page==="documentos"   && <Documentos />}
          {page==="obras"        && <Obras />}
          {page==="indicadores"  && <Indicadores />}
          {page==="config"       && <Configuracoes />}
        </div>
      </div>

      {/* MODAL */}
      {detail && <DetalheEmp emp={detail} onClose={()=>setDetail(null)} />}
      </div>
    </>
  );
}
