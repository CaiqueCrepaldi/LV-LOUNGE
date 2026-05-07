import { useState } from 'react';
import { Plus, X, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
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

export default function Vendas() {
  const { vendas, setVendas } = useApp();
  const [itens, setItens] = useState<ItemComanda[]>([]);
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [imposto, setImposto] = useState<TipoImposto>('isento');
  const [comandaNum, setComanadaNum] = useState(String(Math.floor(Math.random() * 900) + 100));

  const addItem = (nome?: string, precoVal?: number) => {
    const desc = nome ?? descricao;
    const val = precoVal ?? parseFloat(preco.replace(',', '.'));
    if (!desc || isNaN(val)) return;
    const total = val * quantidade;
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

  const totalComanda = itens.reduce((s, i) => s + i.total, 0);

  const fecharComanda = () => {
    if (itens.length === 0) return;
    alert(`Comanda #${comandaNum} fechada! Total: R$${totalComanda.toFixed(2)}`);
    setItens([]);
    setComanadaNum(String(Math.floor(Math.random() * 900) + 100));
  };

  const impostoLabel: Record<TipoImposto, string> = {
    iss_5: 'ISS 5%', icms_12: 'ICMS 12%', isento: 'Isento',
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
                  <th>Total</th>
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
            <div className="comanda-total">
              <span>Total</span>
              <span>R${totalComanda.toFixed(2)}</span>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={fecharComanda} disabled={itens.length === 0}>
              Fechar comanda
            </button>
            <button className="btn btn-ghost" onClick={() => setItens([])}>
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
