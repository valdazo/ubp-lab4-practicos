let handler = require('../handlers/app.handler');

module.exports = app => {
  app.get('/partners', (req, res) => handler.getPartners(req, res));
  app.get('/partners/:id', (req, res) => handler.getPartner(req, res));
  app.post('/partners', (req, res) => handler.addPartner(req, res));
  app.delete('/partners/:id', (req, res) => handler.deletePartner(req, res));
  app.get('/books', (req, res) => handler.getBooks(req, res));
  app.get('/books/:id', (req, res) => handler.getBook(req, res));
  app.post('/newBook', (req, res) => handler.createBook(req, res));
  app.post('/books', (req, res) => handler.addBook(req, res));
  app.delete('/books/:id', (req, res) => handler.deleteBook(req, res));
  app.get('/loans', (req, res) => handler.getLoans(req, res));
  app.get('/loans/:id', (req, res) => handler.howMuchLoans(req, res));
  app.post('/loans/lent', (req, res) => handler.lent(req, res));
  app.get('/debt/:id', (req, res) => handler.hasDebt(req, res));
  app.get('/isLoan/:Bid/:Pid', (req, res) => handler.isLoan(req, res));
  app.post('/loans/return', (req, res) => handler.returnBook(req, res));
  app.post('/modifyTime', (req, res) => handler.modifyTime(req, res));
}