var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const DIAS_MILI_SEG = 1000 * 60 * 60 * 24;

function Libro(titulo,id,cantidad){
    this.id = id;
    this.titulo = titulo; 
    this.cantidad = cantidad;
}

function Socio(nombre,id){
    this.id = id;
    this.nombre = nombre;
}

function Prestamo(id,idLibro,idSocio, fechaVto){
    this.id = id;
    this.idLibro = idLibro;
    this.idSocio = idSocio;
    this.fechaVto = fechaVto;
    
}

var socios = new Array();
var libros = new Array();
var prestamos = new Array();

// REQ1.1 Añadir libros
app.post('/libros',function(req,res){
    if(req.body.titulo!=null){
        if(Number.isInteger(req.body.cantidad) && req.body.cantidad>0 ){
            var nuevoLibro = new Libro(req.body.titulo,getNewID(),req.body.cantidad);
            libros.push(nuevoLibro);
            res.status(201).json(nuevoLibro.id);
        }
        else{
            res.status(400).json("Cantidad debe ser mayor a 0 y entera");
        }
    }
    else{
        res.status(400).json("Ingrese un nombre por favor");
    }
    
})

// REQ1.2 Eliminar libros
app.delete('/libros/:idLibro',function(req,res){
    var remover = buscarID(libros, req.params.idLibro);
    if(remover != null){
        var librosPrestados = buscarLibrosPrestados(prestamos);
        if(!existeLibroPrestado(librosPrestados,req.params.idLibro)){
            libros.splice(econtrarIndicePorId(libros, remover.id), 1);
            res.status(204).json(remover.id);
        }
        else{
            res.status(400).json("No se puede eliminar un libro prestado");
        }
    }
    else{
        // el parametro idLibro no existe en la coleccion LIBROS 
        res.status(404).json("No existe el libro");
    }   
})

// REQ1.3 Modificar cantidad de ejemplares de un libro
app.put('/libros/:idLibro', function(req,res){
    var libroMod;
    if(Number.isInteger(req.body.cantidad) == true && req.body.cantidad > 0){
        if(buscarID(libros, req.params.idLibro) != null)
        {
            if(req.body.cantidad>cantidadLibrosPrestados(req.params.idLibro)){
                libroMod = modifCantEjemplares(req.params.idLibro, req.body.cantidad);
                res.status(200).json(libroMod);
            }
            else{
                res.status(400).json("La cantidad a ingresar debe ser mayor a la cantidad prestada");
            }
            
        }
        else{
            res.status(404).json("No existe el libro");
        }
    } 
    else{
        res.status(400).json("Se espera un entero mayor a cero");
    }
   
})

// REQ1.4 Obtener la cantidad de ejemplares disponibles para prestamo
app.get('/libros/:idLibro', function(req,res){
    var disponibles;
    if(buscarID(libros, req.params.idLibro) != null){
        disponibles = disponibilidad(req.params.idLibro);
        res.status(200).json(disponibles);
    }
    else{
        res.status(404).json("No existe el libro");
    }
})

// REQ2.1 Añadir socios
app.post('/socios', function(req, res){
    socios.push(new Socio(req.body.nombre,getNewID()));
    res.status(201);
    res.json(nuevoSocio.id);
})

// REQ2.2 Obtener los libros prestados al socio con sus fechas de vencimiento.
app.get('/prestamos/:idSocio', function(req,res){
    var prestamo;
    if(buscarID(socios, req.params.idSocio) != null){
        prestamo = buscarPrestamos(prestamos, req.params.idSocio);
        if(prestamo == null){
            res.status(404).json("No se encontraron libros prestado al socio");
        }
    }
    else{
        res.status(404).json("No existe el socio");
    }
    
    res.status(200);
    res.json(prestamo);
})

// REQ3.1 Añadir prestamos
app.post('/prestamos', function(req,res){
    var validarDatos = validarDatosPrestamo(req.body.idLibro, req.body.idSocio);
    var prestamosSocio, comprobarVencidos, nuevoPrestamo;
    
    if(validarDatos == true){
        if(disponibilidad(req.body.idLibro)>0){
            prestamosSocio = buscarPrestamos(prestamos, req.body.socios);
            comprobarVencidos = comprobarLibrosVencidos(prestamosSocio);

            if(comprobarVencidos == true){
                nuevoPrestamo = new Prestamo(getNewID(),req.body.idLibro,req.body.idSocio, obtenerFechaVto(10));
                prestamos.push(nuevoPrestamo);
                res.status(201).json(nuevoPrestamo.id);
            }
            else{
                res.status(400).json("Socio tiene prestamos vencidos, no puede pedir libros");
            }
        }
        else{
            res.status(400).json("No hay ejemplares disponibles");
        }
    }
    else{
        res.status(404).json("El libro o socio no existen");
    }
        
})

// REQ3.2 Devolver libro prestado
app.delete('/prestamos/:idPrestamo', function(req,res){
    var indicePrestamo = buscarID(req.params.idPrestamo);
    if(indicePrestamo != -1)
    {
        indicePrestamo.splice(indicePrestamo, 1);
    }
    else{
        res.status(404).json("El prestamo no existe");
    }
    
    res.status(204).send();
})

// Obtener todos los socios
app.get('/socios',function(req,res){
    res.status(200);
    res.json(socios);
})
// Obtener todos los libros
app.get('/libros',function(req,res){
    res.status(200);
    res.json(libros);
})
// Obtener todos los prestamos
app.get('/prestamos',function(req,res){
    res.status(200);
    res.json(prestamos);
})

// Estos son algunos ejemplos para no tener que cargar a mano los RQ
libros.push(new Libro("La vida de Juan Pereyra",getNewID(),10));
libros.push(new Libro("24hs UML",getNewID(),18));
libros.push(new Libro("El perro siberiano",getNewID(),14));

socios.push(new Socio("Juan Pereyra",getNewID()));
socios.push(new Socio("Juana Manso",getNewID()));
socios.push(new Socio("Pedro Picapiedra",getNewID()));

function getNewID(){
    return Math.random().toString(36).substr(2,9);
}

function obtenerFechaVto(dias){
    var f = new Date();
    var fechaMiliseg = f.getTime();
    var fecVto = fechaMiliseg + (DIAS_MILI_SEG * dias);
    return new Date(fecVto);
}

function econtrarIndicePorId(coleccion, IdABuscar){
    function esElId(elemento){
        return elemento.id == IdABuscar;
    }
    return coleccion.findIndex(esElId);
}

function cantidadLibrosPrestados(id){
    var cantidadPrestados = 0;
    for(var p of prestamos){
        if(id == p.idLibro){
            cantidadPrestados++;
        }
    }
    return cantidadPrestados;
}

function disponibilidad(id){
    pos = econtrarIndicePorId(libros, id);
    disponibles = libros[pos].cantidad - cantidadLibrosPrestados(id);
    return disponibles;
}

// busca un elemento en una coleccion filtrando por su ID, si no existe en la coleccion devuelve null
function buscarID(miColeccion, id){
    for(var m of miColeccion){
        if(m.id == id){
            return m;
        }
    }
    return null;
}

// obtiene los libros que fueron prestados a un socio, sino tiene libros prestados devuelve null
function buscarPrestamos(prestamos, idSocio){
    var prestamosSocio = new Array();
    for(var p of prestamos){
        if(p.idSocio == idSocio){
            prestamosSocio.push(p);
        }
    }
    if(prestamosSocio.length < 1){
        return null;
    }
    else{
        return prestamosSocio;
    }
}

function buscarLibrosPrestados(prestamos){
    var librosPrestados = new Array();
    for(var p of prestamos){
        librosPrestados.push(p.idLibro);
    }
    return librosPrestados;
}

function existeLibroPrestado(librosPrestados,idLibro){
    for(var l of librosPrestados){
        if(l == idLibro){
            return true;
        }
    }
    return false;
}

function modifCantEjemplares(idLibro, nuevaCant){
    pos = econtrarIndicePorId(libros, idLibro);
    libros[pos].cantidad = nuevaCant;
    libroMod = libros[pos];

    return libroMod;
}


/*  recibe como parametro una coleccion con los libros prestados a un determinado socio y
    determina si la fechaActual(en la que esta pidiendo un nuevo prestamo), es mayor a la fechaVto de alguno
    de los libros que le fueron prestados, de ser asi retorna FALSO, de lo contrario retorna TRUE */
function comprobarLibrosVencidos(prestamosSocio){
    fechaActual = Date.now();
    if(prestamosSocio!=null){
        for(var p of prestamosSocio){
            if(fechaActual > p.fecVto){
                return false;
            }
        }
    }
    return true;
}

// recibe idLibro e idSocio y verifica que ambos sean datos existentes en LIBROS y SOCIOS respectivamente
function validarDatosPrestamo(idLibro, idSocio){
    var libro = buscarID(libros, idLibro);
    var socio = buscarID(socios, idSocio);
    if(libro != null && socio != null){
        return true;
    }
    else{
        return false;
    }
}

var server = app.listen(8080, '127.0.0.1', function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

