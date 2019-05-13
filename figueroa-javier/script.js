var express=require("express");
var app=express();
var bodyParser=require('body-parser');

var server= app.listen(8080,'127.0.0.1' ,function(){
console.log("Example")
})
/*---------------------------------------------------*/

var socios=new Array();
var prestamos=new Array();
var libros=new Array();

const DIA_EN_MILISEG=1000*60*60*24;

function getNewId(){
return Math.random().toString(36).substr(2,9);
	
}
function encontrarIndicePorId(coleccion,idABuscar){
	function esElId(elemento){
		return elemento.id==idABuscar;

}
}

function Socio(nombre,id){
	this.nombre=nombre;
	this.id=id;

	
}

function Prestamo(id,id_libro,titulo_libro,nombre_socio,dias)
{
	this.id=id;
	this.id_libro=id_libro;
	this.titulo_libro=titulo_libro;
	this.nombre_socio=nombre_socio;
	this.fechaVencimiento=Date.now()+DIA_EN_MILISEG*dias
}
function Libro(titulo_libro,cantidad,id_libro){
	this.titulo_libro=titulo_libro;
	this.cantidad=cantidad;
	this.id_libro=id_libro;
	this.disponibles=function (prestamos){
		var count=0;
		for(const prest of prestamos){
			if(prest.id_libro==id){
				count++;
			}
		}
		return this.cantidad-count;
}
}
function Eliminarlibro(id){
	for(var i=0;i<libros.length;i++){
		console.log(libros[i]);
		if(id==libros[i].id_libro){
			libros.splice(i,1);
			console.log("LIBRO ENCONTRADO");
			return true;
		}
	}
	return false;
}

function EliminarSocio(id){
	for(var i=0;i<socios.length;i++){
		if(id==socios[i].id){
			socios.splice(i,1)
			console.log("SOCIO ELIMINADO");
			return true;
		}
	}
	return 0;
}
function Buscarlibro(id_lib){
	for(var i=0;i<libros.length;i++){
		if(id_lib==libros[i].id_libro){
			console.log("LIBRO ENCONTRADO");
			return true;
			
		}
	}
}
function Actualizarlibro(id_lib,cant){
	for(var i=0;i<libros.length;i++){
		if(id_lib==libros[i].id_libro){
			libros[i].cantidad=cant;
			return true;
		}
		
	}
	return false;
	
}
function DevolverLibro(id,id_Libro){
    for (var i = 0; i < prestamos.length; i++) {
        if(prestamos[i].id==id && prestamos[i].id_libro==id_libro){
            console.log("Libro encontrado");
            console.log(prestamos[i]);
            prestamos.splice(i,1);
            return true;
        }
    }
    return false;
}
function A_devolver(nom_socio){
    var fecha_prest=new Array();
    for (var i = 0; i < prestamos.length; i++) {
        if(nom_socio==prestamos[i].nombre_socio){
            fecha_prest.push(new Date(prestamos[i].fechavencimiento));
        }
    }
    for (var i = 0; i < fecha_prest.length; i++) {
        if(Date.now()>fecha_prest[i]){
            return true;
        }
    }
    return false;
}
function GetPrestamos(nom_socio){
    var prest=new Array();
    for (var i = 0; i < prestamos.length; i++) {
        if(nom_socio==prestamos[i].nombre_socio){
            prest.push({"idLibro":prestamos[i].id_libro ,"Fecha Vencimiento":new Date(prestamos[i].fechavencimiento)});
        }
    }
    return prest;
}

/*Agrego libros a la lista */
libros.push(new Libro("SAPOS DE LA MEMORIA",4,4546));
libros.push(new Libro("ANIMALES FANTASTICOS",5,4547));
libros.push(new Libro("EL BANQUETE DE PLATON",9,4548));
/*AGREGO SOCIOS A LA LISTA*/
socios.push(new Socio("Figueroa Javier",2));
socios.push(new Socio("Pedraza Pedro",5));
socios.push(new Socio("Juan bustos",0));
/*AGREGOS LOS PRESTAMOS A LA LISTA*/
prestamos.push(new Prestamo(4545,2,"SAPOS DE LA MEMORIA","Figueroa Javier",05));
prestamos.push(new Prestamo(4547,5,"ANIMALES FANTASTICOS","Pedraza Pedro",09));

app.use(bodyParser.json());
app.get("/socios/",function(req,res){
	res.status(200);
	res.json([socios]);
})

app.post("/socios/",function(req,res){
	socios.push(new Socio(req.body.nombre,getNewId()));
	res.status(201);
	res.json();
	
})
app.use(bodyParser.json());
app.get("/libros/",function(req,res){
	res.status(200);
	res.json([libros]);
})
app.post("/libros/",function(req,res){
	libros.push(new Libro(req.body.titulo_libro,req.body.cantidad,getNewId()));
	res.status(201);
	res.json();
})
app.use(bodyParser.json());
app.get("/prestamos/",function(req,res){
	res.status(200);
	res.json([prestamos]);
})
app.post("/prestamos/",function(req,res){
	prestamos.push(new Prestamo(getNewId(),req.body.id_libro,req.body.titulo_libro,req.body.nombre_socio,req.body.dias));
	res.status(201);
	res.json();
	
})
app.delete("/libros/:id_libro",function(req,res){
	if(Eliminarlibro(req.params.id_libro)){
		res.status(200);
		res.json("EL LIBRO SE HA ELIMINADO CORRECTAMENTE: ");
	}
	else{
		res.status(400);
		res.json("EL LIBRO NO SE HA ELIMINADO O NO SE ENCUENTRA DISPONIBLE: ");
	}
})
/*app.put("/libros/modificarlibro",function(req,res){
	if(Buscarlibro(req.params.libros)==libros.id_libro){
		res.status(200);
		res.json("EL LIBRO SE HA MODIFICADO CORRECTAMENTE")
	}
	else{
		res.status(400);
		res.json("NO SE HA MODIFICADO 
		
	
	
})*/

app.put("/libros/:idlibro",function(req,res){
	if(Actualizarlibro(req.params.idlibro,req.body.cantidad)){
		res.status(200);
		res.json(Buscarlibro(req.params.idlibro));
		console.log("Se encontro el libre y se ha modificado la cantidad");
		}
	else
	{
		res.status(404)
		res.json("NO SE ENCONTRO NI SE HA MODIFICADO LA CANTIDAD");
		
	}
	
})

app.delete('/prestamos/:idsocio/:idlibro',function(req,res){
    if(DevolverLibro(req.params.idSocio,req.params.id_libro)){
		res.status(200)
		res.json("A devuelto el libro");
        console.log(prestamos);
    }
    else{
		res.status(400);
		res.json("ERROR EN LA OPERACION")
    }
})

