import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';

const Bodega = sequelize.define('Bodega', {
  id_bodega: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  bodega_name: {
    type: DataTypes.STRING(50)  
  },
  bodega_description: {
    type: DataTypes.STRING(500)  
  },

  latitud: {
    type: DataTypes.STRING(30),
  },
  longitud: {
    type: DataTypes.STRING(30),  

  },
  image_url: {  
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
    direction: {
    type: DataTypes.STRING(500)  
  },

}, {
  
  indexes: [{ unique: true, fields: ['bodega_name'] }],  
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});



export default Bodega;

//Ten en cuenta que hasMany solo establece la relación desde el modelo principal hacia el secundario.
//En algunos casos, eso puede ser suficiente si no necesitas navegar desde el secundario hacia el principal.
//Sin embargo, si necesitas la relación inversa(por ejemplo, obtener el usuario al que pertenece un libro), entonces necesitarás belongsTo.
