const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const CustomError = require('./utils/CustomError');
require('dotenv').config();

const routes = require("./routes/routes");

const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Routes section
app.use("/api/v1", routes);

// Catch 404 request
app.use((req, res, next) => {
    let error = new CustomError(404, 'Not found!');
    next(error);
});

// Error handler middleware
app.use((error, req, res, next) => {
    res.status(error.getStatusCode()).json({message: error.getMessage()});
});

//Start the server application
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Health monitoring server started at port ${PORT}`);
});
