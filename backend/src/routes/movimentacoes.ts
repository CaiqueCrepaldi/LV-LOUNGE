import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/movimentacoes?data=YYYY-MM-DD
router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Não implementado' });
});

// POST /api/movimentacoes
router.post('/', (req: Request, res: Response) => {
  const mov = req.body;

  if (!mov?.produtoId || !mov?.tipo || !mov?.quantidade) {
    res.status(400).json({ error: 'Campos obrigatórios: produtoId, tipo, quantidade' });
    return;
  }

  res.status(501).json({ error: 'Não implementado' });
});

export default router;
