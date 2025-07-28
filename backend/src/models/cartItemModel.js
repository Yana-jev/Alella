import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Cart from "./cartModel.js";
import Wine from "./wineModel.js";

const CartItem = sequelize.define(
  "CartItem",
  {
    id_cart_item: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Wine.hasMany(CartItem, { foreignKey: "wineId", onDelete: "CASCADE" });
CartItem.belongsTo(Wine, { foreignKey: "wineId" });

export default CartItem;
