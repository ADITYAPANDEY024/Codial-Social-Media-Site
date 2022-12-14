const { populate } = require('../models/post');
const Post=require('../models/post');
const User=require('../models/user');



module.exports.home=async function(req,res){

    try{

        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user',
            }
        })
    
        let user=await User.find({});
            
        return res.render('home',{title:'Codial | home',posts:posts,all_users:user});
    }
    catch(err){
        console.log('Error home_controller',err);
    }
}

