import { useState, useMemo } from "react";

// ── BRAND / VISUAL FIX ──────────────────────────────────────────────────────
// Coloque o arquivo da logo em: public/brasil-terrenos-logo.png
// No Vite, tudo que fica na pasta public é acessado pela raiz: /nome-do-arquivo.png
const LOGO_URL = "/brasil-terrenos-logo.png";

const BRAND = {
  verde: "#587810",
  verdeClaro: "#CAD8A9",
  amarelo: "#f7b400",
  amareloClaro: "#FFE6A4",
  vermelho: "#c00000",
  azul: "#215ed4",
  azulClaro: "#b6cefc",
  cinzaClaro: "#eeeeee",
  cinzaFundo: "#f0f0f0",
  branco: "#ffffff",
};

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body, #root {
        width: 100%;
        height: 100%;
        min-width: 0;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      body {
        display: block !important;
        place-items: initial !important;
        background: ${BRAND.cinzaFundo} !important;
      }
      #root {
        max-width: none !important;
        text-align: initial !important;
      }
      button, select, input, textarea {
        font-family: inherit;
      }
    `}</style>
  );
}

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
  emdia:   { label:"Em dia",   color:BRAND.verde, bg:BRAND.verdeClaro, text:BRAND.verde },
  atencao: { label:"Atenção",  color:BRAND.amarelo, bg:BRAND.amareloClaro, text:"#7a5600" },
  risco:   { label:"Em risco", color:BRAND.amarelo, bg:BRAND.amareloClaro, text:"#7a5600" },
  atrasado:{ label:"Atrasado", color:BRAND.vermelho, bg:"#ffe7e7", text:BRAND.vermelho },
  concluido:{ label:"Concluído",color:BRAND.azul, bg:BRAND.azulClaro, text:BRAND.azul },
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
  aprovado:  { label:"Aprovado",   bg:BRAND.verdeClaro, text:BRAND.verde },
  pendente:  { label:"Pendente",   bg:BRAND.amareloClaro, text:"#7a5600" },
  revisao:   { label:"Em revisão", bg:BRAND.azulClaro, text:BRAND.azul },
  bloqueado: { label:"Bloqueado",  bg:"#ffe7e7", text:BRAND.vermelho },
  obsoleto:  { label:"Obsoleto",   bg:BRAND.cinzaClaro, text:"#6b7280" },
  aguardando:{ label:"Aguardando", bg:BRAND.azulClaro, text:BRAND.azul },
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
  return <span style={{ padding:"2px 10px", borderRadius:12, fontSize:11, fontWeight:600, background:s.bg, color:s.text }}>{s.label}</span>;
};

const DocBadge = ({ status }) => {
  const s = DOC_STATUS[status] || DOC_STATUS.pendente;
  return <span style={{ padding:"2px 9px", borderRadius:12, fontSize:11, fontWeight:600, background:s.bg, color:s.text }}>{s.label}</span>;
};

const ProgressBar = ({ pct, color = "#215ed4" }) => (
  <div style={{ background:"#eeeeee", borderRadius:8, height:6, width:"100%", overflow:"hidden" }}>
    <div style={{ width:`${pct}%`, background:color, height:"100%", borderRadius:8, transition:"width .4s" }} />
  </div>
);

const MiniCard = ({ label, value, sub, accent = "#215ed4", icon }) => (
  <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:"18px 20px", flex:1, minWidth:150 }}>
    <div style={{ fontSize:13, color:"#6b7280", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
      {icon && <span style={{ fontSize:16 }}>{icon}</span>}{label}
    </div>
    <div style={{ fontSize:28, fontWeight:700, color:accent, lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom:20 }}>
    <h2 style={{ fontSize:20, fontWeight:700, color:"#111827", margin:0 }}>{title}</h2>
    {sub && <p style={{ fontSize:13, color:"#6b7280", margin:"4px 0 0" }}>{sub}</p>}
  </div>
);

const Dot = ({ color }) => <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:color, marginRight:6 }} />;

const BrandLogo = ({ compact = false }) => {
  const [logoOk, setLogoOk] = useState(true);

  if (compact) {
    return (
      <div style={{ width:34, height:34, borderRadius:9, background:BRAND.branco, color:BRAND.verde, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, boxShadow:"0 1px 3px rgba(0,0,0,.12)" }}>
        BT
      </div>
    );
  }

  return (
    <div style={{ width:"100%", minHeight:52, borderRadius:10, background:"rgba(255,255,255,.12)", display:"flex", alignItems:"center", justifyContent:"center", padding:"8px 10px", overflow:"hidden" }}>
      {logoOk ? (
        <img
          src={LOGO_URL}
          alt="Brasil Terrenos"
          onError={() => setLogoOk(false)}
          style={{ width:"100%", maxHeight:42, objectFit:"contain", display:"block" }}
        />
      ) : (
        <div style={{ color:BRAND.branco, fontWeight:900, fontSize:16, lineHeight:1.05, letterSpacing:.2 }}>
          Brasil<br/><span style={{ fontWeight:700, color:BRAND.amareloClaro }}>Terrenos</span>
        </div>
      )}
    </div>
  );
};

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
    { tipo:"risco", msg:"Jardim das Águas — Licença Ambiental vence em 45 dias", icon:"⚠️" },
    { tipo:"atrasado", msg:"Reserva Santa Clara — Aprovação na Prefeitura com 72 dias de atraso", icon:"🔴" },
    { tipo:"risco", msg:"Nova Campinas — Registro em Cartório travado por pendência documental", icon:"⚠️" },
    { tipo:"atrasado", msg:"Alameda das Flores — TVO ainda não iniciado, doação concluída há 4 meses", icon:"🔴" },
    { tipo:"atencao", msg:"Parque Horizonte — Projetos com 2 revisões no último mês", icon:"🟡" },
  ];

  return (
    <div>
      <SectionTitle title="Visão Geral" sub="Resumo executivo de todos os empreendimentos" />

      {/* KPI CARDS */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:28 }}>
        <MiniCard label="Total de Empreendimentos" value={total} icon="🏗️" accent="#215ed4" sub="portfólio ativo" />
        <MiniCard label="Em Dia" value={emdia} icon="✅" accent="#587810" sub="sem pendências críticas" />
        <MiniCard label="Em Risco" value={risco} icon="⚠️" accent="#f7b400" sub="requer atenção imediata" />
        <MiniCard label="Atrasados" value={atrasado} icon="🔴" accent="#c00000" sub="prazo extrapolado" />
        <MiniCard label="Lançamentos 2026" value={lancamentos2026} icon="🚀" accent="#215ed4" sub="previstos para este ano" />
        <MiniCard label="Volume Aprovado" value="4.320 lotes" icon="📋" accent="#215ed4" sub="vs. 6.100 planejados" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        {/* CHART */}
        <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, color:"#374151", marginBottom:16 }}>Empreendimentos por Etapa</div>
          {byEtapa.map((b,i) => (
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4b5563", marginBottom:3 }}>
                <span>{b.name}</span><span style={{ fontWeight:600 }}>{b.count}</span>
              </div>
              <div style={{ background:"#f0f0f0", borderRadius:6, height:8 }}>
                <div style={{ width:`${b.count/maxCount*100}%`, background:"#215ed4", height:"100%", borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>

        {/* ALERTAS */}
        <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, color:"#374151", marginBottom:14 }}>⚡ Alertas Críticos</div>
          {alertas.map((a,i) => (
            <div key={i} style={{ padding:"10px 12px", borderRadius:8, marginBottom:8, background: a.tipo==="atrasado"?"#fff1f2": a.tipo==="risco"?"#fff7ed":"#fffbeb", border:`1px solid ${a.tipo==="atrasado"?"#fecaca":a.tipo==="risco"?"#fed7aa":"#fde68a"}` }}>
              <span style={{ fontSize:13, color:"#374151" }}>{a.icon} {a.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LISTA RÁPIDA */}
      <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
        <div style={{ fontWeight:600, fontSize:14, color:"#374151", marginBottom:14 }}>Empreendimentos Recentes</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #eeeeee" }}>
              {["Empreendimento","Cidade","Etapa","Responsável","Lançamento","Status","Avanço"].map(h=>(
                <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"#9ca3af", padding:"0 8px 8px", textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EMPREENDIMENTOS.slice(0,8).map(e=>(
              <tr key={e.id} onClick={()=>onCard(e)} style={{ borderBottom:"1px solid #f0f0f0", cursor:"pointer" }} onMouseEnter={ev=>ev.currentTarget.style.background="#f9fafb"} onMouseLeave={ev=>ev.currentTarget.style.background=""}>
                <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600, color:"#111827" }}>{e.nome}</td>
                <td style={{ padding:"10px 8px", fontSize:13, color:"#4b5563" }}>{e.cidade}</td>
                <td style={{ padding:"10px 8px" }}><span style={{ fontSize:12, background:"#b6cefc", color:"#215ed4", padding:"2px 9px", borderRadius:12, fontWeight:500 }}>{e.etapa}</span></td>
                <td style={{ padding:"10px 8px", fontSize:13, color:"#4b5563" }}>{e.responsavel}</td>
                <td style={{ padding:"10px 8px", fontSize:13, color:"#4b5563" }}>{e.lancamento}</td>
                <td style={{ padding:"10px 8px" }}><Badge status={e.status} /></td>
                <td style={{ padding:"10px 8px", width:100 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <ProgressBar pct={e.avanco} />
                    <span style={{ fontSize:12, color:"#6b7280", minWidth:32 }}>{e.avanco}%</span>
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
      <div style={{ overflowX:"auto" }}>
        <div style={{ display:"flex", gap:12, minWidth:1400, paddingBottom:12 }}>
          {ETAPAS.map((et, ci) => {
            const cards = EMPREENDIMENTOS.filter(e=>e.etapa===et);
            return (
              <div key={ci} style={{ minWidth:200, flex:"0 0 200px" }}>
                <div style={{ padding:"8px 12px", background:"#f0f0f0", borderRadius:8, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{et}</span>
                  <span style={{ fontSize:11, background:"#215ed4", color:"#fff", borderRadius:10, padding:"1px 7px" }}>{cards.length}</span>
                </div>
                {cards.map(e=>(
                  <div key={e.id} onClick={()=>onCard(e)}
                    style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:10, padding:14, marginBottom:10, cursor:"pointer", transition:"box-shadow .15s" }}
                    onMouseEnter={ev=>ev.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.1)"}
                    onMouseLeave={ev=>ev.currentTarget.style.boxShadow="none"}>
                    <div style={{ fontWeight:700, fontSize:13, color:"#111827", marginBottom:4 }}>{e.nome}</div>
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:6 }}>📍 {e.cidade}</div>
                    <div style={{ marginBottom:6 }}><Badge status={e.status} /></div>
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:4 }}>👤 {e.responsavel}</div>
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:8 }}>🚀 Lançamento: {e.lancamento}</div>
                    {e.pendencias>0 && <div style={{ fontSize:11, background:"#ffe7e7", color:"#991b1b", padding:"2px 8px", borderRadius:8, display:"inline-block", marginBottom:8 }}>{e.pendencias} pendências</div>}
                    <ProgressBar pct={e.avanco} />
                    <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>{e.avanco}% concluído</div>
                    <div style={{ fontSize:10, color:"#215ed4", marginTop:6, borderTop:"1px solid #f0f0f0", paddingTop:6 }}>→ {e.proximo}</div>
                  </div>
                ))}
                {cards.length===0 && <div style={{ padding:"20px 12px", textAlign:"center", color:"#d1d5db", fontSize:12 }}>Nenhum empreendimento</div>}
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
  const FASE_STATUS = { concluido:{bg:"#CAD8A9",text:"#587810",label:"Concluído"}, atencao:{bg:"#FFE6A4",text:"#92400e",label:"Atenção"}, risco:{bg:"#FFE6A4",text:"#9a3412",label:"Em risco"}, pendente:{bg:"#f0f0f0",text:"#6b7280",label:"Não iniciado"} };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:"#f9fafb", borderRadius:16, width:"100%", maxWidth:900, maxHeight:"90vh", overflowY:"auto" }}
        onClick={e=>e.stopPropagation()}>
        {/* HEADER */}
        <div style={{ background:"#215ed4", padding:"24px 28px", borderRadius:"16px 16px 0 0", color:"#fff" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:22, fontWeight:800 }}>{emp.nome}</div>
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
              <div style={{ width:`${emp.avanco}%`, background:"#fff", height:"100%", borderRadius:8 }} />
            </div>
          </div>
        </div>

        {/* ABAS */}
        <div style={{ display:"flex", gap:0, background:"#fff", borderBottom:"1px solid #eeeeee", padding:"0 24px" }}>
          {abas.map(a=>(
            <button key={a} onClick={()=>setAba(a)} style={{ padding:"12px 16px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:aba===a?700:400, color:aba===a?"#215ed4":"#6b7280", borderBottom:aba===a?"2px solid #215ed4":"2px solid transparent", textTransform:"capitalize" }}>{a}</button>
          ))}
        </div>

        <div style={{ padding:24 }}>
          {aba==="resumo" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                ["Etapa Atual", emp.etapa, "#b6cefc","#215ed4"],
                ["Próximo Marco", emp.proximo, "#b6cefc","#215ed4"],
                ["Status Documental", "Pendências em 2 documentos", "#FFE6A4","#92400e"],
                ["Status Licenciamento", "LP aguardando análise CETESB", "#FFE6A4","#9a3412"],
                ["Previsão de Lançamento", emp.lancamento, "#CAD8A9","#587810"],
                ["Pendências Abertas", emp.pendencias, "#ffe7e7","#991b1b"],
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
                <thead><tr style={{ borderBottom:"2px solid #eeeeee" }}>
                  {["Fase","Previsto","Realizado","Variação","Responsável","Status"].map(h=>(
                    <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"#9ca3af", padding:"0 8px 10px", textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{timeline.map((t,i)=>{
                  const fs = FASE_STATUS[t.status];
                  return (
                    <tr key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
                      <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{t.fase}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color:"#4b5563" }}>{t.prev}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color:t.real==="—"?"#9ca3af":"#587810" }}>{t.real}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color: typeof t.var==="number"&&t.var>30?"#c00000":"#4b5563" }}>{typeof t.var==="number" ? `+${t.var}d` : t.var}</td>
                      <td style={{ padding:"10px 8px", fontSize:12, color:"#4b5563" }}>{t.resp}</td>
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
                <div key={i} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:10, padding:14, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{p.item}</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>Área: {p.area} · Prazo: {p.prazo}</div>
                  </div>
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:10, background:p.criticidade==="Alta"?"#ffe7e7":"#FFE6A4", color:p.criticidade==="Alta"?"#991b1b":"#92400e", fontWeight:700 }}>{p.criticidade}</span>
                </div>
              ))}
            </div>
          )}

          {aba==="documentos" && (
            <div>
              {DOCUMENTOS.filter(d=>d.emp===emp.nome).map((d,i)=>(
                <div key={i} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:10, padding:14, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{d.doc}</div>
                      <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>Versão: {d.versao} · Atualizado: {d.atualizado} · {d.resp}</div>
                      {d.sistema!=="—" && <div style={{ fontSize:11, marginTop:4, color:"#215ed4" }}>🔗 {d.sistema}</div>}
                    </div>
                    <DocBadge status={d.status} />
                  </div>
                  {d.status==="obsoleto" && <div style={{ marginTop:8, background:"#FFE6A4", border:"1px solid #fde68a", borderRadius:6, padding:"6px 10px", fontSize:12, color:"#92400e" }}>⚠️ Atenção: pode haver versão mais recente no Construcode. Verifique antes de usar na obra.</div>}
                </div>
              ))}
              {DOCUMENTOS.filter(d=>d.emp===emp.nome).length===0 && <div style={{ color:"#9ca3af", textAlign:"center", padding:40 }}>Nenhum documento cadastrado</div>}
            </div>
          )}

          {aba==="revisoes" && (
            <div>
              {REVISOES.filter(r=>r.emp===emp.nome).map((r,i)=>(
                <div key={i} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:10, padding:14, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{r.projeto} — Revisão #{r.rev}</div>
                      <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>Motivo: {r.motivo}</div>
                      <div style={{ fontSize:12, color:"#6b7280" }}>Origem: {r.origem} · {r.inicio} → {r.fim}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:18, fontWeight:700, color:"#c00000" }}>{r.dias}d</div>
                      <div style={{ fontSize:11, color:"#9ca3af" }}>impacto</div>
                    </div>
                  </div>
                </div>
              ))}
              {REVISOES.filter(r=>r.emp===emp.nome).length===0 && <div style={{ color:"#9ca3af", textAlign:"center", padding:40 }}>Sem revisões registradas</div>}
            </div>
          )}

          {aba==="licencas" && (
            <div>
              {licencas.map((l,i)=>(
                <div key={i} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:10, padding:14, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{l.nome}</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>Órgão: {l.orgao} · Emissão: {l.emissao} · Validade: {l.validade}</div>
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
        <MiniCard label="Maior Prazo Aprovação" value="210d" sub="Ribeirão Preto" accent="#c00000" icon="📅" />
        <MiniCard label="Maior Prazo Licença" value="245d" sub="Ribeirão Preto" accent="#f7b400" icon="🏛️" />
        <MiniCard label="Menor Prazo Cartório" value="65d" sub="São José dos Campos" accent="#587810" icon="📜" />
        <MiniCard label="Média Geral Aprovação" value="176d" sub="todas as regiões" accent="#215ed4" icon="⏱️" />
      </div>

      <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20, marginBottom:20 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Tabela Comparativa por Região</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:"2px solid #eeeeee" }}>
            {["Região","Prazo Aprovação (dias)","Prazo Cartório (dias)","Prazo Licenciamento (dias)","Ranking","Status"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"#9ca3af", padding:"0 10px 10px", textTransform:"uppercase" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{regioes.map((r,i)=>(
            <tr key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
              <td style={{ padding:"12px 10px", fontWeight:600, fontSize:13 }}>{r.reg}</td>
              <td style={{ padding:"12px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:"#f0f0f0", borderRadius:6, height:8, width:120 }}>
                    <div style={{ width:`${r.pmAprov/250*100}%`, background: r.pmAprov>190?"#c00000":"#f7b400", height:"100%", borderRadius:6 }} />
                  </div>
                  <span style={{ fontSize:13 }}>{r.pmAprov}d</span>
                </div>
              </td>
              <td style={{ padding:"12px 10px", fontSize:13 }}>{r.pmCartorio}d</td>
              <td style={{ padding:"12px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:"#f0f0f0", borderRadius:6, height:8, width:120 }}>
                    <div style={{ width:`${r.pmLicen/280*100}%`, background: r.pmLicen>210?"#c00000":"#f7b400", height:"100%", borderRadius:6 }} />
                  </div>
                  <span style={{ fontSize:13 }}>{r.pmLicen}d</span>
                </div>
              </td>
              <td style={{ padding:"12px 10px", fontSize:13, fontWeight:700, color:"#215ed4" }}>#{i+1}</td>
              <td style={{ padding:"12px 10px" }}><Badge status={r.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <div style={{ background:"#fff8f0", border:"1px solid #fed7aa", borderRadius:10, padding:14 }}>
        <div style={{ fontWeight:600, fontSize:13, color:"#9a3412", marginBottom:4 }}>ℹ️ Nota sobre comparação entre municípios</div>
        <div style={{ fontSize:12, color:"#92400e" }}>Municípios como Ribeirão Preto e Campinas possuem ciclos de aprovação naturalmente mais longos por exigirem mais etapas técnicas. Evite comparação direta sem contextualização do porte do empreendimento e complexidade ambiental.</div>
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
        <MiniCard label="Meta Total 2026-2029" value="14.200" sub="lotes planejados" accent="#215ed4" icon="🎯" />
        <MiniCard label="Volume Aprovado" value="4.470" sub="lotes com aprovação" accent="#587810" icon="✅" />
        <MiniCard label="Volume em Aprovação" value="5.450" sub="aguardando aprovação" accent="#f7b400" icon="⏳" />
        <MiniCard label="Volume em Risco" value="4.280" sub="sem garantia de prazo" accent="#c00000" icon="⚠️" />
      </div>

      {anos.map((a,i) => {
        const total = a.aprov + a.emAprov + a.risco;
        const gap = a.plan - total;
        const status = a.aprov >= a.plan ? "emdia" : a.aprov + a.emAprov >= a.plan * .9 ? "atencao" : "risco";
        return (
          <div key={i} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontWeight:800, fontSize:18, color:"#111827" }}>Lançamentos {a.ano}</div>
              <Badge status={status} />
            </div>
            <div style={{ display:"flex", gap:20, marginBottom:14 }}>
              {[["Planejado",a.plan,"#215ed4"],["Aprovado",a.aprov,"#587810"],["Em aprovação",a.emAprov,"#f7b400"],["Em risco",a.risco,"#c00000"],["Gap",gap>0?gap:"—",gap>0?"#c00000":"#587810"]].map(([l,v,c])=>(
                <div key={l}><div style={{ fontSize:11, color:"#9ca3af", marginBottom:2 }}>{l}</div><div style={{ fontSize:20, fontWeight:700, color:c }}>{typeof v==="number" ? v.toLocaleString("pt-BR") : v}</div><div style={{ fontSize:11, color:"#9ca3af" }}>lotes</div></div>
              ))}
            </div>
            {/* STACKED BAR */}
            <div style={{ background:"#f0f0f0", borderRadius:8, height:14, overflow:"hidden", display:"flex" }}>
              {[[a.aprov,"#587810"],[a.emAprov,"#f7b400"],[a.risco,"#c00000"]].map(([v,c],ii)=>(
                <div key={ii} style={{ width:`${v/a.plan*100}%`, background:c, height:"100%", transition:"width .4s" }} />
              ))}
            </div>
            <div style={{ display:"flex", gap:16, marginTop:6 }}>
              {[["Aprovado","#587810"],["Em aprovação","#f7b400"],["Em risco","#c00000"]].map(([l,c])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#6b7280" }}><Dot color={c} />{l}</div>
              ))}
            </div>
            {gap > 0 && <div style={{ marginTop:10, background:"#ffe7e7", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#991b1b" }}>⚠️ Gap de {gap.toLocaleString("pt-BR")} lotes para atingir a meta de {a.ano}. Aceleração de processos necessária.</div>}
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
        <MiniCard label="Total de Revisões" value={REVISOES.length} icon="🔄" accent="#215ed4" />
        <MiniCard label="Dias Médios/Revisão" value="39d" icon="⏱️" accent="#f7b400" />
        <MiniCard label="Maior Impacto" value="66d" sub="Reserva Santa Clara" icon="📉" accent="#c00000" />
        <MiniCard label="Principal Causa" value="Norma desatualizada" icon="📋" accent="#f7b400" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Revisões por Motivo</div>
          {motivos.map((m,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4b5563", marginBottom:3 }}>
                <span>{m.m}</span><span style={{ fontWeight:600 }}>{m.n}</span>
              </div>
              <div style={{ background:"#f0f0f0", borderRadius:6, height:8 }}>
                <div style={{ width:`${m.n/max*100}%`, background:"#f7b400", height:"100%", borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Impacto por Empreendimento (dias)</div>
          {REVISOES.map((r,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f0f0f0" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{r.emp}</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>{r.projeto} — Rev. #{r.rev}</div>
              </div>
              <div style={{ fontSize:16, fontWeight:700, color: r.dias>50?"#c00000":r.dias>30?"#f7b400":"#f7b400" }}>{r.dias}d</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Registro Detalhado de Revisões</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:"2px solid #eeeeee" }}>
            {["Empreendimento","Projeto","Rev.","Motivo","Origem","Responsável","Início","Fim","Dias","Impacto"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"#9ca3af", padding:"0 8px 10px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{REVISOES.map((r,i)=>(
            <tr key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{r.emp}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{r.projeto}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>#{r.rev}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:"#4b5563" }}>{r.motivo}</td>
              <td style={{ padding:"10px 8px" }}><span style={{ fontSize:11, background:"#b6cefc", color:"#215ed4", padding:"2px 8px", borderRadius:8 }}>{r.origem}</span></td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{r.resp}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:"#6b7280" }}>{r.inicio}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:"#6b7280" }}>{r.fim}</td>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:700, color: r.dias>50?"#c00000":r.dias>30?"#f7b400":"#4b5563" }}>{r.dias}d</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:"#c00000" }}>+{r.impacto}d</td>
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

      <div style={{ background:"#fff8f0", border:"1px solid #fed7aa", borderRadius:10, padding:14, marginBottom:20 }}>
        <div style={{ fontWeight:700, fontSize:13, color:"#9a3412" }}>⚠️ Alerta de Versão Desatualizada</div>
        <div style={{ fontSize:12, color:"#92400e", marginTop:4 }}>Jardim das Águas — Projeto Elétrico (v2.1) está marcado como <b>Obsoleto</b> no Construcode. Existe versão v3.0 disponível. A versão utilizada na obra pode estar desatualizada. <span style={{ color:"#215ed4", cursor:"pointer", textDecoration:"underline" }}>Ver documento →</span></div>
      </div>

      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        <MiniCard label="Total Documentos" value={DOCUMENTOS.length} icon="📄" accent="#215ed4" />
        <MiniCard label="Aprovados" value={DOCUMENTOS.filter(d=>d.status==="aprovado").length} icon="✅" accent="#587810" />
        <MiniCard label="Pendentes" value={DOCUMENTOS.filter(d=>d.status==="pendente").length} icon="⏳" accent="#f7b400" />
        <MiniCard label="Bloqueados / Obsoletos" value={DOCUMENTOS.filter(d=>["bloqueado","obsoleto"].includes(d.status)).length} icon="🔒" accent="#c00000" />
      </div>

      <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:"2px solid #eeeeee" }}>
            {["Empreendimento","Documento","Status","Versão","Atualizado","Responsável","Origem","Sistema"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"#9ca3af", padding:"0 8px 10px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{DOCUMENTOS.map((d,i)=>(
            <tr key={i} style={{ borderBottom:"1px solid #f0f0f0", background: d.status==="obsoleto"?"#fffbeb":"" }}>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{d.emp}</td>
              <td style={{ padding:"10px 8px", fontSize:13 }}>{d.doc}</td>
              <td style={{ padding:"10px 8px" }}><DocBadge status={d.status} /></td>
              <td style={{ padding:"10px 8px", fontSize:12, color:"#6b7280" }}>{d.versao}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color:"#6b7280" }}>{d.atualizado}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{d.resp}</td>
              <td style={{ padding:"10px 8px", fontSize:12 }}>{d.origem}</td>
              <td style={{ padding:"10px 8px" }}>{d.sistema!=="—" ? <span style={{ fontSize:11, background:"#b6cefc", color:"#215ed4", padding:"2px 8px", borderRadius:8, fontWeight:600 }}>{d.sistema}</span> : <span style={{ color:"#d1d5db" }}>—</span>}</td>
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
        <MiniCard label="Obras em Andamento" value={OBRAS.filter(o=>o.pct<100).length} icon="🏗️" accent="#215ed4" />
        <MiniCard label="Obras Concluídas" value={OBRAS.filter(o=>o.pct===100).length} icon="✅" accent="#587810" />
        <MiniCard label="Doações Pendentes" value={OBRAS.filter(o=>o.doacao!=="Concluída").length} icon="📋" accent="#f7b400" />
        <MiniCard label="TVOs Pendentes" value={OBRAS.filter(o=>o.tvo!=="Concluído").length} icon="🔏" accent="#f7b400" />
      </div>

      {OBRAS.map((o,i)=>(
        <div key={i} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20, marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:"#111827" }}>{o.emp}</div>
              <div style={{ fontSize:12, color:"#6b7280" }}>Responsável: {o.resp} · Etapa: {o.etapa}</div>
            </div>
            {o.pct===100 ? <Badge status="emdia" /> : o.pendencias>0 ? <Badge status="atencao" /> : <Badge status="emdia" />}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:14 }}>
            {[["Previsto",o.previsto],["Realizado",o.realizado],["Doação",o.doacao],["TVO",o.tvo],["Pendências",o.pendencias]].map(([l,v])=>(
              <div key={l} style={{ background:"#f9fafb", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:"#9ca3af", marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{v}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4b5563", marginBottom:4 }}>
              <span>Avanço físico</span><span style={{ fontWeight:700 }}>{o.pct}%</span>
            </div>
            <ProgressBar pct={o.pct} color={o.pct===100?"#587810":"#215ed4"} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Indicadores() {
  const byEtapa = ETAPAS.map(et => ({ name:et, count: EMPREENDIMENTOS.filter(e=>e.etapa===et).length }));
  const byStatus = [
    { name:"Em dia", value: EMPREENDIMENTOS.filter(e=>e.status==="emdia").length, color:"#587810" },
    { name:"Atenção", value: EMPREENDIMENTOS.filter(e=>e.status==="atencao").length, color:"#f7b400" },
    { name:"Em risco", value: EMPREENDIMENTOS.filter(e=>e.status==="risco").length, color:"#f7b400" },
    { name:"Atrasado", value: EMPREENDIMENTOS.filter(e=>e.status==="atrasado").length, color:"#c00000" },
  ];
  const max = Math.max(...byEtapa.map(b=>b.count));

  return (
    <div>
      <SectionTitle title="Indicadores Executivos" sub="Painel estratégico para tomada de decisão" />
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
        <MiniCard label="Portfólio Total" value={EMPREENDIMENTOS.length} icon="🏗️" accent="#215ed4" sub="empreendimentos" />
        <MiniCard label="% Em dia" value={`${Math.round(EMPREENDIMENTOS.filter(e=>e.status==="emdia").length/EMPREENDIMENTOS.length*100)}%`} icon="✅" accent="#587810" />
        <MiniCard label="Revisões (total)" value={REVISOES.length} icon="🔄" accent="#f7b400" sub="projetos" />
        <MiniCard label="Dias médios/revisão" value="39d" icon="⏱️" accent="#c00000" />
        <MiniCard label="Lançamentos 2026" value="2" icon="🚀" accent="#215ed4" sub="empreendimentos" />
        <MiniCard label="Lotes aprovados 2028" value="1.800" icon="📊" accent="#215ed4" sub="de 5.000 planejados" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Distribuição por Status</div>
          {byStatus.map((s,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><Dot color={s.color} />{s.name}</span>
                <span style={{ fontWeight:700 }}>{s.value}</span>
              </div>
              <div style={{ background:"#f0f0f0", borderRadius:6, height:10 }}>
                <div style={{ width:`${s.value/EMPREENDIMENTOS.length*100}%`, background:s.color, height:"100%", borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Empreendimentos por Etapa</div>
          {byEtapa.filter(b=>b.count>0).map((b,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4b5563", marginBottom:3 }}>
                <span>{b.name}</span><span style={{ fontWeight:700 }}>{b.count}</span>
              </div>
              <div style={{ background:"#f0f0f0", borderRadius:6, height:7 }}>
                <div style={{ width:`${b.count/max*100}%`, background:"#215ed4", height:"100%", borderRadius:6 }} />
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
          <div key={i} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:12, color:"#6b7280", marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:800, color: s==="risco"?"#c00000":s==="atencao"?"#f7b400":"#587810" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"#215ed4", borderRadius:12, padding:20, color:"#fff" }}>
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
          <div key={item} style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:10, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:14, fontWeight:600, color:"#374151" }}>{item}</span>
            <button style={{ fontSize:12, background:"#215ed4", color:"#fff", border:"none", borderRadius:6, padding:"6px 14px", cursor:"pointer" }}>Gerenciar</button>
          </div>
        ))}
      </div>
      <div style={{ background:"#fff", border:"1px solid #eeeeee", borderRadius:12, padding:20 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Regras de Alerta por Município / Etapa</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:"2px solid #eeeeee" }}>
            {["Município","Etapa","Prazo Padrão","Alerta Amarelo","Alerta Vermelho","Ação"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"#9ca3af", padding:"0 8px 10px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{regras.map((r,i)=>(
            <tr key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
              <td style={{ padding:"10px 8px", fontSize:13, fontWeight:600 }}>{r.municipio}</td>
              <td style={{ padding:"10px 8px", fontSize:13 }}>{r.etapa}</td>
              <td style={{ padding:"10px 8px", fontSize:13 }}>{r.padrao}d</td>
              <td style={{ padding:"10px 8px" }}><span style={{ background:"#FFE6A4", color:"#92400e", padding:"2px 9px", borderRadius:8, fontSize:12 }}>🟡 {r.amarelo}d</span></td>
              <td style={{ padding:"10px 8px" }}><span style={{ background:"#ffe7e7", color:"#991b1b", padding:"2px 9px", borderRadius:8, fontSize:12 }}>🔴 {r.vermelho}d</span></td>
              <td style={{ padding:"10px 8px" }}><button style={{ fontSize:12, background:"none", color:"#215ed4", border:"1px solid #215ed4", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Editar</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
const MENU = [
  { id:"visao", label:"Visão Geral", icon:"📊" },
  { id:"esteira", label:"Esteira", icon:"🔀" },
  { id:"prazos", label:"Mapa de Prazos", icon:"📅" },
  { id:"lancamentos", label:"Lançamentos", icon:"🚀" },
  { id:"revisoes", label:"Revisões", icon:"🔄" },
  { id:"documentos", label:"Documentos", icon:"📄" },
  { id:"obras", label:"Obras / TVO", icon:"🏗️" },
  { id:"indicadores", label:"Indicadores", icon:"📈" },
  { id:"config", label:"Configurações", icon:"⚙️" },
];

export default function App() {
  const [page, setPage] = useState("visao");
  const [detail, setDetail] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);

  return (
    <>
      <GlobalStyles />
      <div style={{ display:"flex", width:"100vw", height:"100vh", fontFamily:"'Inter', 'Segoe UI', sans-serif", background:"#f0f0f0", overflow:"hidden" }}>
      {/* SIDEBAR */}
      <div style={{ width: sideOpen ? 240 : 56, background:"#587810", transition:"width .25s", display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
        <div style={{ padding: sideOpen ? "14px 14px 10px" : "14px 10px 10px", display:"flex", alignItems:"center", justifyContent: sideOpen ? "flex-start" : "center", gap:10, borderBottom:"1px solid rgba(255,255,255,.14)" }}>
          <BrandLogo compact={!sideOpen} />
        </div>

        <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
          {MENU.map(m=>(
            <button key={m.id} onClick={()=>setPage(m.id)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 10px", border:"none", background: page===m.id ? "rgba(99,102,241,.3)" : "none", borderRadius:8, cursor:"pointer", marginBottom:2, color: page===m.id ? "#b6cefc" : "#9ca3af", fontWeight: page===m.id ? 600 : 400, fontSize:13, transition:"background .15s", textAlign:"left" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{m.icon}</span>
              {sideOpen && <span style={{ whiteSpace:"nowrap" }}>{m.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding:12, borderTop:"1px solid rgba(255,255,255,.1)" }}>
          <button onClick={()=>setSideOpen(v=>!v)} style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"none", color:"#9ca3af", borderRadius:6, padding:"7px", cursor:"pointer", fontSize:13 }}>
            {sideOpen ? "← Recolher" : "→"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* TOPBAR */}
        <div style={{ height:56, background:"#fff", borderBottom:"1px solid #eeeeee", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{MENU.find(m=>m.id===page)?.label}</div>
            <div style={{ fontSize:12, color:"#9ca3af" }}>/ {EMPREENDIMENTOS.length} empreendimentos</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <select style={{ fontSize:12, border:"1px solid #eeeeee", borderRadius:6, padding:"5px 10px", color:"#374151", background:"#fff" }}>
              <option>Todas as regiões</option>
              {["Campinas","Sorocaba","Ribeirão Preto","São José dos Campos","Jundiaí"].map(r=><option key={r}>{r}</option>)}
            </select>
            <select style={{ fontSize:12, border:"1px solid #eeeeee", borderRadius:6, padding:"5px 10px", color:"#374151", background:"#fff" }}>
              <option>Todos os status</option>
              <option>Em dia</option><option>Atenção</option><option>Em risco</option><option>Atrasado</option>
            </select>
            <div style={{ width:34, height:34, background:"#215ed4", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>AC</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, minWidth:0, overflowY:"auto", padding:24 }}>
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
