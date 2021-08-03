const jwt = require('jsonwebtoken');
const https = require('https');

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Function to verify authentication token
const verifyJwtToken = (req, res, next) => {
    let authorizationHeader = req.headers.authorization;

    if(typeof authorizationHeader !== 'undefined'){
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, jwtSecretKey, (error, authData) => {
            if(error){
                res.sendStatus(403);
            }else{
                next();
            }
        });
    }else{
        res.sendStatus(403);
    }
    
}

// Function to send SMS
const sendSMS = (contact, message) => {

    const username = process.env.SMS_GATEWAY_USERNAME;
    const password = process.env.SMS_GATEWAY_PASSWORD;
    let senderID = "HM";

    let URL = `https://portal.nigeriabulksms.com/api/?username=${username}&password=${password}&message=${message}&sender=${senderID}&mobiles=${contact}`;
    
    https.get(URL, response => {

        let data = '';

        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            console.log(data);
        });

    }).on('error', error => {
        console.log(error.message);
    });
}

module.exports = {
    jwtSecretKey,
    verifyJwtToken,
    sendSMS
}