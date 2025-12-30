const express = require('express');
const { InfoController } = require('../../controllers/index');
const router = express.Router();

router.get('/info', InfoController.info);

module.exports = router;