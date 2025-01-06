const { DataSource } = require("typeorm");

const Ticket = require("../models/Ticket");
const Client = require("../models/Client");
const User = require("../models/User");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "your-ip",
    port: your-port,
    username: "your-username",
    password: "your-password",
    database: "your-database",
    entities: [User, Client, Ticket],
    synchronize: true,
    logging: false,
});

module.exports = { AppDataSource };