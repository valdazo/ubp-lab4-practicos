var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

var libros = new Array();
var socios = new Array();
var prestamos = new Array();

function Libro(titulo, cantidad, id) {
    this.id = id;
    this.titulo = titulo;
    this.cantidad = cantidad;
    this.disponibles = function () {
        let count = 0;
        for (const prest of prestamos) {
            if (prest.idLibro == this.id) {
                count++;
            }
        }
        return this.cantidad - count;
    }
}

function Socio(nombre, id) {
    this.id = id;
    this.nombre = nombre;
}

function Prestamo(id, idSocio, idLibro, dias) {
    this.id = id;
    this.idSocio = idSocio;
    this.idLibro = idLibro;
    this.fechavencimiento = Date.now() + DIA_EN_MILISEGUNDOS * dias;
}

//devuelve la cantidad de ejmplares prestados de un libro
function librosPrestados(idLibro) {
    let cont = 0;
    for (let i = 0; i < prestamos.length; i++) {
        if (prestamos[i].idLibro == idLibro) {
            cont++;
        }
    }
    return cont;
}

//actualiza la cantidad de ejemplares de un libro
function updateBook(bookID, cantidad) {
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
}

//encuentra el objeto libro/socio de acuerdo a su id
function findID(id, coleccion) {
    for (let i = 0; i < coleccion.length; i++) {
        if (id == coleccion[i].id) {
            return coleccion[i];
        }
    }
    return 0;
}

//retorna true si el socio adeuda libros, false si no adeuda
function adeuda(idSocio) {
    for (let i = 0; i < prestamos.length; i++) {
        if (idSocio == prestamos[i].idSocio && prestamos[i].fechavencimiento < Date.now()) {
            return true;
        }
    }
    return false;
}

//devuelve true si el libro fue prestado, false si no lo fue
function checkPrestado(idLibro) {
    for (let i = 0; i < prestamos.length; i++) {
        if (prestamos[i].idLibro == idLibro) {
            return true;
        }
    }
    return false;
}

//elimina un libro
function deleteBook(id) {
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
}

//devuelve todos los prestamos
function getPrestamos(idSocio) {
    let prest = new Array();
    for (let i = 0; i < prestamos.length; i++) {
        if (idSocio == prestamos[i].idSocio) {
            prest.push({ "idLibro": prestamos[i].idLibro, "Fecha Vencimiento": new Date(prestamos[i].fechavencimiento) });
        }
    }
    return prest;
}

function generatePrestamosID() {
    return Math.random().toString(36).substr(2, 9);
}

// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
libros.push(new Libro("Harry Potter", 100, 10));
libros.push(new Libro("El Señor de los Anillos", 10, 20));
// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
socios.push(new Socio("A", 1));
socios.push(new Socio("B", 2));
// TODO: este conjunto de push es solo para facilitar la validacion, 
// borrar una vez que se haya integrado con la base de datos
prestamos.push(new Prestamo(1, 1, 10, 20));
prestamos.push(new Prestamo(2, 2, 10, 20));

app.get('/socios', function (req, res) {
    res.status(200).json(socios);
})

//devuelve todos los socios
app.get('/socios/:idSocio', function (req, res) {
    let socio = findID(req.params.idSocio, socios);
    if (socio != 0) {
        res.status(200).json(socio);
    }
    else {
        res.status(404).send("Socio no encontrado");
    }
})

app.get('/socios/:idSocio/prestamos', function (req, res) {
    if (findID(req.params.idSocio, socios)) {
        let prest = getPrestamos(req.params.idSocio);
        if (prest.length == 0) {
            res.status(200).send("No hay Prestamos Realizados por el Socio");
        }
        else {
            res.status(200).json(prest);
        }
    }
    else {
        res.status(400).send("Socio No Encontrado");
    }
})

app.get('/prestamos', function (req, res) {
    if (prestamos != null)
        res.status(200).json(prestamos);
    else
        res.status(204).send("No hay Prestamos Registrados");
})

app.get('/libros/:idLibro', function (req, res) {
    let book = findID(req.params.idLibro, libros);
    if (book != 0) {
        res.status(200).json({ "idLibro": parseInt(req.params.idLibro), "disponibles": book.disponibles() });
    }
    else {
        res.status(400).send("Libro no encontrado");
    }
})

app.post('/socios', function (req, res) {
    if (req.body.nombre != null && req.body.id != null) {
        socios.push(new Socio(req.body.nombre, req.body.id));
        res.status(201).json(req.body);
    }
    else {
        res.status(400).send("Parametros Incorrectos");
    }
})

app.post('/libros', function (req, res) {
    libros.push(new Libro(req.body.nombre, req.body.cantidad, req.body.id));
    res.status(201).json(req.body);
})

app.post('/prestamos', function (req, res) {
    if (adeuda(req.body.idSocio)) {
        res.status(400).send("El socio adeuda libros");
    }
    else {
        if (findID(req.body.idLibro, libros).disponibles() > 0) {
            prestamos.push(new Prestamo(generatePrestamosID(), req.body.idSocio, req.body.idLibro, req.body.dias));
            res.status(200).send("Prestamo realizado con exito");
        }
        else {
            res.status(404).send("No hay ejemplares disponibles para prestamo");
        }
    }
})

app.delete('/libros/:idlibro', function (req, res) {
    let resultado = deleteBook(req.params.idLibro);
    if (resultado) {
        res.status(200).send("Libro Eliminado");
    }
    else if (resultado == -1) {
        res.status(400).send("No se puede eliminar el libro porque hay ejemplares prestados")
    }
    else {
        res.status(400).send("Libro No Encontrado");
    }
})

function returnBook(idPrestamo) {
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

app.delete('/prestamos/:idSocio/:idPrestamo', function (req, res) {
    if (returnBook(req.params.idPrestamo)) {
        res.status(200).send("Libro devuelto");
        console.log(prestamos);
    }
    else {
        res.status(400).send("La operacion no se pudo llevar a cabo");
    }
})

app.put('/libros/:idLibro', function (req, res) {
    let resultado = updateBook(req.params.idLibro, req.body.cantidad);
    if (resultado == 1) {
        res.status(200).json(findID(req.params.idLibro, libros));
    }
    else if (resultado == -1) {
        res.status(400).send("Error: la cantidad de libros es menor a la cantidad de libros prestados");
    }
    else {
        res.status(400).json("Libro no encontrado");
    }
})

var server = app.listen(8080, '127.0.0.1', function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app corriendo en: http://%s:%s", host, port)
})
