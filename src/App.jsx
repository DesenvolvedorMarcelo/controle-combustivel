import { useMemo, useState } from "react";

const vehicleInitial = {
  placa: "ABC1D23",
  modelo: "Fiat Uno 1.0",
  ano: "2018",
  combustivel: "Gasolina",
  mediaCidade: "12",
  potencia: "75 cv",
};

const abastecimentoInicial = {
  data: "",
  kmAtual: "",
  litros: "",
  valor: "",
};

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function numero(valor, casas = 1) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

function dataLabel(data) {
  if (!data) return "--/--/----";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function App() {
  const [aba, setAba] = useState("inicio");
  const [logado, setLogado] = useState(false);
  const [login, setLogin] = useState({ email: "", senha: "" });
  const [vehicle, setVehicle] = useState(vehicleInitial);
  const [form, setForm] = useState(abastecimentoInicial);
  const [historico, setHistorico] = useState([
    { id: 1, data: "2026-03-18", kmAtual: 15240, litros: 28.5, valor: 152.9 },
    { id: 2, data: "2026-03-20", kmAtual: 15510, litros: 26.4, valor: 144.5 },
    { id: 3, data: "2026-03-22", kmAtual: 15828, litros: 29.1, valor: 164.2 },
  ]);

  const enriquecido = useMemo(() => {
    return historico.map((item, index) => {
      const anterior = historico[index - 1];
      const kmRodados = anterior ? item.kmAtual - anterior.kmAtual : 0;
      const consumoMedio = anterior && item.litros > 0 ? kmRodados / item.litros : 0;
      const custoPorKm = anterior && kmRodados > 0 ? item.valor / kmRodados : 0;
      return { ...item, kmRodados, consumoMedio, custoPorKm };
    });
  }, [historico]);

  const validos = enriquecido.filter((item) => item.kmRodados > 0);

  const resumo = useMemo(() => {
    const totalValor = historico.reduce((soma, item) => soma + Number(item.valor), 0);
    const totalLitros = historico.reduce((soma, item) => soma + Number(item.litros), 0);
    const totalKm = validos.reduce((soma, item) => soma + Number(item.kmRodados), 0);
    const consumoMedio = totalLitros > 0 ? totalKm / totalLitros : 0;
    const custoPorKm = totalKm > 0 ? totalValor / totalKm : 0;
    return { totalValor, totalLitros, totalKm, consumoMedio, custoPorKm };
  }, [historico, validos]);

  const grafico = useMemo(() => {
    const base = validos.slice(-6);
    if (!base.length) {
      return [8.4, 9.2, 7.8, 10.1, 9.4, 11.3];
    }
    return base.map((item) => Number(item.consumoMedio.toFixed(1)));
  }, [validos]);

  const loginSubmit = (e) => {
    e.preventDefault();
    setLogado(true);
    setAba("inicio");
  };

  const salvarVeiculo = (e) => {
    e.preventDefault();
    setAba("inicio");
  };

  const adicionarAbastecimento = (e) => {
    e.preventDefault();
    if (!form.data || !form.kmAtual || !form.litros || !form.valor) return;

    const novo = {
      id: Date.now(),
      data: form.data,
      kmAtual: Number(form.kmAtual),
      litros: Number(form.litros),
      valor: Number(form.valor),
    };

    const atualizados = [...historico, novo].sort((a, b) => a.kmAtual - b.kmAtual);
    setHistorico(atualizados);
    setForm(abastecimentoInicial);
    setAba("abastecimento");
  };

  const ultimo = validos[validos.length - 1];
  const semanaValor = historico.slice(-2).reduce((soma, item) => soma + Number(item.valor), 0);
  const semanaKm = validos.slice(-2).reduce((soma, item) => soma + Number(item.kmRodados), 0);

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.shell}>
        <div style={styles.appFrame}>
          <div style={styles.glowA} />
          <div style={styles.glowB} />

          <header style={styles.topbar}>
            <div>
              <div style={styles.brandRow}>
                <span style={styles.brandIcon}>⛽</span>
                <span style={styles.brandText}>Fuel Tracker</span>
              </div>
              <div style={styles.subtitle}>Controle premium para consumo de combustível</div>
            </div>
            <div style={styles.statusBadge}>{logado ? "Online" : "Visitante"}</div>
          </header>

          {!logado && (
            <section style={styles.phoneCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Entrar</h2>
                <span style={styles.sectionMini}>Acesso seguro</span>
              </div>
              <form onSubmit={loginSubmit} style={styles.formStack}>
                <input
                  style={styles.input}
                  placeholder="E-mail"
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                />
                <input
                  style={styles.input}
                  placeholder="Senha"
                  type="password"
                  value={login.senha}
                  onChange={(e) => setLogin({ ...login, senha: e.target.value })}
                />
                <button style={styles.primaryButton} type="submit">Entrar</button>
              </form>
              <div style={styles.footerLink}>Esqueceu a senha?</div>
            </section>
          )}

          {logado && (
            <>
              {aba === "inicio" && (
                <section style={styles.screenGrid}>
                  <div style={styles.heroCard}>
                    <div style={styles.heroHeader}>
                      <div>
                        <div style={styles.sectionMini}>Visão geral</div>
                        <h2 style={styles.heroTitle}>Controle de Combustível</h2>
                      </div>
                      <div style={styles.heroPill}>Atualizado agora</div>
                    </div>

                    <div style={styles.kpiGrid}>
                      <div style={styles.kpiCardGreen}>
                        <span style={styles.kpiLabel}>Gasto total</span>
                        <strong style={styles.kpiValue}>{moeda(resumo.totalValor)}</strong>
                      </div>
                      <div style={styles.kpiCardBlue}>
                        <span style={styles.kpiLabel}>KM rodados</span>
                        <strong style={styles.kpiValue}>{Math.round(resumo.totalKm)} km</strong>
                      </div>
                      <div style={styles.kpiCardBlue}>
                        <span style={styles.kpiLabel}>Consumo médio</span>
                        <strong style={styles.kpiValue}>{numero(resumo.consumoMedio)} km/L</strong>
                      </div>
                      <div style={styles.kpiCardBlue}>
                        <span style={styles.kpiLabel}>Custo por km</span>
                        <strong style={styles.kpiValue}>{moeda(resumo.custoPorKm)}</strong>
                      </div>
                    </div>

                    <div style={styles.chartCard}>
                      <div style={styles.chartHeader}>
                        <span style={styles.chartTitle}>Desempenho de Consumo</span>
                        <span style={styles.chartMini}>Últimos ciclos</span>
                      </div>
                      <div style={styles.chartArea}>
                        {grafico.map((valor, index) => (
                          <div key={index} style={styles.chartColumnWrap}>
                            <div
                              style={{
                                ...styles.chartBar,
                                height: `${Math.max(30, valor * 9)}px`,
                              }}
                            />
                            <span style={styles.chartDay}>{["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][index] || `#${index + 1}`}</span>
                          </div>
                        ))}
                        <svg style={styles.lineSvg} viewBox="0 0 320 140" preserveAspectRatio="none">
                          <polyline
                            fill="none"
                            stroke="#4da3ff"
                            strokeWidth="3"
                            points={grafico
                              .map((valor, index) => `${20 + index * 56},${130 - valor * 8}`)
                              .join(" ")}
                          />
                        </svg>
                      </div>
                    </div>

                    <div style={styles.bottomSummary}>
                      <div style={styles.summaryTile}>
                        <span style={styles.kpiLabel}>Último abastecimento</span>
                        <strong style={styles.summaryValue}>{ultimo ? `${Math.round(ultimo.litros)} L` : "--"}</strong>
                        <small style={styles.summaryMini}>{ultimo ? dataLabel(ultimo.data) : "sem dados"}</small>
                      </div>
                      <div style={styles.summaryTile}>
                        <span style={styles.kpiLabel}>Custo atual/KM</span>
                        <strong style={styles.summaryValue}>{ultimo ? moeda(ultimo.custoPorKm) : "R$ 0,00"}</strong>
                        <small style={styles.summaryMini}>último ciclo</small>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {aba === "veiculo" && (
                <section style={styles.phoneCard}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Cadastro do Veículo</h2>
                    <span style={styles.sectionMini}>Dados principais</span>
                  </div>
                  <form onSubmit={salvarVeiculo} style={styles.formStack}>
                    <input style={styles.input} placeholder="Placa" value={vehicle.placa} onChange={(e) => setVehicle({ ...vehicle, placa: e.target.value })} />
                    <input style={styles.input} placeholder="Modelo" value={vehicle.modelo} onChange={(e) => setVehicle({ ...vehicle, modelo: e.target.value })} />
                    <input style={styles.input} placeholder="Ano" value={vehicle.ano} onChange={(e) => setVehicle({ ...vehicle, ano: e.target.value })} />
                    <input style={styles.input} placeholder="Combustível" value={vehicle.combustivel} onChange={(e) => setVehicle({ ...vehicle, combustivel: e.target.value })} />
                    <input style={styles.input} placeholder="Média Cidade (km/L)" value={vehicle.mediaCidade} onChange={(e) => setVehicle({ ...vehicle, mediaCidade: e.target.value })} />
                    <input style={styles.input} placeholder="Potência" value={vehicle.potencia} onChange={(e) => setVehicle({ ...vehicle, potencia: e.target.value })} />
                    <button style={styles.primaryButton} type="submit">Salvar</button>
                  </form>
                </section>
              )}

              {aba === "abastecimento" && (
                <section style={styles.phoneCard}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Registro de Abastecimento</h2>
                    <span style={styles.sectionMini}>Controle detalhado</span>
                  </div>

                  <div style={styles.kpiGridSmall}>
                    <div style={styles.kpiCardGreen}>
                      <span style={styles.kpiLabel}>KM Rodados</span>
                      <strong style={styles.kpiValue}>{Math.round(semanaKm)} km</strong>
                    </div>
                    <div style={styles.kpiCardBlue}>
                      <span style={styles.kpiLabel}>Consumo Médio</span>
                      <strong style={styles.kpiValue}>{numero(resumo.consumoMedio)} km/L</strong>
                    </div>
                    <div style={styles.kpiCardBlue}>
                      <span style={styles.kpiLabel}>Custo por KM</span>
                      <strong style={styles.kpiValue}>{moeda(resumo.custoPorKm)}</strong>
                    </div>
                  </div>

                  <form onSubmit={adicionarAbastecimento} style={styles.formStackCompact}>
                    <input style={styles.input} type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                    <input style={styles.input} placeholder="KM Atual" value={form.kmAtual} onChange={(e) => setForm({ ...form, kmAtual: e.target.value })} />
                    <input style={styles.input} placeholder="Litros" value={form.litros} onChange={(e) => setForm({ ...form, litros: e.target.value })} />
                    <input style={styles.input} placeholder="Valor" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
                    <button style={styles.primaryButton} type="submit">+ Adicionar Abastecimento</button>
                  </form>

                  <div style={styles.listWrap}>
                    {enriquecido.slice().reverse().map((item) => (
                      <div key={item.id} style={styles.listItem}>
                        <div>
                          <strong style={styles.listDate}>{dataLabel(item.data)}</strong>
                          <div style={styles.listMeta}>{numero(item.litros, 1)} L • {moeda(item.valor)}</div>
                        </div>
                        <div style={styles.listKm}>{item.kmRodados > 0 ? `${Math.round(item.kmRodados)} km` : `${Math.round(item.kmAtual)} km`}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {aba === "analise" && (
                <section style={styles.phoneCard}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Análise de Consumo</h2>
                    <span style={styles.sectionMini}>Resumo financeiro</span>
                  </div>

                  <div style={styles.topDuo}>
                    <div style={styles.kpiCardGreen}>
                      <span style={styles.kpiLabel}>Esta Semana</span>
                      <strong style={styles.kpiValue}>{moeda(semanaValor)}</strong>
                      <small style={styles.summaryMini}>{Math.round(semanaKm)} km</small>
                    </div>
                    <div style={styles.kpiCardBlue}>
                      <span style={styles.kpiLabel}>Este Mês</span>
                      <strong style={styles.kpiValue}>{moeda(resumo.totalValor)}</strong>
                      <small style={styles.summaryMini}>{Math.round(resumo.totalKm)} km</small>
                    </div>
                  </div>

                  <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                      <span style={styles.chartTitle}>Desempenho de Consumo</span>
                    </div>
                    <div style={styles.chartArea}>
                      {grafico.map((valor, index) => (
                        <div key={index} style={styles.chartColumnWrap}>
                          <div style={{ ...styles.chartBar, height: `${Math.max(28, valor * 9)}px` }} />
                          <span style={styles.chartDay}>{["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][index] || `#${index + 1}`}</span>
                        </div>
                      ))}
                      <svg style={styles.lineSvg} viewBox="0 0 320 140" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#4da3ff"
                          strokeWidth="3"
                          points={grafico
                            .map((valor, index) => `${20 + index * 56},${130 - valor * 8}`)
                            .join(" ")}
                        />
                      </svg>
                    </div>
                  </div>

                  <div style={styles.bottomSummary}>
                    <div style={styles.summaryTile}>
                      <span style={styles.kpiLabel}>Média Semanal</span>
                      <strong style={styles.summaryValue}>{numero(resumo.consumoMedio)} km/L</strong>
                    </div>
                    <div style={styles.summaryTile}>
                      <span style={styles.kpiLabel}>Custo Semanal</span>
                      <strong style={styles.summaryValue}>{moeda(semanaValor)}</strong>
                    </div>
                  </div>
                </section>
              )}

              <nav style={styles.bottomNav}>
                <button onClick={() => setAba("inicio")} style={aba === "inicio" ? styles.navBtnActive : styles.navBtn}>Início</button>
                <button onClick={() => setAba("veiculo")} style={aba === "veiculo" ? styles.navBtnActive : styles.navBtn}>Veículo</button>
                <button onClick={() => setAba("abastecimento")} style={aba === "abastecimento" ? styles.navBtnActive : styles.navBtn}>Abastecer</button>
                <button onClick={() => setAba("analise")} style={aba === "analise" ? styles.navBtnActive : styles.navBtn}>Análise</button>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #102447 0%, #08111f 45%, #02060d 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  shell: {
    width: "100%",
    maxWidth: "430px",
  },
  appFrame: {
    position: "relative",
    overflow: "hidden",
    minHeight: "860px",
    borderRadius: "34px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(180deg, rgba(8,18,35,0.98) 0%, rgba(6,14,27,0.98) 100%)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
    padding: "18px",
  },
  glowA: {
    position: "absolute",
    width: "220px",
    height: "220px",
    top: "-60px",
    right: "-80px",
    background: "radial-gradient(circle, rgba(55,111,255,0.28) 0%, rgba(55,111,255,0) 70%)",
    pointerEvents: "none",
  },
  glowB: {
    position: "absolute",
    width: "240px",
    height: "240px",
    bottom: "-120px",
    left: "-100px",
    background: "radial-gradient(circle, rgba(0,224,168,0.18) 0%, rgba(0,224,168,0) 70%)",
    pointerEvents: "none",
  },
  topbar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "18px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 700,
    color: "#f5f7fb",
    fontSize: "30px",
  },
  brandIcon: {
    fontSize: "30px",
  },
  brandText: {
    fontSize: "15px",
    letterSpacing: "0.3px",
  },
  subtitle: {
    marginTop: "6px",
    color: "#91a3c2",
    fontSize: "12px",
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#c7d6f2",
    fontSize: "11px",
  },
  screenGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
  },
  heroCard: {
    position: "relative",
    borderRadius: "26px",
    padding: "18px",
    background: "linear-gradient(180deg, rgba(18,31,58,0.95) 0%, rgba(10,20,39,0.95) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },
  heroHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "16px",
  },
  heroTitle: {
    margin: 0,
    color: "#f7f9fd",
    fontSize: "22px",
    lineHeight: 1.1,
  },
  heroPill: {
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "11px",
    background: "rgba(77,163,255,0.12)",
    color: "#9cc7ff",
    border: "1px solid rgba(77,163,255,0.25)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "14px",
  },
  sectionTitle: {
    margin: 0,
    color: "#f7f9fd",
    fontSize: "22px",
  },
  sectionMini: {
    color: "#90a4c3",
    fontSize: "12px",
  },
  phoneCard: {
    borderRadius: "26px",
    padding: "18px",
    background: "linear-gradient(180deg, rgba(18,31,58,0.95) 0%, rgba(10,20,39,0.95) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },
  formStack: {
    display: "grid",
    gap: "12px",
  },
  formStackCompact: {
    display: "grid",
    gap: "10px",
    marginTop: "14px",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#f6f8fc",
    padding: "14px 14px",
    outline: "none",
    fontSize: "14px",
  },
  primaryButton: {
    border: 0,
    borderRadius: "14px",
    padding: "14px 16px",
    background: "linear-gradient(180deg, #2f7ef7 0%, #1058d4 100%)",
    color: "white",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(19,99,255,0.35)",
  },
  footerLink: {
    marginTop: "14px",
    textAlign: "center",
    color: "#87a4d1",
    fontSize: "13px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "16px",
  },
  kpiGridSmall: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "14px",
  },
  kpiCardGreen: {
    borderRadius: "18px",
    padding: "14px",
    background: "linear-gradient(180deg, rgba(23,57,51,0.95) 0%, rgba(15,39,35,0.95) 100%)",
    border: "1px solid rgba(60,214,153,0.20)",
    boxShadow: "inset 0 -3px 0 rgba(67,232,169,0.55)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  kpiCardBlue: {
    borderRadius: "18px",
    padding: "14px",
    background: "linear-gradient(180deg, rgba(19,35,61,0.95) 0%, rgba(13,25,44,0.95) 100%)",
    border: "1px solid rgba(77,163,255,0.18)",
    boxShadow: "inset 0 -3px 0 rgba(77,163,255,0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  kpiLabel: {
    fontSize: "11px",
    color: "#95a7c5",
  },
  kpiValue: {
    fontSize: "22px",
    color: "#ffffff",
    lineHeight: 1.1,
  },
  chartCard: {
    borderRadius: "22px",
    padding: "16px",
    background: "rgba(7,16,31,0.78)",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "16px",
  },
  chartHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  chartTitle: {
    color: "#f5f8ff",
    fontWeight: 700,
    fontSize: "15px",
  },
  chartMini: {
    color: "#8ea6cb",
    fontSize: "11px",
  },
  chartArea: {
    position: "relative",
    height: "220px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "8px",
    padding: "8px 6px 0",
    backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "100% 36px",
  },
  chartColumnWrap: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    height: "100%",
  },
  chartBar: {
    width: "22px",
    borderRadius: "10px 10px 0 0",
    background: "linear-gradient(180deg, rgba(75,227,164,0.95) 0%, rgba(39,153,108,0.95) 100%)",
    boxShadow: "0 10px 20px rgba(15,161,101,0.22)",
  },
  chartDay: {
    marginTop: "8px",
    fontSize: "11px",
    color: "#90a5c6",
  },
  lineSvg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "visible",
    pointerEvents: "none",
  },
  bottomSummary: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  summaryTile: {
    borderRadius: "18px",
    padding: "14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: "19px",
    lineHeight: 1.1,
  },
  summaryMini: {
    color: "#88a1c3",
    fontSize: "11px",
  },
  listWrap: {
    display: "grid",
    gap: "10px",
    marginTop: "8px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    borderRadius: "16px",
    padding: "14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  listDate: {
    color: "#ffffff",
    fontSize: "14px",
  },
  listMeta: {
    marginTop: "4px",
    color: "#8ca3c6",
    fontSize: "12px",
  },
  listKm: {
    color: "#c6d8f7",
    fontWeight: 700,
    fontSize: "13px",
  },
  topDuo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "16px",
  },
  bottomNav: {
    position: "sticky",
    bottom: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginTop: "18px",
    padding: "12px",
    borderRadius: "20px",
    background: "rgba(6,13,24,0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
  },
  navBtn: {
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.03)",
    color: "#88a0c2",
    borderRadius: "14px",
    padding: "12px 8px",
    fontSize: "12px",
    cursor: "pointer",
  },
  navBtnActive: {
    border: "1px solid rgba(77,163,255,0.25)",
    background: "linear-gradient(180deg, rgba(34,75,145,0.95) 0%, rgba(20,46,90,0.95) 100%)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "12px 8px",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "inset 0 -2px 0 rgba(77,163,255,0.45)",
  },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  input::placeholder { color: #7488ab; }
  @media (max-width: 480px) {
    .hide-mobile { display: none; }
  }
`;
