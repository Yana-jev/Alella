// src/validations/cart.Validation.js

// src/validations/cart.Validation.js
import { body } from 'express-validator';

export const cartValidator = [
   body("status")
      .optional() 
      .isString()
      .withMessage("Status should be a string")
      .isIn(["active", "completed", "cancelled"])
      .withMessage("Status must be one of: 'active', 'completed', 'cancelled'")
];
