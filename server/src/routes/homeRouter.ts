import express, { Request, Response } from 'express';
import ensureAuthenticated from '../middleware/auth'; // Ensure this path is correct

const router = express.Router();

router.get('/auth/validate', ensureAuthenticated, (req: Request, res: Response)=> {
  res.status(200).json({ valid: true, user: req.user});
});

export default router;
