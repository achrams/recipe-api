const { Recipe } = require('../models');

const recipeController = {
  // Create a new recipe
  async create(req, res) {
    try {
      const { title, description, utensils, items, video_url, images } = req.body;
      const recipe = await Recipe.create({
        title,
        description,
        utensils,
        items,
        video_url,
        images,
        userId: req.user.id
      });

      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all recipes
  async getAll(req, res) {
    try {
      const recipes = await Recipe.findAll({
        include: [{
          association: 'user',
          attributes: ['id', 'username']
        }]
      });
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user's recipes
  async getUserRecipes(req, res) {
    try {
      const recipes = await Recipe.findAll({
        where: { userId: req.user.id },
        include: [{
          association: 'user',
          attributes: ['id', 'username']
        }]
      });
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific recipe
  async getOne(req, res) {
    try {
      const recipe = await Recipe.findOne({
        where: { id: req.params.id },
        include: [{
          association: 'user',
          attributes: ['id', 'username']
        }]
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a recipe
  async update(req, res) {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['title', 'description', 'utensils', 'items', 'video_url', 'images'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }

      const recipe = await Recipe.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      updates.forEach(update => recipe[update] = req.body[update]);
      await recipe.save();
      res.json(recipe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a recipe
  async delete(req, res) {
    try {
      const recipe = await Recipe.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      await recipe.destroy();
      res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = recipeController;
