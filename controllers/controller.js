const jwt = require('jsonwebtoken');
const util = require('../utils/util');

let storage = [];

const login = (req, res) => {
    // Static authentication details
    let username = req.body.username;
    let password = req.body.password;

    if(
        username == 'healthadmin@gmail.com' && 
        password == 'admin@12345'
    ){
        // Generate authentication token and send response
        jwt.sign({username, password}, util.jwtSecretKey, (error, token) => {
            res.json({
                token
            });
        });
    }else{
        res.json({
            token: null
        });
    }

};

const getHealthRecords = (req, res) => {
    res.json({
        data: storage,
        message: "READ"
    });
};

const addHealthRecord = (req, res) => {
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
    util.sendSMS(contact, message);

    res.json({
        data: healthRecords,
        message: "CREATED"
    });

};

const deleteRecords = (req, res) => {

    storage = [];

    res.json({
        message: "DELETED"
    });
};

module.exports = {
    login,
    getHealthRecords,
    addHealthRecord,
    deleteRecords
};