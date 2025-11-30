const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  cisloPolozky: { type: String, required: true },
  stav: { type: String, default: 'Aktívne' },
  popis: { type: String, required: true },
  baliacaJednotka: { type: String, required: true },
  castkovaJedno: { type: String, required: true },
  jednotka: { type: String, required: true },
  hodnota1: { type: Number, default: 0 },
  hodnota2: { type: Number, default: 0 },
  hodnota3: { type: Number, default: 0 },
  celkom: { type: Number, default: 0 },
  poznamka: { type: String, default: '' },
  locked: { type: Boolean, default: false }
}, { _id: false });

const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  items: [inventoryItemSchema],
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived'],
    default: 'draft'
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp pri uložení
inventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pre rýchlejšie vyhľadávanie
inventorySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Inventory', inventorySchema);