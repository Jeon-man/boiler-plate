const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const config = require('./config/key');

app.use(bodyPaser.urlencoded({extended: true}));
app.use(bodyPaser.json());

const { User } = require('./models/user');

const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("MongoDB connect"))
    .catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    });


});


app.listen(3000, () => {
    console.log("Conneted 3000 port");
});