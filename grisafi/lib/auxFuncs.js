module.exports = {
    //devuelve la cantidad de ejmplares prestados de un libro
    librosPrestados: (bookID,loansCollection) => {
        let cont = 0;
        for (let i = 0; i < loansCollection.length; i++) {
            if (loansCollection[i].bookID == bookID) {
                cont++;
            }
        }
        return cont;
    },

    //actualiza la cantidad de ejemplares de un libro
    updateBook: (bookID, amount, booksCollection,loansCollection) => {
        if (amount<0){
            return -1
        }
        if (amount >= module.exports.librosPrestados(bookID,loansCollection)) {
            for (let i = 0; i < booksCollection.length; i++) {
                if (bookID == booksCollection[i].id) {
                    booksCollection[i].amount = amount;
                    return 1;
                }
            }
            return 0;
        }
        else {
            return -1;
        }
    },

    //encuentra el objeto libro/socio de acuerdo a su id
    findID: (id, collection) => {
        for (let i = 0; i < collection.length; i++) {
            if (id == collection[i].id) {
                return collection[i];
            }
        }
        return false;
    },

    //retorna true si el socio adeuda libros, false si no adeuda
    adeuda: (idSocio) => {
        for (let i = 0; i < prestamos.length; i++) {
            if (idSocio == prestamos[i].idSocio && prestamos[i].fechavencimiento < Date.now()) {
                return true;
            }
        }
        return false;
    },

    //devuelve true si el libro fue prestado, false si no lo fue
    checkPrestado: (idLibro,loans) => {
        for (let i = 0; i < loans.length; i++) {
            if (loans[i].idLibro == idLibro) {
                return true;
            }
        }
        return false;
    },

    //elimina un libro
    deleteBook: (id,books,loans) => {
        if (module.exports.checkPrestado(id,loans) == 0) {
            for (let i = 0; i < books.length; i++) {
                if (id == books[i].id) {
                    books.splice(i, 1);
                    return 1;
                }
            }
            return 0;
        }
        else {
            return -1;
        }
    },

    //devuelve todos los prestamos
    getLoansId: (memberId, loansCollection) => {
        let prest = new Array();
        for (let i = 0; i < loansCollection.length; i++) {
            if (memberId == loansCollection[i].memberId) {
                prest.push({ "BookId": loansCollection[i].bookId, "Expiracy Date": new Date(loansCollection[i].expiracyDate) });
            }
        }
        return prest;
    },

    generatePrestamosID: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    returnBook: (idPrestamo) => {
        for (let i = 0; i < prestamos.length; i++) {
            if (prestamos[i].id == idPrestamo) {
                console.log("Libro encontrado");
                console.log(prestamos[i]);
                prestamos.splice(i, 1);
                return 1;
            }
        }
        return 0;
    }
}