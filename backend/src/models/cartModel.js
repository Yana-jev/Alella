import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./userModel.js";

const Cart = sequelize.define(
  "Cart",
  {
    id_cart: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

export default Cart;
