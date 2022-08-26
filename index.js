const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');


app.use(bodyPaser.urlencoded({extended: true}));
app.use(bodyPaser.json());
app.use(cookieParser());

const { User } = require('./models/User');

const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("MongoDB connect"))
    .catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, user) => {
        if(err) {
            console.log(err);
            return res.json({success: false, err})
        }
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일의 유저가 없습니다."
            })
        }


        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            })

            user.createToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    })
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logOut', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: " "}, function (err, user) {
        if(err) {
            return res.json({success: false, err});
        }
        return res.status(200).send({
            success: true
        })
    })

})

app.listen(3000, () => {
    console.log("Conneted 3000 port");
});