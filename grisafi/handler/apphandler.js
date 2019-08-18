let f = require('../lib/auxFuncs');

const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

function Book(title, amount, id) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.availables = function () {
        let count = 0;
        for (const prest of loans) {
            if (prest.idBook == this.id) {
                count++;
            }
        }
        return this.amount - count;
    }
}

function Member(name, id) {
    this.id = id;
    this.name = name;
}

function Loan(id, memberId, bookId, days) {
    this.id = id;
    this.memberId = memberId;
    this.bookId = bookId;
    this.expiracyDate = Date.now() + DIA_EN_MILISEGUNDOS * days;
}

var books = new Array();
var members = new Array();
var loans = new Array();

// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
books.push(new Book("Harry Potter", 100, 10));
books.push(new Book("El Señor de los Anillos", 10, 20));
// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
members.push(new Member("A", 1));
members.push(new Member("B", 2));
// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
loans.push(new Loan(1, 1, 10, 20));
loans.push(new Loan(2, 2, 10, 20));


module.exports = {

    getMembers: (req, res) => {
        console.log(`GET /members/`);
        res.status(200).json({ data: members });
    },

    getMemberId: (req, res) => {
        console.log(`GET /members/${req.params.id}`);
        let member = f.findID(req.params.id, members);
        if (member) {
            res.status(200).json({ data: member });
        }
        else {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "Member not found"
                }
            });
        }
    },

    postMember: (req, res) => {
        console.log("POST /members/")
        if (req.body.name != null && req.body.id != null) {
            members.push(new Member(req.body.name, req.body.id));
            res.status(201).json(
                {
                    data: {
                        id: req.body.id,
                        name: req.body.name
                    },
                    message: `Member with id ${req.body.id} created successfully`
                });
        }
        else {
            res.status(400).json({
                error: {
                    code: 404,
                    message: "Incorrect Parameters"
                }
            });
        }
    },

    getBooks: (req, res) => {
        console.log(`GET /books/`);
        res.status(200).json({ data: books });
    },

    getBookId: (req, res) => {
        let book = f.findID(req.params.id, books);
        if (book != 0) {
            res.status(200).json(
                {
                    data: {
                        "bookId": parseInt(req.params.id),
                        "title": book.title,
                        "available": book.availables()
                    }
                });
        }
        else {
            res.status(404).json(
                {
                    error: {
                        code: 404,
                        message: "book not found"
                    }
                });
        }
    },

    postBook: (req, res) => {
        if (f.findID(req.body.id, books)==false) {
            books.push(new Book(req.body.title, req.body.quantity, req.body.id));
            res.status(201).json(
                {
                    status: "success",
                    message: "book added"
                }
            );
        }
        else{
            res.status(400).json(
                {
                    error:{
                        code:404,
                        message:"there's already another book with that id"
                    }
                }
            )
        }
    },

    deleteBook: (req, res) => {
        let result = f.deleteBook(req.params.id, books, loans);
        if (result) {
            res.status(200).json({
                success: true,
                message: "Book Deleted"
            });
        }
        else if (result == -1) {
            res.status(403).json(
                {
                    error: {
                        code: 403,
                        message: "Cannot delete the book due to there are borrowed copies"
                    }
                })
        }
        else {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "Book not found"
                }
            });
        }
    },

    putBook: (req, res) => {
        let result = f.updateBook(req.body.bookId, req.body.quantity, books, loans);
        if (result == 1) {
            res.status(200).json(
                {
                    status: "success",
                    message: `amount of copies of book with id: ${req.body.bookId} updated successfully`
                });
        }
        else if (result == -1) {
            res.status(400).json(
                {
                    error: {
                        code: 400,
                        message: "wrong amount of books"
                    }
                })
        }
        else {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "book not found"
                }
            });
        }
    },

    getLoans: (req, res) => {
        console.log(`GET Loans`);
        if (loans != null)
            res.status(200).json({ data: loans });
        else
            res.status(204).json({ message: "no loans registered" });
    },

    getLoansMember: (req, res) => {
        console.log(`GET /loans/:id`);
        if (f.findID(req.params.id, members)) {
            let prest = f.getLoansId(req.params.id, loans);
            if (prest.length == 0) {
                res.status(204).json({ message: `There are no loans made by member with id: ${req.params.id}` });
            }
            else {
                res.status(200).json({ data: prest });
            }
        }
        else {
            res.status(404).json(
                {
                    error: {
                        code: 404,
                        message: "Member not found"
                    }
                })
        }
    },

    postLoan: (req, res) => {
        if (f.adeuda(req.body.MemberId)) {
            res.status(400).json({
                error: {
                    code: 400,
                    message: `Member ${req.body.MemberId} has unreturned books`
                }
            });
        }
        else {
            if (f.findID(req.body.BookId, books).availables() > 0) {
                loans.push(new Loan(f.generatePrestamosID(), req.body.MemberId, req.body.BookId, req.body.days));
                res.status(200).json({
                    success: true,
                    message: `Loan of book ${req.body.BookId} created successfully`
                });
            }
            else {
                res.status(400).json(
                    {
                        error: {
                            code: 400,
                            message: `There are no available copies of Book ${req.body.BookId} available for loan`
                        }
                    })
            }
        }
    }
}