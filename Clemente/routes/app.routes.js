let handler = require("../handlers/app.handler");

module.exports = app => {
  app.get("/partners", (req, res) => handler.listAllPartners(req, res));
  app.get("/partners/:id", (req, res) => handler.getPartner(req, res));
  app.post("/partners", (req, res) => handler.addPartner(req, res));
  app.delete("/partners/:id", (req, res) => handler.deletePartner(req, res));
  app.get("/books/", (req, res) => handler.listAllBooks(req, res));
  app.get("/books/:id", (req, res) => handler.getBook(req, res));
  app.post("/books/", (req, res) => handler.addBook(req, res));
  app.delete("/books/:id", (req, res) => handler.deleteBook(req, res));
  app.get("/loans/", (req, res) => handler.listAllLoans(req, res));
  app.post("/loans/lent", (req, res) => handler.lentBook(req, res));
  app.post("/loans/return", (req, res) => handler.returnBook(req, res));
  app.post("/time/", (req, res) => handler.modifyTime(req, res));
}