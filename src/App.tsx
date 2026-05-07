import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Vendas from './pages/Vendas';
import Estoque from './pages/Estoque';
import Geladeira from './pages/Geladeira';
import Notificacoes from './pages/Notificacoes';
import Produtos from './pages/Produtos';
import Fornecedores from './pages/Fornecedores';
import Funcionarios from './pages/Funcionarios';
import Relatorios from './pages/Relatorios';

function PageRouter() {
  const { currentPage } = useApp();
  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    vendas: <Vendas />,
    estoque: <Estoque />,
    geladeira: <Geladeira />,
    notificacoes: <Notificacoes />,
    produtos: <Produtos />,
    fornecedores: <Fornecedores />,
    funcionarios: <Funcionarios />,
    relatorios: <Relatorios />,
  };
  return <>{pages[currentPage] ?? <Dashboard />}</>;
}

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div className="page-content">
          <PageRouter />
        </div>
      </div>
    </div>
  );
}
