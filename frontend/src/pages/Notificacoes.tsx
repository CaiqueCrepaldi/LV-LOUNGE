import { useState } from 'react';
import { AlertCircle, Clock, Wrench, Bell, CheckCircle, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { SeveridadeAlerta, TipoAlerta } from '../types';

const tipoIcon: Record<TipoAlerta, React.ReactNode> = {
  estoque: <AlertCircle size={20} />,
  validade: <Clock size={20} />,
  manutencao: <Wrench size={20} />,
  sistema: <Bell size={20} />,
};

const severidadeConfig: Record<SeveridadeAlerta, { label: string; bg: string; border: string; color: string; badgeBg: string }> = {
  critico: { label: 'CRÍTICO', bg: 'var(--red-bg)', border: 'var(--red-text)', color: 'var(--red-text)', badgeBg: 'var(--red-text)' },
  aviso:   { label: 'AVISO',   bg: 'var(--amber-bg)', border: 'var(--amber-text)', color: 'var(--amber-text)', badgeBg: 'var(--amber-text)' },
  info:    { label: 'INFO',    bg: 'var(--blue-pale)', border: 'var(--blue)', color: '#042C53', badgeBg: 'var(--blue)' },
};

export default function Notificacoes() {
  const { notificacoes, setNotificacoes } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const resolver = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, resolvido: true, lida: true } : n));
    setExpandedId(null);
  };

  const pendentes = notificacoes.filter(n => !n.resolvido);
  const resolvidos = notificacoes.filter(n => n.resolvido);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Alertas</div>
        <div className="page-subtitle">Estoque, validade e sistema</div>
      </div>

      {pendentes.length === 0 && resolvidos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Bell size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p>Nenhum alerta</p>
        </div>
      )}

      {pendentes.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 12 }}>
            PENDENTES ({pendentes.length})
          </div>
          <div className="grid-2">
            {pendentes.map(n => {
              const cfg = severidadeConfig[n.severidade];
              const isExpanded = expandedId === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => toggleExpand(n.id)}
                  style={{
                    background: cfg.bg,
                    border: `1.5px solid ${isExpanded ? cfg.border : 'transparent'}`,
                    borderRadius: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {/* Cabeçalho do card */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ color: cfg.color, marginTop: 1, flexShrink: 0 }}>
                      {tipoIcon[n.tipo]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 9, fontWeight: 800, letterSpacing: 0.8,
                          background: cfg.badgeBg, color: '#fff',
                          borderRadius: 4, padding: '2px 6px',
                        }}>
                          {cfg.label}
                        </span>
                        <span style={{ fontSize: 10, color: cfg.color, opacity: 0.7 }}>
                          {n.data} · {n.horario}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: cfg.color, lineHeight: 1.3 }}>
                        {n.titulo}
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      style={{
                        color: cfg.color, opacity: 0.5, flexShrink: 0,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        marginTop: 3,
                      }}
                    />
                  </div>

                  {/* Conteúdo expandido */}
                  {isExpanded && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${cfg.border}33` }}>
                      <p style={{ fontSize: 12, color: cfg.color, lineHeight: 1.6, marginBottom: 14, opacity: 0.9 }}>
                        {n.mensagem}
                      </p>
                      <button
                        onClick={(e) => resolver(n.id, e)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: 'var(--green-bg)', color: 'var(--green-text)',
                          border: '1px solid var(--green-text)', borderRadius: 7,
                          padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        <CheckCircle size={13} /> Marcar como resolvido
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {resolvidos.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 12 }}>
            RESOLVIDOS ({resolvidos.length})
          </div>
          <div className="grid-2">
            {resolvidos.map(n => (
              <div
                key={n.id}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '14px 16px', opacity: 0.5,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ color: 'var(--text-muted)', marginTop: 1, flexShrink: 0 }}>
                    {tipoIcon[n.tipo]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {n.data} · {n.horario}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      {n.titulo}
                    </div>
                  </div>
                  <CheckCircle size={14} style={{ color: 'var(--green-text)', flexShrink: 0, marginTop: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
