module.exports = {
    //devuelve la cantidad de ejmplares prestados de un libro
    librosPrestados: (idLibro) => {
        let cont = 0;
        for (let i = 0; i < prestamos.length; i++) {
            if (prestamos[i].idLibro == idLibro) {
                cont++;
            }
        }
        return cont;
    },

    //actualiza la cantidad de ejemplares de un libro
    updateBook: (bookID, cantidad) => {
        if (cantidad >= librosPrestados(bookID)) {
            for (let i = 0; i < libros.length; i++) {
                if (bookID == libros[i].id) {
                    libros[i].cantidad = cantidad;
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
    checkPrestado: (idLibro) => {
        for (let i = 0; i < prestamos.length; i++) {
            if (prestamos[i].idLibro == idLibro) {
                return true;
            }
        }
        return false;
    },

    //elimina un libro
    deleteBook: (id) => {
        if (checkPrestado() == 0) {
            for (let i = 0; i < libros.length; i++) {
                if (id == libros[i].id) {
                    libros.splice(i, 1);
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
    getPrestamos: (idSocio) => {
        let prest = new Array();
        for (let i = 0; i < prestamos.length; i++) {
            if (idSocio == prestamos[i].idSocio) {
                prest.push({ "idLibro": prestamos[i].idLibro, "Fecha Vencimiento": new Date(prestamos[i].fechavencimiento) });
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