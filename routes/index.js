const { application } = require('express');
const express=require('express');
const home=require('../controllers/home_controller').home;
const router=express.Router();

router.use('/users',require('./users'));
router.use('/posts',require('./post')); 
router.use('/comments',require('./comments'));
router.get('/',home);

module.exports=router;
