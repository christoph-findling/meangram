const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://cfindl:" + process.env.MONGO_ATLAS_KEY + "@cluster0-bwqvl.mongodb.net/node-angular?retryWrites=true")
    .then(() => console.log('connected to mongoDB'))
    .catch((err) => { console.log('error connecting to mongo db: ' + err), console.log(process.env.MONGO_ATLAS_KEY) });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
