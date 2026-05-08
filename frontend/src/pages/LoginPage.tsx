import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState('bianca.gerente');
  const [senha, setSenha] = useState('12345678');
  const [erro, setErro] = useState('');

  const handleLogin = () => {
    const ok = login(usuario, senha);
    if (!ok) setErro('Usuário ou senha incorretos. Tente novamente.');
    else setErro('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">LV</div>
          <div>
            <div className="login-logo-text">LV Lounge</div>
            <div className="login-logo-sub">Sistema de Gestão</div>
          </div>
        </div>

        <div className="login-title">Faça seu login</div>
        <div className="login-sub">Entre com seu usuário e senha para acessar</div>

        {erro && <div className="login-error">{erro}</div>}

        <div className="login-field">
          <label className="login-label">Usuário</label>
          <input
            className="login-input"
            type="text"
            placeholder="seu.usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="login-field">
          <label className="login-label">Senha</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="login-opts">
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> Lembrar acesso
          </label>
          <span className="login-link">Esqueceu a senha?</span>
        </div>

        <button className="login-submit" onClick={handleLogin}>
          ENTRAR
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          Novo funcionário?{' '}
          <span className="login-link">Solicite acesso ao gerente</span>
        </div>

        <div style={{ marginTop: 20, padding: '10px 12px', background: 'var(--blue-xpale)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--blue-dark)' }}>Demo:</strong> usuario <code>bianca.gerente</code> · senha <code>12345678</code>
        </div>
      </div>
    </div>
  );
}
