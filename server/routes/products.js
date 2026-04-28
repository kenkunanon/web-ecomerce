const express = require('express');
const router = express.Router();
const {create,list,update,read,remove,
    listby,searchFilters,createImages,removeImage} 
    = require('../controllers/products');
const {authCheck,adminCheck} = require('../middlewares/authCheck');



router.post('/product',create)
router.get('/products/:count',list)
router.put('/products/:id',update)
router.get('/product/:id',read)
router.delete('/products/:id',remove)
router.post('/productby',listby)
router.post('/search/filters',searchFilters)
router.post('/images',authCheck,adminCheck,createImages)
router.post('/removeimages',authCheck,adminCheck,removeImage)


module.exports = router