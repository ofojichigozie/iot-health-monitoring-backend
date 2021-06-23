const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const routes = require("./routes/routes");

const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Routes section
app.use("/api/v1", routes);

//Start the server application
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Health monitoring server started at port 5000");
});
