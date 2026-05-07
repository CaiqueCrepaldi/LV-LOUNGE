import { useState } from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

type TabType = 'diario' | 'semanal';

export default function Relatorios() {
  const { vendasDiarias, vendasSemanais } = useApp();
  const [tab, setTab] = useState<TabType>('diario');

  const maxDiario = Math.max(...vendasDiarias.map(d => d.quantidade));
  const maxSemanal = Math.max(...vendasSemanais.map(d => d.lucro));
  const totalDiario = vendasDiarias.reduce((s, d) => s + d.total, 0);
  const mediaLucro = vendasSemanais.reduce((s, d) => s + d.lucro, 0) / vendasSemanais.length;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Relatórios</div>
        <div className="page-subtitle">Análise de vendas diárias e semanais</div>
      </div>

      <div className="tab-bar">
        <div className={`tab${tab === 'diario' ? ' active' : ''}`} onClick={() => setTab('diario')}>
          Relatório Diário
        </div>
        <div className={`tab${tab === 'semanal' ? ' active' : ''}`} onClick={() => setTab('semanal')}>
          Relatório Semanal
        </div>
      </div>

      {tab === 'diario' && (
        <div>
          <div className="grid-2">
            <div className="card">
              <div className="card-title">
                <span><BarChart2 size={14} style={{ display: 'inline', marginRight: 6 }} />Produtos mais vendidos — Hoje</span>
              </div>
              <div className="bar-chart" style={{ height: 120 }}>
                {vendasDiarias.map((d, i) => {
                  const h = Math.max(8, (d.quantidade / maxDiario) * 100);
                  return (
                    <div className="bar-group" key={d.produto}>
                      <div
                        className={`bar ${i === 0 ? 'bar-peak' : i < 3 ? 'bar-primary' : 'bar-pale'}`}
                        style={{ height: `${h}%` }}
                        title={`${d.produto}: ${d.quantidade} un · R$${d.total.toLocaleString()}`}
                      />
                      <span className="bar-label" style={{ fontSize: 8 }}>
                        {d.produto.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                Total vendido: R${totalDiario.toLocaleString()}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Análise do dia</div>
              <div className="alert-list">
                <div className="alert-item alert-danger">
                  <BarChart2 size={15} />
                  <div>
                    <strong>Sexta:</strong> após análises, o produto <strong>Ballena</strong> foi o mais vendido.
                  </div>
                </div>
                <div className="alert-item alert-warn">
                  <BarChart2 size={15} />
                  <div>
                    <strong>Sábado:</strong> após análises, a <strong>Porção de Tilápia</strong> foi o mais vendido.
                  </div>
                </div>
                <div className="alert-item alert-success">
                  <BarChart2 size={15} />
                  <div>
                    <strong>Domingo:</strong> após análises, o produto <strong>Redbull</strong> foi o mais vendido.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela detalhada */}
          <div className="card">
            <div className="card-title">Detalhamento por produto</div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Produto</th><th>Qtd. vendida</th><th>Total R$</th><th>Participação</th></tr>
                </thead>
                <tbody>
                  {vendasDiarias.map((d, i) => {
                    const pct = ((d.total / totalDiario) * 100).toFixed(1);
                    return (
                      <tr key={d.produto}>
                        <td style={{ fontWeight: i === 0 ? 700 : 400 }}>
                          {i === 0 && <span className="badge badge-amber" style={{ marginRight: 6 }}>🏆 Top</span>}
                          {d.produto}
                        </td>
                        <td>{d.quantidade} un</td>
                        <td style={{ fontWeight: 500 }}>R${d.total.toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'var(--blue-pale)', borderRadius: 3 }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--blue)', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 32 }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'semanal' && (
        <div>
          <div className="grid-2">
            <div className="card">
              <div className="card-title">
                <span><TrendingUp size={14} style={{ display: 'inline', marginRight: 6 }} />Lucro semanal (R$)</span>
              </div>
              <div className="bar-chart" style={{ height: 120 }}>
                {vendasSemanais.map((d, i) => {
                  const h = Math.max(8, (d.lucro / maxSemanal) * 100);
                  const isPeak = d.lucro === maxSemanal;
                  return (
                    <div className="bar-group" key={d.dia}>
                      <div
                        className={`bar ${isPeak ? 'bar-peak' : i >= 4 ? 'bar-primary' : 'bar-pale'}`}
                        style={{ height: `${h}%` }}
                        title={`${d.dia}: R$${d.lucro.toLocaleString()}`}
                      />
                      <span className="bar-label">{d.dia}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Total: R${vendasSemanais.reduce((s, d) => s + d.lucro, 0).toLocaleString()}</span>
                <span>Pico: Sábado</span>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Análise semanal</div>
              <div className="alert-list">
                <div className="alert-item alert-info">
                  <TrendingUp size={15} />
                  <div>
                    <strong>Lucro semanal:</strong> na primeira semana de novembro houve uma pequena baixa comparado a julho, porém sem prejuízos.
                  </div>
                </div>
                <div className="alert-item alert-warn">
                  <BarChart2 size={15} />
                  <div>
                    <strong>Produtos destaque:</strong> Ballena, Combo Whisky, Porção de Batata e Redbull Tradicional foram os mais vendidos.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Resumo por dia</div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Dia</th><th>Lucro</th><th>Qtd. produtos</th><th>Vs. média semanal</th></tr>
                </thead>
                <tbody>
                  {vendasSemanais.map(d => {
                    const delta = ((d.lucro - mediaLucro) / mediaLucro * 100).toFixed(0);
                    const positivo = Number(delta) >= 0;
                    return (
                      <tr key={d.dia}>
                        <td style={{ fontWeight: 500 }}>{d.dia}</td>
                        <td style={{ fontWeight: 600 }}>R${d.lucro.toLocaleString()}</td>
                        <td>{d.produtos} un</td>
                        <td>
                          <span className={`badge ${positivo ? 'badge-green' : 'badge-red'}`}>
                            {positivo ? '↑' : '↓'} {Math.abs(Number(delta))}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
