const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const auth = require('./routes/auth.js');

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Welcome Polafit Webservice");
});

app.use('/auth', auth);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
