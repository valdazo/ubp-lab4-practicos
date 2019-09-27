var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('util');

app.use(bodyParser.json());

const DIAS_MILI_SEG = 1000 * 60 * 60 * 24;

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "db",
  user: "user",
  password: "password",
  database: "jose-emi"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

const query = util.promisify(con.query).bind(con);

// Funciones GET
app.get('/socios', async function(req,res){
    var queryResult = await query(`select * from socios`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

app.get('/libros', async function(req,res){
    var queryResult = await query(`select * from libros`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

app.get('/prestamos', async function(req,res){
    var queryResult = await query(`select * from prestamos`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

// REQ Agregar un prestamo
app.post('/prestamos', async function(req, res){
    const queryLibro = `select * from libros where id_libro = ?`;
    var queryidLibro = await query(queryLibro,req.body.idLibro);

    const querySocio = `select * from socios where id_socio = ?`;
    var queryidSocio = await query(querySocio,req.body.idSocio);

    const queryCantidad = `select count(*) cant from prestamos where id_libro = ?`;
    var queryCantidadLibros = await query(queryCantidad,req.body.idLibro);

    var f = new Date();
    var fechaMiliseg = f.getTime();
    const queryPrestamos = `select * from prestamos where id_socio = ? and fecha_vto < ?`;
    var queryPrestamosSocios = await query(queryPrestamos,[req.body.idSocio, fechaMiliseg]);

    if(queryidLibro.length<=0){
        res.status(404).json("Libro no encontrado");
    }
    else if(queryidSocio.length<=0){
        res.status(404).json("Socio no encontrado");
    }
    else if(req.body.cantidadDias <= 0){
        res.status(400).json("Cantidad de dias debe ser mayor a cero");
    }
    else{
        disponibles = queryidLibro[0].cantidad - queryCantidadLibros[0].cant;
        if (disponibles <= 0){
            res.status(400).json("No hay ejemplares disponibles");
        }
        else{
            if(queryPrestamosSocios.length > 0){
                res.status(400).json("El socio tiene prestamos vencidos");
            }
            else{
                const queryStr = `insert into prestamos (id_prestamo, id_libro, id_socio, fecha_vto) values (?, ?, ?, ?)`;
                var queryResult = await query(queryStr, [getNewID(), req.body.idLibro, req.body.idSocio, obtenerFechaVto(req.body.cantidadDias)]);
                console.log(queryResult);
                res.status(201).json("Se agrego el prestamo correctamente");
            }
        }
    }
})

// REQ Agregar un libro
app.post('/libros', async function(req, res){
    if(req.body.cantidad < 0){
        res.status(400).json("Debe ingresar una cantidad mayor a cero");
    }
    else if(!Number.isInteger(req.body.cantidad)){
        res.status(400).json("Debe ingresar un entero");
    }   
    else if(req.body.cantidad == null){
        res.status(400).json("Debe completar el campo cantidad");
    }
    else if(req.body.titulo == null){
        res.status(400).json("Debe completar el campo titulo");
    }
    else{
        const queryStr = `insert into libros (id_libro, titulo, cantidad) values (?, ?, ?)`;
        var queryLibros = await query(queryStr, [getNewID(), req.body.titulo, req.body.cantidad]);
        res.status(200).json("Libro agregado correctamente");
    }
})

// REQ Actualizar cantidad de ejemplares
app.put('/libros/:idLibro', async function(req,res){
    const queryExisteLibro = `select * from libros where id_libro = (?)`;
    var queryResultExisteLibro = await query(queryExisteLibro, req.params.idLibro);
    
    if (req.body.cantidad >= 0){
        if (queryResultExisteLibro.length <= 0){
          res.status(404).json("Libro not found");
        } else {
                const queryCantPrestada = `select count(*) as cant_prestada from prestamos where id_libro = (?)`;
                var queryResultCantPrestada = await query(queryCantPrestada, req.params.idLibro);
                if (queryResultCantPrestada[0].cant_prestada > req.body.cantidad){
                    res.status(400).json("La cantidad a ingresar debe ser mayor a la cantidad prestada");
                }else{
                    const queryStr = `update libros set cantidad = (?) where id_libro = (?)`;
                    var queryResult = await query(queryStr,[req.body.cantidad,req.params.idLibro]);
                    res.status(200).json("La cantidad ha sido actualizada correctamente");
                }
        } 
    }
    else{
      res.status(400).json("Se espera un entero mayor a 0");
    }
})

// REQ Obtener la cantidad de ejemplares disponibles
app.get('/libros/:idLibro', async function(req,res){
    const queryStr = `select cantidad from libros where id_libro = (?)`;
    var queryResult = await query(queryStr,req.params.idLibro);
    if (queryResult.length <= 0){
      res.status(404).json("Libro not found");
    } 
    else {
            const queryCantPrestada = `select count(*) as cant_prestada from prestamos where id_libro = (?)`;
            var queryResultCantPrestada = await query(queryCantPrestada, req.params.idLibro);
            var disponibles = queryResult[0].cantidad - queryResultCantPrestada[0].cant_prestada;
            res.status(200).json("Cantidad de ejemplares: " + disponibles);
    } 
})

// REQ Agregar un socio
app.post('/socios', async function(req, res){
    if(req.body.nombre == null){
        res.status(400).json("Debe completar el campo nombre");
    }
    else{
        const queryStr = `insert into socios (id_socio, nombre) values (?, ?)`;
        var querySocios = await query(queryStr, [getNewID(), req.body.nombre]);
        res.status(200).json("Socio agregado correctamente");
    }
})

// REQ Obtener libros prestados a un socio
app.get('/prestamos/:idSocio', async function(req, res){
    const querySocio = `select * from socios where id_socio = (?)`;
    var queryidSocio = await query(querySocio,req.params.idSocio);

    if(queryidSocio.length<=0){
        res.status(404).json("Socio no encontrado");
    }
    else{
        const queryPrestamos = `select * from prestamos where id_socio = (?)`;
        var queryPrestamosSocios = await query(queryPrestamos,req.params.idSocio);
        if(queryPrestamosSocios.length <= 0){
            res.status(404).json("No se encontraron libros prestado al socio");
        }
        else{
            res.status(200).json(queryPrestamosSocios);
        }
    }
})

// REQ Eliminar un prestamo
app.delete('/prestamos/:idPrestamo', async function(req, res){
    const queryPrestamos = `select * from prestamos where id_prestamo = ?`;
    var queryidPrestamos = await query(queryPrestamos, req.params.idPrestamo);

    if(queryidPrestamos.length <= 0){
        res.status(404).json("Prestamo no encontrado");
    }
    else{
        const queryStr = `delete from prestamos where id_prestamo = ?`;
        var queryEliminar = await query(queryStr, req.params.idPrestamo);
        res.status(204).json("Prestamo eliminado");
    }
})

// REQ Eliminar un libro
app.delete('/libros/:idLibro', async function(req, res){
    const queryLibros = `select * from libros where id_libro = (?)`;
    var queryResultLibros = await query(queryLibros, req.params.idLibro);

    console.log(queryResultLibros);

    if(queryResultLibros.length <= 0){
        res.status(404).json("Libro no encontrado");
    }
    else{
        const queryPrestamos = `select * from prestamos where id_libro = (?)`;
        var queryResultPrestamos= await query(queryPrestamos, req.params.idLibro);

        if(queryResultPrestamos.length > 0){
            res.status(400).json("El libro tiene ejemplares prestados");
        }
        else{
            const queryEliminar = `delete from libros where id_libro = (?)`;
            var queryResultEliminar = await query(queryEliminar, req.params.idLibro);
            res.status(204).json("Se elimino el libro correctamente");
        }
    }

})

function getNewID(){
    return Math.random().toString(36).substr(2,9);
}

function obtenerFechaVto(dias){
    var f = new Date();
    var fechaMiliseg = f.getTime();
    var fecVto = fechaMiliseg + (DIAS_MILI_SEG * dias);
    return fecVto;
}

var server = app.listen(8080, '0.0.0.0', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
})