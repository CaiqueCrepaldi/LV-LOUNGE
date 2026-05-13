import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    return;
  }

  // TODO: validar contra banco de dados e retornar JWT
  res.status(501).json({ error: 'Não implementado' });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  // TODO: invalidar token no banco
  res.status(501).json({ error: 'Não implementado' });
});

export default router;
