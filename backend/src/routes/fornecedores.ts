import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/fornecedores
router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Não implementado' });
});

// POST /api/fornecedores
router.post('/', (req: Request, res: Response) => {
  const fornecedor = req.body;

  if (!fornecedor?.nome || !fornecedor?.cnpj) {
    res.status(400).json({ error: 'Campos obrigatórios: nome, cnpj' });
    return;
  }

  res.status(501).json({ error: 'Não implementado' });
});

// PUT /api/fornecedores/:id
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(501).json({ error: 'Não implementado', id });
});

// DELETE /api/fornecedores/:id
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(501).json({ error: 'Não implementado', id });
});

export default router;
