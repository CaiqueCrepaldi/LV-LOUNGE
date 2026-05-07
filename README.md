# LV Lounge — Sistema de Gestão

Frontend completo em **React + TypeScript + Vite** para o sistema de gerenciamento de estoque e vendas da casa de shows LV Lounge.

---

## 🚀 Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Acesse: http://localhost:5173
```

**Login de demonstração:**
- Usuário: `bianca.gerente`
- Senha: `12345678`

---

## 📁 Estrutura do projeto

```
src/
├── context/
│   ├── AuthContext.tsx     # Autenticação e controle de usuário logado
│   └── AppContext.tsx      # Estado global (produtos, vendas, etc.)
├── data/
│   └── mockData.ts         # Dados mock para desenvolvimento (substituir por API)
├── pages/
│   ├── LoginPage.tsx       # Tela de login
│   ├── Dashboard.tsx       # Visão geral com métricas
│   ├── Vendas.tsx          # Caixa aberto / comanda
│   ├── Estoque.tsx         # Controle de estoque
│   ├── Geladeira.tsx       # Produtos na geladeira (temp/data/horário)
│   ├── Notificacoes.tsx    # Central de alertas
│   ├── Produtos.tsx        # CRUD de produtos
│   ├── Fornecedores.tsx    # CRUD de fornecedores
│   ├── Funcionarios.tsx    # CRUD de funcionários
│   └── Relatorios.tsx      # Relatórios diário e semanal
├── components/
│   ├── Sidebar.tsx         # Menu lateral com navegação
│   └── Topbar.tsx          # Barra superior
├── types/
│   └── index.ts            # Todas as interfaces TypeScript
├── styles/
│   └── global.css          # Variáveis CSS e estilos globais
├── App.tsx                 # Roteamento e layout principal
└── main.tsx               # Entry point
```

---

## 🔐 Níveis de acesso

| Cargo | Dashboard | Vendas | Estoque | Geladeira | Notif. | Produtos | Fornecedores | Funcionários | Relatórios |
|-------|-----------|--------|---------|-----------|--------|----------|-------------|-------------|------------|
| Gerente | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Barman/Garçom/Cozinheiro | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🔧 Próximos passos (backend)

1. **Substituir `mockData.ts`** por chamadas à API real (ex: Axios ou fetch)
2. **Adicionar React Query** para cache e sincronização de dados
3. **Implementar persistência** no banco de dados (requisitos: SQLite ou PostgreSQL)
4. **Conectar autenticação** com JWT
5. **Alertas automáticos**: integrar a lógica de notificação com o backend

---

## 🎨 Design

- **Fonte display:** Syne (títulos e números)
- **Fonte body:** DM Sans (texto corrido)
- **Cor primária:** `#2B7FD4` (azul LV Lounge — aprovado pelo cliente)
- **Paleta completa:** definida em `src/styles/global.css` como variáveis CSS

---

## 📋 Requisitos funcionais implementados

- ✅ RF001 — Gerenciamento de estoque
- ✅ RF002 — Alertas de reabastecimento
- ✅ RF003 — Registro de movimentações
- ✅ RF004 — Cadastro de produtos
- ✅ RF005 — Especificação de tipo (comercializado/ingrediente)
- ✅ RF006/RF007 — Vida útil e alertas de validade
- ✅ RF008 — Horário e data do produto armazenado (geladeira)
- ✅ RF009/RF010 — Registro e consulta/edição de vendas
- ✅ RF011/RF012 — Relatório diário e semanal
- ✅ RF013/RF014 — Cadastro e gestão de fornecedores
- ✅ RF015/RF016 — Produtos na geladeira/freezer
- ✅ RF017/RF018 — Cadastro e gestão de funcionários
- ✅ RF019 — Níveis de acesso por cargo
- ✅ RF020 — Tela principal diferente por nível de acesso
