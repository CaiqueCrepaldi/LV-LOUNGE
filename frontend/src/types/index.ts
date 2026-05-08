// ─── Usuário / Auth ───────────────────────────────────────────────
export type UserRole = 'gerente' | 'barman' | 'garcom' | 'cozinheiro';
export type Turno = 'tarde' | 'noite' | 'madrugada';

export interface User {
  id: string;
  usuario: string;
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  cargo: UserRole;
  turno?: Turno;
  salario: number;
  senha?: string;
  ativo: boolean;
}

// ─── Produto ──────────────────────────────────────────────────────
export type TipoProduto = 'comercializado' | 'ingrediente';
export type CategoriaProduto = 'bebida' | 'alimento' | 'descartavel';
export type VidaUtil = 'perecivel' | 'nao_perecivel';
export type StatusEstoque = 'normal' | 'atencao' | 'critico';

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  tipo: TipoProduto;
  categoria: CategoriaProduto;
  marca: string;
  estoqueAtual: number;
  estoqueInicial: number;
  estoqueMinimo: number;
  preco: number;
  imposto: number;
  validade: string;
  vidaUtil: VidaUtil;
  status: StatusEstoque;
}

// ─── Fornecedor ───────────────────────────────────────────────────
export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  logradouro: string;
  numero: string;
  cep: string;
  cidade: string;
  estado: string;
  historicoTransacao: string;
  produtoFornecido: string;
}

// ─── Geladeira ────────────────────────────────────────────────────
export interface ItemGeladeira {
  id: string;
  produtoId: string;
  produtoNome: string;
  categoria: CategoriaProduto;
  quantidade: number;
  temperatura: number;
  horario: string;
  data: string;
  validade: string;
  status: StatusEstoque;
}

// ─── Vendas / Comanda ─────────────────────────────────────────────
export type TipoImposto = 'iss_5' | 'icms_12' | 'isento';

export interface ItemComanda {
  id: string;
  produtoId: string;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  imposto: TipoImposto;
  total: number;
}

export interface Venda {
  id: string;
  comanda: string;
  funcionarioId: string;
  funcionarioNome: string;
  itens: ItemComanda[];
  total: number;
  data: string;
  horario: string;
  status: 'aberta' | 'fechada' | 'cancelada';
}

// ─── Movimentação de Estoque ──────────────────────────────────────
export type TipoMovimentacao = 'entrada' | 'saida';

export interface Movimentacao {
  id: string;
  produtoId: string;
  produtoNome: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  horario: string;
  data: string;
  funcionarioNome: string;
  status: 'ok' | 'verificar' | 'erro';
}

// ─── Notificação ──────────────────────────────────────────────────
export type TipoAlerta = 'estoque' | 'validade' | 'manutencao' | 'sistema';
export type SeveridadeAlerta = 'info' | 'aviso' | 'critico';

export interface Notificacao {
  id: string;
  tipo: TipoAlerta;
  severidade: SeveridadeAlerta;
  titulo: string;
  mensagem: string;
  data: string;
  horario: string;
  lida: boolean;
}

// ─── Relatório ────────────────────────────────────────────────────
export interface DadoVendaDiaria {
  produto: string;
  quantidade: number;
  total: number;
}

export interface DadoVendaSemanal {
  dia: string;
  lucro: number;
  produtos: number;
}

// ─── API ──────────────────────────────────────────────────────────
// Tipo de resposta padrão do backend PHP (usado quando BASE_URL for configurado)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ─── App State ────────────────────────────────────────────────────
export type PageId =
  | 'dashboard'
  | 'vendas'
  | 'estoque'
  | 'geladeira'
  | 'notificacoes'
  | 'produtos'
  | 'fornecedores'
  | 'funcionarios'
  | 'relatorios';
