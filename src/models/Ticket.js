const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Ticket",
  tableName: "tickets",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    origin: {
      type: "text",
      nullable: false
    },
    destination: {
      type: "text",
      nullable: false
    },
    seat: {
      type: "int",
      nullable: false
    }
  }
});