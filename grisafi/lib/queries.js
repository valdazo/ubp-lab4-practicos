let mysql = require('mysql');
let util = require('util');
let con = mysql.createConnection({
    host: 'db',
    user: 'library',
    password: 'library',
    database: 'library'
})

const query = util.promisify(con.query).bind(con);
const DAY_IN_MILSEC = 1000 * 60 * 60 * 24;

module.exports = {

    getBooks: () => {
        let result = query(`
            select * from books
        `);
        return result;
    },

    getBookId: (id) => {
        let result = query(
            `
            select b.id, b.title, b.amount, b.amount - count(l.bookId) as availables
                from books b
                left join loans l
                    on b.id = l.bookId
                where b.id=?
                group by b.id, b.title, b.amount
            `, [id]
        )
        return result;
    },

    postBook: (title, quantity) => {
        let result = query(`
            insert into books
            values (null, ?, ?)
        `, [title, quantity]);
        return result;
    },

    deleteBook: (id) => {
        let aux = query(`
            select *
                from loans l
                where l.bookId = ?`, [id]
        );
        if (aux.length == 0) {
            let result = query(` 
                delete b
                from books b
                where b.id = ?
            `, [id]
            );
            return result;
        }
        else {
            return false;
        }
    },

    putBook: async (id, amount) => {
        let aux = await query(
            `
            select count(b.id) as amount
                from loans l
                right join books b 
                    on l.bookId = b.id
                where b.id = ?
            group by b.id
            `, [id]
        );

        if (aux[0].amount < amount) {
            await query(`
                update books
                set amount = ?
                where id=?`, [amount, id]
            );
            return true;
        }
        return false;
    },

    getMembers: () => {
        let result = query(`select * from members`);
        return result;
    },

    getMemberId: (id) => {
        let result = query(
            `select *
                from members m
                where m.id=?`, [id]
        );
        return result;
    },

    postMember: (name) => {
        let result = query(
            `
            insert into members
            values(null,?)
            `, [name]
        )
        return result;
    },

    getLoans: () => {
        let result = query(`
            select * from loans;
        `);
        return result;
    },

    getLoansMember: async (id) => {
        let aux = await query(`
        select *
            from members m
            where m.id = ?
        `, [id]);
        if (aux.length > 0) {
            let result = query(`
            select *
                from loans l
                where l.memberId = ?
            `, [id]);
            return result;
        }
        return null;
    },

    postLoan: async (memberId, bookId, days) => {
        let debt = await query(`
            select *
            from loans l
                where l.memberId = ?
            order by l.expiracyDate asc
            limit 1`, [memberId]
        );
        if (debt.length > 0) {
            if (debt[0].expiracyDate < Date.now()) {
                return false;
            }
        }
        query(`
            insert into loans (id, memberId, bookId, expiracyDate)
            values(null, ?, ?, ?)`, [memberId, bookId, Date.now() + DAY_IN_MILSEC * days]
        );
        return true;
    },

    deleteLoan: (id) => {
        let result = query(`
            delete l
            from loans l
            where l.id = ?
        `, [id]);
        return result;
    }

}