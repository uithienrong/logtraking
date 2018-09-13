var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var config = require('../config/database');
var bcrypt = require('bcryptjs');


module.exports = function (passport) {
    //Local strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        //Match username
        var query = {username:username};
        User.findOne(query, function (err, user) {
            if(err){
                throw err
            }
            if(!user){
                return done(null, false, {message: 'No user found'});
            }

            //Match password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        })
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    })
}