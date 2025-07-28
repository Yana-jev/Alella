// src/routes/userRoutes.js
import { Router } from 'express';
import { getBodegas, getBodegaById, addBodega, updateBodega, deleteBodega } from '../controllers/bodegaController.js'
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/',  getBodegas);
router.get('/:id', getBodegaById);
router.post('/', authenticateToken(['user','mod','admin']), addBodega);
router.patch('/:id', authenticateToken(['user','mod','admin']), idValidator,  updateBodega);
router.delete('/:id', authenticateToken(['user','mod','admin']), idValidator, deleteBodega);
router.get('/top-ventas', getBodegas);

export default router;
