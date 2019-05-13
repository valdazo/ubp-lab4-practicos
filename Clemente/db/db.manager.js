let fs = require("fs");
let json = require("./db.json");

// guarda los cambios en la db
let save = () => {
  fs.writeFile("./db/db.json", JSON.stringify(json), err => {
    if (err) throw err;
  });
}
// devuelve un array con todos los elementos de la tabla
let getTable = (tableName) => {
  return json[tableName];
}


// nos dice si existe el partner
// sirve para validar antes de realizar otra acción
let getPartner = (id) => {
  let partner = null;
  getTable("partners").forEach(entry => {
    if (entry.id == id) {
      partner = entry;
    }
  });
  return partner;
}

// agrega un elemento a una tabla
let addEntry = (tableName, entry) => {
  json[tableName].push(entry);
  save();
}

let deletePartner = id => {
  let i = 0;
  getTable("partners").forEach(entry => {
    if (entry.id == id) {
      json[tableName].splice(i, 1);
    }
    i++;
  });
  save();
}

let getBook = id => {
  let found = null;
  getTable("books").forEach(book => {
    if (book.id == id) {
      found = book;
    }
  });
  return found;
}

let addBook = (id) => {
  getTable("books").forEach(book => {
    if (book.id == id) {
      book["inventory"] += 1;
    }
  });
  save();
}

let deleteBook = id => {
  getTable("books").forEach(book => {
    if (book.id == id && book.inventory != 0) {
      book["inventory"] -= 1;
    }
  });
  save();
}

// booleano que indica si se le venció una deuda a un partner
let hasDebt = (id, time) => {
  let debt = false;
  getTable("loans").forEach(loan => {
    if (loan.partner == id && loan.expiration_date < time) {
      debt = true;
    }
  });
  return debt;
}

let lentBook = (Pid, Bid, expiration) => {
  addEntry("loans", { partner: Pid, book: Bid, expiration_date: expiration });
  getTable("books").forEach(book => {
    if(book.id == Bid) {
      book.inventory-=1;
    }
  });
  save();
}

let returnBook = (Pid, Bid) => {
  let i=0;
  getTable("loans").forEach(loan => {
    if(loan.partner == Pid && loan.book == Bid){
      json["loans"].splice(i, 1);
    }
    i++;
  });
  getTable("books").forEach(book => {
    if(book.id == Bid) {
      book.inventory+=1;
    }
  });
  save();
}

let isLoan = (Pid, Bid) => {
  let r = false;
  getTable("loans").forEach(loan => {
    if(loan.partner == Pid && loan.book == Bid){
      r = true;
    }
  });
  return r;
}

module.exports = {
  getTable,
  getPartner,
  addEntry,
  deletePartner,
  getBook,
  addBook,
  deleteBook,
  hasDebt,
  lentBook,
  returnBook,
  isLoan
}