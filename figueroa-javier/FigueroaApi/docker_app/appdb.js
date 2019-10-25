var express=require('express');
var sql = require('mysql'); 
var app=express();
var bodyParser=require('body-parser');
var util=require('util');

var server= app.listen(8080,'0.0.0.0' ,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listening at http://%s:%s", host, port);

});


app.use(bodyParser.json()); 

/*---------------------------------------------------*/
var con = sql.createConnection({
  host: "mysql-db",
  user: "biblioteca",
  password: "biblioteca",
  database: "BibliotecaAPI"
});
con.connect(function(err) {
  if (err) throw err;
  console.log(" Database Connected!");
});
/*---------------------------------------------------*/
const DIAS_MILI_SEG=1000*60*60*24;
function obtenerFechaVto(dias){
    var f = new Date();
    var fechaMiliseg = f.getTime();
    var fecha_vencimiento = fechaMiliseg + (DIAS_MILI_SEG * dias);
    return fecha_vencimiento;
}
function getNewId()
{
	return Math.random().toString(36).substr(2,9);
}

const query = util.promisify(con.query).bind(con);

app.get('/socios',async function(req,res){
	var queryResult=await query (`select * from Socios`);
	console.log(queryResult);
	res.status(200).json(queryResult);

})

app.get('/libros',async function(req,res){
	var queryResult=await query(`select * from Libros`);
	console.log(queryResult);
	res.status(200).json(queryResult);
	
})

app.get('/prestamos',async function(req,res){
	var queryResult=await query(`select * from Prestamos`);
	console.log(queryResult);
	res.status(200).json(queryResult);
})

app.post('/socios',async function(req,res){
	if(req.body.nombre==null)
	{
		res.status(400).json("DEBE COMPLETAR EL CAMPO DE NOMBRE");
	}
	else
	{
		const queryStr=`insert into Socios(id_socio,nombre) values (?,?)`;
		var queryResult=await query(queryStr,[getNewId(),req.body.nombre]);
		res.status(201).json("SE CREO CON EXITO EL SOCIO");
	}	
})

app.post('/libros',async function(req,res){
	
	if(typeof(req.body.cantidad)!='number'||(req.body.cantidad<0)||(req.body.titulo_libro==null)){
		res.status(401).json("NO SE PUDO AGREGAR UN LIBRO,LOS DATOS INGRESADOS SON INCORRECTOS,VERIFIQUE");
	}
	else
	{
		const queryStr=`insert into Libros(id_libro,cantidad,titulo_libro) values (?,?,?)`;
		var queryResult=await query(queryStr,[getNewId(),req.body.cantidad,req.body.titulo_libro]);
		res.status(201).json("SE CREO UN LIBRO NUEVO");
	}
})

app.post('/prestamos',async function(req,res){
	var queryidLibro = await query(queryLibro,req.body.id_libro);
    const querySocio = `select * from Socios where id_socio = ?`;
	var queryidSocio = await query(querySocio,req.body.id_socio);
    const queryCantidad = `select count(*) cant from Prestamos where id_libro = ?`;
	var queryCantidadLibros = await query(queryCantidad,req.body.id_libro);
    var f = new Date();
    var fechaMiliseg = f.getTime();
    const queryPrestamos = `select * from Prestamos where id_socio = ? and fecha_vencimiento < ?`;
	var queryPrestamosSocios = await query(queryPrestamos,[req.body.id_socio, fechaMiliseg]);
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
                const queryStr = `insert into Prestamos (id_prestamo, id_libro, id_socio, fecha_vencimiento) values (?, ?, ?, ?)`;
                var queryResult = await query(queryStr, [getNewId(), req.body.id_libro, req.body.id_socio, obtenerFechaVto(req.body.cantidad_dias)]);
                console.log(queryResult);
                res.status(201).json("Se agrego el prestamo correctamente");
            }
        }
    }
})

app.delete('/libros/:id_libro',async function(req,res){
		
		/*const queryStr=`delete from Libros where id_libro=?`;
		var queryResult=await query(queryStr,[req.body.titulo_libro,req.params.id_libro]);
		res.status(204).json("SE HA ELIMINADO EL LIBRO CON EXITO");*/
	const queryPrestamosId=`select * from Prestamos where id_libro=?`;
	var queryResultPrestamosId=await query(queryPrestamosId,req.params.id_libro);
	if (queryResultPrestamosId.length>0)
	{
		res.status(400).json("El libro esta prestado");
	}
	else
	{
		const queryDelete=`delete from Libros where id_libro=?`;
		var queryResultDelete=await query(queryDelete,req.params.id_libro);
		res.status(204).json("Libro eliminado correctamente");
	
	}
})

app.delete('/prestamos/:id_prestamo',async function(req,res){
	const queryidprestamos=`select * from Prestamos where id_prestamo='${req.params.id_prestamo}'`;
	var queryResultidPrestamos=await query(queryidprestamos,req.body.id_prestamo);
	if(typeof(queryResultidPrestamos)!='number' && (queryResultidPrestamos.length<0))
	{
		res.status(400).json("EL PRESTAMO NO SE PUEDE REALIZAR");
	}
	else
	{
		const queryStr=`delete from Prestamos where id_prestamo='${req.params.id_prestamo}'`;
		var queryResult=await query(queryStr,req.body.id_prestamo);
		res.status(204).json("PRESTAMO REALIZADO CORRECTAMENTE");

	}
})

app.put('/libros/:idlibro',async function(req,res){
	//console.log("..................a");
	const queryExiteLibro=`select * from Libros where id_libro=?`;
	//console.log("................b");
	var queryExisteLibroResult=await query(queryExiteLibro,[req.params.id_libro,req.params.cantidad]);
	//console.log(".....................c")
	if(req.body.cantidad>0)
	{
		if(queryExiteLibro.length<0)
		{
			res.status(400).json("LIBRO NO EXISTE");
		}
		else
		{
			const queryCantidadPrestada=`select count(*) as cantprestada from Prestamos where id_libro=?`;
			var queryResutlCantidadPrestada=await query(queryCantidadPrestada,req.params.id_libro);
			if(queryCantidadPrestada[0].cantprestadas>req.body.cantidad)
			{
				res.status(400).json("SUPERA EL MAXIMO DE PRESTAMOS")
			}		
			else 
			{
				const queryStr=`update Libros set cantidad=? where id_libro=?`;
				var queryResult=await query(req.body.cantidad,req.body.params.id_libro);
				res.status(200).json("SE ACTUALIZO CORRECTAMENTE LOS DATOS");
			}	
		}
	}
	else
	{
		res.status(400).json("ERROR EN LA CANTIDAD DE LIBROS");

	}
})

app.get('/prestamos/:id_socio',async function(req,res){
	console.log("params")
	const querySocio=`select * from Socios where id_socio='${req.params.id_socio}'`;
	var queryResultSocio=await query(querySocio,req.params.id_socio);

	if(queryResultSocio.length<0)
	{
		res.status(404).json("NO EXISTE EL SOCIO");
	}
	else
	{
		queryPrestamos=`select * from Prestamos where id_socio=?`;
		queryResultPrestamos=await query(queryPrestamos,req.params.id_socio);

		if(queryResultPrestamos.length<=0)
		{
			res.status(404).json("NO SE ENCONTRARON LIBROS PRESTADOS PARA EL SOCIO");

		}
		else
		{
			res.status(200).json("SE ENCONTRO EL SOCIO PARA EL PRESTAMO");
			Console.log(queryResultPrestamos);
		}
	}

})

app.get('/libros/:id_libro',async function(req,res){
	// obtener la cantidad de libros con id: id_libro
	const queryStr=`select * from Libros where id_libro=?`;
	var queryResult=await query(queryStr,req.params.id_libro);

	if(queryResult.length<0)
	{
		res.status(404).json("LIBRO INCORRECTO");
	}
	else
	{	
		// obtener la cantidad de prestamos realizados del libro id_libro
		queryPrestados=`select count (*) as cantprestadas  from Prestamos where id_libro=?`;
		queryResultPrestados=await query(queryPrestados,req.params.id_libro);
		var disponible=queryResult[0].cantidad-queryResultPrestados[0].cantprestadas;
		res.status(200).json(disponible);
	}
})
