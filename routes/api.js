const express = require('express');
const { validate, sort, error } = require('../controllers/api');
const router = express.Router();

router.use(validate);
router.post('/', sort);
router.use(error);

module.exports = router;
