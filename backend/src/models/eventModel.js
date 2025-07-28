import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';

const Event = sequelize.define('Event', {
  id_event: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  event_name: {
    type: DataTypes.STRING(50)  
  },
  bodega_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.STRING(255),  
    defaultValue: '1' 
  },
  image_url: {  
    type: DataTypes.STRING(255), 
    allowNull: true 
  },

}, {
  
  indexes: [{ unique: true, fields: ['event_name'] }],  
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});



export default Event;

//Ten en cuenta que hasMany solo establece la relación desde el modelo principal hacia el secundario.
//En algunos casos, eso puede ser suficiente si no necesitas navegar desde el secundario hacia el principal.
//Sin embargo, si necesitas la relación inversa(por ejemplo, obtener el usuario al que pertenece un libro), entonces necesitarás belongsTo.
