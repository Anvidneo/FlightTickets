const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Client",
  tableName: "clients",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "text",
      nullable: false
    }
  }
});