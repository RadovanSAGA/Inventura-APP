const Inventory = require('../models/Inventory');

// @desc    Získaj všetky inventúry usera
// @route   GET /api/inventory
// @access  Private
exports.getInventories = async (req, res, next) => {
  try {
    const inventories = await Inventory.find({ userId: req.user._id })
      .sort('-date')
      .select('-__v');

    res.json({
      success: true,
      count: inventories.length,
      data: inventories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Získaj konkrétnu inventúru
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventúra nenájdená'
      });
    }

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vytvor novú inventúru
// @route   POST /api/inventory
// @access  Private
exports.createInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Aktualizuj inventúru
// @route   PUT /api/inventory/:id
// @access  Private
exports.updateInventory = async (req, res, next) => {
  try {
    let inventory = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventúra nenájdená'
      });
    }

    inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vymaž inventúru
// @route   DELETE /api/inventory/:id
// @access  Private
exports.deleteInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventúra nenájdená'
      });
    }

    await inventory.deleteOne();

    res.json({
      success: true,
      message: 'Inventúra vymazaná'
    });
  } catch (error) {
    next(error);
  }
};