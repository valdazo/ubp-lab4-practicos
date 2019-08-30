var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('util');

var app = express();
app.use(bodyParser.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "biblioteca",
  password: "biblioteca",
  database: "bd_biblioteca"
});

const query = util.promisify(con.query).bind(con);

const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

function getNewId() {
    return Math.random().toString(36).substr(2,9);
}

async function encontrarIndiceLibro(idLibro) {
    const queryStr = `SELECT * FROM bd_biblioteca.libros WHERE id_Libro = ?`;
    const queryResult = await query(queryStr, [idLibro]);

    if(queryResult.length <= 0) {
        return -1;
    } else {
        return queryResult;
    }
}

async function encontrarIndiceSocio(idSocio) {
    const queryStr = `SELECT * FROM bd_biblioteca.socios WHERE id_Socio = ?`;
    const queryResult = await query(queryStr, [idSocio]);
    
    if(queryResult.length <= 0) {
        return -1;
    } else {
        return queryResult;
    }
}

async function encontrarIndicePrestamo(idPrestamo) {
    const queryStr = `SELECT * FROM bd_biblioteca.prestamos WHERE idPrestamo = ?`;
    const queryResult = await query(queryStr, [idPrestamo]);
    
    if(queryResult.length <= 0) {
        return -1;
    } else {
        return queryResult;
    }
}

async function cantidadLibrosPrestados(idLibro) {
    const queryStr = `SELECT COUNT(*) AS cantidadPrestados FROM bd_biblioteca.prestamos WHERE idLibro = ?`;
    const queryResult = await query(queryStr, [idLibro]);

    if(queryResult.length <= 0) {
        return -1;
    } else {
        return queryResult[0].cantidadPrestados;
    }
}

async function disponibilidad(idLibro){
    const queryStr = `SELECT cantidad FROM bd_biblioteca.libros WHERE id_Libro = ?`;
    const queryResult = await query(queryStr, [idLibro]);

    if(queryResult.length <= 0) {
        console.log(queryResult);
        return -1;
    } else {
        return queryResult[0].cantidad - await cantidadLibrosPrestados(idLibro);
    }
}

async function comprobarLibrosVencidos(idSocioPrestamo){
    const queryStr = `SELECT COUNT(*) AS cantidadPrestamosVencidos FROM bd_biblioteca.prestamos WHERE idSocio = ? AND fechaVencimiento < ?`;
    var queryResult = await query(queryStr, [idSocioPrestamo, Date.now()]);
    console.log(queryResult);
    return queryResult[0].cantidadPrestamosVencidos == 0;
}

//Listado de libros
app.get('/libros', async function (req, res) {
    var queryResult = await query(`SELECT * FROM bd_biblioteca.libros`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

//Listado de socios
app.get('/socios', async function (req, res) {
    var queryResult = await query(`SELECT * FROM bd_biblioteca.socios`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

//Listado de préstamos
app.get('/prestamos', async function (req, res) {
    var queryResult = await query(`SELECT * FROM bd_biblioteca.prestamos`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

//RQ1.1: Agregar libro a la libreria
async function insertLibros(idLibro, nombreLibro, cantidadLibro) {
    const queryStr = `INSERT INTO bd_biblioteca.libros (id_Libro, titulo, cantidad) VALUES (?, ?, ?)`;
    var queryResult = await query(queryStr, [idLibro,nombreLibro,cantidadLibro]);
    console.log(queryResult);
}

app.post('/libros', function (req, res) {
    var nombreLibro = req.body.titulo;
    var cantidadLibro = req.body.cantidad;
    if(typeof cantidadLibro === 'number' && cantidadLibro > 0) {
        if(nombreLibro != undefined) {
            var idLibro = getNewId();
            insertLibros(idLibro, nombreLibro, cantidadLibro);
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

//RQ1.2: Eliminar libro de la libreria
app.delete('/libros/:libro', async function (req, res) {
    const idLibro = req.params.libro;
    const libroAEliminar = await encontrarIndiceLibro(idLibro);
    
    if(libroAEliminar != -1) {
        libroPrestado = await cantidadLibrosPrestados(idLibro);

        if(libroPrestado != -1) {
            const queryStr = `DELETE FROM bd_biblioteca.libros WHERE id_Libro = ?`;
            var queryResult = await query(queryStr, [idLibro]);

            if(queryResult <= 0) {
                res.status(500).json("Hubo un error al eliminar el libro");
            } else {
                res.status(204).send();
            }

        } else {
            res.status(400).json("El libro no puede ser eliminado porque está prestado");
        }

    } else {
        res.status(404).json("El id del libro ingresado no existe");
    }
})

//RQ1.3: Modificar la cantidad de ejemplares de un libro en la biblioteca
app.put('/libros/:libro', async function (req, res) {
    const idLibro = req.params.libro;
    const libroAModificar = await encontrarIndiceLibro(idLibro);

    if(libroAModificar != -1) {
        var cantidadNueva = req.body.cantidad;
        
        if(typeof cantidadNueva === 'number' && cantidadNueva > 0) {
            var cantidadPrestados = await cantidadLibrosPrestados(idLibro);

            if(cantidadNueva > cantidadPrestados) {
                const queryStr = `UPDATE bd_biblioteca.libros SET cantidad = ? WHERE id_Libro = ?`;
                var queryResult = await query(queryStr, [cantidadNueva,idLibro]);

                if(queryResult <= 0) {
                    res.status(500).json("Hubo un error al modificar la cantidad del libro");
                } else {
                    res.status(204).send();
                }
            } else {
                res.status(400).json("La cantidad nueva no puede ser menor a la cantidad de ejemplares que estan prestados");
            }

        } else {
            res.status(400).json("La cantidad debe ser un entero mayor a cero");    
        }
    } else {
        res.status(404).json("El id del libro ingresado no existe");
    }
})

//RQ1.4: Obtener la cantidad de ejemplares disponibles para prestamo en la libreria
app.get('/libros/:libro', async function (req, res) {
    const idLibro = req.params.libro;
    const libroAConsultar = await encontrarIndiceLibro(idLibro);

    if(libroAConsultar != -1) {
        var cantidadEjemplaresDisponibles = await disponibilidad(idLibro);
        res.status(200).json("Cantidad de ejemplares disponibles: " + cantidadEjemplaresDisponibles);
    }
    else {
        res.status(404).json("El id del libro ingresado no existe");
    } 
})

//RQ2.1: Crear socio
async function insertSocios(idSocio, nombreSocio) {
    const queryStr = `INSERT INTO bd_biblioteca.socios (id_Socio, nombre) VALUES (?, ?)`;
    var queryResult = await query(queryStr, [idSocio,nombreSocio]);
    console.log(queryResult);
}

app.post('/socios', function (req, res) {
    var nombreSocio = req.body.nombre;
    if(nombreSocio != undefined) {
        var idSocio = getNewId();
        insertSocios(idSocio, nombreSocio);
        res.status(201).json(idSocio);
    }
    else {
        res.status(400).json("No puede agregarse un socio sin ingresar un nombre");
    }
})

//RQ2.2: Obtener los libros prestados al socio con sus fechas de vencimiento
app.get('/socios/:socio/prestamos', async function (req, res) {
    const idSocio = req.params.socio;
    var socioAConsultar = encontrarIndiceSocio(idSocio);

    if(socioAConsultar != -1) {
        const queryStr = `SELECT * FROM bd_biblioteca.prestamos WHERE idSocio = ?`;
        const queryResult = await query(queryStr, [idSocio]);
        console.log(queryResult);
        if(queryResult <= 0) {
            res.status(200).json("El socio no tiene libros prestados");
        } else {
            res.status(200).json(queryResult);
        }        

    }
    else {
        res.status(404).json("El id del socio ingresado no existe");
    }
})

//RQ3.1: Registrar un prestamo de un libro a un socio
async function insertPrestamos(idPrestamo, idSocioPrestamo, idLibroPrestamo, fechaVencimiento) {
    const queryStr = `INSERT INTO bd_biblioteca.prestamos (idPrestamo, idSocio, idLibro, fechaVencimiento) VALUES (?, ?, ?, ?)`;
    var queryResult = await query(queryStr, [idPrestamo,idSocioPrestamo,idLibroPrestamo,fechaVencimiento]);
    console.log(queryResult);
}

app.post('/prestamos', async function (req, res) {
    var idSocioPrestamo = await encontrarIndiceSocio(req.body.idSocio);
    var idLibroPrestamo = await encontrarIndiceLibro(req.body.idLibro);
    
    if (idSocioPrestamo != -1) {
        if (idLibroPrestamo != -1) {
            var librosVencidos = await comprobarLibrosVencidos(idSocioPrestamo);

            if(librosVencidos) {
                var cantidadDisponibles = await disponibilidad(req.body.idLibro);
                console.log(cantidadDisponibles);
                if(cantidadDisponibles > 0) {
                    var idPrestamo = getNewId();
                    var diasPrestamo = req.body.dias;

                    if(typeof diasPrestamo === 'number' && diasPrestamo > 0) {
                        var fechaVencimiento = Date.now() + diasPrestamo * DIA_EN_MILISEGUNDOS;
                        insertPrestamos(idPrestamo, req.body.idSocio, req.body.idLibro, fechaVencimiento);
                        res.status(201).json("idPrestamo: "+ idPrestamo);
                    } else {
                        res.status(400).json("La cantidad de dias del prestamo no debe ser nula ni negativa");   
                    }

                } else {
                    res.status(400).json("No hay ejemplares disponibles");
                }
            } else {
                res.status(400).json("Socio tiene prestamos vencidos, no puede pedir libros");
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
app.delete('/prestamos/:prestamo', async function (req, res) {
    var idPrestamoEliminar = await encontrarIndicePrestamo(req.params.prestamo);
    
    if(idPrestamoEliminar != -1) {
        const queryStr = `DELETE FROM bd_biblioteca.prestamos WHERE idPrestamo = ?`;
        var queryResult = await query(queryStr, [req.params.prestamo]);

        if(queryResult <= 0) {
            res.status(500).json("Hubo un error al eliminar el prestamo");
        } else {
            res.status(204).send();
        }
    }
    else {
        res.status(404).json("El id del prestamo ingresado no existe");
    }
})

var server = app.listen(8080, '127.0.0.1', function () {
  var host = server.address().address
  var port = server.address().port
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  console.log("Example app listening at http://%s:%s", host, port)
})