const passport = require('passport');
const User = require("../models/User");
const LocalStrategy = require('passport-local').Strategy


//Authentication using passport

passport.use(new LocalStrategy(
    {
        usernameField:"username",
    },
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
          
        if(err)
        {
            console.log('Error in finding user');
            return done(err);
        }

        if(!user || user.password!=password)
        {
            console.log("Invalid Username/ Password");
            return done(null, false)
        }
        
        return done(null, user);
        
      });
    }
));

passport.serializeUser(function(user,done){
    done(null, user.id);
})

passport.deserializeUser(function(id,done){

    User.findById(id,function(err,user){
        if(err)
        {
            console.log('Error in finding user');
            return done(err);
        }

        return done(null, user);
    })
})


module.exports = passport;