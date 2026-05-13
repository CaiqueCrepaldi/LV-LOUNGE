import React, { createContext, useContext, useState } from 'react';
import type {
  Produto, Fornecedor, ItemGeladeira, Venda,
  User, Movimentacao, Notificacao, PageId,
  DadoVendaDiaria, DadoVendaSemanal,
} from '../types';
import {
  mockProdutos, mockFornecedores, mockGeladeira,
  mockVendas, mockUsers, mockMovimentacoes, mockNotificacoes,
  mockVendasDiarias, mockVendasSemanais,
} from '../data/mockData';

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (p: PageId) => void;
  produtos: Produto[];
  setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
  fornecedores: Fornecedor[];
  setFornecedores: React.Dispatch<React.SetStateAction<Fornecedor[]>>;
  geladeira: ItemGeladeira[];
  setGeladeira: React.Dispatch<React.SetStateAction<ItemGeladeira[]>>;
  vendas: Venda[];
  setVendas: React.Dispatch<React.SetStateAction<Venda[]>>;
  funcionarios: User[];
  setFuncionarios: React.Dispatch<React.SetStateAction<User[]>>;
  movimentacoes: Movimentacao[];
  setMovimentacoes: React.Dispatch<React.SetStateAction<Movimentacao[]>>;
  notificacoes: Notificacao[];
  setNotificacoes: React.Dispatch<React.SetStateAction<Notificacao[]>>;
  vendasDiarias: DadoVendaDiaria[];
  setVendasDiarias: React.Dispatch<React.SetStateAction<DadoVendaDiaria[]>>;
  vendasSemanais: DadoVendaSemanal[];
  setVendasSemanais: React.Dispatch<React.SetStateAction<DadoVendaSemanal[]>>;
  notificacoesNaoLidas: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(mockFornecedores);
  const [geladeira, setGeladeira] = useState<ItemGeladeira[]>(mockGeladeira);
  const [vendas, setVendas] = useState<Venda[]>(mockVendas);
  const [funcionarios, setFuncionarios] = useState<User[]>(mockUsers);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(mockMovimentacoes);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(mockNotificacoes);
  const [vendasDiarias, setVendasDiarias] = useState<DadoVendaDiaria[]>(mockVendasDiarias);
  const [vendasSemanais, setVendasSemanais] = useState<DadoVendaSemanal[]>(mockVendasSemanais);

  const notificacoesNaoLidas = notificacoes.filter(n => !n.resolvido).length;

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      produtos, setProdutos,
      fornecedores, setFornecedores,
      geladeira, setGeladeira,
      vendas, setVendas,
      funcionarios, setFuncionarios,
      movimentacoes, setMovimentacoes,
      notificacoes, setNotificacoes,
      vendasDiarias, setVendasDiarias,
      vendasSemanais, setVendasSemanais,
      notificacoesNaoLidas,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
