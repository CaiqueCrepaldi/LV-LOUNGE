import { useState } from 'react';
import { BarChart2, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Turno, UserRole } from '../types';

type TabType = 'diario' | 'semanal' | 'funcionarios';

const cargoLabels: Record<UserRole, string> = {
  gerente: 'Gerente', barman: 'Barman', garcom: 'Garçom', cozinheiro: 'Cozinheiro',
};
const turnoLabels: Record<Turno, string> = {
  tarde: 'Tarde (12h–18h)', noite: 'Noite (18h–00h)', madrugada: 'Madrugada (00h–06h)',
};
const turnoBadge: Record<Turno, string> = {
  tarde: 'badge-amber', noite: 'badge-blue', madrugada: 'badge-gray',
};

const DIAS_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function Relatorios() {
  const { vendasDiarias, vendasSemanais, vendas, funcionarios } = useApp();
  const [tab, setTab] = useState<TabType>('diario');

  const hoje = new Date();
  const hojeISO = hoje.toISOString().slice(0, 10);

  // ── Dados diários: deriva das vendas reais de hoje ─────────────
  const vendasHoje = vendas.filter(v => v.data === hojeISO && v.status !== 'cancelada');
  const prodMapDiario: Record<string, { quantidade: number; total: number }> = {};
  vendasHoje.forEach(v =>
    v.itens.forEach(i => {
      if (!prodMapDiario[i.descricao]) prodMapDiario[i.descricao] = { quantidade: 0, total: 0 };
      prodMapDiario[i.descricao].quantidade += i.quantidade;
      prodMapDiario[i.descricao].total += i.precoUnitario * i.quantidade;
    })
  );
  const dadosDiariosReais = Object.entries(prodMapDiario)
    .map(([produto, v]) => ({ produto, ...v }))
    .sort((a, b) => b.total - a.total);

  // Cai no mock se ainda não houve vendas hoje
  const dadosDiarios = dadosDiariosReais.length > 0 ? dadosDiariosReais : vendasDiarias;
  const totalDiario = dadosDiarios.reduce((s, d) => s + d.total, 0);
  const maxDiario = Math.max(...dadosDiarios.map(d => d.quantidade), 1);
  const temDadosReaisHoje = dadosDiariosReais.length > 0;

  // ── Dados semanais: mock como base + vendas reais desta semana ─
  const diaDaSemana = hoje.getDay();
  const offsetSegunda = diaDaSemana === 0 ? 6 : diaDaSemana - 1;
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - offsetSegunda);
  inicioSemana.setHours(0, 0, 0, 0);

  const semanalReal: Record<string, { lucro: number; produtos: number }> = {};
  vendas
    .filter(v => new Date(v.data + 'T00:00:00') >= inicioSemana && v.status !== 'cancelada')
    .forEach(v => {
      const dia = DIAS_ABREV[new Date(v.data + 'T00:00:00').getDay()];
      if (!semanalReal[dia]) semanalReal[dia] = { lucro: 0, produtos: 0 };
      semanalReal[dia].lucro += v.total;
      semanalReal[dia].produtos += v.itens.reduce((s, i) => s + i.quantidade, 0);
    });

  const dadosSemanais = vendasSemanais.map(d => ({
    ...d,
    lucro: d.lucro + (semanalReal[d.dia]?.lucro ?? 0),
    produtos: d.produtos + (semanalReal[d.dia]?.produtos ?? 0),
  }));

  const maxSemanal = Math.max(...dadosSemanais.map(d => d.lucro), 1);
  const totalSemanal = dadosSemanais.reduce((s, d) => s + d.lucro, 0);
  const mediaLucro = totalSemanal / dadosSemanais.length;
  const picoDia = dadosSemanais.reduce((top, d) => d.lucro > top.lucro ? d : top, dadosSemanais[0]);

  // ── Por funcionário ────────────────────────────────────────────
  const vendorStats = Object.values(
    vendas.reduce((acc, v) => {
      const key = v.funcionarioId;
      if (!acc[key]) acc[key] = { funcionarioId: key, nome: v.funcionarioNome, comandas: 0, total: 0, itens: 0 };
      acc[key].comandas += 1;
      acc[key].total += v.total;
      acc[key].itens += v.itens.reduce((s, i) => s + i.quantidade, 0);
      return acc;
    }, {} as Record<string, { funcionarioId: string; nome: string; comandas: number; total: number; itens: number }>)
  ).sort((a, b) => b.total - a.total);

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
        <div className={`tab${tab === 'funcionarios' ? ' active' : ''}`} onClick={() => setTab('funcionarios')}>
          Por Funcionário
        </div>
      </div>

      {tab === 'diario' && (
        <div>
          <div className="grid-2">
            <div className="card">
              <div className="card-title">
                <span><BarChart2 size={14} style={{ display: 'inline', marginRight: 6 }} />Produtos mais vendidos — Hoje</span>
              </div>
              {dadosDiarios.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  Nenhuma venda registrada hoje.
                </div>
              ) : (
                <div className="bar-chart" style={{ height: 120 }}>
                  {dadosDiarios.map((d, i) => {
                    const h = Math.max(8, (d.quantidade / maxDiario) * 100);
                    return (
                      <div className="bar-group" key={d.produto}>
                        <div
                          className={`bar ${i === 0 ? 'bar-peak' : i < 3 ? 'bar-primary' : 'bar-pale'}`}
                          style={{ height: `${h}%` }}
                          title={`${d.produto}: ${d.quantidade} un · R$${d.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        />
                        <span className="bar-label" style={{ fontSize: 8 }}>
                          {d.produto.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total vendido: R${totalDiario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                {!temDadosReaisHoje && <span style={{ fontStyle: 'italic' }}>dados históricos</span>}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Análise do dia</div>
              {temDadosReaisHoje ? (
                <div className="alert-list">
                  {dadosDiariosReais.slice(0, 3).map((d, i) => (
                    <div key={d.produto} className={`alert-item ${i === 0 ? 'alert-danger' : i === 1 ? 'alert-warn' : 'alert-info'}`}>
                      <BarChart2 size={15} />
                      <div>
                        <strong>{i === 0 ? '🏆 1º lugar' : i === 1 ? '2º lugar' : '3º lugar'}:</strong> produto <strong>{d.produto}</strong> com {d.quantidade} un vendidas — R${d.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert-list">
                  <div className="alert-item alert-danger">
                    <BarChart2 size={15} />
                    <div><strong>Sexta:</strong> após análises, o produto <strong>Ballena</strong> foi o mais vendido.</div>
                  </div>
                  <div className="alert-item alert-warn">
                    <BarChart2 size={15} />
                    <div><strong>Sábado:</strong> após análises, a <strong>Porção de Tilápia</strong> foi o mais vendido.</div>
                  </div>
                  <div className="alert-item alert-success">
                    <BarChart2 size={15} />
                    <div><strong>Domingo:</strong> após análises, o produto <strong>Redbull</strong> foi o mais vendido.</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Detalhamento por produto</div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Produto</th><th>Qtd. vendida</th><th>Total R$</th><th>Participação</th></tr>
                </thead>
                <tbody>
                  {dadosDiarios.map((d, i) => {
                    const pct = totalDiario > 0 ? ((d.total / totalDiario) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={d.produto}>
                        <td style={{ fontWeight: i === 0 ? 700 : 400 }}>
                          {i === 0 && <span className="badge badge-amber" style={{ marginRight: 6 }}>🏆 Top</span>}
                          {d.produto}
                        </td>
                        <td>{d.quantidade} un</td>
                        <td style={{ fontWeight: 500 }}>R${d.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
                  {dadosDiarios.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>Nenhum dado disponível</td></tr>
                  )}
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
                {dadosSemanais.map((d, i) => {
                  const h = Math.max(8, (d.lucro / maxSemanal) * 100);
                  const isPeak = d.lucro === picoDia?.lucro;
                  return (
                    <div className="bar-group" key={d.dia}>
                      <div
                        className={`bar ${isPeak ? 'bar-peak' : i >= 4 ? 'bar-primary' : 'bar-pale'}`}
                        style={{ height: `${h}%` }}
                        title={`${d.dia}: R$${d.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      />
                      <span className="bar-label">{d.dia}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Total: R${totalSemanal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span>Pico: {picoDia?.dia ?? '—'}</span>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Análise semanal</div>
              <div className="alert-list">
                <div className="alert-item alert-info">
                  <TrendingUp size={15} />
                  <div>
                    <strong>Faturamento semanal:</strong> R${totalSemanal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no total. Pico em <strong>{picoDia?.dia ?? '—'}</strong> com R${picoDia?.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
                  </div>
                </div>
                {vendorStats[0] && (
                  <div className="alert-item alert-warn">
                    <BarChart2 size={15} />
                    <div>
                      <strong>Top funcionário:</strong> <strong>{vendorStats[0].nome}</strong> liderou com R${vendorStats[0].total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em {vendorStats[0].comandas} comanda(s).
                    </div>
                  </div>
                )}
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
                  {dadosSemanais.map(d => {
                    const delta = mediaLucro > 0 ? ((d.lucro - mediaLucro) / mediaLucro * 100).toFixed(0) : '0';
                    const positivo = Number(delta) >= 0;
                    return (
                      <tr key={d.dia}>
                        <td style={{ fontWeight: 500 }}>{d.dia}</td>
                        <td style={{ fontWeight: 600 }}>R${d.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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

      {tab === 'funcionarios' && (
        <div>
          <div className="grid-2">
            <div className="card">
              <div className="card-title">
                <span><Users size={14} style={{ display: 'inline', marginRight: 6 }} />Ranking de vendas</span>
              </div>
              <div className="bar-chart" style={{ height: 120 }}>
                {vendorStats.map((v, i) => {
                  const max = vendorStats[0]?.total || 1;
                  const h = Math.max(8, (v.total / max) * 100);
                  return (
                    <div className="bar-group" key={v.funcionarioId}>
                      <div
                        className={`bar ${i === 0 ? 'bar-peak' : i < 3 ? 'bar-primary' : 'bar-pale'}`}
                        style={{ height: `${h}%` }}
                        title={`${v.nome}: R$${v.total.toFixed(2)}`}
                      />
                      <span className="bar-label" style={{ fontSize: 8 }}>
                        {v.nome.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              {vendorStats.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '16px 0' }}>
                  Nenhuma venda registrada ainda.
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-title">Resumo geral</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Total de comandas fechadas: <strong style={{ color: 'var(--text)' }}>{vendas.filter(v => v.status === 'fechada').length}</strong>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Faturamento total registrado: <strong style={{ color: 'var(--text)' }}>R${vendas.reduce((s, v) => s + v.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Funcionários com vendas: <strong style={{ color: 'var(--text)' }}>{vendorStats.length}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Vendas por funcionário</div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Funcionário</th><th>Cargo</th><th>Turno</th><th>Comandas</th><th>Itens vendidos</th><th>Total vendido</th></tr>
                </thead>
                <tbody>
                  {vendorStats.map((v, i) => {
                    const func = funcionarios.find(f => f.id === v.funcionarioId);
                    return (
                      <tr key={v.funcionarioId}>
                        <td style={{ fontWeight: 700, color: i === 0 ? 'var(--amber)' : 'var(--text-muted)', fontSize: 12 }}>
                          {i === 0 ? '🏆' : `#${i + 1}`}
                        </td>
                        <td style={{ fontWeight: 500 }}>{v.nome}</td>
                        <td>
                          {func ? <span className="badge badge-blue">{cargoLabels[func.cargo]}</span> : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>}
                        </td>
                        <td>
                          {func?.turno
                            ? <span className={`badge ${turnoBadge[func.turno]}`}>{turnoLabels[func.turno]}</span>
                            : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>}
                        </td>
                        <td>{v.comandas}</td>
                        <td>{v.itens} un</td>
                        <td style={{ fontWeight: 600 }}>R${v.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })}
                  {vendorStats.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>Nenhuma venda registrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
