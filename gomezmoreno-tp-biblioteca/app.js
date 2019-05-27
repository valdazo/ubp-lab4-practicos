var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

app.use(bodyParser.json());

function Libro(id_Libro, titulo, cantidad) {
    this.id = id_Libro;
    this.titulo = titulo;
    this.cantidad = cantidad;
    this.disponibles = function(prestamos) {
        var prestado = 0;
        for (var librosPrestados of prestamos) {
            if(librosPrestados.idLibro == this.id) {
                prestado++;
            }
        }
        return this.cantidad - prestado;
    } 
}

function Socio(id_Socio, nombre) {
    this.id = id_Socio;
    this.nombre = nombre;
}

function Prestamo(idPrestamo, idSocio, idLibro, dias) {
    this.id = idPrestamo;
    this.idSocio = idSocio;
    this.idLibro = idLibro;
    this.fechaVencimiento = Date.now() + DIA_EN_MILISEGUNDOS * dias;
}

var libros = new Array();
var socios = new Array();
var prestamos = new Array();

function getNewId() {
    return Math.random().toString(36).substr(2,9);
}

function encontrarIndice (coleccion, idABuscar) {
    function esElId(elemento) {
        return elemento.id == idABuscar;
    }
    return coleccion.findIndex(esElId);
}

//RQ1.1: Agregar libro a la libreria
app.post('/libros', function (req, res) {
    var idLibro = getNewId();
    var nombreLibro = req.body.titulo;
    var cantidadLibro = req.body.cantidad;
    if(Number.isInteger(cantidadLibro) && cantidadLibro > 0) {
        if(nombreLibro != undefined) {
            libros.push(new Libro(idLibro, nombreLibro, cantidadLibro));
            res.status(201).json("idLibro: " + idLibro);
        }
        else {
            res.status(400).json("No puede agregarse un libro sin ingresar un titulo");
        }
    }
    else {
        res.status(400).json("La cantidad debe ser un entero mayor a cero");
    }
 })

function libroPrestado(idLibro) {
    for (var librosPrestamos of prestamos) {
        if(librosPrestamos.idLibro == idLibro) {
            return true;
        }
    }
    return false;
}

//RQ1.2: Eliminar libro de la libreria
app.delete('/libros/:libro', function (req, res) {
    var eliminarLibro = encontrarIndice(libros, req.params.libro);
    if(eliminarLibro != -1) {
        if(!libroPrestado(req.params.libro)) {
            libros.splice(eliminarLibro, 1);
            res.status(204).send();
        }
        else {
            res.status(400).json("El libro no puede ser eliminado porque está prestado");
        }
    }
    else {
        res.status(404).json("El id del libro ingresado no existe");
    }
})

//RQ1.3: Modificar la cantidad de ejemplares de un libro en la libreria
app.put('/libros/:libro', function (req, res) {
    var libroAModificar = encontrarIndice(libros, req.params.libro);
    var cantidadNueva = req.body.cantidad;
    
    if(libroAModificar != -1) {
        if(Number.isInteger(cantidadNueva) && cantidadNueva > 0) {
            if(cantidadNueva > (libros[libroAModificar].cantidad - libros[libroAModificar].disponibles(prestamos))) {
                libros[libroAModificar].cantidad = cantidadNueva;
                res.status(204).send();
            }
            else {
                res.status(400).json("No puede ingresarse una cantidad menor a la cantidad de ejemplares prestados");
            }
        }
        else {
            res.status(400).json("La cantidad debe ser un entero mayor a cero");
        }
    }
    else {
        res.status(404).json("El id del libro ingresado no existe");
    }  
})

//RQ1.4: Obtener la cantidad de ejemplares disponibles para prestamo en la libreria
app.get('/libros/:libro', function (req, res) {
    var libroAConsultar = encontrarIndice(libros, req.params.libro);
    if(libroAConsultar != -1) {
        res.status(200);
        var copiaLibro = Object.assign({}, libros[libroAConsultar]);
        copiaLibro["disponibles"] = copiaLibro.disponibles(prestamos);
        res.json(copiaLibro);
    }
    else {
        res.status(404).json("El id del libro ingresado no existe");
    } 
})

//RQ2.1: Crear socio
app.post('/socios', function (req, res) {
    var idSocio = getNewId();
    var nombreSocio = req.body.nombre;
    if(nombreSocio != undefined) {
        socios.push(new Socio(idSocio, nombreSocio));
        res.status(201).json(idSocio);
    }
    else {
        res.status(400).json("No puede agregarse un socio sin ingresar un nombre");
    }
})

function librosPrestados(idSocioPrestamos) {
    var prestamosSocio = new Array();
    for (var librosPrestadosASocio of prestamos) {
        if(librosPrestadosASocio.idSocio == idSocioPrestamos) {
            var copiaPrestamos = Object.assign({}, librosPrestadosASocio);
            delete copiaPrestamos.idSocio;
            prestamosSocio.push(copiaPrestamos);
        }
    }
    if(prestamosSocio.length < 1) {
        return null;
    } else {
        return prestamosSocio;
    }
}

//RQ2.2: Obtener los libros prestados al socio con sus fechas de vencimiento
app.get('/socios/:socio/prestamos', function (req, res) {
    var socioAConsultar = encontrarIndice(socios, req.params.socio);
    if(socioAConsultar != -1) {
        var librosSocio = librosPrestados(req.params.socio);

        if (librosSocio != null) {
            res.status(200);
            res.json(librosSocio);
        }
        else {
            res.status(400).json("El socio no tiene libros prestados");
        }
    }
    else {
        res.status(404).json("El id del socio ingresado no existe");
    }
})

function comprobarLibrosVencidos(prestamosSocio){
    var fechaActual = Date.now();

    if(prestamosSocio != null){
        for(var p of prestamosSocio){
            if(fechaActual < p.fechaVencimiento){
                return true;
            }
        }
    }
    return false;
}

//RQ3.1: Registrar un prestamo de un libro a un socio
app.post('/prestamos', function (req, res) {
    var idSocioPrestamo = encontrarIndice(socios, req.body.idSocio);
    var idLibroPrestamo = encontrarIndice(libros, req.body.idLibro);
    
    if (idSocioPrestamo != -1) {
        if (idLibroPrestamo != -1) {
            var cantidadDisponibles = libros[idLibroPrestamo].disponibles(prestamos);
            
            if(cantidadDisponibles > 0) {
                var prestamosSocio = librosPrestados(idSocioPrestamo);
                var librosVencidos = comprobarLibrosVencidos(prestamosSocio);
            
                if(!librosVencidos){
                    var idPrestamo = getNewId();
                    var vencimiento = req.body.dias;
                    prestamos.push(new Prestamo(idPrestamo, req.body.idSocio, req.body.idLibro, vencimiento));
                    res.status(201).json("idPrestamo: "+idPrestamo);
                }
                else{
                    res.status(400).json("Socio tiene prestamos vencidos, no puede pedir libros");
                }            
            }
            else {
                res.status(400).json("No hay ejemplares disponibles");
            }   
        }
        else {
            res.status(404).json("El id del libro ingresado no existe");
        }
    }
    else {
        res.status(404).json("El id del socio ingresado no existe");
    }
})

//RQ3.2: Un socio puede devolver un libro prestado
app.delete('/prestamos/:prestamo', function (req, res) {
    var eliminarPrestamo = encontrarIndice(prestamos, req.params.prestamo);
    if(eliminarPrestamo != -1) {
        prestamos.splice(eliminarPrestamo, 1);
        res.status(204).send();
    }
    else {
        res.status(404).json("El id del prestamo ingresado no existe");
    }
})

app.get('/prestamos',function(req,res){
    res.status(200);
    res.json(prestamos);
})

var server = app.listen(8080, '127.0.0.1', function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})