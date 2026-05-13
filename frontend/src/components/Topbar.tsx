import { Search, Bell, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PageId } from '../types';

const pageTitles: Record<PageId, string> = {
  dashboard: 'Dashboard',
  vendas: 'Caixa / Vendas',
  estoque: 'Estoque',
  geladeira: 'Geladeira da LV',
  notificacoes: 'Alertas',
  produtos: 'Cadastro de Produtos',
  fornecedores: 'Fornecedores',
  funcionarios: 'Funcionários',
  relatorios: 'Relatórios',
};

export default function Topbar() {
  const { currentPage, setCurrentPage, notificacoesNaoLidas } = useApp();

  return (
    <header className="topbar">
      <span className="topbar-title">{pageTitles[currentPage]}</span>
      <div className="topbar-spacer" />
      <button className="topbar-btn" title="Buscar">
        <Search size={16} />
      </button>
      <button
        className="topbar-btn"
        title="Alertas"
        onClick={() => setCurrentPage('notificacoes')}
      >
        <Bell size={16} />
        {notificacoesNaoLidas > 0 && <span className="notif-dot" />}
      </button>
      <button className="topbar-btn" title="Configurações">
        <Settings size={16} />
      </button>
    </header>
  );
}
