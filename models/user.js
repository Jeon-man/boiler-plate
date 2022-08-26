const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 1
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) { return next(err); }

            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) { return next(err); }
                user.password = hash;
                next();
            })

        });
    } else {
        next();
    }
        
});

userSchema.methods.comparePassword = function(plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if(err) return cd(err);
        cb(null, isMatch)
    }) 
}

userSchema.methods.createToken = function(cb) {

    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret');
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)

    })

}

userSchema.statics.findByToken = function(token, cb) {
    //토큰 디코드
    jwt.verify(token, 'secret', function(err, decode) {
        User.findOne({"_id": decode, "token": token}, (err, userInfo) => {
            if(err) {
                return cb(err);
            }
            cb(null, userInfo);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };