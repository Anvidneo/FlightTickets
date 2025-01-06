require('dotenv').config();

const express = require("express");
const { AppDataSource } = require("./src/config/data-source");

const app = express();
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/v1/auth", authRoutes);
const ticketRoutes = require("./src/routes/ticketRoutes");
app.use("/api/v1/ticket", ticketRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server runing on PORT ${process.env.PORT || 8080}`);
});