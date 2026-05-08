import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';
import type { Fornecedor } from '../types';
import { maskCNPJ, maskPhone, maskCEP, validateCNPJ, validatePhone, validateCEP } from '../utils/masks';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

const initForm = {
  nome: '', cnpj: '', telefone: '',
  logradouro: '', numero: '', cep: '', cidade: '', estado: '',
  historicoTransacao: '', produtoFornecido: '',
};

const initErrors = { cnpj: '', telefone: '', cep: '' };

const fieldError = (msg: string) => (
  <div style={{ fontSize: 11, color: 'var(--red, #e53e3e)', marginTop: 3 }}>{msg}</div>
);

export default function Fornecedores() {
  const { fornecedores, setFornecedores } = useApp();
  const toast = useToast();
  const { confirm, modal } = useConfirm();
  const [form, setForm] = useState(initForm);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState(initErrors);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const change = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (k in errors) setErrors(p => ({ ...p, [k]: '' }));
  };

  const blurValidate = (k: keyof typeof initErrors, v: string) => {
    if (!v) return;
    let msg = '';
    if (k === 'cnpj' && !validateCNPJ(v)) msg = 'CNPJ inválido.';
    if (k === 'telefone' && !validatePhone(v)) msg = 'Telefone inválido (mínimo 10 dígitos).';
    if (k === 'cep' && !validateCEP(v)) msg = 'CEP inválido (deve ter 8 dígitos).';
    setErrors(p => ({ ...p, [k]: msg }));
  };

  const handleSubmit = () => {
    const faltando: string[] = [];
    if (!form.nome.trim()) faltando.push('Nome');
    if (!form.cnpj.trim()) faltando.push('CNPJ');
    if (!form.telefone.trim()) faltando.push('Telefone');
    if (!form.logradouro.trim()) faltando.push('Logradouro');
    if (!form.numero.trim()) faltando.push('Número');
    if (!form.cep.trim()) faltando.push('CEP');
    if (!form.cidade.trim()) faltando.push('Cidade');
    if (!form.estado) faltando.push('Estado');
    if (!form.produtoFornecido.trim()) faltando.push('Produto fornecido');
    if (!form.historicoTransacao.trim()) faltando.push('Histórico de transação');
    if (faltando.length > 0) {
      setFormError(`Campos obrigatórios: ${faltando.join(', ')}.`);
      return;
    }
    const invalidos: string[] = [];
    if (!validateCNPJ(form.cnpj)) invalidos.push('CNPJ inválido');
    if (!validatePhone(form.telefone)) invalidos.push('Telefone inválido');
    if (!validateCEP(form.cep)) invalidos.push('CEP inválido');
    if (invalidos.length > 0) {
      setFormError(invalidos.join(' · ') + '.');
      return;
    }
    setFormError('');
    if (editandoId) {
      setFornecedores(prev => prev.map(f => f.id === editandoId ? { ...f, ...form } : f));
      setEditandoId(null);
      toast('Fornecedor atualizado com sucesso.');
    } else {
      const novo: Fornecedor = { id: String(Date.now()), ...form };
      setFornecedores(prev => [...prev, novo]);
      toast('Fornecedor cadastrado com sucesso.');
    }
    setForm(initForm);
    setErrors(initErrors);
  };

  const handleEdit = (f: Fornecedor) => {
    setFormError('');
    setErrors(initErrors);
    setForm({
      nome: f.nome, cnpj: f.cnpj, telefone: f.telefone,
      logradouro: f.logradouro, numero: f.numero, cep: f.cep,
      cidade: f.cidade, estado: f.estado,
      historicoTransacao: f.historicoTransacao, produtoFornecido: f.produtoFornecido,
    });
    setEditandoId(f.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm('Excluir este fornecedor permanentemente?');
    if (ok) {
      setFornecedores(prev => prev.filter(f => f.id !== id));
      toast('Fornecedor removido.');
    }
  };

  const enderecoCompleto = (f: Fornecedor) => {
    const partes = [f.logradouro, f.numero && `nº ${f.numero}`, f.cidade, f.estado].filter(Boolean);
    return partes.join(', ') || '—';
  };

  const filtered = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cnpj.includes(busca) ||
    f.cidade.toLowerCase().includes(busca.toLowerCase()) ||
    f.produtoFornecido.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      {modal}
      <div className="page-header">
        <div className="page-title">Fornecedores</div>
        <div className="page-subtitle">Cadastro e controle de fornecedores</div>
      </div>

      <div className="card mb-18">
        <div className="card-title">{editandoId ? 'Editar fornecedor' : 'Cadastrar fornecedor'}</div>

        {/* Linha 1: Nome, CNPJ, Telefone */}
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Nome do fornecedor *</div>
            <input
              className="form-control"
              placeholder="Ex: Adega JR"
              value={form.nome}
              onChange={e => change('nome', e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-label">CNPJ *</div>
            <input
              className={`form-control${errors.cnpj ? ' input-invalid' : ''}`}
              placeholder="00.000.000/0001-00"
              value={form.cnpj}
              onChange={e => change('cnpj', maskCNPJ(e.target.value))}
              onBlur={e => blurValidate('cnpj', e.target.value)}
              inputMode="numeric"
            />
            {errors.cnpj && fieldError(errors.cnpj)}
          </div>
          <div className="form-group">
            <div className="form-label">Telefone *</div>
            <input
              className={`form-control${errors.telefone ? ' input-invalid' : ''}`}
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={e => change('telefone', maskPhone(e.target.value))}
              onBlur={e => blurValidate('telefone', e.target.value)}
              inputMode="numeric"
            />
            {errors.telefone && fieldError(errors.telefone)}
          </div>
        </div>

        {/* Linha 2: Logradouro, Número, CEP */}
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Logradouro *</div>
            <input
              className="form-control"
              placeholder="Rua, Av., Travessa..."
              value={form.logradouro}
              onChange={e => change('logradouro', e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-label">Número *</div>
            <input
              className="form-control"
              placeholder="Ex: 100"
              value={form.numero}
              onChange={e => change('numero', e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
            />
          </div>
          <div className="form-group">
            <div className="form-label">CEP *</div>
            <input
              className={`form-control${errors.cep ? ' input-invalid' : ''}`}
              placeholder="00000-000"
              value={form.cep}
              onChange={e => change('cep', maskCEP(e.target.value))}
              onBlur={e => blurValidate('cep', e.target.value)}
              inputMode="numeric"
            />
            {errors.cep && fieldError(errors.cep)}
          </div>
        </div>

        {/* Linha 3: Cidade, Estado, Produto fornecido */}
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Cidade *</div>
            <input
              className="form-control"
              placeholder="Ex: São Paulo"
              value={form.cidade}
              onChange={e => change('cidade', e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-label">Estado *</div>
            <select className="form-control" value={form.estado} onChange={e => change('estado', e.target.value)}>
              <option value="">Selecione</option>
              {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Produto fornecido *</div>
            <input
              className="form-control"
              placeholder="Ex: Ballena, Redbull"
              value={form.produtoFornecido}
              onChange={e => change('produtoFornecido', e.target.value)}
            />
          </div>
        </div>

        {/* Linha 4: Histórico + botões */}
        <div className="form-row form-row-3">
          <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
            <div className="form-label">Histórico de transação *</div>
            <input
              className="form-control"
              placeholder="Ex: Ativo desde 2023"
              value={form.historicoTransacao}
              onChange={e => change('historicoTransacao', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSubmit}>
                <Plus size={14} /> {editandoId ? 'Salvar' : 'Cadastrar fornecedor'}
              </button>
              {editandoId && (
                <button className="btn btn-ghost" onClick={() => { setEditandoId(null); setForm(initForm); setFormError(''); setErrors(initErrors); }}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {formError && <div className="form-error" style={{ marginTop: 10 }}>{formError}</div>}
      </div>

      <div className="action-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={14} />
          <input placeholder="Buscar fornecedor..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} fornecedor(es)</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>CEP</th>
                <th>Histórico</th>
                <th>Produto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{f.cnpj}</td>
                  <td>{f.telefone}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{enderecoCompleto(f)}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.cep || '—'}</td>
                  <td style={{ fontSize: 11 }}>{f.historicoTransacao}</td>
                  <td><span className="badge badge-blue">{f.produtoFornecido || '—'}</span></td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleEdit(f)}><Edit2 size={13} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(f.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Nenhum fornecedor cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
