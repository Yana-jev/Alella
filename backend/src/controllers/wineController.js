import Wine from "../models/wineModel.js";
import { validationResult } from "express-validator";
import { uploadFileMiddleware } from "../middlewares/upload.js";
import { Op } from "sequelize";


const aromaFilters = {
  tinto: {
    madera: ["%madera%", "%cuero%", "%minerales%"],
    especias: ["%especias%", "%vainilla%", "%pimienta%", "%minerales%"],
    "frutos maduros": [
      "%frutos maduros%",
      "%cereza%",
      "%mora%",
      "%baya%",
      "%ciruela%",
      "%grosella%",
    ],
  },
  blanco: {
    frutas: ["%frutas%", "%manzana%", "%cítrico%", "%pera%", "%melón%"],
    floral: ["%floral%", "%miel%", "%flores%"],
    hierbas: ["%hierbas%", "%roble%", "%mineral%", "%especias%"],
  },
  espumoso: {
    frutas: ["%frutas%", "%manzana%", "%cítrico%", "%baya%"],
    floral: ["%floral%", "%miel%"],
    bollería: ["%bollería%", "%madera%", "%mineral%", "%especias%"],
  },
};

const maridajeFilters = {
  tinto: {
    carne: ["%carne%", "%cordero%", "%asado%", "%carnes%", "%pollo%"],
    pasta: ["%pasta%", "%lasaña%", "%ravioli%", "%pollo%", "%pizzas%"],
    aperitivo: ["%quesos%", "%embutidos%", "%ensaladas%", "%entrantes%"],
  },
  blanco: {
    "pescados y mariscos": ["%pescados%", "%mariscos%", "%atún%", "%salmón%"],
    aperitivos: ["%quesos%", "%entrantes%", "%postres%", "%ensaladas%"],
    carnes: ["%pollo%", "%pavo%", "%cerdo%"],
  },
  espumoso: {
    "pescados y mariscos": ["%pescados%", "%mariscos%", "%caviar%"],
    aperitivos: ["%quesos%", "%entrantes%", "%postres%", "%ensaladas%"],
    carnes: ["%pollo%", "%pavo%", "%jamón%", "pollo", "%carne%", "%carnes%"],
  },
};

export const filterWines = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { color, type, maridaje, aroma, price } = req.query;
    const whereConditions = {};

    if (color === "tinto") {
      whereConditions.color = "Tinto";
    } else if (color === "blanco") {
      whereConditions.color = "Blanco";
      whereConditions.type = { [Op.ne]: "Espumoso" };
    } else if (type === "espumoso") {
      whereConditions.type = "Espumoso";
    }

    if (maridaje) {
      const maridajeConditions = [];
      const filtersForMaridaje = maridajeFilters[color]?.[maridaje];

      if (filtersForMaridaje) {
        filtersForMaridaje.forEach((filter) => {
          maridajeConditions.push({ [Op.like]: filter });
        });
      } else {
        maridajeConditions.push({ [Op.like]: `%${maridaje}%` });
      }

      whereConditions.maridaje = { [Op.or]: maridajeConditions };
    }

    if (aroma) {
      const aromaConditions = [];
      const aromaFiltersList = aroma.split(",").map((a) => a.trim());

      aromaFiltersList.forEach((a) => {
        const filtersForAroma = aromaFilters[color]?.[a];

        if (filtersForAroma) {
          filtersForAroma.forEach((filter) => {
            aromaConditions.push({ [Op.like]: filter });
          });
        } else {
          aromaConditions.push({ [Op.like]: `%${a}%` });
        }
      });

      whereConditions.aroma = { [Op.or]: aromaConditions };
    }

    if (price) {
      const priceRange = price.split("-").map((p) => p.trim());
    
      if (priceRange.length === 1) {
        const singlePrice = parseFloat(priceRange[0]);
        if (!isNaN(singlePrice)) {
          whereConditions.price = { [Op.gte]: singlePrice }; 
        }
      } else if (priceRange.length === 2) {
        const minPrice = parseFloat(priceRange[0]);
        const maxPrice = parseFloat(priceRange[1]);
    
        if (!isNaN(minPrice) && priceRange[1] === "") {
          // Случай "20-" (цены больше 20)
          whereConditions.price = { [Op.gte]: minPrice };
        } else if (!isNaN(minPrice) && !isNaN(maxPrice)) {
  
          whereConditions.price = { [Op.between]: [minPrice, maxPrice] };
        }
      }
    }
    

    const wines = await Wine.findAll({ where: whereConditions });

    if (wines.length > 0) {
      const shuffledWines = wines.sort(() => 0.5 - Math.random());
      const randomWines = shuffledWines.slice(0, 2);

      res.status(200).json(randomWines);
    } else {
      res
        .status(404)
        .json({ message: "No wines found with the given filters" });
    }
  } catch (error) {
    console.error("Error fetching wines:", error);
    res.status(500).json({ error: "An error occurred while fetching wines" });
  } finally {
    console.log("Wine filtering operation completed");
  }
};



export const getWines = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const wines = await Wine.findAll();
    res.status(200).json(wines);
  } catch (error) {
    console.error("Error in getWines:", error);
    res.status(500).json({
      code: -100,
      message: "Error of getWines",
    });
  }
};

export const getWineById = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const wine = await Wine.findByPk(id);
    if (!wine) {
      return res.status(404).json({
        code: -6,
        message: "Wine not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Product details",
      data: wine,
    });
  } catch (error) {
    console.error("Error in get product", error);
    res.status(500).json({
      code: -100,
      message: "Error in get product",
    });
  }
};

export const addWine = async (req, res) => {
  await uploadFileMiddleware(req, res);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { wine_name, bodega_name, date, description } = req.body;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    let newWine;
    try {
      newWine = await Wine.create({
        id_wine,
        wine_name,
        bodega_name,
        variedad,
        year,
        cantidad,
        aroma,
        maridaje,
        price,
        color,
        type,
        sugar,
        image_url,
        description,
        volumen,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          code: -61,
          message: "Duplicate name",
        });
      }
      throw error;
    }

    if (!newWine) {
      return res.status(404).json({
        code: -6,
        message: "Error while adding the wine",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Wine added successfully",
      data: newWine,
    });
  } catch (error) {
    console.error("Error in addWine:", error);
    res.status(500).json({
      code: -100,
      message: "Error while adding the wine",
    });
  }
};

export const updateWine = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { wine_name, year } = req.body;

    const wine = await Wine.findByPk(id);
    if (!wine) {
      return res.status(404).json({
        code: -3,
        message: "wine not found",
      });
    }

    wine.wine_name = wine_name;
    wine.year = year;
    await wine.save();

    res.status(200).json({
      code: 1,
      message: "Wino updated",
      data: wine,
    });
  } catch (error) {
    console.error("Error in updateWine:", error);
    res.status(500).json({
      code: -100,
      message: "Error in update Wine",
    });
  }
};

export const deleteWine = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const deletedWine = await Wine.destroy({ where: { id_wine: id } });

    if (!deletedWine) {
      return res.status(404).json({
        code: -100,
        message: "Wine not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Wine deleted",
    });
  } catch (error) {
    console.error("Error deleting the wine:", error);
    res.status(500).json({
      code: -100,
      message: "Error deleting the wine",
    });
  }
};
