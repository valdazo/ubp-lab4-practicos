var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
const MILISEGUNDOS = 1000*60*60*24;

function Socio(id, nombre){
    this.id = id;
    this.nombre = nombre;
}

function Libro(id, titulo, cantidad){
    this.id = id;
    this.titulo = titulo;
    this.cantidad = cantidad;
    
    this.disponibles=function(){
        var contador = 0;
        for(var prest of prestamos) {
            if(prest.idLibro ==  this.id){
                contador++;
            }
        }
        return this.cantidad - contador;
    }
    
}

function Prestamo(id, idLibro, idSocio, dias){
    this.id = id;
    this.idLibro = idLibro
    this.idSocio = idSocio;    
    this.fechaVencimiento = Date.now() + MILISEGUNDOS * dias;
}

function borrarPrestamo(idS, idL){
    for (let i = 0; i < prestamos.length; i++) {
        if(idS==prestamos[i].idSocio){
            if(idL == prestamos[i].idLibro){
                prestamos.splice(i,1);
                return 0;
            }
        }
    }
}

function borrarLibros(id){
    for (let i = 0; i < libros.length; i++) {
        if(id == libros[i].id){
            libros.splice(i,1);
        }
    }
}

function controlarPrestamosLibros(id){
    let prestados = 0;
    for(let i=0; i < prestamos.length; i++){
        if(id == prestamos[i].idLibro){
            prestados++;
        }        
    }
    return prestados;
}

function disponibleLibro(idL){
    for(let i=0; i < libros.length; i++){
        if(idL == libros[i].id){
            return libros[i].disponibles();
        }        
    }
    return -1;
}

function actualizarCantidad(idL, cant){
    if(cant > controlarPrestamosLibros(idL)){
        for(let i=0; i < libros.length; i++){
            if (idL == libros[i].id){
                libros[i].cantidad = cant;
                return 0;
            }
        } 
    }else{
        return -1;
    }      
}

function buscarPrestamos(idS){
    var aux = new Array();
    for(let i=0; i < prestamos.length; i++){
        if(idS == prestamos[i].idSocio){
            aux.push({"idLibro":prestamos[i].idLibro, 
                      "Fecha de vencimiento":new Date(prestamos[i].fechaVencimiento)});
        }
    }
    return aux;
}

function librosAdeudados(idSocio){
    for(let i=0; i < prestamos.length; i++){
        if(idSocio == prestamos[i].idSocio){
            if(Date.now() > prestamos[i].fechaVencimiento){
                return -1;
            }
        }
    }
   return 0;
}

function buscarPorId(idAux, coleccion){
    let aux = -1;
    for (let i = 0; i < coleccion.length; i++) {
        if(idAux == coleccion[i].id){
            aux = 0;
        }      
    }
    return aux;
}

var libros = new Array();
var socios = new Array();
var prestamos = new Array();

libros.push(new Libro(1, "Libro 1", 1));
libros.push(new Libro(2, "Libro 2", 5));

socios.push(new Socio(1, "Socio 1"));
socios.push(new Socio(2, "Socio 2"));

prestamos.push(new Prestamo(1, 1, 1, 5));
prestamos.push(new Prestamo(2, 2, 2, 10));
//prestamos.push(new Prestamo(3, 2, 1, 3));

app.get('/socios', function(req,res){
    res.status(200).json(socios);    
})

/*para tener todos los libros*/
app.get('/libros', function(req,res){
    res.status(200).json(libros);      
})

app.get('/libros/:idlibro', function(req,res){   
    if (buscarPorId(req.params.idlibro, libros) == 0){
        res.status(200).json(disponibleLibro(req.params.idlibro)); 
    } else{
        res.status(404).json({
            message: "No se encuentra el id del libro ingresado"
        });
    }
     
})

app.get('/prestamos', function(req,res){
    res.status(200).json(prestamos);     
})

/*Obtener los libros prestados al socio con sus fechas de vencimiento.*/
app.get('/socios/:idsocio/prestamos', function(req,res){
    if(buscarPorId(req.params.idsocio, socios) == 0){
        res.status(200).json(buscarPrestamos(req.params.idsocio));
    }else{
        res.status(404).json({
            message: "No se puede obtener los libros prestados al socio"
        });
    }   
})

/*actualiza*/
app.put('/libros/:idlibro', function(req,res){
    if(buscarPorId(req.params.idlibro, libros) == 0){
        if(actualizarCantidad(req.params.idlibro,req.body.cantidad) == 0){
            res.status(200).json({
                message: "Se actualizo correctamente la cantidad del libro"
            });
        }else{
            res.status(400).json({
                message: "No se puede actualizar la cantidad de libros, es menor a la cantidad de libros prestados"
            });
        }0
    }else{
        res.status(400).json({
            message: "No se encuentra el id del libro ingresado"
        });
    }
})

/*coloca nuevo*/
app.post('/socios', function(req,res){
    if(req.body.id == null || req.body.nombre == null){
        res.status(400).json({
            message: "Datos incompletos"
        });
    } else{
        socios.push(new Socio(req.body.id, req.body.nombre));    
        res.status(201).json(socios);
    }
})

app.post('/libros', function(req,res){
    if(req.body.id == null || req.body.titulo == null || req.body.cantidad < 0 || req.body.cantidad == null){
        res.status(400).json({
            message: "Datos incompletos"
        });
    } else{
        libros.push(new Libro(req.body.id, req.body.titulo,req.body.cantidad));
        res.status(201).json(libros);
    }
})

/*Registrar un préstamo de un libro a un socio.*/
app.post('/prestamos', function(req,res){
    if(disponibleLibro(req.body.idLibro) > 0){
        if(librosAdeudados(req.body.idSocio) == 0){
        prestamos.push(new Prestamo(req.body.id, req.body.idLibro, req.body.idSocio, req.body.dias));
        res.status(201).json({
            message: "El prestamo se registro correctamente"
        });
        }else{
            res.status(400).json({
                message: "El socio adeuda libros"
            });
        }
    }
    else{
        res.status(400).json({
            message: "No hay libros disponibles"
        });
    }  
})

/* Un socio puede devolver un libro prestado*/
app.delete('/prestamos/:idSocio/:idLibro',function(req,res){
    if(buscarPorId(req.params.idSocio, socios) == 0 && buscarPorId(req.params.idLibro, libros) == 0){
        borrarPrestamo(req.params.idSocio, req.params.idLibro);
            res.status(200).json({
                message: "Se elimino correctamente el prestamo"
            });
    }else{
        res.status(404).json({
            message: "No se puede borrar el prestamo, no existe"
        });             
    }   
})

app.delete('/libros/:idLibro',function(req,res){
    if(buscarPorId(req.params.idLibro, libros) != -1){        
        if(controlarPrestamosLibros(req.params.idLibro) == 0){ 
            borrarLibros(req.params.idLibro);
            res.status(200).json({
                message: "Se elimino correctamente el libro"
            });
        }else{
            res.status(404).json({
                message: "No se puede eliminar el libro porque hay prestados"
            });
        }  
    } else{
        res.status(404).json({
            message: "No se puede eliminar el libro porque no existe"
        });  
    }
})

var server = app.listen(8080, '127.0.0.1', function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
  })