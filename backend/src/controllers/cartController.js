import Cart from "../models/cartModel.js";
import CartItem from "../models/cartItemModel.js";
import Wine from "../models/wineModel.js";
import User from "../models/userModel.js";

export const createCart = async ({ user }) => {
  try {
    const userId = user.id_user;

    // Проверяем, не существует ли корзина для пользователя
    const existingCart = await Cart.findOne({ where: { userId } });
    if (!existingCart) {
      await Cart.create({ userId }); // Создаём корзину, если её нет
    }
  } catch (error) {
    console.error("Error en createCart:", error);
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "No se encontró el carrito para este usuario." });  // Упрощённое сообщение
    }

    const items = await CartItem.findAll({
      where: { cartId: cart.id_cart },
      include: [
        {
          model: Wine,
          attributes: ["id_wine", "wine_name", "price", "image_url"],
        },
      ],
    });

    const cartItemsWithTotal = items.map(item => {
      const wine = item.Wine;
      const totalPrice = wine.price * item.quantity;
      return {
        wineId: wine.id_wine,
        wineName: wine.wine_name,
        price: wine.price,
        quantity: item.quantity,
        totalPrice: totalPrice,
        imageUrl: wine.image_url
      };
    });

    res.status(200).json(cartItemsWithTotal); 
  } catch (error) {
    console.error("Error en getCart:", error);
    res.status(500).json({ message: "Error al obtener el carrito." });  
  }
};


export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { wineId, quantity } = req.body;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "No se encontró el carrito para este usuario." });
    }

    const [item, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id_cart, wineId },
      defaults: { quantity },
    });

    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    res.status(200).json(item);  // Возвращаем только информацию о товаре
  } catch (error) {
    console.error("Error en addItemToCart:", error);
    res.status(500).json({ message: "Error al añadir el producto al carrito." });
  }
};


export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { wineId } = req.params;


    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "No se encontró el carrito para este usuario." });
    }

    const item = await CartItem.findOne({
      where: { cartId: cart.id_cart, wineId },
    });

    if (!item) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    await item.destroy();

    res.status(200).json({ message: "Producto eliminado del carrito exitosamente." });  // Упрощённый ответ
  } catch (error) {
    console.error("Error en removeItemFromCart:", error);
    res.status(500).json({ message: "Error al eliminar el producto del carrito." });
  }
};


export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "No se encontró el carrito para este usuario." });
    }

    await CartItem.destroy({ where: { cartId: cart.id_cart } });

    res.status(200).json({ message: "Carrito vaciado exitosamente." });  
  } catch (error) {
    console.error("Error en clearCart:", error);
    res.status(500).json({ message: "Error al vaciar el carrito." });
  }
};


export const getTotalItemsInCart = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "No se encontró el carrito para este usuario." });
    }

    const items = await CartItem.findAll({ where: { cartId: cart.id_cart } });


    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({ totalItems }); 
  } catch (error) {
    console.error("Error en getTotalItemsInCart:", error);
    res.status(500).json({ message: "Error al obtener la cantidad total de productos en el carrito." });
  }
};


export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { wineId, quantity } = req.body;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "No se encontró el carrito para este usuario." });
    }

    const item = await CartItem.findOne({
      where: { cartId: cart.id_cart, wineId },
    });

    if (!item) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    item.quantity = quantity;
    await item.save();

    res.status(200).json(item); 
  } catch (error) {
    console.error("Error en updateCartItemQuantity:", error);
    res.status(500).json({ message: "Error al actualizar la cantidad del producto." });
  }
};
