 const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin, handleValidationErrors } = require('../utils/validators');

const router = express.Router();

router.post('/register', [...validateRegister, handleValidationErrors], register);
router.post('/login', [...validateLogin, handleValidationErrors], login);
router.get('/me', protect, getMe);

module.exports = router;