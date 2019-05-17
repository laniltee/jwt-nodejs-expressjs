const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const SECRET = 'supersecret';

app.listen(3000);
app.use(cookieParser());

const authorization = function (req, res, next) {
    const token = req.headers['x-authorization'];
    const msg = {auth: false, message: 'No token provided.'};
    if (!token) res.status(500).send(msg);
    jwt.verify(token, SECRET, function (err, decoded) {
        const msg = {auth: false, message: 'Failed to authenticate token.'};
        if (err) res.status(500).send(msg);
        next();
    });
};

app.get('/', function (req, res) {
    const cookie = req.cookies['x-authorization-cookie'];
    if (cookie) {
        jwt.verify(cookie, SECRET, function (err, decoded) {
            res.sendFile('views/home.html', {root: __dirname})
        });
    } else {
        res.clearCookie('x-authorization-cookie');
        res.sendFile('views/login.html', {root: __dirname})
    }
});


app.get('/login', function (req, res) {
    const username = req.query.username;
    const password = req.query.password;
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({foo: 'bar'}, SECRET);
        const currentDate = Date.now();
        res.cookie('x-authorization-cookie', token, {maxAge: 300000, httpOnly: true});
        console.log(token);
        res.sendFile('views/home.html', {root: __dirname})
    } else {
        const msg = {auth: false, message: 'Invalid username or password.'};
        res.sendFile('views/login.html', {root: __dirname})
    }

});

app.get('/api/students', authorization, function (req, res) {
    res.send('hello world')
});

app.post('/api/students', function (req, res) {
    res.send('hello world')
});

app.put('/api/students/:id', function (req, res) {
    res.send('hello world')
});

app.delete('/api/students/:id', function (req, res) {
    res.send('hello world')
});
