// src/routes/cartRoutes.js
import { Router } from 'express';
import { createCart, getCart, addItemToCart, removeItemFromCart, updateCartItemQuantity, clearCart, getTotalItemsInCart } from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { idValidator } from '../validations/generic.Validation.js';

const router = Router();


router.get('/', authenticateToken(['user', 'admin']), getCart);
router.get('/total', authenticateToken(['user', 'admin']), getTotalItemsInCart)
router.post('/', authenticateToken(['user', 'admin']), createCart);
router.post('/add', authenticateToken(['user', 'admin']), addItemToCart);
router.patch('/update', authenticateToken(['user', 'admin']), updateCartItemQuantity); 
router.delete('/remove/:wineId', authenticateToken(['user', 'admin']), removeItemFromCart);
router.delete('/clear', authenticateToken(['user', 'admin']), clearCart);


export default router;
