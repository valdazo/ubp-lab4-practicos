--Obtener todos los libros

*Request*
GET url/libros

*Response*
    Status: 200 OK
[
    {
        "id": <"id">,
        "titulo": <"titulo">,
        "cantidad": <"cantidad">
    }
]

--Obtener Socios

*Request*

GET url/socios

*Response*

    Status: 200 OK
[
    {
        "id": <"id">,
        "nombre": <"nombre">
    }
]


--Obtener Prestamos

*Request*

GET url/prestamos

*Response*
 Status: 200 OK
[
    {
        "id": <"id">,
        "idLibro": <"idLibro">,
        "idSocio": <"idSocio">,
        "fechaVencimiento": <"fechaVencimiento">
    }
]


--Obtener los libros prestados al socio con sus fechas de vencimiento

*Request*

GET url/socios/:idsocio/prestamos

Params key: idSocio
       value: 2

*Response*
Status: 200 OK
[
    {
        "idLibro": <"idLibro">,
        "Fecha de vencimiento": <"fechaVencimiento">
    }
]

Params key: idSocio
       value: 3

*Response*
Status: 200 OK

[
    {
        "No tiene prestamos": 0
    }
]

Params key: idSocio
       value: 8

*Response*
Status: 404 Not Found
{
    "message": "No existe el socio solicitado"
}



--Actualiza la cantidad de un libros

*Request*

PUT url/libros/:idlibro

Params key: idlibro 
       value: 1

Body:
{
	"cantidad":  <"cantidad">
}

*Response*
Status: 400

{
    "message": "No se puede actualizar la cantidad de libros, es menor a la cantidad de libros prestados"
}

Params key: idlibro 
       value: 1

Body:
{
	"cantidad":  <"cantidad">
}

*Response*

Status: 200
{
    "message": "Se actualizo correctamente la cantidad del libro"
}


Params key: idlibro 
       value: 5

Body:
{
	"cantidad":  <"cantidad">
}

*Response*
Status: 400
{
    "message": "No se encuentra el id del libro ingresado"
}


--Agregar nuevo socio

POST url/socios

*Request*
Body:
{
	 "id": <"id">,
    "nombre": <"nombre">
}

*Response*
Status: 200 OK
[
    {
        "id": <"id">,
        "nombre": <"nombre">
    }
]

*Request*
Body:
{
	"id": <"id">
}

*Response*
Status: 400 Bad Request

{
    "message": "Datos incompletos"
}

Body:
{
	"id": 3, 
	"nombre": "Socio 3"
}

*Response*
Status: 400 Bad Request
{
    "message": "El socio ya existe"
}

--Agrega nuevo libro

*Request*

POST url/libros
Body:
    {
	"id": <"id">,
	"titulo": <"titulo">, 
	"cantidad":  <"cantidad">

}
*Response*
Status: 201 Created
[
    {
        "id": <"id">,
        "titulo": <"titulo">,
        "cantidad":  <"cantidad">
    }
]

*Request*
Body:
{
	"id": <"id">
}

*Response*
Status: 400 Bad Request
{
    "message": "Datos incompletos"
}



--Registra un prestamo de un libro a un socio

*Request*

POST url/prestamos

body
{
	"id": <"id">,
	"idLibro": <"idLibro">,
	"idSocio": <"idSocio">,
	"dias": <"dias">
}


*Response*

Status: 201 Created
{
    "message": "El prestamo se registro correctamente"
}

body
{
	
	"id": <"id">,
	"idLibro": <"idLibro">,
	"idSocio": <"idSocio">,
	"dias": <"dias">
}

*Response*
Status: 400 Bad Request
{
    "message": "No hay libros disponibles"
}

body
{
	"id": <"id">,
	"idLibro": <"idLibro">,
	"idSocio": <"idSocio">,
	"dias": <"dias">
}

*Response*
Status: 400 Bad Request
{
    "message": "El socio adeuda libros"
}

*Response*
Status: 404 Not Found
{
    "message": "No existe el socio"
}

*Response*
Status: 404 Not Found
{
    "message": "No existe el libro"
}


--Socio devuelve libro prestamo, se borra el prestamo

*Request*

DELETE url/prestamos/:idPrestamo

Params key: :idPrestamo
        value: 1

*Response*
Status: 200
{
    "message": "Se elimino correctamente el prestamo"
}

Params key: :idPrestamo
        value: 1

*Response*
Status: 404 Not Found

{
    "message": "No se puede borrar el prestamo, no existe"
}


--Se borra un libro

DELETE url/libros/:idLibro

*Request*
Params: key: idLibro
        value: 2

*Response*
Status: 400 Bad Request
Body:
    {
    "message": "No se puede eliminar el libro porque hay prestados"
}

*Request*
Params: key: idLibro
        value: 7

*Response*
Status: 200
Body:
    {
    "message": "Se elimino correctamente el libro"
}

*Request*
Params: key: idLibro
        value: 2

*Response*
Status: 404 Not Found
Body:
    {
    "message": "No se puede eliminar el libro porque no existe"
}
