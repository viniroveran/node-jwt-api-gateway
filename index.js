//index.js
require("dotenv-safe").config();

const httpProxy = require('express-http-proxy');
const express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

const app = express();

app.use(logger('dev'));

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.listen(10000, () => {
    console.log('Basic API Gateway + JWT running!');
});

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

// Authentication route
app.post('/login', urlencodedParser, (req, res, next) => {
    // mock authentication
    // in a regular app, it would happen on the database
    if (req.body.user === 'viniroveran' && req.body.password === '1234') {
        const id = 1; // user id
        const access_level = 1; // user access level
        const token = jwt.sign({ id, access_level }, process.env.SECRET, {
            expiresIn: 300 // token expiration time, in seconds
        });
        return res.json({ auth: true, token: token });
    }

    res.status(500).json({ message: 'Invalid login' });
})

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

function selectProxyHost(req) {
    if (req.path.startsWith('/games'))
        return 'http://localhost:5000/';
    else if (req.path.startsWith('/cinemas'))
        return 'http://localhost:6000/';
}

app.use(verifyJWT, (req, res, next) => {
    httpProxy(selectProxyHost(req))(req, res, next);
});
