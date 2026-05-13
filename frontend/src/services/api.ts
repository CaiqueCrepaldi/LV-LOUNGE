// ─── Camada de Serviço — LV Lounge ────────────────────────────────────────
// Documenta todos os endpoints que o backend PHP precisa implementar.
// Quando VITE_API_URL estiver configurado em .env.local, substitua cada
// função pelos fetch() comentados abaixo.

export const BASE_URL = import.meta.env.VITE_API_URL ?? '';

// ─── Endpoints esperados no backend ────────────────────────────────────────
//
// Autenticação
//   POST   /api/auth/login                 body: { usuario, senha }  → { token, user }
//   POST   /api/auth/logout
//
// Produtos
//   GET    /api/produtos
//   POST   /api/produtos                   body: Omit<Produto, 'id' | 'status'>
//   PUT    /api/produtos/:id               body: Partial<Produto>
//   DELETE /api/produtos/:id
//
// Fornecedores
//   GET    /api/fornecedores
//   POST   /api/fornecedores
//   PUT    /api/fornecedores/:id
//   DELETE /api/fornecedores/:id
//
// Funcionários
//   GET    /api/funcionarios
//   POST   /api/funcionarios               body: Omit<User, 'id' | 'ativo'>
//   PUT    /api/funcionarios/:id
//   DELETE /api/funcionarios/:id
//
// Geladeira
//   GET    /api/geladeira
//   POST   /api/geladeira
//   PUT    /api/geladeira/:id
//   DELETE /api/geladeira/:id
//
// Vendas
//   GET    /api/vendas
//   POST   /api/vendas                     body: { itens, funcionarioId }
//   PUT    /api/vendas/:id/fechar
//   PUT    /api/vendas/:id/cancelar
//
// Movimentações
//   GET    /api/movimentacoes
//   POST   /api/movimentacoes              body: { produtoId, tipo, quantidade }
//
// Notificações
//   GET    /api/notificacoes
//   PUT    /api/notificacoes/:id/lida
//   PUT    /api/notificacoes/marcar-todas-lidas
//
// Relatórios
//   GET    /api/relatorios/diario          → DadoVendaDiaria[]
//   GET    /api/relatorios/semanal         → DadoVendaSemanal[]

// ─── Utilitários de fetch (ativar quando backend estiver pronto) ────────────
//
// const authHeaders = () => ({
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${localStorage.getItem('lv_token') ?? ''}`,
// });
//
// export const get = <T>(path: string): Promise<T> =>
//   fetch(`${BASE_URL}${path}`, { headers: authHeaders() }).then(r => {
//     if (!r.ok) throw new Error(`GET ${path} falhou: ${r.status}`);
//     return r.json() as Promise<T>;
//   });
//
// export const post = <T>(path: string, body: unknown): Promise<T> =>
//   fetch(`${BASE_URL}${path}`, {
//     method: 'POST', headers: authHeaders(), body: JSON.stringify(body),
//   }).then(r => { if (!r.ok) throw new Error(`POST ${path} falhou: ${r.status}`); return r.json() as Promise<T>; });
//
// export const put = <T>(path: string, body: unknown): Promise<T> =>
//   fetch(`${BASE_URL}${path}`, {
//     method: 'PUT', headers: authHeaders(), body: JSON.stringify(body),
//   }).then(r => { if (!r.ok) throw new Error(`PUT ${path} falhou: ${r.status}`); return r.json() as Promise<T>; });
//
// export const del = (path: string): Promise<void> =>
//   fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: authHeaders() })
//     .then(r => { if (!r.ok) throw new Error(`DELETE ${path} falhou: ${r.status}`); });
