import { body } from 'express-validator';

export const cartItemValidator = [
   body('cart_id')
      .exists()
      .withMessage('Cart ID is required')
      .isInt({ min: 1 })
      .withMessage('Cart ID should be a positive integer'),

   body('wine_id')
      .exists()
      .withMessage('Wine ID is required')
      .isInt({ min: 1 })
      .withMessage('Wine ID should be a positive integer'),

   body('quantity')
      .exists()
      .withMessage('Quantity is required')
      .isInt({ min: 1 })
      .withMessage('Quantity should be a positive integer')
];
