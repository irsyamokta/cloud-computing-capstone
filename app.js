import express from "express";
import bodyParser from "body-parser";
import sequelize  from "./config/connection.js";
import jwt from "jsonwebtoken";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});