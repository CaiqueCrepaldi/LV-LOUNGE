import { TrendingUp, Package, AlertTriangle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { produtos, movimentacoes, notificacoes, funcionarios, vendasSemanais, vendas } = useApp();
  const { user } = useAuth();

  const naoLidas = notificacoes.filter(n => !n.lida).length;
  const criticos = produtos.filter(p => p.status === 'critico').length;
  const atencao = produtos.filter(p => p.status === 'atencao').length;
  const totalAlerts = naoLidas + criticos + atencao;

  const hoje = new Date();
  const nomeHora = hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  // ── Vendas hoje e ontem ───────────────────────────────────────────
  const hojeISO = hoje.toISOString().slice(0, 10);
  const ontemISO = new Date(hoje.getTime() - 86_400_000).toISOString().slice(0, 10);

  const vendasHoje = vendas
    .filter(v => v.data === hojeISO && v.status !== 'cancelada')
    .reduce((s, v) => s + v.total, 0);

  const vendasOntem = vendas
    .filter(v => v.data === ontemISO && v.status !== 'cancelada')
    .reduce((s, v) => s + v.total, 0);

  const tendencia = vendasOntem > 0
    ? Math.round((vendasHoje - vendasOntem) / vendasOntem * 100)
    : null;

  // ── Total semanal (mock histórico + vendas reais desta semana) ────
  const diaDaSemana = hoje.getDay();
  const offsetSegunda = diaDaSemana === 0 ? 6 : diaDaSemana - 1;
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - offsetSegunda);
  inicioSemana.setHours(0, 0, 0, 0);

  const totalSemanaReal = vendas
    .filter(v => new Date(v.data + 'T00:00:00') >= inicioSemana && v.status !== 'cancelada')
    .reduce((s, v) => s + v.total, 0);

  const totalSemanaMock = vendasSemanais.reduce((s, d) => s + d.lucro, 0);
  const totalSemana = totalSemanaMock + totalSemanaReal;

  // ── Top produto real (por faturamento) ───────────────────────────
  const produtoFat: Record<string, number> = {};
  vendas.forEach(v => v.itens.forEach(i => {
    produtoFat[i.descricao] = (produtoFat[i.descricao] ?? 0) + i.total;
  }));
  const topProduto = Object.entries(produtoFat).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Ballena';

  const maxLucro = Math.max(...vendasSemanais.map(d => d.lucro));

  const statusColors: Record<string, string> = {
    ok: 'badge-green', verificar: 'badge-amber', erro: 'badge-red',
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{nomeHora}, {user?.nome.split(' ')[0]} 👋</div>
        <div className="page-subtitle" style={{ textTransform: 'capitalize' }}>
          {dataFormatada} · LV Lounge
        </div>
      </div>

      {/* Métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon icon-green"><TrendingUp /></div>
          <div className="metric-label">VENDAS HOJE</div>
          <div className="metric-value">R${vendasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className={`metric-trend ${tendencia === null ? 'trend-neutral' : tendencia >= 0 ? 'trend-up' : 'trend-down'}`}>
            {tendencia === null
              ? 'Sem dados de ontem'
              : `${tendencia >= 0 ? '↑' : '↓'} ${tendencia >= 0 ? '+' : ''}${tendencia}% vs ontem`}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon icon-blue"><Package /></div>
          <div className="metric-label">ITENS EM ESTOQUE</div>
          <div className="metric-value">{produtos.reduce((s, p) => s + p.estoqueAtual, 0).toLocaleString()}</div>
          <div className="metric-trend trend-neutral">Reposição normal</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon icon-amber"><AlertTriangle /></div>
          <div className="metric-label">ALERTAS ATIVOS</div>
          <div className="metric-value">{totalAlerts}</div>
          <div className="metric-trend trend-down">↑ {naoLidas} não lidos</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon icon-blue"><Users /></div>
          <div className="metric-label">FUNCIONÁRIOS</div>
          <div className="metric-value">{funcionarios.length}</div>
          <div className="metric-trend trend-neutral">{funcionarios.filter(f => f.ativo).length} ativos agora</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Gráfico semanal */}
        <div className="card">
          <div className="card-title">Vendas da semana</div>
          <div className="bar-chart">
            {vendasSemanais.map((d, i) => {
              const height = Math.max(10, (d.lucro / maxLucro) * 100);
              const isPeak = d.lucro === maxLucro;
              return (
                <div className="bar-group" key={d.dia}>
                  <div
                    className={`bar ${isPeak ? 'bar-peak' : i >= 4 ? 'bar-primary' : 'bar-pale'}`}
                    style={{ height: `${height}%` }}
                    title={`R$${d.lucro.toLocaleString()}`}
                  />
                  <span className="bar-label">{d.dia}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between" style={{ marginTop: 10, fontSize: 10, color: 'var(--text-muted)' }}>
            <span>Total semana: R${totalSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span>Top: {topProduto}</span>
          </div>
        </div>

        {/* Alertas */}
        <div className="card">
          <div className="card-title">Alertas recentes</div>
          <div className="alert-list">
            {notificacoes.slice(0, 3).map(n => (
              <div key={n.id} className={`alert-item ${n.severidade === 'critico' ? 'alert-danger' : n.severidade === 'aviso' ? 'alert-warn' : 'alert-info'}`}>
                <AlertTriangle />
                <div>
                  <strong>{n.titulo}</strong>
                  <div style={{ marginTop: 2 }}>{n.mensagem}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Movimentações recentes */}
      <div className="card">
        <div className="card-title">Movimentações recentes</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Qtd</th>
                <th>Horário</th>
                <th>Funcionário</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.produtoNome}</td>
                  <td>
                    <span className={`badge ${m.tipo === 'entrada' ? 'badge-green' : 'badge-blue'}`}>
                      {m.tipo === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                    </span>
                  </td>
                  <td>{m.quantidade}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{m.horario}</td>
                  <td>{m.funcionarioNome}</td>
                  <td><span className={`badge ${statusColors[m.status]}`}>{m.status === 'ok' ? 'OK' : m.status === 'erro' ? 'Erro' : 'Verificar'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
