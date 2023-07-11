const express = require('express');
const { registerController, loginController } = require('../controllers/userControllers');
const router = new express.Router();

router.post('/', registerController);

router.post('/login', loginController);

module.exports = router;
