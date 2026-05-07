import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Produto, TipoProduto, CategoriaProduto, VidaUtil, StatusEstoque } from '../types';

const statusBadge: Record<StatusEstoque, string> = {
  normal: 'badge-green', atencao: 'badge-amber', critico: 'badge-red',
};

const initForm = {
  tipo: 'comercializado' as TipoProduto,
  categoria: 'bebida' as CategoriaProduto,
  marca: '',
  nome: '',
  estoqueInicial: '',
  estoqueMinimo: '60',
  codigo: '',
  preco: '',
  imposto: '',
  validade: '',
  vidaUtil: 'nao_perecivel' as VidaUtil,
};

export default function Produtos() {
  const { produtos, setProdutos } = useApp();
  const [form, setForm] = useState(initForm);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const change = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const calcStatus = (atual: number, minimo: number): StatusEstoque => {
    if (atual <= minimo) return 'critico';
    if (atual <= minimo * 1.1) return 'atencao';
    return 'normal';
  };

  const handleSubmit = () => {
    if (!form.nome || !form.codigo) { alert('Nome e Código são obrigatórios.'); return; }
    const estoqueAtual = Number(form.estoqueInicial) || 0;
    const estoqueMinimo = Number(form.estoqueMinimo) || 60;
    if (editandoId) {
      setProdutos(prev => prev.map(p => p.id === editandoId ? {
        ...p, ...form,
        estoqueAtual, estoqueInicial: estoqueAtual, estoqueMinimo,
        preco: Number(form.preco), imposto: Number(form.imposto),
        status: calcStatus(estoqueAtual, estoqueMinimo),
      } : p));
      setEditandoId(null);
    } else {
      const novo: Produto = {
        id: String(Date.now()),
        codigo: form.codigo, nome: form.nome, tipo: form.tipo,
        categoria: form.categoria, marca: form.marca,
        estoqueAtual, estoqueInicial: estoqueAtual, estoqueMinimo,
        preco: Number(form.preco), imposto: Number(form.imposto),
        validade: form.validade, vidaUtil: form.vidaUtil,
        status: calcStatus(estoqueAtual, estoqueMinimo),
      };
      setProdutos(prev => [...prev, novo]);
    }
    setForm(initForm);
  };

  const handleEdit = (p: Produto) => {
    setForm({
      tipo: p.tipo, categoria: p.categoria, marca: p.marca, nome: p.nome,
      estoqueInicial: String(p.estoqueAtual), estoqueMinimo: String(p.estoqueMinimo),
      codigo: p.codigo, preco: String(p.preco), imposto: String(p.imposto),
      validade: p.validade, vidaUtil: p.vidaUtil,
    });
    setEditandoId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este produto?')) setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const filtered = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo.includes(busca) ||
    p.marca.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Cadastro de Produtos</div>
        <div className="page-subtitle">Gerencie todos os produtos da LV Lounge</div>
      </div>

      <div className="card mb-18">
        <div className="card-title">{editandoId ? 'Editar produto' : 'Novo produto'}</div>
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Tipo de produto</div>
            <select className="form-control" value={form.tipo} onChange={e => change('tipo', e.target.value)}>
              <option value="comercializado">Comercializado</option>
              <option value="ingrediente">Ingrediente</option>
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Categoria</div>
            <select className="form-control" value={form.categoria} onChange={e => change('categoria', e.target.value)}>
              <option value="bebida">Bebida</option>
              <option value="alimento">Alimento</option>
              <option value="descartavel">Descartável</option>
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Marca</div>
            <input className="form-control" placeholder="Ex: Ballena" value={form.marca} onChange={e => change('marca', e.target.value)} />
          </div>
        </div>
        <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Nome do produto *</div>
            <input className="form-control" placeholder="Ex: Ballena 600ml" value={form.nome} onChange={e => change('nome', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Estoque inicial</div>
            <input className="form-control" type="number" placeholder="0" value={form.estoqueInicial} onChange={e => change('estoqueInicial', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Estoque mínimo</div>
            <input className="form-control" type="number" placeholder="60" value={form.estoqueMinimo} onChange={e => change('estoqueMinimo', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Código *</div>
            <input className="form-control" placeholder="001" value={form.codigo} onChange={e => change('codigo', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Preço (R$)</div>
            <input className="form-control" placeholder="0,00" value={form.preco} onChange={e => change('preco', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Imposto (%)</div>
            <input className="form-control" placeholder="0" value={form.imposto} onChange={e => change('imposto', e.target.value)} />
          </div>
        </div>
        <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Validade</div>
            <input className="form-control" type="date" value={form.validade} onChange={e => change('validade', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Vida útil (tipo de alerta)</div>
            <select className="form-control" value={form.vidaUtil} onChange={e => change('vidaUtil', e.target.value)}>
              <option value="perecivel">Perecível (alerta 1 semana antes)</option>
              <option value="nao_perecivel">Não perecível (alerta 1 mês antes)</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <Plus size={13} /> {editandoId ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
          {editandoId && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditandoId(null); setForm(initForm); }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="action-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={14} />
          <input placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} produto(s)</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th><th>Estoque I/M</th><th>Validade</th>
                <th>Preço/Imposto</th><th>Categoria</th><th>Código</th><th>Status</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.nome}</td>
                  <td>{p.estoqueAtual} / {p.estoqueMinimo}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {p.validade ? new Date(p.validade).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td>R${p.preco.toFixed(2)} / {p.imposto}%</td>
                  <td><span className={`badge ${p.tipo === 'comercializado' ? 'badge-blue' : 'badge-gray'}`}>
                    {p.tipo === 'comercializado' ? 'Comercializado' : 'Ingrediente'}
                  </span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.codigo}</td>
                  <td><span className={`badge ${statusBadge[p.status]}`}>{p.status === 'normal' ? 'Normal' : p.status === 'atencao' ? 'Atenção' : 'Crítico'}</span></td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleEdit(p)}><Edit2 size={13} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
