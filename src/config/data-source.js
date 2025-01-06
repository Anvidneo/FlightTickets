const { DataSource } = require("typeorm");

const Ticket = require("../models/Ticket");
const Client = require("../models/Client");
const User = require("../models/User");

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Client, Ticket],
    synchronize: true,
    logging: false,
});

module.exports = { AppDataSource };
