const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const SECRET = 'supersecret';

app.listen(3000);

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


app.post('/login', function (req, res) {
    const token = jwt.sign({foo: 'bar'}, SECRET);
    console.log(token);
    res.send({token});
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
