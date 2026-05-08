import { useState } from 'react';
import { Plus, Trash2, Snowflake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useConfirm } from '../components/ConfirmModal';
import type { ItemGeladeira, StatusEstoque } from '../types';

const statusBadge: Record<StatusEstoque, string> = {
  normal: 'badge-green', atencao: 'badge-amber', critico: 'badge-red',
};
const statusLabel: Record<StatusEstoque, string> = {
  normal: 'Normal', atencao: 'Atenção', critico: 'Crítico',
};

const makeInitForm = () => ({
  produtoId: '', categoria: 'bebida', quantidade: '', temperatura: '',
  horario: new Date().toTimeString().slice(0, 5),
  data: new Date().toISOString().slice(0, 10),
});

export default function Geladeira() {
  const { geladeira, setGeladeira, produtos } = useApp();
  const { confirm, modal } = useConfirm();
  const [form, setForm] = useState(makeInitForm);
  const [formError, setFormError] = useState('');

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    const faltando: string[] = [];
    if (!form.produtoId) faltando.push('Produto');
    if (!form.quantidade) faltando.push('Quantidade');
    if (form.temperatura === '') faltando.push('Temperatura');
    if (!form.horario) faltando.push('Horário');
    if (!form.data) faltando.push('Data');
    if (faltando.length > 0) {
      setFormError(`Campos obrigatórios: ${faltando.join(', ')}.`);
      return;
    }
    setFormError('');
    const produto = produtos.find(p => p.id === form.produtoId);
    const novo: ItemGeladeira = {
      id: String(Date.now()),
      produtoId: form.produtoId,
      produtoNome: produto?.nome ?? '',
      categoria: form.categoria as ItemGeladeira['categoria'],
      quantidade: Number(form.quantidade),
      temperatura: Number(form.temperatura),
      horario: form.horario,
      data: form.data,
      validade: produto?.validade ?? '',
      status: 'normal',
    };
    setGeladeira(prev => [...prev, novo]);
    setForm(makeInitForm());
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm('Remover este item da geladeira?');
    if (ok) setGeladeira(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      {modal}
      <div className="page-header">
        <div className="page-title">Geladeira da LV</div>
        <div className="page-subtitle">Controle de temperatura, data e horário de armazenamento</div>
      </div>

      {/* Form cadastro */}
      <div className="card mb-18">
        <div className="card-title">
          <span><Snowflake size={15} style={{ display: 'inline', marginRight: 6 }} />Adicionar produto à geladeira</span>
        </div>
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Produto *</div>
            <select className="form-control" value={form.produtoId} onChange={e => handleChange('produtoId', e.target.value)}>
              <option value="">-- Selecione --</option>
              {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Categoria *</div>
            <select className="form-control" value={form.categoria} onChange={e => handleChange('categoria', e.target.value)}>
              <option value="bebida">Bebida</option>
              <option value="alimento">Alimento</option>
              <option value="descartavel">Descartável</option>
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Quantidade *</div>
            <input className="form-control" type="number" placeholder="0" value={form.quantidade} onChange={e => handleChange('quantidade', e.target.value)} />
          </div>
        </div>
        <div className="form-row form-row-3">
          <div className="form-group">
            <div className="form-label">Temperatura (°C) *</div>
            <input className="form-control" type="number" placeholder="-5" value={form.temperatura} onChange={e => handleChange('temperatura', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Horário *</div>
            <input className="form-control" type="time" value={form.horario} onChange={e => handleChange('horario', e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Data *</div>
            <input className="form-control" type="date" value={form.data} onChange={e => handleChange('data', e.target.value)} />
          </div>
        </div>
        {formError && <div className="form-error" style={{ marginTop: 10 }}>{formError}</div>}
        <div className="form-actions">
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <Plus size={13} /> Registrar
          </button>
        </div>
      </div>

      {/* Cards geladeira */}
      <div className="card">
        <div className="card-title">Produtos armazenados ({geladeira.length})</div>
        {geladeira.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 12 }}>
            Nenhum produto na geladeira
          </div>
        ) : (
          <div className="fridge-grid">
            {geladeira.map(item => (
              <div key={item.id} className="fridge-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="fridge-card-name">{item.produtoNome}</div>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(item.id)}><Trash2 size={12} /></button>
                </div>
                <div className="fridge-temp">{item.temperatura}°C</div>
                <div className="fridge-meta">
                  <span>📅 {item.data} · {item.horario}</span>
                  <span>
                    📦 {item.quantidade} un ·{' '}
                    <span className={`badge ${statusBadge[item.status]}`}>{statusLabel[item.status]}</span>
                  </span>
                  {item.validade && (
                    <span>⏰ Validade: {new Date(item.validade).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
