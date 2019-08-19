let f = require('../lib/auxFuncs');
let v = require('../lib/validators');

const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

function Book(title, amount, id) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.availables = function () {
        let count = 0;
        for (const prest of loans) {
            if (prest.bookId == this.id) {
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
books.push(new Book("Harry Potter", 3, 10));
books.push(new Book("El Señor de los Anillos", 10, 20));
// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
members.push(new Member("A", 1));
members.push(new Member("B", 2));
// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
loans.push(new Loan(1, 1, 10, 10));
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
        if (req.body.name != null && v.validateId(req.body.id)) {
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
        if (f.findID(req.body.id, books) == false) {
            if (v.validateBook(req.body.title, req.body.quantity, req.body.id)) {
                books.push(new Book(req.body.title, req.body.quantity, req.body.id));
                res.status(201).json(
                    {
                        status: "success",
                        message: "book added"
                    }
                );
            }
            else {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "wrong parameters"
                    }
                })
            }
        }
        else {
            res.status(400).json(
                {
                    error: {
                        code: 400,
                        message: "there's already another book with that id"
                    }
                }
            )
        }
    },

    deleteBook: (req, res) => {
        let result = f.deleteBook(req.params.id, books, loans);
        if (result == 1) {
            res.status(200).json({
                success: true,
                message: "book deleted"
            });
        }
        else if (result == -1) {
            res.status(403).json(
                {
                    error: {
                        code: 403,
                        message: "cannot delete the book due to there are borrowed copies"
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

    putBook: (req, res) => {
        if (v.validateBookUpdate(req.body.bookId, req.body.quantity)) {
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
        }
        else {
            res.status(400).json({
                error: {
                    code: 400,
                    message: "wrong parameters"
                }
            })
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
            res.status(200).json({ data: prest });
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
        if (f.findID(req.body.memberId, members) == false) {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "member not found"
                }
            })
        }

        else if (!v.validateDays(req.body.days)) {
            res.status(400).json({
                error: {
                    code: 400,
                    message: "wrong number of days"
                }
            })
        }

        else if (f.debt(req.body.memberId, loans)) {
            res.status(400).json({
                error: {
                    code: 400,
                    message: `member ${req.body.memberId} has unreturned books`
                }
            });
        }
        else {
            let book = f.findID(req.body.bookId, books);
            if (book == false) {
                res.status(404).json({
                    error: {
                        code: 404,
                        message: "book not found"
                    }
                })
            }
            else if (book.availables() > 0) {
                loans.push(new Loan(f.generateLoansID(), req.body.memberId, req.body.bookId, req.body.days));
                res.status(200).json({
                    success: true,
                    message: `loan of book with id ${req.body.bookId} created successfully`
                });
            }
            else {
                res.status(400).json(
                    {
                        error: {
                            code: 400,
                            message: `there are no available copies of Book ${req.body.bookId} available for loan`
                        }
                    })
            }
        }
    },

    deleteLoan: (req, res) => {
        if (f.returnBook(req.params.id,loans)) {
            res.status(200).json({
                status:"success",
                message:"loan deleted successfully"
            })
        }
        else {
            res.status(404).json({
                error:{
                    code:404,
                    message:"loan not found"
                }
            })
        }
    }


}