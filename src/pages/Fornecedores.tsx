import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Fornecedor } from '../types';

const initForm = { nome: '', cnpj: '', telefone: '', endereco: '', historicoTransacao: '', produtoFornecido: '' };

export default function Fornecedores() {
  const { fornecedores, setFornecedores } = useApp();
  const [form, setForm] = useState(initForm);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const change = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.nome || !form.cnpj) { alert('Nome e CNPJ são obrigatórios.'); return; }
    if (editandoId) {
      setFornecedores(prev => prev.map(f => f.id === editandoId ? { ...f, ...form } : f));
      setEditandoId(null);
    } else {
      const novo: Fornecedor = { id: String(Date.now()), ...form };
      setFornecedores(prev => [...prev, novo]);
    }
    setForm(initForm);
  };

  const handleEdit = (f: Fornecedor) => {
    setForm({ nome: f.nome, cnpj: f.cnpj, telefone: f.telefone, endereco: f.endereco, historicoTransacao: f.historicoTransacao, produtoFornecido: f.produtoFornecido });
    setEditandoId(f.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este fornecedor?')) setFornecedores(prev => prev.filter(f => f.id !== id));
  };

  const filtered = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cnpj.includes(busca) ||
    f.produtoFornecido.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Fornecedores</div>
        <div className="page-subtitle">Cadastro e controle de fornecedores</div>
      </div>

      <div className="card mb-18">
        <div className="card-title">{editandoId ? 'Editar fornecedor' : 'Novo fornecedor'}</div>
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Nome do fornecedor *</div>
            <input className="form-control" placeholder="Ex: Adega JR" value={form.nome} onChange={e => change('nome', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">CNPJ *</div>
            <input className="form-control" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={e => change('cnpj', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Endereço</div>
            <input className="form-control" placeholder="Rua, número - Cidade" value={form.endereco} onChange={e => change('endereco', e.target.value)} />
          </div>
        </div>
        <div className="form-row form-row-3">
          <div className="form-group">
            <div className="form-label">Telefone</div>
            <input className="form-control" placeholder="(11) 0000-0000" value={form.telefone} onChange={e => change('telefone', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Histórico de transação</div>
            <input className="form-control" placeholder="Ex: Ativo desde 2023" value={form.historicoTransacao} onChange={e => change('historicoTransacao', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Produto fornecido</div>
            <input className="form-control" placeholder="Ex: Ballena, Redbull" value={form.produtoFornecido} onChange={e => change('produtoFornecido', e.target.value)} />
          </div>
        </div>
        <div className="form-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <Plus size={13} /> {editandoId ? 'Salvar' : 'Cadastrar fornecedor'}
          </button>
          {editandoId && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditandoId(null); setForm(initForm); }}>Cancelar</button>
          )}
        </div>
      </div>

      <div className="action-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={14} />
          <input placeholder="Buscar fornecedor..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Nome</th><th>CNPJ</th><th>Telefone</th><th>Endereço</th><th>Histórico</th><th>Produto</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{f.cnpj}</td>
                  <td>{f.telefone}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.endereco}</td>
                  <td style={{ fontSize: 11 }}>{f.historicoTransacao}</td>
                  <td><span className="badge badge-blue">{f.produtoFornecido}</span></td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleEdit(f)}><Edit2 size={13} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(f.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Nenhum fornecedor cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
