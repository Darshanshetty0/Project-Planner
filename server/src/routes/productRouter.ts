import express, { Request, Response } from 'express';
import ensureAuthenticated from '../middleware/auth'; // Ensure this path is correct

const router = express.Router();

router.get('/', ensureAuthenticated, (req: Request, res: Response)=> {
  res.status(200).json([
    {
      name: "1",
      price: "300"
    },
    {
      name: "3",
      price: "400"
    },
    {
      name: "5",
      price: "20",
      model_no: "122234"
    }
  ]);
});

export default router;
