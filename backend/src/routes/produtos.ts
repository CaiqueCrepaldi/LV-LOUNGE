import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/produtos
router.get('/', (_req: Request, res: Response) => {
  // TODO: listar produtos do banco
  res.status(501).json({ error: 'Não implementado' });
});

// GET /api/produtos/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: buscar produto por id
  res.status(501).json({ error: 'Não implementado', id });
});

// POST /api/produtos
router.post('/', (req: Request, res: Response) => {
  const produto = req.body;

  if (!produto?.nome || !produto?.codigo) {
    res.status(400).json({ error: 'Campos obrigatórios: nome, codigo' });
    return;
  }

  // TODO: criar produto no banco
  res.status(501).json({ error: 'Não implementado' });
});

// PUT /api/produtos/:id
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: atualizar produto no banco
  res.status(501).json({ error: 'Não implementado', id });
});

// DELETE /api/produtos/:id
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: remover produto do banco
  res.status(501).json({ error: 'Não implementado', id });
});

export default router;
