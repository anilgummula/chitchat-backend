const express = require('express');
const { registerValidation, loginValidation } = require('../middlewares/validate');
const { register, login, logout } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register',registerValidation,register);
router.post('/login',loginValidation,login);
router.post('/logout',logout);

module.exports = router;