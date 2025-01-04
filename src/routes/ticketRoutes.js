const express = require("express");
const authenticateToken = require('../middleware/authMiddleware');
const { generateTicket } = require("../controllers/ticketController");

const router = express.Router();

router.get("/generate", authenticateToken, generateTicket);

module.exports = router;
