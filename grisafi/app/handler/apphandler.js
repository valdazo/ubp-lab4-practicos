//let func = require('../lib/auxFuncs');
let validator = require('../lib/validators');
//let mysql = require('mysql');
let query = require('../lib/queries')

module.exports = {
    getBooks: async (req, res) => {
        console.log(`- GET /books/`);
        let result = await query.getBooks();
        res.status(200).json({
            code: 200,
            data: result
        });
    },

    getBookId: async (req, res) => {
        console.log("- GET /book/:id");
        let book = await query.getBookId(req.params.id);
        if (book.length > 0) {
            res.status(200).json({
                code: 200,
                data: {
                    book
                }
            });
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

    postBook: async (req, res) => {
        if (validator.validateBook(req.body.title, req.body.quantity)) {
            query.postBook(req.body.title, req.body.quantity);
            res.status(201).json({
                code: 201,
                message: "book added"
            });
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

    //deleteBook deletes a book via its id, if the book was 
    //deleted then the number of affected rows is 1
    deleteBook: async (req, res) => {
        let result = await query.deleteBook(req.params.id);
        if (result.affectedRows == 1) {
            res.status(200).json({
                code: 200,
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

    putBook: async (req, res) => {
        if (validator.validateBookUpdate(req.body.bookId, req.body.amount)) {
            let book = await query.getBookId(req.body.bookId);
            if (book.length == 0) {
                res.status(404).json({
                    error: {
                        code: 404,
                        message: "book not found"
                    }
                });
            }
            else if (await query.putBook(req.body.bookId, req.body.amount)) {
                res.status(200).json({
                    code: 200,
                    message: `amount of copies of book with id: ${req.body.bookId} updated successfully`
                });
            }
            else {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "wrong amount of books"
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
            });
        }
    },

    //getMembers makes a query to get all the members registered
    getMembers: async (req, res) => {
        console.log(`- GET /members/`);
        let result = await query.getMembers();
        res.status(200).json({
            code: 200,
            data: result
        });
    },

    //getMemberId finds a member by his id
    getMemberId: async (req, res) => {
        console.log(`- GET /members/${req.params.id}`);
        let member = await query.getMemberId(req.params.id);
        if (member.length > 0) {
            res.status(200).json({
                code: 200,
                data: member
            });
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

    postMember: async (req, res) => {
        console.log("- POST /members/")
        if (req.body.name != null) {
            await query.postMember(req.body.name);
            res.status(201).json(
                {
                    code: 201,
                    message: `Member created successfully`
                });
        }
        else {
            res.status(400).json({
                error: {
                    code: 400,
                    message: "Incorrect Parameters"
                }
            });
        }
    },

    getLoans: async (req, res) => {
        console.log(`- GET /loans/`);
        let result = await query.getLoans();
        res.status(200).json({
            code: 200,
            data: result
        });
    },

    getLoansMember: async (req, res) => {
        console.log(`- GET /loans/:id`);
        let result = await query.getLoansMember(req.params.id);
        if (result) {
            res.status(200).json({
                code: 200,
                data: result
            });
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

    postLoan: async (req, res) => {
        console.log("- POST /loans/");
        let member = await query.getMemberId(req.body.memberId);
        if (member.length == 0) {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "member not found"
                }
            });
        }
        else {
            let book = await query.getBookId(req.body.bookId);
            if (book.length == 0) {
                res.status(404).json({
                    error: {
                        code: 404,
                        message: "book not found"
                    }
                });
            }
            else if (book[0].availables == 0) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: `there are no available copies of Book ${req.body.bookId} available for loan`
                    }
                })
            }

            else if (!validator.validateDays(req.body.days)) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "wrong number of days"
                    }
                });
            }
            else {

                let result = await query.postLoan(req.body.memberId, req.body.bookId, req.body.days);
                if (result) {
                    res.status(200).json({
                        code: 200,
                        message: `loan of book with id ${req.body.bookId} created successfully`
                    });
                    return;
                }
                else {
                    res.status(400).json({
                        error: {
                            code: 400,
                            message: `member ${req.body.memberId} has unreturned books`
                        }
                    });
                }
            }
        }
    },

    deleteLoan: async (req, res) => {
        console.log("- DELETE /loans/:id");
        let result = await query.deleteLoan(req.params.id);
        if (result.affectedRows == 1) {
            res.status(204).json({
                code: 204,
                message: "loan deleted successfully"
            });
        }
        else {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "loan not found"
                }
            })
        }
    }
}