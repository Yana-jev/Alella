import { DataTypes, NUMBER } from 'sequelize';
import { sequelize } from '../db.js';


const Wine = sequelize.define('Wine', {
  id_wine: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  wine_name: {
    type: DataTypes.STRING(50),
  },
  bodega_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  variedad: {
    type: DataTypes.STRING(100),
  },
  year: {
    type: DataTypes.INTEGER.UNSIGNED, 
  },
  cantidad: {
    type: DataTypes.INTEGER(8).UNSIGNED, 
  },
  aroma: {
    type: DataTypes.STRING(500),
  },
  maridaje: {
    type: DataTypes.STRING(500),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), 
  },
  color: {
    type: DataTypes.STRING(100),
  },
  type: {
    type: DataTypes.STRING(100),
  },
  sugar: {
    type: DataTypes.STRING(100),
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(1500),
  },
  volumen: {
    type: DataTypes.STRING(10), 
  },

}, {
  
  indexes: [{ unique: true, fields: ['wine_name'] }],  
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});



export default Wine;

//Ten en cuenta que hasMany solo establece la relación desde el modelo principal hacia el secundario.
//En algunos casos, eso puede ser suficiente si no necesitas navegar desde el secundario hacia el principal.
//Sin embargo, si necesitas la relación inversa(por ejemplo, obtener el usuario al que pertenece un libro), entonces necesitarás belongsTo.
