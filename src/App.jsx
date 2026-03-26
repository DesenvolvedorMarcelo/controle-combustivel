import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fuel-tracker-pwa-v1";

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
  const [aba, setAba] = useState("login");
  const [login, setLogin] = useState({ email: "", senha: "" });
  const [vehicle, setVehicle] = useState(vehicleInitial);
  const [form, setForm] = useState(abastecimentoInicial);
  const [historico, setHistorico] = useState([
    { id: 1, data: "2026-03-18", kmAtual: 15240, litros: 25.8, valor: 145.0 },
    { id: 2, data: "2026-03-20", kmAtual: 15602, litros: 30.2, valor: 170.0 },
    { id: 3, data: "2026-03-22", kmAtual: 16152, litros: 28.5, valor: 152.0 },
  ]);
  const [instalarEvento, setInstalarEvento] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      if (!bruto) return;
      const dados = JSON.parse(bruto);

      if (dados?.vehicle) setVehicle(dados.vehicle);
      if (Array.isArray(dados?.historico) && dados.historico.length) {
        setHistorico(dados.historico);
      }
      if (dados?.login) setLogin(dados.login);
      if (dados?.aba) setAba(dados.aba);
    } catch (erro) {
      console.error("Erro ao carregar dados salvos:", erro);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        vehicle,
        historico,
        login,
        aba,
      })
    );
  }, [vehicle, historico, login, aba]);

  useEffect(() => {
    const capturarInstall = (event) => {
      event.preventDefault();
      setInstalarEvento(event);
    };

    window.addEventListener("beforeinstallprompt", capturarInstall);
    return () => window.removeEventListener("beforeinstallprompt", capturarInstall);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch((erro) => console.error("Erro ao registrar service worker:", erro));
    }
  }, []);

  const enriquecido = useMemo(() => {
    return historico.map((item, index) => {
      const anterior = historico[index - 1];
      const kmRodados = anterior ? item.kmAtual - anterior.kmAtual : 0;
      const consumoMedio = anterior && item.litros > 0 ? kmRodados / item.litros : 0;
      const custoPorKm = anterior && kmRodados > 0 ? item.valor / kmRodados : 0;

      return {
        ...item,
        kmRodados,
        consumoMedio,
        custoPorKm,
      };
    });
  }, [historico]);

  const validos = enriquecido.filter((item) => item.kmRodados > 0);

  const resumo = useMemo(() => {
    const totalValor = historico.reduce((soma, item) => soma + Number(item.valor), 0);
    const totalLitros = historico.reduce((soma, item) => soma + Number(item.litros), 0);
    const totalKm = validos.reduce((soma, item) => soma + Number(item.kmRodados), 0);
    const consumoMedio = totalLitros > 0 ? totalKm / totalLitros : 0;
    const custoPorKm = totalKm > 0 ? totalValor / totalKm : 0;

    return {
      totalValor,
      totalLitros,
      totalKm,
      consumoMedio,
      custoPorKm,
    };
  }, [historico, validos]);

  const grafico = useMemo(() => {
    const base = validos.slice(-6);
    if (!base.length) return [10.5, 7.2, 5.0, 7.0, 8.7, 6.3];
    return base.map((item) => Number(item.consumoMedio.toFixed(1)));
  }, [validos]);

  const ultimo = validos[validos.length - 1];
  const semanaValor = historico.slice(-2).reduce((soma, item) => soma + Number(item.valor), 0);
  const semanaKm = validos.slice(-2).reduce((soma, item) => soma + Number(item.kmRodados), 0);

  function entrar() {
    setAba("inicio");
    setMensagem("Dados salvos localmente no seu aparelho.");
  }

  function salvarVeiculo() {
    setMensagem("Veículo salvo com sucesso.");
    setAba("veiculo");
  }

  function adicionarAbastecimento() {
    if (!form.data || !form.kmAtual || !form.litros || !form.valor) {
      setMensagem("Preencha data, km atual, litros e valor.");
      return;
    }

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
    setMensagem("Abastecimento salvo com sucesso.");
    setAba("abastecimento");
  }

  function limparTudo() {
    const confirmar = window.confirm("Apagar todos os dados do app?");
    if (!confirmar) return;

    localStorage.removeItem(STORAGE_KEY);
    setVehicle(vehicleInitial);
    setHistorico([]);
    setLogin({ email: "", senha: "" });
    setForm(abastecimentoInicial);
    setAba("login");
    setMensagem("Dados apagados.");
  }

  async function instalarApp() {
    if (!instalarEvento) {
      setMensagem("No celular, abra no Chrome e toque em 'Adicionar à tela inicial'.");
      return;
    }

    instalarEvento.prompt();
    await instalarEvento.userChoice;
    setInstalarEvento(null);
  }

  function TelaLogin() {
    return (
      <section style={styles.screenCard}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>⛽</div>
          <div style={styles.logoText}>Fuel Tracker</div>
        </div>

        <form style={styles.formStack}>
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

          <div style={styles.smallLink}>Esqueceu a senha ?</div>

          <button type="button" style={styles.primaryButton} onClick={entrar}>
            Entrar
          </button>
        </form>

        <div style={styles.bottomPlainLink}>Cadastre-se</div>
      </section>
    );
  }

  function TelaVeiculo() {
    return (
      <section style={styles.screenCard}>
        <div style={styles.headerRow}>
          <span style={styles.backArrow}>‹</span>
          <h2 style={styles.headerTitle}>Cadastro do Veículo</h2>
        </div>

        <form style={styles.formStack}>
          <div>
            <label style={styles.label}>Placa:</label>
            <input
              style={styles.input}
              value={vehicle.placa}
              onChange={(e) => setVehicle({ ...vehicle, placa: e.target.value })}
            />
          </div>

          <div>
            <label style={styles.label}>Modelo:</label>
            <input
              style={styles.input}
              value={vehicle.modelo}
              onChange={(e) => setVehicle({ ...vehicle, modelo: e.target.value })}
            />
          </div>

          <div>
            <label style={styles.label}>Ano:</label>
            <input
              style={styles.input}
              value={vehicle.ano}
              onChange={(e) => setVehicle({ ...vehicle, ano: e.target.value })}
            />
          </div>

          <div>
            <label style={styles.label}>Combustível:</label>
            <select
              style={styles.input}
              value={vehicle.combustivel}
              onChange={(e) => setVehicle({ ...vehicle, combustivel: e.target.value })}
            >
              <option>Gasolina</option>
              <option>Etanol</option>
              <option>Flex</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Média Cidade (km/L):</label>
            <input
              style={styles.input}
              value={vehicle.mediaCidade}
              onChange={(e) => setVehicle({ ...vehicle, mediaCidade: e.target.value })}
            />
          </div>

          <div>
            <label style={styles.label}>Potência:</label>
            <input
              style={styles.input}
              value={vehicle.potencia}
              onChange={(e) => setVehicle({ ...vehicle, potencia: e.target.value })}
            />
          </div>

          <button type="button" style={styles.primaryButton} onClick={salvarVeiculo}>
            Salvar
          </button>
        </form>
      </section>
    );
  }

  function TelaAbastecimento() {
    return (
      <section style={styles.screenCard}>
        <div style={styles.headerRow}>
          <span style={styles.backArrow}>‹</span>
          <h2 style={styles.headerTitle}>Registro de Abastecimento</h2>
        </div>

        <div style={styles.topMetricGrid3}>
          <div style={styles.metricCardGreen}>
            <div style={styles.metricLabel}>KM Rodados</div>
            <div style={styles.metricValueSmall}>{Math.round(semanaKm)} km</div>
          </div>

          <div style={styles.metricCardBlue}>
            <div style={styles.metricLabel}>Consumo Médio</div>
            <div style={styles.metricValueSmall}>{numero(resumo.consumoMedio)} km/L</div>
          </div>

          <div style={styles.metricCardBlue}>
            <div style={styles.metricLabel}>Custo por</div>
            <div style={styles.metricValueSmall}>{moeda(resumo.custoPorKm)}</div>
          </div>
        </div>

        <div style={styles.historyList}>
          {enriquecido
            .slice()
            .reverse()
            .map((item) => (
              <div key={item.id} style={styles.historyRow}>
                <div style={styles.historyLeft}>
                  <div style={styles.historyDate}>
                    {dataLabel(item.data)} · {numero(item.litros)} L · {moeda(item.valor)}
                  </div>
                </div>

                <div style={styles.historyRight}>
                  {item.kmRodados > 0 ? `${Math.round(item.kmRodados)} km` : `${item.kmAtual} km`}
                </div>
              </div>
            ))}
        </div>

        <form style={styles.formStackCompact}>
          <input
            style={styles.input}
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="KM Atual"
            value={form.kmAtual}
            onChange={(e) => setForm({ ...form, kmAtual: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Litros"
            value={form.litros}
            onChange={(e) => setForm({ ...form, litros: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Valor"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
          />

          <button type="button" style={styles.primaryButton} onClick={adicionarAbastecimento}>
            + Adicionar Abastecimento
          </button>
        </form>
      </section>
    );
  }

  function TelaAnalise() {
    return (
      <section style={styles.screenCard}>
        <div style={styles.headerRow}>
          <span style={styles.backArrow}>‹</span>
          <h2 style={styles.headerTitle}>Análise de Consumo</h2>
        </div>

        <div style={styles.topMetricGrid2}>
          <div style={styles.metricCardGreen}>
            <div style={styles.metricLabel}>Esta Semana</div>
            <div style={styles.metricValueBig}>{moeda(semanaValor)}</div>
            <div style={styles.metricSub}>{Math.round(semanaKm)} km</div>
          </div>

          <div style={styles.metricCardBlue}>
            <div style={styles.metricLabel}>Este Mês</div>
            <div style={styles.metricValueBig}>{moeda(resumo.totalValor)}</div>
            <div style={styles.metricSub}>{Math.round(resumo.totalKm)} km</div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Desempenho de Consumo</div>

          <div style={styles.chartArea}>
            {grafico.map((valor, index) => (
              <div key={index} style={styles.chartColumnWrap}>
                <div
                  style={{
                    ...styles.chartBar,
                    height: `${Math.max(24, valor * 10)}px`,
                  }}
                />
                <div style={styles.chartDay}>
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][index] || `#${index + 1}`}
                </div>
              </div>
            ))}

            <svg style={styles.chartSvg} viewBox="0 0 320 150" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#42a5ff"
                strokeWidth="3"
                points={grafico
                  .map((valor, index) => `${24 + index * 54},${132 - valor * 8}`)
                  .join(" ")}
              />
            </svg>
          </div>
        </div>

        <div style={styles.bottomMetricGrid2}>
          <div style={styles.bottomMetricCard}>
            <div style={styles.metricLabel}>Média Semanal</div>
            <div style={styles.bottomMetricValue}>{numero(resumo.consumoMedio)} km/L</div>
          </div>

          <div style={styles.bottomMetricCard}>
            <div style={styles.metricLabel}>Custo Semanal</div>
            <div style={styles.bottomMetricValue}>{moeda(semanaValor)}</div>
          </div>
        </div>
      </section>
    );
  }

  function TelaInicio() {
    return (
      <section style={styles.screenCard}>
        <div style={styles.screenTitleBig}>Controle de Combustível</div>
        <div style={styles.screenSub}>Visual escuro, exclusivo e responsivo com estilo mobile</div>

        <div style={styles.topMetricGrid4}>
          <div style={styles.metricCardBlue}>
            <div style={styles.metricLabel}>Gastos da Vida</div>
            <div style={styles.metricValueBig}>{moeda(resumo.totalValor)}</div>
          </div>

          <div style={styles.metricCardBlue}>
            <div style={styles.metricLabel}>KM Rodados</div>
            <div style={styles.metricValueBig}>{Math.round(resumo.totalKm)} km</div>
          </div>

          <div style={styles.metricCardBlue}>
            <div style={styles.metricLabel}>Consumo Médio</div>
            <div style={styles.metricValueBig}>{numero(resumo.consumoMedio)} km/L</div>
          </div>

          <div style={styles.metricCardBlue}>
            <div style={styles.metricLabel}>Economia</div>
            <div style={styles.metricValueBig}>82%</div>
          </div>
        </div>

        <div style={styles.chartCardLarge}>
          <div style={styles.chartTitle}>Desempenho Semanal</div>
          <div style={styles.chartLineBarMix}>
            {grafico.map((valor, index) => (
              <div key={index} style={styles.chartColumnWrap}>
                <div style={{ ...styles.miniBlueBar, width: "100%" }} />
                <div style={styles.chartDay}>
                  {["SEG", "TER", "QUA", "QUI", "SEX", "SAB"][index] || `#${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.bottomMetricGrid2}>
          <div style={styles.bottomMetricCard}>
            <div style={styles.metricLabel}>Último Abastecimento</div>
            <div style={styles.bottomMetricValue}>{ultimo ? `${Math.round(ultimo.litros)} L` : "--"}</div>
            <div style={styles.metricSub}>{ultimo ? dataLabel(ultimo.data) : "sem dados"}</div>
          </div>

          <div style={styles.bottomMetricCard}>
            <div style={styles.metricLabel}>Custo por KM</div>
            <div style={styles.bottomMetricValue}>{moeda(resumo.custoPorKm)}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.mobileShell}>
        <div style={styles.mobileFrame}>
          {mensagem && <div style={styles.alerta}>{mensagem}</div>}

          {aba === "login" && <TelaLogin />}
          {aba === "inicio" && <TelaInicio />}
          {aba === "veiculo" && <TelaVeiculo />}
          {aba === "abastecimento" && <TelaAbastecimento />}
          {aba === "analise" && <TelaAnalise />}

          {aba !== "login" && (
            <>
              <div style={styles.actionsRow}>
                <button style={styles.secondaryButton} onClick={instalarApp}>
                  Instalar app
                </button>
                <button style={styles.dangerButton} onClick={limparTudo}>
                  Limpar dados
                </button>
              </div>

              <nav style={styles.bottomNav}>
                <button
                  style={aba === "inicio" ? styles.navActive : styles.navBtn}
                  onClick={() => setAba("inicio")}
                >
                  Início
                </button>

                <button
                  style={aba === "veiculo" ? styles.navActive : styles.navBtn}
                  onClick={() => setAba("veiculo")}
                >
                  Veículo
                </button>

                <button
                  style={aba === "abastecimento" ? styles.navActive : styles.navBtn}
                  onClick={() => setAba("abastecimento")}
                >
                  Abastecimento
                </button>

                <button
                  style={aba === "analise" ? styles.navActive : styles.navBtn}
                  onClick={() => setAba("analise")}
                >
                  Histórico
                </button>
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
    background: "radial-gradient(circle at top, #0b1d38 0%, #07101f 55%, #03070d 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  mobileShell: {
    width: "100%",
    maxWidth: "390px",
  },
  mobileFrame: {
    minHeight: "820px",
    borderRadius: "34px",
    background: "linear-gradient(180deg, #08111f 0%, #0a1630 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
    overflow: "hidden",
    padding: "18px",
    position: "relative",
  },
  screenCard: {
    borderRadius: "22px",
    background: "linear-gradient(180deg, rgba(15,28,52,0.98) 0%, rgba(10,19,35,0.98) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "18px",
    minHeight: "680px",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "42px",
    marginTop: "8px",
  },
  logoIcon: {
    fontSize: "30px",
  },
  logoText: {
    color: "#f2f6ff",
    fontSize: "16px",
    fontWeight: 700,
  },
  formStack: {
    display: "grid",
    gap: "14px",
    marginTop: "18px",
  },
  formStackCompact: {
    display: "grid",
    gap: "10px",
    marginTop: "18px",
  },
  label: {
    display: "block",
    color: "#d9e3f8",
    fontSize: "13px",
    marginBottom: "6px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f7f9fe",
    padding: "12px 12px",
    fontSize: "14px",
    outline: "none",
  },
  smallLink: {
    textAlign: "right",
    color: "#98abd0",
    fontSize: "12px",
    marginTop: "-4px",
  },
  bottomPlainLink: {
    textAlign: "center",
    color: "#9db3da",
    marginTop: "120px",
    fontSize: "14px",
  },
  primaryButton: {
    marginTop: "4px",
    border: 0,
    borderRadius: "10px",
    padding: "13px 16px",
    background: "linear-gradient(180deg, #2e80f8 0%, #1359d4 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(34,103,255,0.35)",
  },
  secondaryButton: {
    border: "1px solid rgba(83,162,255,0.25)",
    borderRadius: "10px",
    padding: "11px 12px",
    background: "rgba(255,255,255,0.03)",
    color: "#dce6fa",
    fontWeight: 600,
    cursor: "pointer",
  },
  dangerButton: {
    border: "1px solid rgba(255,120,120,0.25)",
    borderRadius: "10px",
    padding: "11px 12px",
    background: "rgba(255,80,80,0.06)",
    color: "#ffd0d0",
    fontWeight: 600,
    cursor: "pointer",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },
  backArrow: {
    color: "#f4f7ff",
    fontSize: "28px",
    lineHeight: 1,
  },
  headerTitle: {
    margin: 0,
    color: "#f5f8ff",
    fontSize: "21px",
    fontWeight: 700,
  },
  screenTitleBig: {
    color: "#f4f8ff",
    fontWeight: 700,
    fontSize: "22px",
    marginBottom: "4px",
  },
  screenSub: {
    color: "#8ea2c7",
    fontSize: "11px",
    marginBottom: "14px",
  },
  topMetricGrid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginBottom: "14px",
  },
  topMetricGrid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "14px",
  },
  topMetricGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginBottom: "16px",
  },
  metricCardBlue: {
    borderRadius: "12px",
    padding: "10px",
    background: "linear-gradient(180deg, rgba(20,35,62,0.98) 0%, rgba(12,24,45,0.98) 100%)",
    border: "1px solid rgba(83,162,255,0.18)",
    boxShadow: "inset 0 -3px 0 rgba(62,151,255,0.55)",
  },
  metricCardGreen: {
    borderRadius: "12px",
    padding: "10px",
    background: "linear-gradient(180deg, rgba(20,54,45,0.98) 0%, rgba(12,35,30,0.98) 100%)",
    border: "1px solid rgba(64,220,150,0.2)",
    boxShadow: "inset 0 -3px 0 rgba(51,224,147,0.58)",
  },
  metricLabel: {
    color: "#9db0d3",
    fontSize: "10px",
    marginBottom: "6px",
  },
  metricValueBig: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: 1.1,
  },
  metricValueSmall: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "15px",
    lineHeight: 1.15,
  },
  metricSub: {
    color: "#a7b9dc",
    fontSize: "11px",
    marginTop: "4px",
  },
  chartCard: {
    borderRadius: "16px",
    background: "rgba(7,14,26,0.75)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "14px",
    marginBottom: "16px",
  },
  chartCardLarge: {
    borderRadius: "16px",
    background: "rgba(7,14,26,0.75)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "14px",
    marginBottom: "16px",
    minHeight: "220px",
  },
  chartTitle: {
    color: "#f6f9ff",
    fontWeight: 700,
    fontSize: "15px",
    marginBottom: "12px",
  },
  chartArea: {
    position: "relative",
    height: "220px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "8px",
    paddingTop: "18px",
    backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "100% 36px",
  },
  chartLineBarMix: {
    height: "150px",
    display: "flex",
    alignItems: "flex-end",
    gap: "6px",
    backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "100% 30px",
  },
  chartColumnWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 2,
    height: "100%",
  },
  chartBar: {
    width: "20px",
    borderRadius: "8px 8px 0 0",
    background: "linear-gradient(180deg, #63e39b 0%, #2e9f67 100%)",
    boxShadow: "0 10px 20px rgba(40,170,110,0.2)",
  },
  miniBlueBar: {
    height: "6px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #2d84ff 0%, #4ba7ff 100%)",
  },
  chartDay: {
    marginTop: "8px",
    color: "#8ea5c9",
    fontSize: "10px",
  },
  chartSvg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },
  historyList: {
    display: "grid",
    gap: "8px",
    marginBottom: "16px",
  },
  historyRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 10px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  historyLeft: {
    minWidth: 0,
  },
  historyDate: {
    color: "#f6f8ff",
    fontSize: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  historyRight: {
    color: "#c5d6f5",
    fontWeight: 700,
    fontSize: "12px",
  },
  bottomMetricGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  bottomMetricCard: {
    borderRadius: "14px",
    padding: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  bottomMetricValue: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    marginTop: "4px",
  },
  actionsRow: {
    marginTop: "10px",
    marginBottom: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  bottomNav: {
    marginTop: "8px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    borderRadius: "16px",
    padding: "10px",
    background: "rgba(5,11,20,0.92)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  navBtn: {
    border: 0,
    borderRadius: "10px",
    padding: "10px 6px",
    background: "transparent",
    color: "#8ea4c9",
    fontSize: "11px",
    cursor: "pointer",
  },
  navActive: {
    border: 0,
    borderRadius: "10px",
    padding: "10px 6px",
    background: "linear-gradient(180deg, rgba(36,77,145,0.95) 0%, rgba(17,44,88,0.95) 100%)",
    color: "#ffffff",
    fontSize: "11px",
    cursor: "pointer",
  },
  alerta: {
    marginBottom: "10px",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "rgba(77,163,255,0.10)",
    border: "1px solid rgba(77,163,255,0.18)",
    color: "#d7e7ff",
    fontSize: "12px",
  },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  input::placeholder { color: #7d93b8; }
  select { appearance: none; }
`;
