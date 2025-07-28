// src/routes/userRoutes.js
import { Router } from 'express';
import { getWines, getWineById, addWine, updateWine, deleteWine } from '../controllers/wineController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { wineValidator } from '../validations/wine.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'
import { filterWines } from '../controllers/wineController.js';
const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', getWines);
router.get('/filter', filterWines);
router.get('/:id', idValidator, getWineById);
router.post('/', authenticateToken(['user','mod','admin']), wineValidator, addWine);
router.patch('/:id', authenticateToken(['user','mod','admin']), idValidator, wineValidator, updateWine);
router.delete('/:id', authenticateToken(['user','mod','admin']), idValidator, deleteWine);
router.get('/top-ventas', getWines);

export default router;
