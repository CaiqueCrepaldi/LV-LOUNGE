import { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useConfirm } from '../components/ConfirmModal';
import type { StatusEstoque } from '../types';

const statusLabel: Record<StatusEstoque, string> = {
  normal: 'Normal', atencao: 'Atenção', critico: 'Crítico',
};
const statusBadge: Record<StatusEstoque, string> = {
  normal: 'badge-green', atencao: 'badge-amber', critico: 'badge-red',
};

export default function Estoque() {
  const { produtos, setProdutos, setCurrentPage } = useApp();
  const { confirm, modal } = useConfirm();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusEstoque | 'todos'>('todos');

  const filtered = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.includes(busca);
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const handleDelete = async (id: string) => {
    const ok = await confirm('Deseja remover este produto do estoque?');
    if (ok) setProdutos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      {modal}
      <div className="page-header">
        <div className="page-title">Estoque</div>
        <div className="page-subtitle">Controle de entradas e saídas de produtos</div>
      </div>

      {/* Resumo rápido */}
      <div className="metrics-grid mb-18">
        {(['normal', 'atencao', 'critico'] as StatusEstoque[]).map(s => (
          <div key={s} className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setFiltroStatus(s)}>
            <div className="metric-label">{statusLabel[s].toUpperCase()}</div>
            <div className="metric-value">{produtos.filter(p => p.status === s).length}</div>
          </div>
        ))}
        <div className="metric-card">
          <div className="metric-label">TOTAL ITENS</div>
          <div className="metric-value">{produtos.reduce((s, p) => s + p.estoqueAtual, 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="action-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={14} />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            className="form-control"
            style={{ height: 36, width: 130 }}
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value as StatusEstoque | 'todos')}
          >
            <option value="todos">Todos status</option>
            <option value="normal">Normal</option>
            <option value="atencao">Atenção</option>
            <option value="critico">Crítico</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={() => setCurrentPage('produtos')}>
            <Plus size={13} /> Registrar entrada
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Estoque Atual</th>
                <th>Mínimo</th>
                <th>Validade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 11 }}>{p.codigo}</td>
                  <td style={{ fontWeight: 500 }}>{p.nome}</td>
                  <td>
                    <span className={`badge ${p.tipo === 'comercializado' ? 'badge-blue' : 'badge-gray'}`}>
                      {p.tipo === 'comercializado' ? 'Comercializado' : 'Ingrediente'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: p.estoqueAtual <= p.estoqueMinimo ? 'var(--red)' : 'var(--text)' }}>
                      {p.estoqueAtual}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}> un</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.estoqueMinimo} un</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                    {p.validade ? new Date(p.validade).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td>
                    <span className={`badge ${statusBadge[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Editar produto"
                        onClick={() => setCurrentPage('produtos')}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Excluir"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
