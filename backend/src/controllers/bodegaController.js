import Bodega from '../models/bodegaModel.js';
import { validationResult } from 'express-validator';
import { uploadFileMiddleware } from '../middlewares/upload.js';

export const getBodegas = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bodegas = await Bodega.findAll();

    res.status(200).json(bodegas);
  } catch (error) {
    console.error('Error in getbodegas:', error); // Логируем ошибку
    res.status(500).json({
      code: -100,
      message: 'Ошибка при получении событий',
    });
  }
};


export const getBodegaById = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Ищем бодега по ID
    const bodega = await Bodega.findByPk(id);
    if (!bodega) {
      return res.status(404).json({
        code: -6,
        message: 'бодега не найдено'
      });
    }

    res.status(200).json({
      code: 1,
      message: 'Детали бодеги',
      data: bodega
    });
  } catch (error) {
    console.error('Error in getBodegaById:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при получении бодеги'
    });
  }
};

export const addBodega = async (req, res) => {
  // Примените middleware для загрузки файла
  await uploadFileMiddleware(req, res); 

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bodega_name,  date, description, direction } = req.body;

    let image_url = null;
    if (req.file) {
      // Формируйте URL для загруженного изображения
      image_url =` /uploads/${req.file.filename}`; // Убедитесь, что ваш сервер правильно обслуживает эту папку
    }

    let newBodega;
    try {
      newBodega = await Bodega.create({ 
        bodega_name, 
        bodega_name,
        date,
        bodega_description,
        direction,
        image_url, // Сохраняем URL изображения
        user_id: req.user.id_user 
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          code: -61,
          message: 'Дубликат названия бодеги'
        });
      }
      throw error;
    }

    if (!newBodega) {
      return res.status(404).json({
        code: -6,
        message: 'Ошибка при добавлении бодеги'
      });
    }

    res.status(200).json({
      code: 1,
      message: 'бодега успешно добавлено',
      data: newBodega
    });
  } catch (error) {
    console.error('Error in addBodega:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при добавлении бодеги'
    });
  }
};

export const updateBodega = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { bodega_name, year } = req.body;

    const bodega = await Bodega.findByPk(id);
    if (!bodega) {
      return res.status(404).json({
        code: -3,
        message: 'бодега не найдено'
      });
    }

    bodega.bodega_name = bodega_name;
    bodega.year = year;
    await bodega.save();

    res.status(200).json({
      code: 1,
      message: 'бодега успешно обновлено',
      data: bodega
    });
  } catch (error) {
    console.error('Error in updateBodega:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при обновлении бодеги'
    });
  }
};

export const deleteBodega = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const deletedBodega = await Bodega.destroy({ where: { id_bodega: id } });

    if (!deletedBodega) {
      return res.status(404).json({
        code: -100,
        message: 'бодега не найдено'
      });
    }

    res.status(200).json({
      code: 1,
      message: 'бодега успешно удалено'
    });
  } catch (error) {
    console.error('Error in deleteBodega:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при удалении бодеги'
    });
  }
};