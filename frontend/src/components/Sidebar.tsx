import {
  LayoutDashboard, ShoppingCart, Package, Snowflake,
  Bell, Box, Truck, Users, BarChart2, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import type { PageId } from '../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  gerenteOnly?: boolean;
}

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: 'VISÃO GERAL',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    ],
  },
  {
    label: 'OPERAÇÕES',
    items: [
      { id: 'vendas', label: 'Caixa / Vendas', icon: <ShoppingCart /> },
      { id: 'estoque', label: 'Estoque', icon: <Package /> },
      { id: 'geladeira', label: 'Geladeira da LV', icon: <Snowflake /> },
      { id: 'notificacoes', label: 'Notificações', icon: <Bell /> },
    ],
  },
  {
    label: 'CADASTROS',
    items: [
      { id: 'produtos', label: 'Produtos', icon: <Box /> },
      { id: 'fornecedores', label: 'Fornecedores', icon: <Truck />, gerenteOnly: true },
      { id: 'funcionarios', label: 'Funcionários', icon: <Users />, gerenteOnly: true },
    ],
  },
  {
    label: 'RELATÓRIOS',
    items: [
      { id: 'relatorios', label: 'Relatórios', icon: <BarChart2 />, gerenteOnly: true },
    ],
  },
];

export default function Sidebar() {
  const { user, logout, isGerente } = useAuth();
  const { currentPage, setCurrentPage, notificacoesNaoLidas } = useApp();

  const initials = user?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('') ?? '??';
  const cargoLabel: Record<string, string> = {
    gerente: 'Gerente · Admin',
    barman: 'Barman',
    garcom: 'Garçom',
    cozinheiro: 'Cozinheiro',
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">LV</div>
        <div>
          <div className="logo-name">LV Lounge</div>
          <div className="logo-sub">SISTEMA DE GESTÃO</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => {
          const visibleItems = section.items.filter(item =>
            isGerente || !item.gerenteOnly
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {visibleItems.map(item => (
                <div
                  key={item.id}
                  className={`nav-item${currentPage === item.id ? ' active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  {item.icon}
                  {item.label}
                  {item.id === 'notificacoes' && notificacoesNaoLidas > 0 && (
                    <span className="nav-badge">{notificacoesNaoLidas}</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.nome}
          </div>
          <div className="user-role">{cargoLabel[user?.cargo ?? ''] ?? user?.cargo}</div>
        </div>
        <button
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 4 }}
          onClick={logout}
          title="Sair"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
