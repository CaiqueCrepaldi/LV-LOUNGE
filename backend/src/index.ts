import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import vendasRoutes from './routes/vendas';
import produtosRoutes from './routes/produtos';
import fornecedoresRoutes from './routes/fornecedores';
import funcionariosRoutes from './routes/funcionarios';
import movimentacoesRoutes from './routes/movimentacoes';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/fornecedores', fornecedoresRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
