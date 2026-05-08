import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/funcionarios
router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Não implementado' });
});

// GET /api/funcionarios/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(501).json({ error: 'Não implementado', id });
});

// POST /api/funcionarios
router.post('/', (req: Request, res: Response) => {
  const funcionario = req.body;

  if (!funcionario?.nome || !funcionario?.usuario || !funcionario?.cargo) {
    res.status(400).json({ error: 'Campos obrigatórios: nome, usuario, cargo' });
    return;
  }

  res.status(501).json({ error: 'Não implementado' });
});

// PUT /api/funcionarios/:id
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(501).json({ error: 'Não implementado', id });
});

export default router;
