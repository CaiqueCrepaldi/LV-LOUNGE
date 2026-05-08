import { AlertCircle, Clock, Wrench, CheckCircle, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { SeveridadeAlerta, TipoAlerta } from '../types';

const severidadeClass: Record<SeveridadeAlerta, string> = {
  critico: 'alert-danger', aviso: 'alert-warn', info: 'alert-info',
};

const tipoIcon: Record<TipoAlerta, React.ReactNode> = {
  estoque: <AlertCircle size={18} />,
  validade: <Clock size={18} />,
  manutencao: <Wrench size={18} />,
  sistema: <Bell size={18} />,
};

export default function Notificacoes() {
  const { notificacoes, setNotificacoes } = useApp();

  const marcarLida = (id: string) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const marcarTodas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const naoLidas = notificacoes.filter(n => !n.lida);
  const lidas = notificacoes.filter(n => n.lida);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Notificações</div>
            <div className="page-subtitle">Alertas de estoque, validade e sistema</div>
          </div>
          {naoLidas.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={marcarTodas}>
              <CheckCircle size={13} /> Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      {naoLidas.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 10 }}>
            NÃO LIDAS ({naoLidas.length})
          </div>
          <div className="alert-list">
            {naoLidas.map(n => (
              <div
                key={n.id}
                className={`alert-item ${severidadeClass[n.severidade]}`}
                style={{ borderRadius: 10, padding: '14px 16px', cursor: 'pointer', border: '1px solid transparent' }}
              >
                {tipoIcon[n.tipo]}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{n.titulo}</div>
                  <div style={{ fontSize: 12 }}>{n.mensagem}</div>
                  <div style={{ fontSize: 10, marginTop: 5, opacity: 0.6 }}>{n.data} às {n.horario}</div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => marcarLida(n.id)}
                  style={{ flexShrink: 0 }}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {lidas.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 10 }}>
            LIDAS ({lidas.length})
          </div>
          <div className="alert-list">
            {lidas.map(n => (
              <div
                key={n.id}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, opacity: 0.6 }}
              >
                {tipoIcon[n.tipo]}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{n.titulo}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.mensagem}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{n.data} às {n.horario}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notificacoes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Bell size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p>Nenhuma notificação</p>
        </div>
      )}
    </div>
  );
}
