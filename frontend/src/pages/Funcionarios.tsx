import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';
import type { User, UserRole, Turno } from '../types';

const cargoLabels: Record<UserRole, string> = {
  gerente: 'Gerente', barman: 'Barman', garcom: 'Garçom', cozinheiro: 'Cozinheiro',
};
const cargoBadge: Record<UserRole, string> = {
  gerente: 'badge-blue', barman: 'badge-amber', garcom: 'badge-gray', cozinheiro: 'badge-green',
};

const turnoLabels: Record<Turno, string> = {
  tarde: 'Tarde (12h–18h)', noite: 'Noite (18h–00h)', madrugada: 'Madrugada (00h–06h)',
};
const turnoBadge: Record<Turno, string> = {
  tarde: 'badge-amber', noite: 'badge-blue', madrugada: 'badge-gray',
};

// ── Máscaras ──────────────────────────────────────────────────────
const maskCPF = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const formatSalario = (v: string) => {
  const num = parseFloat(v.replace(/\./g, '').replace(',', '.'));
  if (!v || isNaN(num)) return '';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseSalario = (v: string) =>
  parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;

const initForm = { nome: '', usuario: '', telefone: '', cpf: '', email: '', cargo: 'barman' as UserRole, turno: 'noite' as Turno, salario: '', senha: '' };

export default function Funcionarios() {
  const { funcionarios, setFuncionarios } = useApp();
  const { user: me } = useAuth();
  const toast = useToast();
  const { confirm, modal } = useConfirm();
  const [form, setForm] = useState(initForm);
  const [formError, setFormError] = useState('');
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const change = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.nome || !form.usuario) {
      setFormError('Nome e Usuário são obrigatórios.');
      return;
    }
    setFormError('');
    const salario = parseSalario(form.salario);
    if (editandoId) {
      setFuncionarios(prev => prev.map(f => {
        if (f.id !== editandoId) return f;
        const updated = { ...f, ...form, salario };
        if (!form.senha) updated.senha = f.senha;
        return updated;
      }));
      setEditandoId(null);
      toast('Funcionário atualizado com sucesso.');
    } else {
      const novo: User = { id: String(Date.now()), ...form, salario, ativo: true };
      setFuncionarios(prev => [...prev, novo]);
      toast('Funcionário cadastrado com sucesso.');
    }
    setForm(initForm);
  };

  const handleEdit = (f: User) => {
    setFormError('');
    setForm({
      nome: f.nome,
      usuario: f.usuario,
      telefone: f.telefone,
      cpf: f.cpf,
      email: f.email,
      cargo: f.cargo,
      turno: f.turno ?? 'noite',
      salario: f.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      senha: '',
    });
    setEditandoId(f.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (id === me?.id) {
      toast('Você não pode excluir seu próprio usuário.', 'warning');
      return;
    }
    const ok = await confirm('Excluir este funcionário permanentemente?');
    if (ok) {
      setFuncionarios(prev => prev.filter(f => f.id !== id));
      toast('Funcionário removido.');
    }
  };

  const filtered = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.usuario.toLowerCase().includes(busca.toLowerCase()) ||
    f.cargo.includes(busca.toLowerCase())
  );

  const initials = (nome: string) => nome.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div>
      {modal}
      <div className="page-header">
        <div className="page-title">Funcionários</div>
        <div className="page-subtitle">Gerenciamento de equipe e níveis de acesso</div>
      </div>

      <div className="card mb-18">
        <div className="card-title">{editandoId ? 'Editar funcionário' : 'Cadastrar funcionário'}</div>
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">Nome completo *</div>
            <input
              className="form-control"
              placeholder="Nome Sobrenome"
              value={form.nome}
              onChange={e => change('nome', e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-label">Usuário *</div>
            <input
              className="form-control"
              placeholder="nome.sobrenome"
              value={form.usuario}
              onChange={e => change('usuario', e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-label">Telefone</div>
            <input
              className="form-control"
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={e => change('telefone', maskPhone(e.target.value))}
              inputMode="numeric"
            />
          </div>
        </div>
        <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <div className="form-label">CPF</div>
            <input
              className="form-control"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={e => change('cpf', maskCPF(e.target.value))}
              inputMode="numeric"
            />
          </div>
          <div className="form-group">
            <div className="form-label">E-mail</div>
            <input
              className="form-control"
              type="email"
              placeholder="email@email.com"
              value={form.email}
              onChange={e => change('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-label">Cargo / Nível de acesso</div>
            <select className="form-control" value={form.cargo} onChange={e => change('cargo', e.target.value)}>
              <option value="barman">Barman</option>
              <option value="garcom">Garçom</option>
              <option value="cozinheiro">Cozinheiro</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Turno</div>
            <select className="form-control" value={form.turno} onChange={e => change('turno', e.target.value)}>
              <option value="tarde">Tarde (12:00–18:00)</option>
              <option value="noite">Noite (18:00–00:00)</option>
              <option value="madrugada">Madrugada (00:00–06:00)</option>
            </select>
          </div>
        </div>
        <div className="form-row form-row-3">
          <div className="form-group">
            <div className="form-label">Salário (R$)</div>
            <input
              className="form-control"
              placeholder="0,00"
              value={form.salario}
              onChange={e => change('salario', e.target.value.replace(/[^\d,]/g, ''))}
              onBlur={e => change('salario', formatSalario(e.target.value))}
              inputMode="decimal"
            />
          </div>
          <div className="form-group">
            <div className="form-label">Senha</div>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={e => change('senha', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSubmit}>
                <Plus size={14} /> {editandoId ? 'Salvar' : 'Criar funcionário'}
              </button>
              {editandoId && (
                <button className="btn btn-ghost" onClick={() => { setEditandoId(null); setForm(initForm); setFormError(''); }}>Cancelar</button>
              )}
            </div>
          </div>
        </div>
        {formError && <div className="form-error" style={{ marginTop: 10 }}>{formError}</div>}
      </div>

      <div className="action-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={14} />
          <input placeholder="Buscar funcionário..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} funcionário(s)</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Funcionário</th><th>Usuário</th><th>Telefone</th><th>CPF</th><th>E-mail</th><th>Cargo</th><th>Turno</th><th>Salário</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{initials(f.nome)}</div>
                      <span style={{ fontWeight: 500 }}>{f.nome}</span>
                      {f.id === me?.id && <span className="badge badge-blue" style={{ fontSize: 9 }}>Você</span>}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{f.usuario}</td>
                  <td>{f.telefone}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.cpf}</td>
                  <td style={{ fontSize: 11 }}>{f.email}</td>
                  <td><span className={`badge ${cargoBadge[f.cargo]}`}>{cargoLabels[f.cargo]}</span></td>
                  <td>{f.turno ? <span className={`badge ${turnoBadge[f.turno]}`}>{turnoLabels[f.turno]}</span> : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>}</td>
                  <td style={{ fontWeight: 500 }}>R$ {f.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleEdit(f)}><Edit2 size={13} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(f.id)} disabled={f.id === me?.id}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Nenhum funcionário encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
