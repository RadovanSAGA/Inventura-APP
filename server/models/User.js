const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username je povinný'],
    unique: true,
    trim: true,
    minlength: [3, 'Username musí mať aspoň 3 znaky'],
    maxlength: [30, 'Username môže mať max 30 znakov']
  },
  email: {
    type: String,
    required: [true, 'Email je povinný'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Neplatný email']
  },
  password: {
    type: String,
    required: [true, 'Heslo je povinné'],
    minlength: [6, 'Heslo musí mať aspoň 6 znakov'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash heslo pred uložením
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Metóda na porovnanie hesla
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Odstráň heslo z JSON výstupu
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);