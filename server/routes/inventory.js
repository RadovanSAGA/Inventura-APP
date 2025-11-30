const express = require('express');
const {
  getInventories,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Všetky routes vyžadujú autentifikáciu
router.use(protect);

router.route('/')
  .get(getInventories)
  .post(createInventory);

router.route('/:id')
  .get(getInventory)
  .put(updateInventory)
  .delete(deleteInventory);

module.exports = router;