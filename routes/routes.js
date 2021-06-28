const express = require('express');
const jwt = require('jsonwebtoken');
const https = require('https');

const router = express.Router();

let storage = [];

let jwtSecretKey = process.env.JWT_SECRET_KEY;

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

router.post('/login', (req, res) => {
    // Static authentication details
    let username = req.body.username;
    let password = req.body.password;

    if(
        username == 'healthadmin@gmail.com' && 
        password == 'admin@12345'
    ){
        // Generate authentication token and send response
        jwt.sign({username, password}, jwtSecretKey, (error, token) => {
            res.json({
                token
            });
        });
    }else{
        res.json({
            token: null
        });
    }

});

router.get('/health-records', verifyJwtToken, (req, res) => {
    res.json({
        data: storage,
        message: "READ"
    });
});

router.get('/health-records/:patientID/:temperature/:humidity/:pulseRate', (req, res) => {
    let id = storage.length + 1;
    let patientID = req.params.patientID;
    let temperature = req.params.temperature;
    let humidity = req.params.humidity;
    let pulseRate = req.params.pulseRate;

    const dateTime = new Date();

    let day = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
    let month = (dateTime.getMonth() + 1) < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1);
    let year = dateTime.getFullYear();

    let date = `${year}-${month}-${day}`;
    let time = dateTime.toLocaleTimeString();

    const healthRecords = {
        id,
        patientID,
        temperature,
        humidity,
        pulseRate,
        date,
        time
    };

    storage.push(healthRecords);

    let contact = '09083755505,08135439547';
    let message = `TEMP:${temperature}, HUM:${humidity}, BPM:${pulseRate }`;
    sendSMS(contact, message);

    res.json({
        data: healthRecords,
        message: "CREATED"
    });

});

router.delete('/health-records ', verifyJwtToken, (req, res) => {

    storage = [];

    res.json({
        message: "DELETED"
    });
});


module.exports = router;