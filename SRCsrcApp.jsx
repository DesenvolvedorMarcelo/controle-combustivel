import { useState } from "react";

export default function App() {
  const [dados, setDados] = useState([]);
  const [km, setKm] = useState("");
  const [litros, setLitros] = useState("");
  const [valor, setValor] = useState("");

  function adicionar() {
    if (!km || !litros || !valor) return;

    const novo = {
      km: Number(km),
      litros: Number(litros),
      valor: Number(valor)
    };

    setDados([...dados, novo]);
    setKm("");
    setLitros("");
    setValor("");
  }

  function calcularMedia() {
    if (dados.length < 2) return 0;

    let totalKm = 0;
    let totalLitros = 0;

    for (let i = 1; i < dados.length; i++) {
      totalKm += dados[i].km - dados[i - 1].km;
      totalLitros += dados[i].litros;
    }

    return (totalKm / totalLitros).toFixed(2);
  }

  function custoPorKm() {
    if (dados.length < 2) return 0;

    let totalKm = 0;
    let totalValor = 0;

    for (let i = 1; i < dados.length; i++) {
      totalKm += dados[i].km - dados[i - 1].km;
      totalValor += dados[i].valor;
    }

    return (totalValor / totalKm).toFixed(2);
  }

  return (
    <div style={{
      fontFamily: "Arial",
      padding: 20,
      maxWidth: 500,
      margin: "auto"
    }}>
      <h2>🚗 Controle de Combustível</h2>

      <input
        placeholder="KM Atual"
        value={km}
        onChange={(e) => setKm(e.target.value)}
      /><br/><br/>

      <input
        placeholder="Litros"
        value={litros}
        onChange={(e) => setLitros(e.target.value)}
      /><br/><br/>

      <input
        placeholder="Valor (R$)"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      /><br/><br/>

      <button onClick={adicionar}>Adicionar</button>

      <hr/>

      <h3>📊 Resultados</h3>
      <p><b>Consumo médio:</b> {calcularMedia()} km/L</p>
      <p><b>Custo por KM:</b> R$ {custoPorKm()}</p>

      <hr/>

      <h3>📋 Histórico</h3>
      {dados.map((d, i) => (
        <div key={i}>
          KM: {d.km} | Litros: {d.litros} | R$: {d.valor}
        </div>
      ))}
    </div>
  );
}
