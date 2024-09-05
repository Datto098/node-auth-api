const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { JWT_SECRET } = require('../configs');


function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        // Remove 'Bearer ' from token
        const jwtToken = token.split(' ')[1];
        // Decode token
        const decoded = jwt.verify(jwtToken, JWT_SECRET);
        // Save decoded user to req.user
        req.user = decoded;
    } catch (err) {
        console.log(err);
        return res.status(401).send('Invalid Token');
    }
    return next();
}

// Route test JWT
router.post('/', verifyToken, (req, res) => {
    res.status(200).send({
        message: 'JWT is valid!',
        user: req.user,
    });
});

module.exports = router;
