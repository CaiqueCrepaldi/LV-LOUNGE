import { useState } from 'react';
import { Plus, X, ShoppingCart, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import type { ItemComanda, TipoImposto } from '../types';

const CARDAPIO = [
  { emoji: '🍟', nome: 'Batata Frita', preco: 28 },
  { emoji: '🍗', nome: 'Porção Frango', preco: 42 },
  { emoji: '🐟', nome: 'Porção Tilápia', preco: 55 },
  { emoji: '🥤', nome: 'Coca-Cola', preco: 12 },
  { emoji: '🥃', nome: 'Whisky', preco: 180 },
  { emoji: '🍸', nome: 'Gin', preco: 160 },
  { emoji: '🍸', nome: 'Vodka', preco: 140 },
  { emoji: '🐂', nome: 'Redbull', preco: 22 },
  { emoji: '🍾', nome: 'Ballena', preco: 150 },
  { emoji: '🕯️', nome: 'Velas Combo', preco: 35 },
];

let itemIdCounter = 100;

const novaComanda = () => String(Math.floor(Math.random() * 900) + 100);

const TAX_RATE: Record<TipoImposto, number> = { iss_5: 0.05, icms_12: 0.12, isento: 0 };

const impostoLabel: Record<TipoImposto, string> = {
  iss_5: 'ISS 5%', icms_12: 'ICMS 12%', isento: 'Isento',
};

export default function Vendas() {
  const { setVendas } = useApp();
  const { user } = useAuth();
  const toast = useToast();
  const [itens, setItens] = useState<ItemComanda[]>([]);
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [imposto, setImposto] = useState<TipoImposto>('isento');
  const [comandaNum, setComanadaNum] = useState(novaComanda);
  const [mostrarResumo, setMostrarResumo] = useState(false);

  const addItem = (nome?: string, precoVal?: number) => {
    const desc = nome ?? descricao;
    const val = precoVal ?? parseFloat(preco.replace(',', '.'));
    if (!desc || isNaN(val)) return;
    const subtotal = val * quantidade;
    const total = subtotal * (1 + TAX_RATE[imposto]);
    setItens(prev => [...prev, {
      id: String(++itemIdCounter),
      produtoId: '0',
      descricao: desc,
      quantidade,
      precoUnitario: val,
      imposto,
      total,
    }]);
    setDescricao(''); setPreco(''); setQuantidade(1);
  };

  const removeItem = (id: string) => setItens(prev => prev.filter(i => i.id !== id));

  const subtotalSemImposto = itens.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0);
  const totalImpostos = itens.reduce((s, i) => s + i.precoUnitario * i.quantidade * TAX_RATE[i.imposto], 0);
  const totalComanda = subtotalSemImposto + totalImpostos;

  const confirmarFechamento = () => {
    setVendas(prev => [...prev, {
      id: String(Date.now()),
      comanda: comandaNum,
      funcionarioId: user?.id ?? '',
      funcionarioNome: user?.nome ?? '',
      itens,
      total: totalComanda,
      data: new Date().toISOString().slice(0, 10),
      horario: new Date().toTimeString().slice(0, 5),
      status: 'fechada',
    }]);
    toast(`Comanda #${comandaNum} fechada — R$${totalComanda.toFixed(2)}`);
    setItens([]);
    setMostrarResumo(false);
    setComanadaNum(novaComanda());
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Caixa Aberto</div>
        <div className="page-subtitle">Registro de vendas por comanda</div>
      </div>

      <div className="comanda-layout">
        {/* Cardápio rápido */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--text)' }}>
            Cardápio Rápido
          </div>
          <div className="cardapio-grid">
            {CARDAPIO.map(item => (
              <div
                key={item.nome}
                className="cardapio-item"
                onClick={() => addItem(item.nome, item.preco)}
              >
                <span className="cardapio-emoji">{item.emoji}</span>
                {item.nome}
                <div className="cardapio-price">R${item.preco.toFixed(2)}</div>
              </div>
            ))}
          </div>
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
                  <input className="form-control" placeholder="0,00" value={preco} onChange={e => setPreco(e.target.value)} />
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
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: 'var(--text)' }}>
                Resumo da Comanda #{comandaNum}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginTop: 6, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  <span>Total a cobrar</span>
                  <span>R${totalComanda.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: 14 }}>
            {mostrarResumo ? (
              <>
                <button className="btn btn-primary" onClick={confirmarFechamento}>
                  <CheckCircle size={14} /> Confirmar fechamento
                </button>
                <button className="btn btn-ghost" onClick={() => setMostrarResumo(false)}>
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
