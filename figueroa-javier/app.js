var express=require("express");
var app=express();
var bodyParser=require('body-parser');

var server= app.listen(8080,'127.0.0.1' ,function(){});
/*---------------------------------------------------*/

var socios=new Array();
var prestamos=new Array();
var libros=new Array();

const DIA_EN_MILISEG=1000*60*60*24;

function getNewId()
{
	return Math.random().toString(36).substr(2,9);
}

function encontrarIndicePorId(coleccion,idABuscar)
{
	function esElId(elemento)
	{
		return elemento.id==idABuscar;
	}
}

function Socio(nombre,id)
{
	this.nombre=nombre;
	this.id=id;
}

function Prestamo(id,id_libro,titulo_libro,nombre_socio,dias)
{
	this.id=id;
	this.id_libro=id_libro;
	this.titulo_libro=titulo_libro;
	this.nombre_socio=nombre_socio;
	this.fechaVencimiento=Date.now()+DIA_EN_MILISEG*dias;
}

function Libro(titulo_libro,cantidad,id_libro)
{
	this.titulo_libro=titulo_libro;
	this.cantidad=cantidad;
	this.id_libro=id_libro;
	this.disponibles=function (prestamos)
	{
		var count=0;
		for(const prest of prestamos)
		{
			if(prest.id_libro==id)
			{
				count++;
			}
		}
		return this.cantidad-count;
	}
}

function Eliminarlibro(id){
	for(var i=0;i<libros.length;i++)
	{
		console.log(libros[i]);
		if(id==libros[i].id_libro)
		{
			libros.splice(i,1);
			return true;
		}
	}
	return false;
}

function EliminarSocio(id){
	for(var i=0;i<socios.length;i++)
	{
		if(id==socios[i].id)
		{
			socios.splice(i,1);
				return true;
		}
	}
	return false;
}

function Buscarlibro(id_lib)
{
	for(var i=0;i<libros.length;i++)
	{
		if(id_lib==libros[i].id_libro)
		{
			return true;
			
		}
	}
	return false;
}

function Actualizarlibro(id_lib,cant)
{
	for(var i=0;i<libros.length;i++)
	{
		if(id_lib==libros[i].id_libro)
		{
			libros[i].cantidad=cant;
			return true;
		}
	}
	return false;
}

function DevolverLibro(id,id_Libro)
{
	for (var i = 0; i < prestamos.length; i++)
	{
		if(prestamos[i].id==id && prestamos[i].id_libro==id_libro)
		{
            prestamos.splice(i,1);
            return true;
        }
    }
    return false;
}

function A_devolver(nom_socio)
{
    var fecha_prest=new Array();
	for (var i = 0; i < prestamos.length; i++)
	{
		if(nom_socio==prestamos[i].nombre_socio)
		{
            fecha_prest.push(new Date(prestamos[i].fechavencimiento));
        }
    }
	for (var i = 0; i < fecha_prest.length; i++) 
	{
		if(Date.now()>fecha_prest[i])
		{
            return true;
        }
    }
    return false;
}

function GetPrestamos(idSocio)
{
    var prest=new Array();
	for (var i = 0; i < prestamos.length; i++) 
	{
		if(id==prestamos[i].idSocio)
		{
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

app.get("/socios/",function(req,res)
{
	res.status(200);
	res.json([socios]);
})

app.post("/socios/",function(req,res)
{
	socios.push(new Socio(req.body.nombre,getNewId()));
	res.status(201);
	res.json();
})

app.get("/libros/",function(req,res)
{
	res.status(200);
	res.json([libros]);
})

app.post("/libros/",function(req,res)
{
	if(Number.isInteger(req.body.cantidad)&&req.body.cantidad>0)
    {
        var nuevoLibro=new Libro(getNewId(),req.body.cantidad,req.body.titulo);
        libros.push(new Libro(req.body.nombre,req.body.cantidad,req.body.id));
        res.status(201).json(nuevoLibro.id);
    }
    else(typeof(req.body.cantidad)!='number'|| (req.body.cantidad<0))
    {
        res.status(401);
    }
})

app.get("/prestamos/",function(req,res)
{
	res.status(200);
	res.json([prestamos]);
})

app.post("/prestamos/",function(req,res)
{
	var indicelibro=encontrarIndicePorId(libros,req.body.libro);
    var indicesocio=encontrarIndicePorId(socios,req.body.socio);
    if(indicelibro==-1)
    {
        res.status(404);
        res.json("ID LIBRO:"+req.body.libro +"NO FUE ENCONTRADO EL LIBRO");

    }else if(indicesocio==-1)
    {
        res.status(404);
        res.json("ID Socio:"+req.body.socio+"NO FUE ENCONTRADO EL SOCIO")
    }
    else
    {
        if(typeof(req.body.dias)!='number')
        {
            res.status(400);
            res.json("Cantidad de dias no disponibles :"+req.body.dias);
        }
        else{
            var id=getNewId();
            prestamos.push(new prestamos(id,req.body.idlibro,req.body.socio,req.body.dias));
            res.status(201);
            res.json(id);
        }
    }
})

app.delete("/libros/:id_libro",function(req,res)
{
	if(Eliminarlibro(req.params.idlibro)==1){
        res.status(200).send("Libro Eliminado");
    }
    else{
        res.status(404).send("Libro No Encontrado");
    }
})

app.put("/libros/:idlibro",function(req,res)
{
    var nlibro;
    if(Number.isInteger(req.body.cantidad)==true && (req.body.cantidad>0))
    {
        if(searchId(libros,req.body.cantidad)!=NULL){
            if(req.body.cantidad>cantidadprestados(req.body.idlibro)){
                nlibro=(Actualizarlibro(req.body.id,req.body.cantidad)==1)
                res.status(201);   
                res.json("Libro Prestado")
            }
            else
            {
                res.status(404)
            }
        }
        res.status(404);
        res.json("NO EXISTE LIBRO")
    }
})

app.delete('/prestamos/:idsocio/:idlibro',function(req,res)
{
	if(DevolverLibro(req.params.idSocio,req.params.id_libro))
	{
		res.status(200)
		res.json("A devuelto el libro");
        console.log(prestamos);
    }
	else
	{
		res.status(400);
		res.json("ERROR EN LA OPERACION")
    }
})

function encontrarIndicePorId(coleccion, idABuscar){
    function esElId(elemento) {
      return elemento.id == idABuscar;
    }
    return coleccion.where(esElId);
}


function searchId(coleccion,id)
{
    for(var n of coleccion)
    {
        if(n.id==id){
            return n;
        }
    }
    return null;
}

function cantidadprestados(id)
{
    var cant_pres=0;
    for(var p in prestamos)
    {
        if(id==p.idlibro)
        {
            cant_prest++;
        }
        return cant_pres;
    }
}
function Validacion(idlibro,idSocio)
{
    var libro=searchId(libro,idlibro);
    var socio=searchId(socio,idSocio);
    if (libro!=NULL && socio!=NULL)
    {
        return true;

    }
    else{
        return false;
    }


}