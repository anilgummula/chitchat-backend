const express = require('express');
const { registerValidation, loginValidation } = require('../middlewares/validate');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register',registerValidation,register);
router.post('/login',loginValidation,login);

module.exports = router;