const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jeonmin:jhmjhm0106@cluster0.ua4oey2.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("MongoDB connect"))
    .catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log("Conneted 3000 port");
});