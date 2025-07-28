import Event from '../models/eventModel.js';
import { validationResult } from 'express-validator';
import { uploadFileMiddleware } from '../middlewares/upload.js';

export const getEvents = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const events = await Event.findAll();

    res.status(200).json(events);
  } catch (error) {
    console.error('Error in getEvents:', error); // Логируем ошибку
    res.status(500).json({
      code: -100,
      message: 'Ошибка при получении событий',
    });
  }
};


export const getEventById = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Ищем событие по ID
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        code: -6,
        message: 'Событие не найдено'
      });
    }

    res.status(200).json({
      code: 1,
      message: 'Детали события',
      data: event
    });
  } catch (error) {
    console.error('Error in getEventById:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при получении события'
    });
  }
};

export const addEvent = async (req, res) => {
  // Примените middleware для загрузки файла
  await uploadFileMiddleware(req, res); 

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { event_name, bodega_name, date, description } = req.body;

    let image_url = null;
    if (req.file) {
      // Формируйте URL для загруженного изображения
      image_url =` /uploads/${req.file.filename}`; // Убедитесь, что ваш сервер правильно обслуживает эту папку
    }

    let newEvent;
    try {
      newEvent = await Event.create({ 
        event_name, 
        bodega_name,
        date,
        description,
        image_url, // Сохраняем URL изображения
        user_id: req.user.id_user 
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          code: -61,
          message: 'Дубликат названия события'
        });
      }
      throw error;
    }

    if (!newEvent) {
      return res.status(404).json({
        code: -6,
        message: 'Ошибка при добавлении события'
      });
    }

    res.status(200).json({
      code: 1,
      message: 'Событие успешно добавлено',
      data: newEvent
    });
  } catch (error) {
    console.error('Error in addEvent:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при добавлении события'
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { event_name, year } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        code: -3,
        message: 'Событие не найдено'
      });
    }

    event.event_name = event_name;
    event.year = year;
    await event.save();

    res.status(200).json({
      code: 1,
      message: 'Событие успешно обновлено',
      data: event
    });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при обновлении события'
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const deletedEvent = await Event.destroy({ where: { id_event: id } });

    if (!deletedEvent) {
      return res.status(404).json({
        code: -100,
        message: 'Событие не найдено'
      });
    }

    res.status(200).json({
      code: 1,
      message: 'Событие успешно удалено'
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    res.status(500).json({
      code: -100,
      message: 'Ошибка при удалении события'
    });
  }
};