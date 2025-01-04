const path = require('path');
const { _response } = require('../utils/helpers');
const { AppDataSource } = require("../config/data-source");
const Client = require("../models/Client");
const Ticket = require("../models/Ticket");

const generateTicket = async (req, res) => {
    const { flightId, airline, datetime, clientId  } = req.body;
    try {
        const ticketRepository = AppDataSource.getRepository(Ticket);
        const ticket = await ticketRepository.findOne({ where: { id: flightId } });
        
        if (!ticket) {
            return res.status(404).json(_response(404, 'Flight not found'));
        }

        const clientRepository = AppDataSource.getRepository(Client);
        const client = await clientRepository.findOne({ where: { id: clientId } });
        
        if (!client) {
            return res.status(404).json(_response(404, 'Client not found'));
        }

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        const imagePath = path.resolve(__dirname, '..', 'utils', 'images', 'ticket.png');
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const maxWidth = pageWidth * 0.8;
        const maxHeight = pageHeight * 0.3;
        const img = doc.openImage(imagePath);
        const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * scaleFactor;
        const height = img.height * scaleFactor;
        const x = (pageWidth - width) / 2;

        doc.image(imagePath, x, 0, { width, height });
        doc.font('Helvetica-Bold').fontSize(16);
        doc.text(airline, 350, 35);
        doc.font('Helvetica').fontSize(12);
        doc.text(client.name, 100, 77);
        doc.text(flightId, 100, 105);
        doc.font('Helvetica').fontSize(10);
        doc.text(ticket.origin, 285, 75);
        doc.text(ticket.destination, 360, 75);
        doc.text(datetime, 285, 97);
        doc.text(ticket.seat, 285, 120);
        
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${clientId}.pdf`,
        });
        
        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error("Error generating ticket:", error);
        return res.status(500).json(_response(500, 'Error generating ticket'));
    }
};

module.exports = { generateTicket };