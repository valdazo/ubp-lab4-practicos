var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var loki = require('lokijs');

const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

var db = new loki('libreria.json',{
	autoload: true,
	autoloadCallback : databaseInitialize,
	autosave: true,
	autosaveInterval: 4000
});

var libros;
var socios;
var prestamos;

function databaseInitialize() {
  libros = db.getCollection('libros');
  if (libros === null) {
    libros = db.addCollection('libros');
  }
  socios = db.getCollection('socios');
  if (socios === null) {
    socios = db.addCollection('socios');
  }
  prestamos = db.getCollection('prestamos');
  if (prestamos === null) {
    prestamos = db.addCollection('prestamos');
  }
}

function Libro(id,nombre,cantidad){
  this.id = id;
  this.nombre = nombre;
  this.cantidad = cantidad;
  this.disponibles = function(librosPrestados){
    var prestados = 0;
    for (var libroPrestado of librosPrestados) {
      if (this.id == libroPrestado.idLibro){
        ++ prestados;
      }
    }
    return cantidad - prestados;
  }
}

/*
var results = coll.where(function(obj) {
return obj.legs === 8;
});*/

function Socio(id, nombre){
  this.id = id;
  this.nombre = nombre;
  this.libros = function(librosPrestados) {
    var prestamos = new Array();
    for (var libroPrestado of librosPrestados) {
      if (this.id == libroPrestado.idSocio) {
        prestamos.push(libroPrestado);
      }
    }
    return prestamos;
  }
}

function Prestamo(id, idLibro, idSocio, dias) {
  this.id = id;
  this.idLibro = idLibro;
  this.idSocio = idSocio;
  this.fechaVencimiento = Date.now() + DIA_EN_MILISEGUNDOS * dias;
}

/*var libros = new Array();
var socios = new Array();
var prestamos = new Array();
*/


/*
var results = coll.where(function(obj) {
return obj.legs === 8;
});*/

function getNewId() {
     //return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
     return Math.random().toString(36).substr(2, 9);
}

function encontrarIndicePorId(colecccion, idABuscar){
  function esElId(elemento) {
    return elemento.id == idABuscar;
  }

  return colecccion.where(esElId);
}

function obtenerDisponibilidad(idLibro, misLibros, misPrestamos) {
  var indice = encontrarIndicePorId(misLibros, idLibro)
  return misLibros[indice].disponibles(misPrestamos);
}

function alphanumerical(textToValidate) {
	var expression = /[A-Za-z0-9]+$/;
	return textToValidate.match(expression);
}

app.use(bodyParser.json()); // for parsing application/json

app.get('/socios', function (req, res){
  res.status(200);
	res.json(socios);
})

app.get('/socios/:socio', function (req,res){
	var indice = encontrarIndicePorId(socios, req.params.socio);
  console.log(indice);
	if (indice.length == 0) {
		res.status(404);
		res.json("Id " + req.params.socio + " no fue encontrado");
  } else if (indice.length == 1){
    res.status(200);
    res.json(indice[0]);
  } else {
    res.status(500);
    res.json("Varios Socios tienen el mismo indice");
  }
})

app.post('/socios', function (req,res){
	if (!alphanumerical(req.body.nombre)){
    res.status(400);
    res.json("El nombre tiene que ser alfanumerico");
  } else {
    var id = getNewId();
    socios.insert(new Socio(id,req.body.nombre));
    db.saveDatabase();
    res.status(201);
    res.json(id);
  }
})

app.get('/socios/:socio/prestamos', function (req,res) {
  var indice = encontrarIndicePorId(socios, req.params.socio);
	if (indice == -1) {
		res.status(404);
		res.json("Id " + req.params.socio + " no fue encontrado");
  } else {
    res.status(200);
    res.json(socios[indice].libros(prestamos));
  }
})

app.post('/prestamos', function (req,res){
  var indiceLibro = encontrarIndicePorId(libros, req.body.libro);
  var indiceSocio = encontrarIndicePorId(socios, req.body.socio);
	if (indiceLibro == -1) {
		res.status(404);
		res.json("Id " + req.body.libro + " no fue encontrado");
  } else if (indiceSocio == -1) {
		res.status(404);
		res.json("Id " + req.body.socio + " no fue encontrado");
  } else {
    if (typeof(req.body.dias) !== 'number'){
      res.status(400);
      res.json("Cantidad de dias invalidos: " + req.body.dias);
    } else {
      var id = getNewId();
      prestamos.push(new Prestamo(id,
        req.body.libro,
        req.body.socio,
        req.body.dias));
      res.status(201);
      res.json(id);
    }
  }
})

app.get('/prestamos', function(req,res){
  res.status(200);
  res.json(prestamos);
})

app.get('/prestamos/:prestamo', function (req,res){
	var indice = encontrarIndicePorId(prestamos, req.params.prestamo);
	if (indice == -1) {
		res.status(404);
		res.json("Id " + req.params.prestamo + " no fue encontrado");
  } else {
    res.status(200);
    res.json(prestamos[indice]);
  }
})

app.delete('/prestamos/:prestamo', function(req,res){
  var indice = encontrarIndicePorId(prestamos, req.params.prestamo);
  if (indice == -1) {
    res.status(404);
    res.json("Id " + req.params.prestamo + " no fue encontrado");
  } else {
    prestamos.splice(indice,1);
    res.status(204);
    res.json(req.params.prestamo);
  }
})

app.put('/libros/:libro', function(req,res){
	console.log(req.body);
	console.log(req.params.libro);
	if (typeof(req.body.cantidad) !== 'number'){
		res.status(400);
		res.json("Se espera que la cantidad sea un numero positivo");
	} else {
	    var indice = encontrarIndicePorId(libros, req.params.libro);
	    if (indice == -1) {
			res.status(404);
			res.json("Id " + req.params.libro + " no fue encontrado");
	    } else {
	    	libros[indice].cantidad = req.body.cantidad;
        res.status(204);
        res.json(req.body.cantidad);
	    }
	}
})

app.get('/libros', function (req, res){
	res.status(200);
	res.json(libros.data);
})

app.get('/libros/:libro', function (req,res){
	var indice = encontrarIndicePorId(libros, req.params.libro);
	if (indice == -1) {
		res.status(404);
		res.json("Id " + req.params.libro + " no fue encontrado");
  } else {
    res.status(200);
    var copiaLibro = Object.assign({}, libros[indice]);
    copiaLibro["disponibles"] = copiaLibro.disponibles(prestamos);
    res.json(copiaLibro);
  }
})

app.post('/libros/', function (req, res){
	console.log(req.body.nombre);
	if (!alphanumerical(req.body.nombre)){
    res.status(400);
    res.response("El nombre del libro debería ser formado solo por letras");
	} else if (typeof(req.body.cantidad) !== 'number'){
    res.status(400);
    res.response("Se espera que la cantidad sea un numero positivo");
	} else {
		var id = getNewId();
		libros.insert(new Libro(id,req.body.nombre,req.body.cantidad));
    db.saveDatabase();
		res.status(201);
		res.json(id);
	}
})

var server = app.listen(8080, '127.0.0.1', function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
