// src/routes/userRoutes.js
import { Router } from 'express';
import { getEvents, getEventById, addEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { eventValidator } from '../validations/event.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/',  getEvents);
router.get('/:id', getEventById);
router.post('/', authenticateToken(['user','mod','admin']), eventValidator, addEvent);
router.patch('/:id', authenticateToken(['user','mod','admin']), idValidator, eventValidator, updateEvent);
router.delete('/:id', authenticateToken(['user','mod','admin']), idValidator, deleteEvent);
router.get('/top-ventas', getEvents);

export default router;
