let db = require("../db/db.manager");
let time = require("../lib/time");
let valid = require("../validators/validator");

module.exports = {
  /////////////////////////////////// PARTNERS ///////////////////////////////////////
  listAllPartners: (req, res) => {
    console.log(`GET /partners/`);
    res.status(200).json(db.getTable("partners"));
  },
  getPartner: (req, res) => {
    let id = req.params.id;
    if (valid.id(id)) {
      let partner = db.getPartner(id);
      if (partner) {
        console.log(`GET /partners/${id} FOUND`);
        res.status(200).json(partner);
      } else {
        console.log(`GET /partners/${id} NOT FOUND`);
        res.status(404).json({ message: "The partner doesn't exist." });
      }
    } else {
      console.log(`GET /partners/${id} INVALID ID`);
      res.status(400).json({ message: "Invalid id." });
    }
  },
  addPartner: (req, res) => {
    let { name } = req.body;
    let { surname } = req.body;
    let { id } = req.body;

    if (valid.string(name) && valid.string(surname) && valid.id(id)) {
      if (!db.getPartner(id)) {
        console.log(`POST /partners/${id} NEW`);
        db.addEntry("partners", { name: name, surname: surname, id: id });
        res.status(201).json({ message: "Created.", name: name, surname: surname, id: id });
      } else {
        console.log(`POST /partners/${id} CONFLICT`);
        res.status(409).json({ message: "The partner already exist." });
      }
    } else {
      console.log(`POST /partners/${id} INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  deletePartner: (req, res) => {
    let id = req.params.id;
    if (valid.id(id)) {
      let partner = db.getPartner(id);
      if (partner) {
        console.log(`DELETE /partners/${id} OK`);
        db.deletePartner(id);
        res.status(204).json({ message: "Deleted." });
      } else {
        console.log(`DELETE /partners/${id} NOT FOUND`);
        res.status(404).json({ message: "The partner doesn't exist" });
      }
    } else {
      console.log(`DELETE /partners/${id} INVALID ID`);
      res.status(400).json({ message: "Invalid id." });
    }
  },
  ///////////////////////////////////////// BOOKS ////////////////////////////////////
  listAllBooks: (req, res) => {
    console.log(`GET /books/`);
    res.status(200).json(db.getTable("books"));
  },
  getBook: (req, res) => {
    let id = req.params.id;
    if (valid.id(id)) {
      let book = db.getBook(id);
      console.log(`GET /books/${id}`);
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "The book doesn't exist." });
      }
    } else {
      console.log(`GET /books/${id} INVALID ID`);
      res.status(400).json({ message: "Invalid id." });
    }
  },
  addBook: (req, res) => {
    let { title } = req.body;
    let { author } = req.body;
    let { id } = req.body;

    if (valid.string(title) && valid.string(author) && valid.id(id)) {
      if (db.getBook(id)) {
        console.log(`POST /books/${id} +1`);
        db.addBook(id);
        res.status(200).json({ message: "Book added to inventory." });
      } else {
        console.log(`POST /books${id} NEW`);
        db.addEntry("books", { title: title, author: author, inventory: 1, id: id });
        res.status(201).json({ message: "Book added to collection." });
      }
    } else {
      console.log(`POST /books/${id} INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  deleteBook: (req, res) => {
    let id = req.params.id;
    let book = db.getBook(id);

    if (book != null) {
      let loans = db.howMuchLoans(id);
      if (book.inventory > loans || loans == 0) {
        console.log(`DELETE /books/${id} OK`);
        db.deleteBook(id);
        res.status(200).json({ message: "Deleted." });
      } else {
        console.log(`DELETE /books/${id} HAS LOANS`);
        res.status(403).json({ message: "The book has loans." });
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
    if (valid.id(Pid) && valid.id(Bid)) {
      if (book) {
        if (book.inventory > 0) {
          let loans = db.howMuchLoans(Bid);
          if (book.inventory > loans) {
            if (partner) {
              if (!db.hasDebt(Pid, time.getTime())) {
                if (!db.isLoan(Pid, Bid)) {
                  console.log(`POST /loans/lent OK`);
                  db.lentBook(Pid, Bid, time.getTime(10));
                  res.status(200).json({ message: "Book lent.", expiration_date: time.getTime(10) });
                } else {
                  console.log(`POST /loans/lent ALREADY LENT`);
                  res.status(400).json({ message: "The partner has already lent that book." });
                }
              } else {
                console.log(`POST /loans/lent OVERDUE DEBTS`);
                res.status(400).json({ message: "The partner has overdue debts." });
              }
            } else {
              console.log(`POST /loans/lent PARTNER NOT FOUND`);
              res.status(404).json({ message: "The partner doesn't exist." });
            }
          } else {
            console.log(`POST /loans/lent ALL LOAN`);
            res.status(403).json({ message: "All copies of this book are on loan." });
          }
        } else {
          console.log(`POST /loans/lent EMPTY`);
          res.status(404).json({ message: "The inventory of this book is empty." });
        }
      } else {
        console.log(`POST /loans/lent BOOK NOT FOUND`);
        res.status(404).json({ message: "The book doesn't exist." });
      }
    } else {
      console.log(`POST /loans/lent INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  returnBook: (req, res) => {
    let { Bid } = req.body;
    let { Pid } = req.body;
    let book = db.getBook(Bid);
    let partner = db.getPartner(Pid);
    if (valid.id(Pid) && valid.id(Bid)) {
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
    } else {
      console.log(`POST /loans/return INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  ///////////////////////////////////////// TESTING ////////////////////////////////////
  modifyTime: (req, res) => {
    let { days } = req.body;
    if (valid.id(days)) {
      time.modifyTime(days);
      res.status(200).json({ message: "Time changed.", new_time: time.getTime() });
    } else {
      res.status(400).json({ message: "Invalid value." });
    }
  }
}