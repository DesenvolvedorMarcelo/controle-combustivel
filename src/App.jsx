import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fuel-tracker-pwa-v5";
const USERS_KEY = "fuel-tracker-users-v2";

const vehicleInitial = {
  placa: "",
  modelo: "",
  ano: "",
  combustivel: "Gasolina",
  mediaCidade: "",
  potencia: "",
};

const abastecimentoInicial = {
  data: "",
  kmAtual: "",
  litros: "",
  valor: "",
};

const cadastroInicial = {
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

const redefinirInicial = {
  email: "",
  novaSenha: "",
  confirmarNovaSenha: "",
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

function TelaLogin({
  login,
  setLogin,
  entrar,
  irCadastro,
  irEsqueciSenha,
  mostrarSenhaLogin,
  setMostrarSenhaLogin,
}) {
  return (
    <section style={styles.screenCard}>
      <div style={styles.logoWrap}>
        <div style={styles.logoIcon}>⛽</div>
        <div style={styles.logoText}>Fuel Tracker</div>
      </div>

      <div style={styles.formStack}>
        <input
          style={styles.input}
          placeholder="E-mail"
          value={login.email}
          onChange={(e) => setLogin((prev) => ({ ...prev, email: e.target.value }))}
        />

        <div style={styles.passwordWrap}>
          <input
            style={styles.inputWithButton}
            placeholder="Senha"
            type={mostrarSenhaLogin ? "text" : "password"}
            value={login.senha}
            onChange={(e) => setLogin((prev) => ({ ...prev, senha: e.target.value }))}
          />
          <button
            type="button"
            style={styles.passwordToggle}
            onClick={() => setMostrarSenhaLogin((prev) => !prev)}
          >
            {mostrarSenhaLogin ? "Ocultar" : "Ver"}
          </button>
        </div>

        <button type="button" style={styles.smallLinkButton} onClick={irEsqueciSenha}>
          Esqueceu a senha?
        </button>

        <button type="button" style={styles.primaryButton} onClick={entrar}>
          Entrar
        </button>
      </div>

      <button type="button" style={styles.linkButton} onClick={irCadastro}>
        Cadastre-se
      </button>
    </section>
  );
}

function TelaCadastroUsuario({
  cadastro,
  setCadastro,
  cadastrarUsuario,
  voltarLogin,
  mostrarSenhaCadastro,
  setMostrarSenhaCadastro,
  mostrarConfirmarCadastro,
  setMostrarConfirmarCadastro,
}) {
  return (
    <section style={styles.screenCard}>
      <div style={styles.headerRow}>
        <h2 style={styles.headerTitle}>Cadastro de Usuário</h2>
      </div>

      <div style={styles.scrollArea}>
        <div style={styles.formStack}>
          <div>
            <label style={styles.label}>Nome</label>
            <input
              style={styles.input}
              placeholder="Seu nome"
              value={cadastro.nome}
              onChange={(e) => setCadastro((prev) => ({ ...prev, nome: e.target.value }))}
            />
          </div>

          <div>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              value={cadastro.email}
              onChange={(e) => setCadastro((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label style={styles.label}>Senha</label>
            <div style={styles.passwordWrap}>
              <input
                style={styles.inputWithButton}
                type={mostrarSenhaCadastro ? "text" : "password"}
                placeholder="Digite uma senha"
                value={cadastro.senha}
                onChange={(e) => setCadastro((prev) => ({ ...prev, senha: e.target.value }))}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setMostrarSenhaCadastro((prev) => !prev)}
              >
                {mostrarSenhaCadastro ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div>
            <label style={styles.label}>Confirmar senha</label>
            <div style={styles.passwordWrap}>
              <input
                style={styles.inputWithButton}
                type={mostrarConfirmarCadastro ? "text" : "password"}
                placeholder="Repita a senha"
                value={cadastro.confirmarSenha}
                onChange={(e) =>
                  setCadastro((prev) => ({
                    ...prev,
                    confirmarSenha: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setMostrarConfirmarCadastro((prev) => !prev)}
              >
                {mostrarConfirmarCadastro ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button type="button" style={styles.primaryButton} onClick={cadastrarUsuario}>
            Cadastrar usuário
          </button>

          <button type="button" style={styles.secondaryButton} onClick={voltarLogin}>
            Voltar para login
          </button>
        </div>
      </div>
    </section>
  );
}

function TelaEsqueciSenha({
  redefinirSenha,
  setRedefinirSenha,
  salvarNovaSenha,
  voltarLogin,
  mostrarNovaSenha,
  setMostrarNovaSenha,
  mostrarConfirmarNovaSenha,
  setMostrarConfirmarNovaSenha,
}) {
  return (
    <section style={styles.screenCard}>
      <div style={styles.headerRow}>
        <h2 style={styles.headerTitle}>Redefinir Senha</h2>
      </div>

      <div style={styles.scrollArea}>
        <div style={styles.formStack}>
          <div>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={redefinirSenha.email}
              onChange={(e) =>
                setRedefinirSenha((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label style={styles.label}>Nova senha</label>
            <div style={styles.passwordWrap}>
              <input
                style={styles.inputWithButton}
                type={mostrarNovaSenha ? "text" : "password"}
                placeholder="Digite a nova senha"
                value={redefinirSenha.novaSenha}
                onChange={(e) =>
                  setRedefinirSenha((prev) => ({ ...prev, novaSenha: e.target.value }))
                }
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setMostrarNovaSenha((prev) => !prev)}
              >
                {mostrarNovaSenha ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div>
            <label style={styles.label}>Confirmar nova senha</label>
            <div style={styles.passwordWrap}>
              <input
                style={styles.inputWithButton}
                type={mostrarConfirmarNovaSenha ? "text" : "password"}
                placeholder="Repita a nova senha"
                value={redefinirSenha.confirmarNovaSenha}
                onChange={(e) =>
                  setRedefinirSenha((prev) => ({
                    ...prev,
                    confirmarNovaSenha: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setMostrarConfirmarNovaSenha((prev) => !prev)}
              >
                {mostrarConfirmarNovaSenha ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button type="button" style={styles.primaryButton} onClick={salvarNovaSenha}>
            Salvar nova senha
          </button>

          <button type="button" style={styles.secondaryButton} onClick={voltarLogin}>
            Voltar para login
          </button>
        </div>
      </div>
    </section>
  );
}

function TelaVeiculo({ vehicle, setVehicle, salvarVeiculo }) {
  return (
    <section style={styles.screenCard}>
      <div style={styles.headerRow}>
        <h2 style={styles.headerTitle}>Cadastro do Veículo</h2>
      </div>

      <div style={styles.scrollArea}>
        <div style={styles.formStack}>
          <div>
            <label style={styles.label}>Placa</label>
            <input
              style={styles.input}
              value={vehicle.placa}
              onChange={(e) => setVehicle((prev) => ({ ...prev, placa: e.target.value }))}
            />
          </div>

          <div>
            <label style={styles.label}>Modelo</label>
            <input
              style={styles.input}
              value={vehicle.modelo}
              onChange={(e) => setVehicle((prev) => ({ ...prev, modelo: e.target.value }))}
            />
          </div>

          <div>
            <label style={styles.label}>Ano</label>
            <input
              style={styles.input}
              value={vehicle.ano}
              onChange={(e) => setVehicle((prev) => ({ ...prev, ano: e.target.value }))}
            />
          </div>

          <div>
            <label style={styles.label}>Combustível</label>
            <select
              style={styles.input}
              value={vehicle.combustivel}
              onChange={(e) => setVehicle((prev) => ({ ...prev, combustivel: e.target.value }))}
            >
              <option>Gasolina</option>
              <option>Etanol</option>
              <option>Flex</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Média Cidade (km/L)</label>
            <input
              style={styles.input}
              value={vehicle.mediaCidade}
              onChange={(e) => setVehicle((prev) => ({ ...prev, mediaCidade: e.target.value }))}
            />
          </div>

          <div>
            <label style={styles.label}>Potência</label>
            <input
              style={styles.input}
              value={vehicle.potencia}
              onChange={(e) => setVehicle((prev) => ({ ...prev, potencia: e.target.value }))}
            />
          </div>

          <button type="button" style={styles.primaryButton} onClick={salvarVeiculo}>
            Salvar
          </button>
        </div>
      </div>
    </section>
  );
}

function TelaAbastecimento({
  semanaKm,
  resumo,
  enriquecido,
  form,
  setForm,
  adicionarAbastecimento,
}) {
  return (
    <section style={styles.screenCard}>
      <div style={styles.headerRow}>
        <h2 style={styles.headerTitle}>Registro de Abastecimento</h2>
      </div>

      <div style={styles.scrollArea}>
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

        <div style={styles.formStackCompact}>
          <input
            style={styles.input}
            type="date"
            value={form.data}
            onChange={(e) => setForm((prev) => ({ ...prev, data: e.target.value }))}
          />

          <input
            style={styles.input}
            placeholder="KM Atual"
            value={form.kmAtual}
            onChange={(e) => setForm((prev) => ({ ...prev, kmAtual: e.target.value }))}
          />

          <input
            style={styles.input}
            placeholder="Litros"
            value={form.litros}
            onChange={(e) => setForm((prev) => ({ ...prev, litros: e.target.value }))}
          />

          <input
            style={styles.input}
            placeholder="Valor"
            value={form.valor}
            onChange={(e) => setForm((prev) => ({ ...prev, valor: e.target.value }))}
          />

          <button type="button" style={styles.primaryButton} onClick={adicionarAbastecimento}>
            + Adicionar Abastecimento
          </button>
        </div>
      </div>
    </section>
  );
}

function TelaAnalise({ semanaValor, semanaKm, resumo, grafico }) {
  return (
    <section style={styles.screenCard}>
      <div style={styles.headerRow}>
        <h2 style={styles.headerTitle}>Análise de Consumo</h2>
      </div>

      <div style={styles.scrollArea}>
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
      </div>
    </section>
  );
}

function TelaInicio({ usuarioAtual, resumo, grafico, ultimo }) {
  return (
    <section style={styles.screenCard}>
      <div style={styles.screenTitleBig}>Controle de Combustível</div>
      <div style={styles.screenSub}>
        {usuarioAtual ? `Usuário: ${usuarioAtual.nome}` : "Visual escuro e responsivo"}
      </div>

      <div style={styles.scrollArea}>
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
      </div>
    </section>
  );
}

export default function App() {
  const [aba, setAba] = useState("login");
  const [login, setLogin] = useState({ email: "", senha: "" });
  const [cadastro, setCadastro] = useState(cadastroInicial);
  const [redefinirSenha, setRedefinirSenha] = useState(redefinirInicial);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [vehicle, setVehicle] = useState(vehicleInitial);
  const [form, setForm] = useState(abastecimentoInicial);
  const [historico, setHistorico] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);
  const [mostrarSenhaCadastro, setMostrarSenhaCadastro] = useState(false);
  const [mostrarConfirmarCadastro, setMostrarConfirmarCadastro] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarNovaSenha, setMostrarConfirmarNovaSenha] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      if (!bruto) return;
      const dados = JSON.parse(bruto);

      if (dados?.vehicle) setVehicle(dados.vehicle);
      if (Array.isArray(dados?.historico)) setHistorico(dados.historico);
      if (dados?.login) setLogin(dados.login);
      if (dados?.aba) setAba(dados.aba);
      if (dados?.usuarioAtual) setUsuarioAtual(dados.usuarioAtual);
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
        usuarioAtual,
      })
    );
  }, [vehicle, historico, login, aba, usuarioAtual]);

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
    const totalValor = historico.reduce((soma, item) => soma + Number(item.valor || 0), 0);
    const totalLitros = historico.reduce((soma, item) => soma + Number(item.litros || 0), 0);
    const totalKm = validos.reduce((soma, item) => soma + Number(item.kmRodados || 0), 0);
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
  const semanaValor = historico.slice(-2).reduce((soma, item) => soma + Number(item.valor || 0), 0);
  const semanaKm = validos.slice(-2).reduce((soma, item) => soma + Number(item.kmRodados || 0), 0);

  function obterUsuarios() {
    try {
      const usuarios = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return Array.isArray(usuarios) ? usuarios : [];
    } catch {
      return [];
    }
  }

  function salvarUsuarios(usuarios) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
  }

  function entrar() {
    if (!login.email || !login.senha) {
      setMensagem("Preencha e-mail e senha.");
      return;
    }

    const usuarios = obterUsuarios();
    const usuario = usuarios.find(
      (item) =>
        item.email.trim().toLowerCase() === login.email.trim().toLowerCase() &&
        item.senha === login.senha
    );

    if (!usuario) {
      setMensagem("Usuário ou senha inválidos.");
      return;
    }

    setUsuarioAtual({
      nome: usuario.nome,
      email: usuario.email,
    });
    setAba("inicio");
    setMensagem(`Bem-vindo, ${usuario.nome}.`);
  }

  function cadastrarUsuario() {
    if (!cadastro.nome || !cadastro.email || !cadastro.senha || !cadastro.confirmarSenha) {
      setMensagem("Preencha todos os campos do cadastro.");
      return;
    }

    if (cadastro.senha !== cadastro.confirmarSenha) {
      setMensagem("As senhas não conferem.");
      return;
    }

    const usuarios = obterUsuarios();
    const emailJaExiste = usuarios.some(
      (item) => item.email.trim().toLowerCase() === cadastro.email.trim().toLowerCase()
    );

    if (emailJaExiste) {
      setMensagem("Já existe um usuário com esse e-mail.");
      return;
    }

    const novoUsuario = {
      id: Date.now(),
      nome: cadastro.nome.trim(),
      email: cadastro.email.trim(),
      senha: cadastro.senha,
    };

    salvarUsuarios([...usuarios, novoUsuario]);

    setLogin({
      email: novoUsuario.email,
      senha: novoUsuario.senha,
    });
    setCadastro(cadastroInicial);
    setAba("login");
    setMensagem("Usuário cadastrado com sucesso. Agora entre com seu login.");
  }

  function salvarNovaSenha() {
    if (
      !redefinirSenha.email ||
      !redefinirSenha.novaSenha ||
      !redefinirSenha.confirmarNovaSenha
    ) {
      setMensagem("Preencha todos os campos para redefinir a senha.");
      return;
    }

    if (redefinirSenha.novaSenha !== redefinirSenha.confirmarNovaSenha) {
      setMensagem("As novas senhas não conferem.");
      return;
    }

    const usuarios = obterUsuarios();
    const indiceUsuario = usuarios.findIndex(
      (item) =>
        item.email.trim().toLowerCase() === redefinirSenha.email.trim().toLowerCase()
    );

    if (indiceUsuario === -1) {
      setMensagem("E-mail não encontrado.");
      return;
    }

    usuarios[indiceUsuario] = {
      ...usuarios[indiceUsuario],
      senha: redefinirSenha.novaSenha,
    };

    salvarUsuarios(usuarios);

    setLogin({
      email: redefinirSenha.email,
      senha: redefinirSenha.novaSenha,
    });
    setRedefinirSenha(redefinirInicial);
    setAba("login");
    setMensagem("Senha atualizada com sucesso.");
  }

  function sair() {
    setUsuarioAtual(null);
    setAba("login");
    setMensagem("Login mantido salvo para facilitar o próximo acesso.");
  }

  function salvarVeiculo() {
    setMensagem("Veículo salvo com sucesso no aplicativo.");
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
    setCadastro(cadastroInicial);
    setRedefinirSenha(redefinirInicial);
    setUsuarioAtual(null);
    setForm(abastecimentoInicial);
    setAba("login");
    setMensagem("Dados apagados.");
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.mobileShell}>
        <div style={styles.mobileFrame}>
          {mensagem && <div style={styles.alerta}>{mensagem}</div>}

          {aba === "login" && (
            <TelaLogin
              login={login}
              setLogin={setLogin}
              entrar={entrar}
              irCadastro={() => setAba("cadastro-usuario")}
              irEsqueciSenha={() => setAba("esqueci-senha")}
              mostrarSenhaLogin={mostrarSenhaLogin}
              setMostrarSenhaLogin={setMostrarSenhaLogin}
            />
          )}

          {aba === "cadastro-usuario" && (
            <TelaCadastroUsuario
              cadastro={cadastro}
              setCadastro={setCadastro}
              cadastrarUsuario={cadastrarUsuario}
              voltarLogin={() => setAba("login")}
              mostrarSenhaCadastro={mostrarSenhaCadastro}
              setMostrarSenhaCadastro={setMostrarSenhaCadastro}
              mostrarConfirmarCadastro={mostrarConfirmarCadastro}
              setMostrarConfirmarCadastro={setMostrarConfirmarCadastro}
            />
          )}

          {aba === "esqueci-senha" && (
            <TelaEsqueciSenha
              redefinirSenha={redefinirSenha}
              setRedefinirSenha={setRedefinirSenha}
              salvarNovaSenha={salvarNovaSenha}
              voltarLogin={() => setAba("login")}
              mostrarNovaSenha={mostrarNovaSenha}
              setMostrarNovaSenha={setMostrarNovaSenha}
              mostrarConfirmarNovaSenha={mostrarConfirmarNovaSenha}
              setMostrarConfirmarNovaSenha={setMostrarConfirmarNovaSenha}
            />
          )}

          {aba === "inicio" && (
            <TelaInicio
              usuarioAtual={usuarioAtual}
              resumo={resumo}
              grafico={grafico}
              ultimo={ultimo}
            />
          )}

          {aba === "veiculo" && (
            <TelaVeiculo
              vehicle={vehicle}
              setVehicle={setVehicle}
              salvarVeiculo={salvarVeiculo}
            />
          )}

          {aba === "abastecimento" && (
            <TelaAbastecimento
              semanaKm={semanaKm}
              resumo={resumo}
              enriquecido={enriquecido}
              form={form}
              setForm={setForm}
              adicionarAbastecimento={adicionarAbastecimento}
            />
          )}

          {aba === "analise" && (
            <TelaAnalise
              semanaValor={semanaValor}
              semanaKm={semanaKm}
              resumo={resumo}
              grafico={grafico}
            />
          )}

          {aba !== "login" && aba !== "cadastro-usuario" && aba !== "esqueci-senha" && (
            <>
              <div style={styles.actionsRow}>
                <button style={styles.secondaryButton} onClick={sair}>
                  Sair
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
    padding: "10px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  mobileShell: {
    width: "100%",
    maxWidth: "390px",
  },
  mobileFrame: {
    height: "100dvh",
    maxHeight: "860px",
    borderRadius: "28px",
    background: "linear-gradient(180deg, #08111f 0%, #0a1630 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
    overflow: "hidden",
    padding: "12px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  screenCard: {
    borderRadius: "18px",
    background: "linear-gradient(180deg, rgba(15,28,52,0.98) 0%, rgba(10,19,35,0.98) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "12px",
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "2px",
    paddingBottom: "10px",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "22px",
    marginTop: "4px",
  },
  logoIcon: {
    fontSize: "26px",
  },
  logoText: {
    color: "#f2f6ff",
    fontSize: "18px",
    fontWeight: 700,
  },
  formStack: {
    display: "grid",
    gap: "10px",
    marginTop: "8px",
  },
  formStackCompact: {
    display: "grid",
    gap: "8px",
    marginTop: "12px",
  },
  label: {
    display: "block",
    color: "#d9e3f8",
    fontSize: "12px",
    marginBottom: "5px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f7f9fe",
    padding: "11px 12px",
    fontSize: "14px",
    outline: "none",
  },
  passwordWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  inputWithButton: {
    flex: 1,
    maxWidth: "100%",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f7f9fe",
    padding: "11px 12px",
    fontSize: "14px",
    outline: "none",
  },
  passwordToggle: {
    border: "1px solid rgba(83,162,255,0.25)",
    borderRadius: "10px",
    padding: "11px 8px",
    background: "rgba(255,255,255,0.03)",
    color: "#dce6fa",
    fontWeight: 600,
    cursor: "pointer",
    minWidth: "62px",
    fontSize: "11px",
  },
  smallLinkButton: {
    textAlign: "right",
    color: "#98abd0",
    fontSize: "12px",
    marginTop: "-2px",
    background: "transparent",
    border: 0,
    cursor: "pointer",
    padding: 0,
  },
  linkButton: {
    marginTop: "auto",
    width: "100%",
    background: "transparent",
    border: 0,
    color: "#9db3da",
    fontSize: "14px",
    cursor: "pointer",
    paddingTop: "18px",
  },
  primaryButton: {
    marginTop: "2px",
    border: 0,
    borderRadius: "10px",
    padding: "12px 14px",
    background: "linear-gradient(180deg, #2e80f8 0%, #1359d4 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(34,103,255,0.35)",
  },
  secondaryButton: {
    border: "1px solid rgba(83,162,255,0.25)",
    borderRadius: "10px",
    padding: "10px 10px",
    background: "rgba(255,255,255,0.03)",
    color: "#dce6fa",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "12px",
  },
  dangerButton: {
    border: "1px solid rgba(255,120,120,0.25)",
    borderRadius: "10px",
    padding: "10px 10px",
    background: "rgba(255,80,80,0.06)",
    color: "#ffd0d0",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "12px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    flexShrink: 0,
  },
  headerTitle: {
    margin: 0,
    color: "#f5f8ff",
    fontSize: "20px",
    fontWeight: 700,
  },
  screenTitleBig: {
    color: "#f4f8ff",
    fontWeight: 700,
    fontSize: "21px",
    marginBottom: "4px",
    flexShrink: 0,
  },
  screenSub: {
    color: "#8ea2c7",
    fontSize: "11px",
    marginBottom: "12px",
    flexShrink: 0,
  },
  topMetricGrid4: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
    marginBottom: "12px",
  },
  topMetricGrid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "6px",
    marginBottom: "12px",
  },
  topMetricGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
    marginBottom: "12px",
  },
  metricCardBlue: {
    borderRadius: "12px",
    padding: "9px",
    background: "linear-gradient(180deg, rgba(20,35,62,0.98) 0%, rgba(12,24,45,0.98) 100%)",
    border: "1px solid rgba(83,162,255,0.18)",
    boxShadow: "inset 0 -3px 0 rgba(62,151,255,0.55)",
    minWidth: 0,
  },
  metricCardGreen: {
    borderRadius: "12px",
    padding: "9px",
    background: "linear-gradient(180deg, rgba(20,54,45,0.98) 0%, rgba(12,35,30,0.98) 100%)",
    border: "1px solid rgba(64,220,150,0.2)",
    boxShadow: "inset 0 -3px 0 rgba(51,224,147,0.58)",
    minWidth: 0,
  },
  metricLabel: {
    color: "#9db0d3",
    fontSize: "10px",
    marginBottom: "5px",
  },
  metricValueBig: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "15px",
    lineHeight: 1.1,
    wordBreak: "break-word",
  },
  metricValueSmall: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "13px",
    lineHeight: 1.15,
    wordBreak: "break-word",
  },
  metricSub: {
    color: "#a7b9dc",
    fontSize: "10px",
    marginTop: "4px",
  },
  chartCard: {
    borderRadius: "14px",
    background: "rgba(7,14,26,0.75)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "12px",
    marginBottom: "12px",
  },
  chartCardLarge: {
    borderRadius: "14px",
    background: "rgba(7,14,26,0.75)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "12px",
    marginBottom: "12px",
    minHeight: "200px",
  },
  chartTitle: {
    color: "#f6f9ff",
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "10px",
  },
  chartArea: {
    position: "relative",
    height: "210px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "6px",
    paddingTop: "16px",
    backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "100% 34px",
  },
  chartLineBarMix: {
    height: "140px",
    display: "flex",
    alignItems: "flex-end",
    gap: "6px",
    backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "100% 28px",
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
    width: "18px",
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
    marginTop: "7px",
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
    gap: "7px",
    marginBottom: "12px",
  },
  historyRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "11px 9px",
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
    gap: "8px",
  },
  bottomMetricCard: {
    borderRadius: "12px",
    padding: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  bottomMetricValue: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "4px",
  },
  actionsRow: {
    marginTop: "8px",
    marginBottom: "8px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px",
    flexShrink: 0,
  },
  bottomNav: {
    marginTop: "4px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "6px",
    borderRadius: "14px",
    padding: "8px",
    background: "rgba(5,11,20,0.92)",
    border: "1px solid rgba(255,255,255,0.07)",
    flexShrink: 0,
  },
  navBtn: {
    border: 0,
    borderRadius: "10px",
    padding: "9px 4px",
    background: "transparent",
    color: "#8ea4c9",
    fontSize: "11px",
    cursor: "pointer",
  },
  navActive: {
    border: 0,
    borderRadius: "10px",
    padding: "9px 4px",
    background: "linear-gradient(180deg, rgba(36,77,145,0.95) 0%, rgba(17,44,88,0.95) 100%)",
    color: "#ffffff",
    fontSize: "11px",
    cursor: "pointer",
  },
  alerta: {
    marginBottom: "8px",
    padding: "9px 10px",
    borderRadius: "12px",
    background: "rgba(77,163,255,0.10)",
    border: "1px solid rgba(77,163,255,0.18)",
    color: "#d7e7ff",
    fontSize: "12px",
    flexShrink: 0,
  },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  html, body, #root { min-height: 100%; }
  input::placeholder { color: #7d93b8; }
  select { appearance: none; }
`;
