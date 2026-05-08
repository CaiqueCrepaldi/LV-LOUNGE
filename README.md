# LV Lounge — Sistema de Gestão

Sistema de gerenciamento de estoque, vendas, funcionários e fornecedores da casa de shows **LV Lounge**, desenvolvido em React + TypeScript + Vite.

---

## Como rodar

### Pré-requisitos
- Node.js 18+
- npm 9+

### Frontend (desenvolvimento)

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

### Monorepo (frontend + backend juntos)

```bash
# Na raiz do projeto
npm run install:all   # instala dependências em ambos
npm run dev           # roda frontend e backend simultaneamente
```

**Login de demonstração:**
- Usuário: `bianca.gerente`
- Senha: `12345678`

---

## Estrutura do projeto

```
LV-LOUNGE/
├── frontend/                   # Aplicação React
│   └── src/
│       ├── context/
│       │   ├── AuthContext.tsx     # Autenticação e controle de usuário logado
│       │   └── AppContext.tsx      # Estado global + persistência localStorage
│       ├── data/
│       │   └── mockData.ts         # Dados mock para desenvolvimento
│       ├── pages/
│       │   ├── LoginPage.tsx       # Tela de login
│       │   ├── Dashboard.tsx       # Visão geral com métricas em tempo real
│       │   ├── Vendas.tsx          # Caixa aberto / comanda
│       │   ├── Estoque.tsx         # Controle de estoque
│       │   ├── Geladeira.tsx       # Produtos na geladeira (temp/data/horário)
│       │   ├── Notificacoes.tsx    # Central de alertas
│       │   ├── Produtos.tsx        # CRUD de produtos
│       │   ├── Fornecedores.tsx    # CRUD de fornecedores
│       │   ├── Funcionarios.tsx    # CRUD de funcionários
│       │   └── Relatorios.tsx      # Relatórios diário e semanal
│       ├── components/
│       │   ├── Sidebar.tsx         # Menu lateral com navegação
│       │   ├── Topbar.tsx          # Barra superior
│       │   ├── ConfirmModal.tsx    # Modal de confirmação reutilizável
│       │   └── Toast.tsx           # Notificações temporárias
│       ├── utils/
│       │   └── masks.ts            # Máscaras de input (CPF, CNPJ, moeda, etc.)
│       ├── types/
│       │   └── index.ts            # Todas as interfaces TypeScript
│       ├── styles/
│       │   └── global.css          # Variáveis CSS e estilos globais
│       ├── App.tsx                 # Roteamento e layout principal
│       └── main.tsx                # Entry point
│
└── backend/                    # API Express (em desenvolvimento)
    └── src/
        ├── routes/
        │   ├── auth.ts             # POST /api/auth/login
        │   ├── vendas.ts           # CRUD /api/vendas
        │   ├── produtos.ts         # CRUD /api/produtos
        │   ├── fornecedores.ts     # CRUD /api/fornecedores
        │   ├── funcionarios.ts     # CRUD /api/funcionarios
        │   └── movimentacoes.ts    # CRUD /api/movimentacoes
        └── index.ts               # Entry point Express
```

---

## Níveis de acesso

| Cargo | Dashboard | Vendas | Estoque | Geladeira | Notif. | Produtos | Fornecedores | Funcionários | Relatórios |
|---|---|---|---|---|---|---|---|---|---|
| Gerente | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Barman / Garçom / Cozinheiro | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Funcionalidades implementadas

- Dashboard com métricas conectadas ao estado real da aplicação
- Caixa aberto com comanda numerada, cardápio do estoque e cálculo de impostos
- Persistência das vendas do dia via `localStorage` (reset automático à meia-noite)
- Estoque com filtro por status (Normal / Atenção / Crítico)
- Geladeira com controle de temperatura, data e horário de entrada
- Cadastro completo de Produtos com validade ou "validade indeterminada"
- Cadastro de Fornecedores com CNPJ, endereço e produto fornecido
- Cadastro de Funcionários com CPF, turno, salário e controle de senha
- Máscaras de input em todos os campos (CPF, CNPJ, telefone, CEP, moeda, percentual)
- Relatórios diário e semanal com exportação CSV
- Central de notificações (validade e estoque crítico)
- Controle de acesso por cargo (gerente vs. demais)

---

## Design

- **Fonte display:** Syne (títulos e números)
- **Fonte body:** DM Sans (texto corrido)
- **Cor primária:** `#2B7FD4` (azul LV Lounge)
- **Paleta completa:** definida em `src/styles/global.css` como variáveis CSS

---

## Próximos passos (backend)

1. Substituir `mockData.ts` por chamadas à API real
2. Implementar autenticação com JWT
3. Conectar banco de dados (SQLite ou PostgreSQL)
4. Adicionar React Query para cache e sincronização
5. Alertas automáticos via webhook ou e-mail
