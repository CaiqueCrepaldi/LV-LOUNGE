import { useState } from 'react';
import { Plus, X, ShoppingCart, CheckCircle, AlertTriangle, CreditCard, Banknote, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import type { ItemComanda, TipoImposto, FormaPagamento } from '../types';
import { formatCurrency, parseCurrency } from '../utils/masks';

let itemIdCounter = 100;

const novaComanda = () => String(Math.floor(Math.random() * 900) + 100);

const TAX_RATE: Record<TipoImposto, number> = { iss_5: 0.05, icms_12: 0.12, isento: 0 };

const impostoLabel: Record<TipoImposto, string> = {
  iss_5: 'ISS 5%', icms_12: 'ICMS 12%', isento: 'Isento',
};

const categoriaEmoji: Record<string, string> = {
  bebida: '🥤', alimento: '🍽️', descartavel: '📦',
};

const mapImpostoTipo = (imp: number): TipoImposto =>
  imp === 5 ? 'iss_5' : imp === 12 ? 'icms_12' : 'isento';

const formaLabel: Record<FormaPagamento, string> = {
  debito: 'Débito', credito: 'Crédito', pix: 'PIX', dinheiro: 'Dinheiro',
};

const maxParcelas = (total: number): number => {
  if (total < 50) return 1;
  if (total < 100) return 2;
  if (total < 200) return 3;
  if (total < 500) return 6;
  return 12;
};

// Acréscimo (%) por número de parcelas no crédito
const JUROS_PARCELA: Record<number, number> = {
  1: 0, 2: 2, 3: 4, 4: 6, 5: 8, 6: 10,
  7: 13, 8: 16, 9: 19, 10: 22, 11: 25, 12: 28,
};

const opcoesForma: { key: FormaPagamento; label: string; icon: React.ReactNode }[] = [
  { key: 'debito',   label: 'Débito',   icon: <CreditCard size={18} /> },
  { key: 'credito',  label: 'Crédito',  icon: <CreditCard size={18} /> },
  { key: 'pix',      label: 'PIX',      icon: <Zap size={18} /> },
  { key: 'dinheiro', label: 'Dinheiro', icon: <Banknote size={18} /> },
];

export default function Vendas() {
  const { setVendas, produtos } = useApp();
  const { user } = useAuth();
  const toast = useToast();
  const [itens, setItens] = useState<ItemComanda[]>([]);
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [imposto, setImposto] = useState<TipoImposto>('isento');
  const [comandaNum, setComanadaNum] = useState(novaComanda);
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null);
  const [parcelas, setParcelas] = useState(1);

  const produtosDisponiveis = produtos.filter(p => p.estoqueAtual > 0);

  const addItem = (nome?: string, precoVal?: number, produtoId?: string, impostoOverride?: TipoImposto) => {
    const desc = nome ?? descricao;
    const val = precoVal ?? parseCurrency(preco);
    const imp = impostoOverride ?? imposto;
    if (!desc || isNaN(val)) return;
    const subtotal = val * quantidade;
    const total = subtotal * (1 + TAX_RATE[imp]);
    setItens(prev => [...prev, {
      id: String(++itemIdCounter),
      produtoId: produtoId ?? '0',
      descricao: desc,
      quantidade,
      precoUnitario: val,
      imposto: imp,
      total,
    }]);
    setDescricao(''); setPreco(''); setQuantidade(1);
  };

  const removeItem = (id: string) => setItens(prev => prev.filter(i => i.id !== id));

  const subtotalSemImposto = itens.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0);
  const totalImpostos = itens.reduce((s, i) => s + i.precoUnitario * i.quantidade * TAX_RATE[i.imposto], 0);
  const totalComanda = subtotalSemImposto + totalImpostos;

  const juros = formaPagamento === 'credito' && parcelas > 1 ? (JUROS_PARCELA[parcelas] ?? 0) : 0;
  const acrescimo = totalComanda * juros / 100;
  const totalFinal = totalComanda + acrescimo;

  const confirmarFechamento = () => {
    if (!formaPagamento) return;
    setVendas(prev => [...prev, {
      id: String(Date.now()),
      comanda: comandaNum,
      funcionarioId: user?.id ?? '',
      funcionarioNome: user?.nome ?? '',
      itens,
      total: totalFinal,
      data: new Date().toISOString().slice(0, 10),
      horario: new Date().toTimeString().slice(0, 5),
      status: 'fechada',
      formaPagamento,
      parcelas: formaPagamento === 'credito' ? parcelas : 1,
    }]);
    const parcelasInfo = formaPagamento === 'credito' && parcelas > 1 ? ` · ${parcelas}x (+${juros}%)` : '';
    toast(`Comanda #${comandaNum} fechada — R$${totalFinal.toFixed(2)} · ${formaLabel[formaPagamento]}${parcelasInfo}`);
    setItens([]);
    setMostrarResumo(false);
    setFormaPagamento(null);
    setParcelas(1);
    setComanadaNum(novaComanda());
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Caixa Aberto</div>
        <div className="page-subtitle">Registro de vendas por comanda</div>
      </div>

      <div className="comanda-layout">
        {/* Produtos do estoque */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--text)' }}>
            Produtos em Estoque
          </div>
          {produtosDisponiveis.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              Nenhum produto disponível no estoque.
            </div>
          ) : (
            <div className="cardapio-grid">
              {produtosDisponiveis.map(p => (
                <div
                  key={p.id}
                  className="cardapio-item"
                  onClick={() => addItem(p.nome, p.preco, p.id, mapImpostoTipo(p.imposto))}
                  title={`Estoque: ${p.estoqueAtual} un`}
                >
                  <span className="cardapio-emoji">{categoriaEmoji[p.categoria] ?? '📦'}</span>
                  {p.nome}
                  <div className="cardapio-price">R${p.preco.toFixed(2)}</div>
                  {p.status !== 'normal' && (
                    <div style={{ fontSize: 9, marginTop: 2, color: p.status === 'critico' ? 'var(--red)' : 'var(--amber)', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                      <AlertTriangle size={9} /> {p.estoqueAtual} un
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comanda */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={18} /> Comanda #{comandaNum}
            </div>
            <span className="badge badge-green">Aberta</span>
          </div>

          {!mostrarResumo ? (
            <>
              {/* Form adicionar item */}
              <div className="form-row form-row-2" style={{ marginBottom: 10 }}>
                <div className="form-group">
                  <div className="form-label">Descrição do produto</div>
                  <input className="form-control" placeholder="Nome ou código..." value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
                <div className="form-group">
                  <div className="form-label">Preço unitário (R$)</div>
                  <input
                    className="form-control"
                    placeholder="0,00"
                    value={preco}
                    onChange={e => setPreco(e.target.value.replace(/[^\d,]/g, ''))}
                    onBlur={e => setPreco(formatCurrency(e.target.value))}
                    inputMode="decimal"
                  />
                </div>
              </div>
              <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
                <div className="form-group">
                  <div className="form-label">Quantidade</div>
                  <input className="form-control" type="number" min={1} value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <div className="form-label">Imposto</div>
                  <select className="form-control" value={imposto} onChange={e => setImposto(e.target.value as TipoImposto)}>
                    <option value="iss_5">ISS 5%</option>
                    <option value="icms_12">ICMS 12%</option>
                    <option value="isento">Isento</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => addItem()} style={{ marginBottom: 16 }}>
                <Plus size={13} /> Adicionar item
              </button>

              {/* Itens da comanda */}
              {itens.length > 0 ? (
                <table className="data-table" style={{ marginBottom: 8 }}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qtd</th>
                      <th>Preço Unit.</th>
                      <th>Imposto</th>
                      <th>Total c/ imposto</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 500 }}>{item.descricao}</td>
                        <td>{item.quantidade}</td>
                        <td>R${item.precoUnitario.toFixed(2)}</td>
                        <td><span className="badge badge-gray">{impostoLabel[item.imposto]}</span></td>
                        <td style={{ fontWeight: 600 }}>R${item.total.toFixed(2)}</td>
                        <td>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeItem(item.id)}>
                            <X size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 12 }}>
                  Nenhum item adicionado ainda.<br />Clique no cardápio ou adicione manualmente.
                </div>
              )}

              {itens.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>R${subtotalSemImposto.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Impostos</span>
                    <span>R${totalImpostos.toFixed(2)}</span>
                  </div>
                  <div className="comanda-total" style={{ marginTop: 6 }}>
                    <span>Total</span>
                    <span>R${totalComanda.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Tela de resumo antes de confirmar fechamento */
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: 'var(--text)' }}>
                Resumo da Comanda #{comandaNum}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                Funcionário: <strong style={{ color: 'var(--text)' }}>{user?.nome}</strong>
              </div>
              <table className="data-table" style={{ marginBottom: 14 }}>
                <thead>
                  <tr><th>Item</th><th>Qtd</th><th>Subtotal</th><th>Imposto</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {itens.map(item => {
                    const sub = item.precoUnitario * item.quantidade;
                    const tax = sub * TAX_RATE[item.imposto];
                    return (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 500 }}>{item.descricao}</td>
                        <td>{item.quantidade}</td>
                        <td>R${sub.toFixed(2)}</td>
                        <td>
                          {tax > 0
                            ? <span className="badge badge-amber">+R${tax.toFixed(2)}</span>
                            : <span className="badge badge-gray">Isento</span>
                          }
                        </td>
                        <td style={{ fontWeight: 600 }}>R${item.total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal (sem impostos)</span>
                  <span>R${subtotalSemImposto.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Impostos</span>
                  <span>R${totalImpostos.toFixed(2)}</span>
                </div>
                {juros > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--amber, #d97706)' }}>
                    <span>Acréscimo ({juros}% — crédito {parcelas}x)</span>
                    <span>+R${acrescimo.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginTop: 6, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  <span>Total a cobrar</span>
                  <span>R${totalFinal.toFixed(2)}</span>
                </div>
              </div>

              {/* Forma de pagamento */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                  Forma de pagamento
                </div>
                <div className="pagamento-grid">
                  {opcoesForma.map(op => (
                    <button
                      key={op.key}
                      className={`pagamento-btn${formaPagamento === op.key ? ' selected' : ''}`}
                      onClick={() => { setFormaPagamento(op.key); if (op.key !== 'credito') setParcelas(1); }}
                    >
                      {op.icon}
                      {op.label}
                    </button>
                  ))}
                </div>
                {formaPagamento === 'credito' && (
                  <div style={{ marginTop: 10 }}>
                    <div className="form-label" style={{ marginBottom: 4 }}>Parcelamento</div>
                    <select
                      className="form-control"
                      value={parcelas}
                      onChange={e => setParcelas(Number(e.target.value))}
                    >
                      {Array.from({ length: maxParcelas(totalComanda) }, (_, i) => i + 1).map(n => {
                        const pct = JUROS_PARCELA[n] ?? 0;
                        const totalN = totalComanda * (1 + pct / 100);
                        const valorParcela = totalN / n;
                        const sufixo = pct === 0 ? ' — sem juros' : ` — +${pct}% (total R$${totalN.toFixed(2)})`;
                        return (
                          <option key={n} value={n}>
                            {n}x de R${valorParcela.toFixed(2)}{sufixo}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {!formaPagamento && (
                  <div style={{ fontSize: 11, color: 'var(--red, #e53e3e)', marginTop: 8 }}>
                    Selecione a forma de pagamento para confirmar.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: 14 }}>
            {mostrarResumo ? (
              <>
                <button className="btn btn-primary" onClick={confirmarFechamento} disabled={!formaPagamento}>
                  <CheckCircle size={14} /> Confirmar fechamento
                </button>
                <button className="btn btn-ghost" onClick={() => { setMostrarResumo(false); setFormaPagamento(null); setParcelas(1); }}>
                  Voltar
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => setMostrarResumo(true)} disabled={itens.length === 0}>
                  Fechar comanda
                </button>
                <button className="btn btn-ghost" onClick={() => setItens([])}>
                  Limpar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
