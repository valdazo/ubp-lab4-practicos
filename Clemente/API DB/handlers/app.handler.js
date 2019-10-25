let db = require('../db/db.manager');
let time = require('../lib/time');

module.exports = {
    /////////////////////////////////// PARTNERS ///////////////////////////////////////
    getPartners: (req, res) => {
        console.log('SELECT * FROM partners');
        res.status(200).json(db.getTable('partners'));
    },
    getPartner: (req, res) => {
        let id = req.params.id;
        console.log(`SELECT * FROM partners WHERE ID=${id}`);
        res.status(200).json(db.getPartner(id));
    },
    addPartner: (req, res) => {
        let { name } = req.body;
        let { surname } = req.body;
        let { id } = req.body;
        console.log(`INSERT INTO partners VALUES(${name},${surname},${id})`);
        db.addEntry("partners", { name: name, surname: surname, id: id })
        res.status(201).json({ message: 'Created.' });
    },
    deletePartner: (req, res) => {
        let id = req.params.id;
        console.log(`DELETE * FROM partners WHERE id=${id}`);
        db.deletePartner(id);
        res.status(204).json({ message: 'Deleted.' });
    },
    /////////////////////////////////// BOOKS ///////////////////////////////////////
    getBooks: (req, res) => {
        console.log('SELECT * FROM books');
        res.status(200).json(db.getTable('books'));
    },
    getBook: (req, res) => {
        let id = req.params.id;
        console.log(`SELECT * FROM books WHERE ID=${id}`);
        res.status(200).json(db.getBook(id));
    },
    addBook: (req, res) => {
        let { id } = req.body;
        db.addBook(id);
        console.log(`UPDATE books SET inventory=inventory+1 WHERE id=${id}`);
        res.status(201).json({ message: 'Book added to collection.' });
    },
    createBook: (req, res) => {
        let { title } = req.body;
        let { author } = req.body;
        let { id } = req.body;
        console.log(`INSERT INTO books VALUES(${title},${author},1,${id})`);
        db.addEntry("books", { title: title, author: author, inventory: 1, id: id });
        res.status(201).json({ message: 'Created.' });
    },
    deleteBook: (req, res) => {
        let id = req.params.id;
        console.log(`DELETE * FROM books WHERE id=${id}`);
        db.deleteBook(id);
        res.status(204).json({ message: 'Deleted.' });
    },
    /////////////////////////////////// LOANS ///////////////////////////////////////
    getLoans: (req, res) => {
        console.log('SELECT * FROM loans');
        res.status(200).json(db.getTable('loans'));
    },
    howMuchLoans: (req, res) => {
        let id = req.params.id;
        res.status(200).json({ loans: db.howMuchLoans(id) });
    },
    hasDebt: (req, res) => {
        let id = req.params.id;
        res.status(200).json({ debt: db.hasDebt(id, time.getTime()) });
    },
    lent: (req, res) => {
        let {Pid} = req.body;
        let {Bid} = req.body;
        db.lentBook(Pid, Bid, time.getTime(10));
        res.status(200).json({ message: "Book lent.", expiration_date: time.getTime(10) });
    },
    isLoan: (req, res) => {
        let Pid = req.params.Pid;
        let Bid = req.params.Bid;
        res.status(200).json({ isLoan: db.isLoan(Pid, Bid) });
    },
    returnBook: (req, res) => {
        let {Pid} = req.body;
        let {Bid} = req.body;
        db.returnBook(Pid, Bid, time.getTime());
        res.status(200).json({ message: "Book returned." });
    },
    modifyTime: (req, res) => {
        let { days } = req.body;
        time.modifyTime(days);
        res.status(200).json({ message: "Time changed.", new_time: time.getTime() });
    }
}