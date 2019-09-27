var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('util');

var app = express();

var con = mysql.createConnection({
  host: "db",
  user: "sofi",
  password: "sofi",
  database: "biblioteca"
});

const query = util.promisify(con.query).bind(con);
app.use(bodyParser.json());
const MILISEGUNDOS = 1000*60*60*24;

app.get('/socios', async function(req,res){
    var queryResult = await query(`select * from socios`);
    res.status(200).json(queryResult); 
})

app.get('/libros', async function(req,res){
    var queryResult = await query(`select * from libros`);
    res.status(200).json(queryResult);   
})

app.get('/libros/:idLibro', async function(req,res){
    const queryStr = `select * from libros where id=?`;
    var queryResult = await query(queryStr,req.params.idLibro);
    if (queryResult.length <= 0){
        res.status(404).json("No existe el libro solicitado");
    } else {
        res.status(200).json(queryResult[0]);
    }
})

app.get('/prestamos', async function(req,res){
    var queryResult = await query(`select * from prestamos`);
    res.status(200).json(queryResult);    
})

app.get('/socios/:idsocio/prestamos', async function(req,res){
    const queryStr = `select * from socios where id=?`;
    var queryResult = await query(queryStr,req.params.idsocio);
    if (queryResult.length <= 0){
        res.status(404).json("No existe el socio solicitado");
    } else {
        const queryStr = `select * from prestamos where idSocio=?`;
        var queryResult = await query(queryStr,req.params.idsocio);
        if (queryResult.length <= 0){
            res.status(404).json("El socio no tiene prestamos");
        } else {
            res.status(200).json(queryResult[0]);
            
        }
    }
})

app.put('/libros/:idLibro', async function(req,res){
    const queryStr = `select * from libros where id=?`;
    var queryResult = await query(queryStr,req.params.idLibro);
    if (queryResult.length <= 0){
        res.status(404).json("El libro no existe");
    } else {
        const queryStr = `select * from libros l join prestamos p on l.id = p.idLibro where l.id=? and cantidad < ?`;
        var queryResult = await query(queryStr,[req.params.idLibro,req.body.cantidad]);
        if (queryResult.length <= 0){
            res.status(404).json("No se puede actualizar la cantidad de libros, es menor a la cantidad de libros prestados");
        } else {
            const queryStr = `update libros set cantidad=? where id=?`;
            var queryResult = await query(queryStr,[req.body.cantidad,req.params.idLibro]);
            if (queryResult.length <= 0){
                res.status(404).json("Error al actualizar la cantidad del libro");
            } else {
                const queryStr = `select * from libros where id=?`;
                var queryResult = await query(queryStr,req.params.idLibro);
                res.status(200).json(queryResult);               
            }        
        }       
    }
})

app.post('/socios', async function(req,res){
    if(req.body.id == null || req.body.nombre == null){
        res.status(400).json({
            message: "Datos incompletos"
        });
    } else{
        const queryStr = `select * from socios where id=?`;
        var queryResult = await query(queryStr,req.body.id);
        if (queryResult.length <= 0){
            const queryStr = `insert into socios (id,nombre) values(?,?)`;
            var queryResult = await query(queryStr,[req.body.id, req.body.nombre]);
            if (queryResult.length <= 0){
                res.status(404).json("Error al ingresar el socio");
            } else {
                var queryResult = await query(`select * from socios`);
                res.status(200).json(queryResult); 
                
            }
        } else {
            res.status(404).json("El socio ya existe");
        }
    }
})

app.post('/libros', async function(req,res){
    if(req.body.id == null || req.body.titulo == null || req.body.cantidad < 0 || req.body.cantidad == null){
        res.status(400).json({
            message: "Datos incompletos"
        });
    } else{
        const queryStr = `select * from libros where id=?`;
        var queryResult = await query(queryStr,[req.body.id]);
        if (queryResult.length <= 0){
            const queryStr = `insert into libros (id,titulo,cantidad) values (?,?,?)`;
            var queryResult = await query(queryStr,[req.body.id, req.body.titulo, req.body.cantidad]);
            if (queryResult.length <= 0){
                res.status(404).json("Error al ingresar el libro");
            } else {
                var queryResult = await query(`select * from libros`);
                res.status(200).json(queryResult);                 
            } 
        } else {
            res.status(404).json("El id ya existe");        
        }
    }
})

app.post('/prestamos', async function(req,res){
    if(req.body.id == null || req.body.idSocio == null || req.body.idLibro == null || req.body.dias == null){
        res.status(400).json({
            message: "Datos incompletos"
        });
    } else{
        const queryStr = `select * from socios where id=?`;
        var queryResult = await query(queryStr,req.body.idSocio);
        if (queryResult.length <= 0){
            res.status(404).json("El socio no existe");
        } else {
            const queryStr = `select * from libros where id=?`;
            var queryResult = await query(queryStr,req.body.idLibro);
            if (queryResult.length <= 0){
                res.status(404).json("El libro no existe");
            } else {
                const queryStr = `select cantidad from libros where id=? and cantidad>0`;
                var queryResult = await query(queryStr,req.body.idLibro);
                if (queryResult.length <= 0){
                    res.status(404).json("Cantidad no disponible");
                } else {
                    fecha_actual = Date.now();
                    const queryStr = `select * from prestamos where idSocio=? and fechaVencimiento>? `;
                    var queryResult = await query(queryStr,[req.body.idSocio, fecha_actual]);
                    if (queryResult.length <= 0){
                        const queryStr = `insert into prestamos (id, idLibro, idSocio, fechaVencimiento) values(?,?,?,?)`;
                        var fecha = Date.now() + MILISEGUNDOS * req.body.dias;
                        var queryResult = await query(queryStr,[req.body.id, req.body.idLibro, req.body.idSocio, fecha]);
                        if (queryResult.length <= 0){
                            res.status(404).json("Error al ingresar el prestamo");
                        } else {
                            var queryResult = await query(`select * from prestamos`);
                            res.status(200).json(queryResult);                          
                        }
                    } else { 
                        res.status(404).json("El socio adeuda libros");                     
                    }                  
                }                
            }            
        }
    }    
})

app.delete('/prestamos/:idPrestamo', async function(req,res){
    const queryStr = `select * from prestamos where id=?`;
    var queryResult = await query(queryStr,req.params.idPrestamo);
    if (queryResult.length <= 0){
        res.status(404).json("El prestamo no existe");
    } else {
        const queryStr = `delete from prestamos where id=?`;
        var queryResult = await query(queryStr,req.params.idPrestamo);
        if (queryResult.length <= 0){
            res.status(404).json("Error al borrar el prestamo");
        } else {
            var queryResult = await query(`select * from prestamos`);
            res.status(200).json(queryResult);             
        }            
    }
})

app.delete('/libros/:idLibro', async function(req,res){
    const queryStr = `select * from libros where id=?`;
    var queryResult = await query(queryStr,req.params.idLibro);
    if (queryResult.length <= 0){
        res.status(404).json("El libro no existe");
    } else {
        const queryStr = `select * from prestamos where idLibro=?`;
        var queryResult = await query(queryStr,req.params.idLibro);
        if (queryResult.length <= 0){
            const queryStr = `delete from libros where id = ?`;
            var queryResult = await query(queryStr,req.params.idLibro);
            if (queryResult.length <= 0){
                res.status(404).json("Error al borrar el libro");
            } else {
                var queryResult = await query(`select * from libros`);
                res.status(200).json(queryResult);                 
            } 
        } else {
            res.status(404).json("El libro se encuentra en un prestamo");   
        }     
    }
})

var server = app.listen(8080, '0.0.0.0', function () {
    var host = server.address().address
    var port = server.address().port
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
    
    console.log("Example app listening at http://%s:%s", host, port)
})
