const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username musí mať 3-30 znakov')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username môže obsahovať len písmená, čísla a _'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Neplatný email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Heslo musí mať aspoň 6 znakov')
];

exports.validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Neplatný email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Heslo je povinné')
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};