const passport= require('passport');

const LocalStratergy= require('passport-local').Strategy;

const User= require('../models/user')

// authentication using passport

passport.use(new LocalStratergy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email,password,done){
        // console.log(email);
        User.findOne({email:email},function(err,user){
            //find user and esablish the identity
            if(err){
                req.flash('error',err);
                return done(err);
            }
            if(!user || user.password!=password)
            {
                req.flash('error','Invalid username/Password')
                return done(null,false);
            }
            else{
                console.log('   ');
            return done(null,user);
            }
        })
    }
));




// serialize user to decide whcih key should be kept in the cookie
// basically if user is found we are setting cookie using this function
passport.serializeUser(function(user,done){
    done(null,user.id);

})






// when the browser send a req the cookie is send along with it for verification
// below is used to decrypt the cookie to verify the authenticity of user
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user-->passport');
                return done(err);
        }
        return done(null,user);
    })
})


//check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if the user is sign in the pass on the req to next function which willl be:
    //my controller action
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in:
    return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated())
    {
        //re.user contain the curr signed in user from the seesion cookie and we are sending it to local for the view
        res.locals.user=req.user
    }
    next();
}



module.exports=passport;