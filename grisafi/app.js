var express= require('express');
var app = express();
var bodyParser= require('body-parser');
app.use(bodyParser.json());

const DIA_EN_MILISEGUNDOS = 1000*60*60*24;

var libros = new Array();
var socios = new Array();
var prestamos = new Array();

function Libro(titulo,cantidad,id){
    this.id=id;
    this.titulo=titulo;
    this.cantidad=cantidad;
    this.disponibles=function(){
        var count=0;
        for (const prest of prestamos) {
            if (prest.idLibro==this.id){
                count++;
            }
        }
        return this.cantidad-count;
    }
}

function Socio(nombre,id){
    this.id=id;
    this.nombre=nombre;
}

function Prestamo(id,idSocio,idLibro,dias){
    this.id=id;
    this.idSocio=idSocio;
    this.idLibro=idLibro;
    this.fechavencimiento=Date.now()+DIA_EN_MILISEGUNDOS*dias;
}

function librosPrestados(idLibro){
    var cont=0;
    for (let i = 0; i < prestamos.length; i++) {
        if(prestamos[i].idLibro==idLibro){
            cont++;
        }
    }
    return cont;
}

function updateBook(bookID,cantidad){
    if(cantidad>librosPrestados(bookID)){
        for (let i = 0; i < libros.length; i++) {
            if(bookID == libros[i].id){
                libros[i].cantidad=cantidad;
                return 1;
            }
        }
        return 0;
    }
    else{
        return -1;
    }
}

function findBook(bookID){
    for (let i = 0; i < libros.length; i++) {
        if(bookID == libros[i].id){
            return libros[i];
        }
    }
    return 0;
}

function findMember(memberID){
    for (let i = 0; i < socios.length; i++) {
        if(memberID==socios[i].id){
            return socios[i];
        }
    }
    return 0;
}

function adeuda(idSocio){
    var fecha_prest=new Array();
    for (let i = 0; i < prestamos.length; i++) {
        if(idSocio==prestamos[i].idSocio){
            fecha_prest.push(new Date(prestamos[i].fechavencimiento));
        }
    }
    for (let i = 0; i < fecha_prest.length; i++) {
        if(Date.now()>fecha_prest[i]){
            return true;
        }
    }
    return false;
}

function checkPrestado(idLibro){
    for (let i = 0; i < prestamos.length; i++) {
        if(prestamos[i].idLibro==idLibro){
            return 1;
        }   
    }
    return 0;
}

function deleteBook(id){
    if(checkPrestado()==0){
        for (let i = 0; i < libros.length; i++) {
            if(id==libros[i].id){
                libros.splice(i,1);
                return 1;
            }
        }
        return 0;
    }
    else{
        return -1;
    }
}

function getPrestamos(idSocio){
    var prest=new Array();
    for (let i = 0; i < prestamos.length; i++) {
        if(idSocio==prestamos[i].idSocio){
            prest.push({"idLibro":prestamos[i].idLibro ,"Fecha Vencimiento":new Date(prestamos[i].fechavencimiento)});
        }
    }
    return prest;
}

function generatePrestamosID(){
    return Math.random().toString(36).substr(2, 9);
}

libros.push(new Libro("Harry Potter",100,10));
libros.push(new Libro("El Señor de los Anillos",10,20));

socios.push(new Socio("A",1));
socios.push(new Socio("B",2));

prestamos.push(new Prestamo(1,1,10,20));
prestamos.push(new Prestamo(2,2,10,20));

app.get('/socios',function(req,res){
    res.status(200).json(socios);
})

app.get('/socios/:idSocio',function(req,res){
    var socio=findMember(req.params.idSocio);
    if(socio!=0){
        res.status(200).json(findMember(req.params.idSocio));
    }
    else{
        res.status(404).send("Socio no encontrado");
    }
})

app.get('/socios/:idSocio/prestamos',function(req,res){
    if(findMember(req.params.idSocio)){
        var prest=getPrestamos(req.params.idSocio);
        if(prest.length==0){
            res.status(200).send("No hay Prestamos Realizados por el Socio");
        }
        else{
            res.status(200).json(prest);
        }
    }
    else{
        res.status(400).send("Socio No Encontrado");
    }
})

app.get('/prestamos',function(req,res){
    if(prestamos!=null)
        res.status(200).json(prestamos);
    else
        res.status(204).send("No hay Prestamos Registrados");
})

app.get('/libros/:idLibro',function(req,res){
    var book=findBook(req.params.idLibro);
    if(book!=0){
        res.status(200).json({"idLibro":parseInt(req.params.idLibro),"disponibles":book.disponibles()});
    }
    else{
        res.status(400).send("Libro no encontrado");
    }
})

app.post('/socios',function(req,res){
    socios.push(new Socio(req.body.nombre,req.body.id));   
    res.status(201).json(req.body);
})

app.post('/libros',function(req,res){
    libros.push(new Libro(req.body.nombre,req.body.cantidad,req.body.id));
    libros[libros.length-1].disponibles();
    res.status(201).json(req.body);
})

app.post('/prestamos',function(req,res){
    if(adeuda(req.body.idSocio)){
        res.status(400).send("El socio adeuda libros");
    }
    else{
        if(findBook(req.body.idLibro).disponibles()>0){
            prestamos.push(new Prestamo(generatePrestamosID(),req.body.idSocio,req.body.idLibro,req.body.dias));
            res.status(200).send("Prestamo realizado con exito");
        }
        else{
            res.status(404).send("No hay ejemplares disponibles para prestamo");
        }
    }
})

app.delete('/libros/:idlibro',function(req,res){
    var resultado=deleteBook(req.params.idLibro);
    if(resultado){
        res.status(200).send("Libro Eliminado");
    }
    else if(resultado==-1){
        res.status(400).send("No se puede eliminar el libro porque hay ejemplares prestados")
    }
    else{
        res.status(400).send("Libro No Encontrado");
    }
})

function returnBook(idSocio,idLibro){
    for (let i = 0; i < prestamos.length; i++) {
        if(prestamos[i].idSocio==idSocio && prestamos[i].idLibro==idLibro){
            console.log("Libro encontrado");
            console.log(prestamos[i]);
            prestamos.splice(i,1);
            return 1;
        }
    }
    return 0;
}

app.delete('/prestamos/:idSocio/:idLibro',function(req,res){
    if(returnBook(req.params.idSocio,req.params.idLibro)){
        res.status(200).send("Libro devuelto");
        console.log(prestamos);
    }
    else{
        res.status(400).send("La operacion no se pudo llevar a cabo");
    }
})

app.put('/libros/:idLibro',function(req,res){
    var resultado=updateBook(req.params.idLibro,req.body.cantidad);
    if(resultado==1){
        res.status(200).json(findBook(req.params.idLibro));
    }
    else if(resultado==-1){
        res.status(400).send("Error: la cantidad de libros es menor a la cantidad de libros prestados");
    }
    else{
        res.status(400).json("Libro no encontrado");
    }
})

var server = app.listen(8080, '127.0.0.1', function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app corriendo en: http://%s:%s", host, port)
  })
  