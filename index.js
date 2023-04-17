require("dotenv").config();

const httpProxy = require('express-http-proxy');
const logger = require('morgan');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const express = require('express'),
      app     = express(),
      port    = parseInt(process.env.GATEWAY_PORT, 10) || 4000;

// Enable development logs
app.use(logger('dev'));

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.listen(port, () => {
    console.log('Basic API Gateway + JWT running on port ' +  port + '! http://' + process.env.GATEWAY_IP + ':' +  port + '/');
});

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) return res.status(403).json({ auth: false, message: 'Failed to authenticate token.' });

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

app.get("/", (req, res) => {
    res.json({message: "Welcome to JWT API Gateway!"});
});

// Authentication route
app.post('/login', urlencodedParser, (req, res, next) => {
    // mock authentication
    // in a regular app, it would happen on the database
    if (req.body.user === 'viniroveran' && req.body.password === '1234') {
        const id = 1; // user id
        const access_level = 1; // user access level
        const token = jwt.sign({ id, access_level }, process.env.JWT_SECRET, {
            expiresIn: 300 // token expiration time, in seconds
        });
        return res.json({ auth: true, token: token });
    }

    res.status(403).json({ message: 'Invalid login' });
})

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

function selectProxyHost(req) {
    if (req.path.startsWith('/games'))
        return 'http://' + process.env.GAMES_IP + ':' + process.env.GAMES_PORT + '/';
    else if (req.path.startsWith('/cars'))
        return 'http://' + process.env.CARS_IP + ':' + process.env.CARS_PORT + '/';
}

app.use(verifyJWT, (req, res, next) => {
    httpProxy(selectProxyHost(req))(req, res, next);
});
