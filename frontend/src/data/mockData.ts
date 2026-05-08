import type {
  User, Produto, Fornecedor, ItemGeladeira,
  Venda, Movimentacao, Notificacao,
  DadoVendaDiaria, DadoVendaSemanal,
} from '../types';

export const mockUsers: User[] = [
  {
    id: '1', usuario: 'bianca.gerente', nome: 'Bianca A.', telefone: '(00) 00000-0001',
    cpf: '000.000.000-00', email: 'gerente@demo.local', cargo: 'gerente', turno: 'tarde',
    salario: 0, ativo: true,
  },
  {
    id: '2', usuario: 'roberto', nome: 'Roberto S.', telefone: '(00) 00000-0002',
    cpf: '000.000.000-00', email: 'barman@demo.local', cargo: 'barman', turno: 'noite',
    salario: 0, ativo: true,
  },
  {
    id: '3', usuario: 'maria', nome: 'Maria S.', telefone: '(00) 00000-0003',
    cpf: '000.000.000-00', email: 'garcom@demo.local', cargo: 'garcom', turno: 'noite',
    salario: 0, ativo: true,
  },
  {
    id: '4', usuario: 'ana', nome: 'Ana O.', telefone: '(00) 00000-0004',
    cpf: '000.000.000-00', email: 'cozinheiro@demo.local', cargo: 'cozinheiro', turno: 'tarde',
    salario: 0, ativo: true,
  },
];

export const mockProdutos: Produto[] = [
  {
    id: '1', codigo: '001', nome: 'Ballena', tipo: 'comercializado', categoria: 'bebida',
    marca: 'Ballena', estoqueAtual: 62, estoqueInicial: 200, estoqueMinimo: 60,
    preco: 150, imposto: 15, validade: '2025-12-31', vidaUtil: 'nao_perecivel', status: 'atencao',
  },
  {
    id: '2', codigo: '002', nome: 'Redbull Lata', tipo: 'comercializado', categoria: 'bebida',
    marca: 'RedBull', estoqueAtual: 144, estoqueInicial: 200, estoqueMinimo: 60,
    preco: 22, imposto: 12, validade: '2025-06-10', vidaUtil: 'nao_perecivel', status: 'normal',
  },
  {
    id: '3', codigo: '003', nome: 'Porção Tilápia', tipo: 'ingrediente', categoria: 'alimento',
    marca: 'Próprio', estoqueAtual: 18, estoqueInicial: 50, estoqueMinimo: 20,
    preco: 55, imposto: 5, validade: '2024-12-15', vidaUtil: 'perecivel', status: 'critico',
  },
  {
    id: '4', codigo: '004', nome: 'Garrafa Whisky', tipo: 'comercializado', categoria: 'bebida',
    marca: 'Jack Daniels', estoqueAtual: 80, estoqueInicial: 120, estoqueMinimo: 30,
    preco: 180, imposto: 15, validade: '2027-01-01', vidaUtil: 'nao_perecivel', status: 'normal',
  },
  {
    id: '5', codigo: '005', nome: 'Batata Frita', tipo: 'ingrediente', categoria: 'alimento',
    marca: 'Próprio', estoqueAtual: 55, estoqueInicial: 100, estoqueMinimo: 40,
    preco: 28, imposto: 5, validade: '2024-12-22', vidaUtil: 'perecivel', status: 'normal',
  },
  {
    id: '6', codigo: '006', nome: 'Garrafa Vodka', tipo: 'comercializado', categoria: 'bebida',
    marca: 'Absolut', estoqueAtual: 45, estoqueInicial: 80, estoqueMinimo: 20,
    preco: 140, imposto: 15, validade: '2027-06-01', vidaUtil: 'nao_perecivel', status: 'normal',
  },
  {
    id: '7', codigo: '007', nome: 'Garrafa Gin', tipo: 'comercializado', categoria: 'bebida',
    marca: 'Tanqueray', estoqueAtual: 30, estoqueInicial: 60, estoqueMinimo: 15,
    preco: 160, imposto: 15, validade: '2027-06-01', vidaUtil: 'nao_perecivel', status: 'normal',
  },
  {
    id: '8', codigo: '008', nome: 'Coca-Cola Lata', tipo: 'comercializado', categoria: 'bebida',
    marca: 'Coca-Cola', estoqueAtual: 200, estoqueInicial: 300, estoqueMinimo: 80,
    preco: 12, imposto: 12, validade: '2025-08-01', vidaUtil: 'nao_perecivel', status: 'normal',
  },
];

export const mockFornecedores: Fornecedor[] = [
  {
    id: '1', nome: 'Fornecedor Demo A', cnpj: '00.000.000/0001-00', telefone: '(00) 0000-0000',
    logradouro: 'Rua Exemplo', numero: '100', cep: '00000-000',
    cidade: 'Cidade Demo', estado: 'SP',
    historicoTransacao: 'Ativo desde 2023', produtoFornecido: 'Produto A',
  },
  {
    id: '2', nome: 'Fornecedor Demo B', cnpj: '00.000.000/0002-00', telefone: '(00) 0000-0001',
    logradouro: 'Av. Exemplo', numero: '200', cep: '00000-001',
    cidade: 'Cidade Demo', estado: 'SP',
    historicoTransacao: 'Ativo desde 2022', produtoFornecido: 'Produto B',
  },
];

export const mockGeladeira: ItemGeladeira[] = [
  {
    id: '1', produtoId: '1', produtoNome: 'Ballena', categoria: 'bebida',
    quantidade: 200, temperatura: -5, horario: '15:30', data: '2024-11-13',
    validade: '2025-12-31', status: 'normal',
  },
  {
    id: '2', produtoId: '3', produtoNome: 'Peixe (Tilápia)', categoria: 'alimento',
    quantidade: 18, temperatura: -8, horario: '09:00', data: '2024-11-12',
    validade: '2024-12-15', status: 'critico',
  },
  {
    id: '3', produtoId: '5', produtoNome: 'Frango', categoria: 'alimento',
    quantidade: 40, temperatura: -6, horario: '11:00', data: '2024-11-13',
    validade: '2024-12-20', status: 'normal',
  },
];

export const mockVendas: Venda[] = [
  {
    id: '1', comanda: '042', funcionarioId: '2', funcionarioNome: 'Roberto',
    itens: [
      { id: '1', produtoId: '1', descricao: 'Ballena', quantidade: 2, precoUnitario: 150, imposto: 'icms_12', total: 300 },
      { id: '2', produtoId: '2', descricao: 'Redbull', quantidade: 4, precoUnitario: 22, imposto: 'iss_5', total: 88 },
      { id: '3', produtoId: '5', descricao: 'Batata Frita', quantidade: 1, precoUnitario: 28, imposto: 'isento', total: 28 },
    ],
    total: 416, data: '2024-11-13', horario: '21:34', status: 'fechada',
  },
];

export const mockMovimentacoes: Movimentacao[] = [
  { id: '1', produtoId: '1', produtoNome: 'Ballena', tipo: 'saida', quantidade: 12, horario: '21:34', data: '2024-11-13', funcionarioNome: 'Roberto', status: 'ok' },
  { id: '2', produtoId: '2', produtoNome: 'Redbull', tipo: 'entrada', quantidade: 48, horario: '20:10', data: '2024-11-13', funcionarioNome: 'Maria', status: 'ok' },
  { id: '3', produtoId: '3', produtoNome: 'Porção Tilápia', tipo: 'saida', quantidade: 5, horario: '19:55', data: '2024-11-13', funcionarioNome: 'Roberto', status: 'ok' },
  { id: '4', produtoId: '4', produtoNome: 'Whisky Combo', tipo: 'saida', quantidade: 3, horario: '19:20', data: '2024-11-13', funcionarioNome: 'Ana', status: 'verificar' },
];

export const mockNotificacoes: Notificacao[] = [
  {
    id: '1', tipo: 'estoque', severidade: 'critico', titulo: 'Estoque crítico: Ballena',
    mensagem: 'Seu estoque de Ballena está próximo do mínimo (62/60 produtos). Solicite reposição imediatamente.',
    data: '2024-11-13', horario: '21:30', lida: false,
  },
  {
    id: '2', tipo: 'validade', severidade: 'aviso', titulo: 'Validade próxima: Peixe (Tilápia)',
    mensagem: 'Seu estoque de peixe está próximo de vencer (15/12/2024 — menos de 1 semana).',
    data: '2024-11-13', horario: '09:00', lida: false,
  },
  {
    id: '3', tipo: 'manutencao', severidade: 'info', titulo: 'Manutenção preventiva',
    mensagem: 'A manutenção dos seus equipamentos pode estar próxima (Data: Mês 12).',
    data: '2024-11-12', horario: '15:00', lida: false,
  },
];

export const mockVendasDiarias: DadoVendaDiaria[] = [
  { produto: 'Ballena', quantidade: 24, total: 3600 },
  { produto: 'Redbull', quantidade: 60, total: 1320 },
  { produto: 'Vodka', quantidade: 8, total: 1120 },
  { produto: 'Porção Frango', quantidade: 15, total: 630 },
  { produto: 'Batata Frita', quantidade: 20, total: 560 },
  { produto: 'Whisky', quantidade: 5, total: 900 },
];

export const mockVendasSemanais: DadoVendaSemanal[] = [
  { dia: 'Seg', lucro: 3200, produtos: 45 },
  { dia: 'Ter', lucro: 4100, produtos: 58 },
  { dia: 'Qua', lucro: 2900, produtos: 38 },
  { dia: 'Qui', lucro: 5500, produtos: 72 },
  { dia: 'Sex', lucro: 7800, produtos: 105 },
  { dia: 'Sáb', lucro: 9200, produtos: 130 },
  { dia: 'Dom', lucro: 6400, produtos: 88 },
];
