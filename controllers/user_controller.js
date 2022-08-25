const User=require('../models/user');
module.exports.users=function(req,res){
    return res.render('user_profile',{title:"user"});
}
//profile
module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:"Codial | profile",
            profile_user:user
        });
    })
    
}

module.exports.update=function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        });

    }
    else{
        return res.status(401).send('Unauthorized access');
    }
}
// render the singnup page
module.exports.signup=function(req,res){
    if(req.isAuthenticated())
    {
        return  res.redirect('/users/profile')
    }
    return res.render('usersignup',{
        title:"Codial | signup"
    })
}

//render the signin page
module.exports.signin=function(req,res){
    // console.log(req.body);
    if(req.isAuthenticated())
    {
       return  res.redirect('/users/profile')
    }
    return res.render('usersignin',{
        title:"Codial | signin"
    });
}




// get the sign up data
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err) {console.log('error in finding for the user to signup',err);return;}
        if(!user){
            User.create(req.body,function(err,user){
                if(err) {console.log('error in finding for the user to signup',err.message);return;}
                return res.redirect('/users/sign-in')
            })
        }
        else{
            req.flash('success', 'You have signed up, login to continue!'); 
            return res.redirect('back')
        }
    })
}
// sign in and create the session for the user
module.exports.createSession=function(req,res){
    // console.log("hello");
    req.flash('success','Logged in Successfully')
    return res.redirect('/')
}
module.exports.destroySession=function(req,res){

    req.logout(function(err){
        
        if(err)
        {
            return err;
        }
        req.flash('success','Logged Out Successfully')
        return res.redirect('/');
    });
    req.flash('success','Logged Out') ;
    return res.redirect('/users/sign-in');
}