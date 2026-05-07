import { TrendingUp, Package, AlertTriangle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockVendasSemanais } from '../data/mockData';

export default function Dashboard() {
  const { produtos, movimentacoes, notificacoes, funcionarios } = useApp();
  const { user } = useAuth();

  const naoLidas = notificacoes.filter(n => !n.lida).length;
  const criticos = produtos.filter(p => p.status === 'critico').length;
  const atencao = produtos.filter(p => p.status === 'atencao').length;
  const totalAlerts = naoLidas + criticos + atencao;

  const hoje = new Date();
  const nomeHora = hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const maxLucro = Math.max(...mockVendasSemanais.map(d => d.lucro));

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
          <div className="metric-value">R$4.820</div>
          <div className="metric-trend trend-up">↑ +12% vs ontem</div>
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
            {mockVendasSemanais.map((d, i) => {
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
            <span>Total semana: R${mockVendasSemanais.reduce((s, d) => s + d.lucro, 0).toLocaleString()}</span>
            <span>Top: Ballena</span>
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
                  <td><span className={`badge ${statusColors[m.status]}`}>{m.status === 'ok' ? 'OK' : 'Verificar'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
