import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/vendas?data=YYYY-MM-DD
router.get('/', (_req: Request, res: Response) => {
  // TODO: buscar vendas do banco filtrando por data
  res.status(501).json({ error: 'Não implementado' });
});

// GET /api/vendas/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: buscar venda por id
  res.status(501).json({ error: 'Não implementado', id });
});

// POST /api/vendas
router.post('/', (req: Request, res: Response) => {
  const venda = req.body;

  if (!venda?.comanda || !venda?.funcionarioId || !venda?.itens?.length) {
    res.status(400).json({ error: 'Campos obrigatórios: comanda, funcionarioId, itens' });
    return;
  }

  // TODO: salvar venda no banco
  res.status(501).json({ error: 'Não implementado' });
});

// PATCH /api/vendas/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['aberta', 'fechada', 'cancelada'].includes(status)) {
    res.status(400).json({ error: 'Status inválido' });
    return;
  }

  // TODO: atualizar status da venda no banco
  res.status(501).json({ error: 'Não implementado', id, status });
});

export default router;
