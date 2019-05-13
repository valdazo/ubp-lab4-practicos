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
        for(const prest of prestamos) {
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
    this.fechaVencimiento = new Date(Date.now() + MILISEGUNDOS * dias);
}

function borrarPrestamo(idS, idL){
    for (let i = 0; i < prestamos.length; i++) {
        if(idS==prestamos[i].idSocio){
            if(idL == prestamos[i].idLibro){
                prestamos.splice(i,1);
                console.log(prestamos);
                return 1;
            }
        }
    }
    return 0;
}

function borrarLibro(id){
    console.log(id);
    var aux = controlarPrestamosLibros(id);
    for (let i = 0; i < libros.length; i++) {
        if(id==libros[i].id &&  aux == 0){
            libros.splice(i,1);
            console.log(libros);
            return 0;
        }
    }
    
    return -1;
}

function controlarPrestamosLibros(id){
    console.log(id);
    var aux = new Array();
    for(let i=0; i < prestamos.length; i++){
        if(id == prestamos[i].idLibro){
            return -1;
        }else{
            aux.push({"idLibro":prestamos[i].idLibro});
        }
        
    }
    return 0;
}

function disponibleLibro(idL){
    for(let i=0; i < libros.length; i++){
        if(idL == libros[i].id){
            return libros[i].disponibles();
        }        
    }
}

function controlarCantidad(idL){
    for (let i = 0; i < libros.length; i++) {
        if(libros[i].id==idL){
                return libros[i].cantidad - libros[i].disponibles();
        }      
    }
}

function actualizarCantidad(idL, cant){
    var aux = controlarCantidad(idL)
    console.log(aux);
    for(let i=0; i < libros.length; i++){
        if(idL == libros[i].id && cant < aux){
            console.log("Hay %d libros prestados", aux);
        }else{
            if (idL == libros[i].id && cant > aux){
               libros[i].cantidad = cant;
            }
        }
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

function buscarIdLibro(idL){
    for (let i = 0; i < libros.length; i++) {
        if(libros[i].id==idL){
                return 0
        }      
    }
    return -1;
}

function buscarIdSocio(idS){
    for (let i = 0; i < socios.length; i++) {
        if(socios[i].id==idS){
                return 0
        }      
    }
    return -1;
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
prestamos.push(new Prestamo(3, 2, 1, 3));

app.get('/socios', function(req,res){
    res.status(200).json(socios);    
})

/*para tener todos los libros*/
app.get('/libros', function(req,res){
    res.status(200).json(libros);      
})

app.get('/libros/:idlibro', function(req,res){      
    res.status(200).json(disponibleLibro(req.params.idlibro));  
})

app.get('/prestamos', function(req,res){

    res.status(200).json(prestamos);     
})

/*Obtener los libros prestados al socio con sus fechas de vencimiento.*/
app.get('/socios/:idsocio/prestamos', function(req,res){
    if(buscarIdSocio(req.params.idsocio) != 0){
        res.status(400);
        res.send("No se puede obtener los libros prestados al socio");
    }else{
        res.status(200).json(buscarPrestamos(req.params.idsocio));  
    }   
})

/*actualiza*/
app.put('/libros/:idlibro', function(req,res){
    if(buscarIdLibro(req.params.idlibro) != 0){
        res.status(400);
        res.send("No se puede actualizar la cantidad de libros");
    }else{
        actualizarCantidad(req.params.idlibro,req.body.cantidad);
        res.status(204).json(libros); 
    }
})

/*coloca nuevo*/
app.post('/socios', function(req,res){
    socios.push(new Socio(req.body.id, req.body.nombre));    
    res.json(socios);
    res.status(201);
})

app.post('/libros', function(req,res){
    libros.push(new Libro(req.body.id, req.body.nombre,req.body.cantidad));
    res.status(201);    
    res.json(libros);
})

/*Registrar un préstamo de un libro a un socio.*/
app.post('/prestamos', function(req,res){
    if(disponibleLibro(req.body.idLibro) > 0 && librosAdeudados(req.body.idSocio) == 0){
        prestamos.push(new Prestamo(req.body.id, req.body.idLibro, req.body.idSocio, req.body.dias));
        res.status(201);
        res.json(prestamos);
    }
    else{
        res.status(404);
        res.send("No se puede realizar el prestamo");
    }  
})

/* Un socio puede devolver un libro prestado*/
app.delete('/prestamos/:idSocio/:idLibro',function(req,res){
    if(buscarIdSocio(req.params.idSocio) != 0 || buscarIdLibro(req.params.idLibro) != 0){
        res.status(400);
        res.send("No se puede borrar el prestamo, no existe");
    }else{
        if(borrarPrestamo(req.params.idSocio, req.params.idLibro)){
            res.status(204).send("Se elimino el prestamo");
        }else{
            res.status(400).send("No se puede eliminar el prestamo");
        }              
    }   
})

app.delete('/libros/:id',function(req,res){
    if(buscarIdLibro(req.params.id) != 0){
        res.status(400).send("No se puede eliminar el libro");
    } else{
        if(borrarLibro(req.params.id)){            
            res.status(204).send("Se elimino el libro");
        }else{
            res.status(400).send("No se puede eliminar el libro");
        }        
    }
})

var server = app.listen(8080, '127.0.0.1', function() {
    var host = server.address().address
    var port = server.address().port
    console.log("app corriendo en: http://%s:%s", host, port)
})