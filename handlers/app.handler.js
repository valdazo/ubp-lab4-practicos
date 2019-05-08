let db = require("../db/db.manager");
let time = require("../lib/time");

module.exports = {
  /////////////////////////////////// PARTNERS ///////////////////////////////////////
  listAllPartners: (req, res) => {
    console.log(`GET /partners/`);
    res.status(200).json(db.getTable("partners"));
  },
  getPartner: (req, res) => {
    let id = req.params.id;
    let partner = db.getPartner(id);

    console.log(`GET /partners/${id}`);
    if (partner) {
      res.status(200).json(partner);
    } else {
      res.status(404).json({ message: "The partner doesn't exist." });
    }
  },
  addPartner: (req, res) => {
    let { name } = req.body;
    let { surname } = req.body;
    let { id } = req.body;

    if (!db.getPartner(id)) {
      console.log(`POST /partners/${id} NEW`);
      db.addEntry("partners", { name: name, surname: surname, id: id });
      res.status(201).json({ message: "Created.", name: name, surname: surname, id: id });
    } else {
      console.log(`POST /partners/${id} CONFLICT`);
      res.status(409).json({ message: "The partner already exist." });
    }
  },
  deletePartner: (req, res) => {
    let id = req.params.id;
    let partner = db.getPartner(id);
    if (partner) {
      console.log(`DELETE /partners/${id} OK`);
      db.deletePartner(id);
      res.status(200).json({ message: "Deleted." });
    } else {
      console.log(`DELETE /partners/${id} NOT FOUND`);
      res.status(404).json({ message: "The partner doesn't exist" });
    }
  },
  ///////////////////////////////////////// BOOKS ////////////////////////////////////
  listAllBooks: (req, res) => {
    console.log(`GET /books/`);
    res.status(200).json(db.getTable("books"));
  },
  getBook: (req, res) => {
    let id = req.params.id;
    let book = db.getBook(id);
    console.log(`GET /books/${id}`);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "The book doesn't exist" });
    }
  },
  addBook: (req, res) => {
    let { title } = req.body;
    let { author } = req.body;
    let { id } = req.body;

    if (db.getBook(id)) {
      console.log(`POST /books/${id} +1`);
      db.addBook(id);
      res.status(200).json({ message: "Book added to collection" });
    } else {
      console.log(`POST /books${id} NEW`);
      db.addEntry("books", { title: title, author: author, inventory: 1, id: id });
      res.status(201).json({ message: "Book added to inventory" });
    }
  },
  deleteBook: (req, res) => {
    let id = req.params.id;
    let book = db.getBook(id);

    if (book != null) {
      if (book.inventory != 0) {
        console.log(`DELETE /books/${id} OK`);
        res.status(200).json({ message: "Deleted" });
        db.deleteBook(id);
      } else {
        console.log(`DELETE /books/${id} EMPTY`);
        res.status(404).json({ message: "The inventory of this book is empty" });
      }
    } else {
      console.log(`DELETE /books/${id} NOT FOUND`);
      res.status(404).json({ message: "The book doesn't exist" });
    }
  },
  ///////////////////////////////////////// LOANS ////////////////////////////////////
  listAllLoans: (req, res) => {
    console.log(`GET /loans/`);
    res.status(200).json(db.getTable("loans"));
  },
  lentBook: (req, res) => {
    let { Bid } = req.body;
    let { Pid } = req.body;
    let book = db.getBook(Bid);
    let partner = db.getPartner(Pid);
    if (book) {
      if (book.inventory > 0) {
        if (partner) {
          if (!db.hasBedt(Pid, time.getTime())) {
            console.log(`POST /loans/lent OK`);
            db.lentBook(Pid, Bid, time.getTime(10));
            res.status(200).json({ message: "Book lent.", expiration_date: time.getTime(10) });
          } else {
            console.log(`POST /loans/lent OVERDUE DEBTS`);
            res.status(400).json({ message: "The partner has overdue debts." });
          }
        } else {
          console.log(`POST /loans/lent PARTNER NOT FOUND`);
          res.status(404).json({ message: "The partner doesn't exist." });
        }
      } else {
        console.log(`POST /loans/lent EMPTY`);
        res.status(404).json({ message: "The inventory of this book is empty" });
      }
    } else {
      console.log(`POST /loans/lent BOOK NOT FOUND`);
      res.status(404).json({ message: "The book doesn't exist" });
    }
  },
  returnBook: (req, res) => {
    let { Bid } = req.body;
    let { Pid } = req.body;
    let book = db.getBook(Bid);
    let partner = db.getPartner(Pid);
    if (book) {
      if (partner) {
        if (db.isLoan(Pid, Bid)) {
          console.log(`POST /loans/return OK`);
          db.returnBook(Pid, Bid, time.getTime());
          res.status(200).json({ message: "Book returned." });
        } else {
          console.log(`POST /loans/return NO LOAN`);
          res.status(404).json({ message: "The partner doesn't have that book." });
        }
      } else {
        console.log(`POST /loans/return PARTNER NOT FOUND`);
        res.status(404).json({ message: "The partner doesn't exist." });
      }
    } else {
      console.log(`POST /loans/return BOOK NOT FOUND`);
      res.status(404).json({ message: "The book doesn't exist" });
    }
  },
  ///////////////////////////////////////// TESTING ////////////////////////////////////
  modifyTime: (req, res) => {
    let { days } = req.body;
    time.modifyTime(days);
    res.status(200).json({ message: "Time changed.", new_time: time.getTime() });
  }
}