const express = require('express');
const router = express.Router();
const {ModelPredict} = require('../controllers/modelPredict');
const {authCheck,adminCheck} = require('../middlewares/authCheck');
router.post('/ModelPredict',authCheck,adminCheck,ModelPredict)


module.exports = router