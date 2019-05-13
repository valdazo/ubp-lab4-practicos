--Obtener todos los libros

*Request*
GET url/libros

*Response*
    Status: 200 OK
[
    {
        "id": 1,
        "titulo": "Libro 1",
        "cantidad": 1
    },
    {
        "id": 2,
        "titulo": "Libro 2",
        "cantidad": 5
    }
]

--Obtener la cantidad disponibles de un libro

*Request*
GET url/libros/:idlibro

Params key: idlibro
       value: 2
127.0.0.1:8080/libros/2

*Response*
 Status: 200 OK
 3

--Obtener Socios

*Request*

GET url/socios

*Response*
[
    {
        "id": 1,
        "nombre": "Socio 1"
    },
    {
        "id": 2,
        "nombre": "Socio 2"
    }
]


--Obtener Prestamos

*Request*

GET url/prestamos

*Response*
 Status: 200 OK
[
    {
        "id": 1,
        "idLibro": 1,
        "idSocio": 1,
        "fechaVencimiento": "2019-05-18T18:38:21.008Z"
    },
    {
        "id": 2,
        "idLibro": 2,
        "idSocio": 2,
        "fechaVencimiento": "2019-05-23T18:38:21.008Z"
    },
    {
        "id": 3,
        "idLibro": 2,
        "idSocio": 1,
        "fechaVencimiento": "2019-05-16T18:38:21.008Z"
    }
]


--Obtener los libros prestados al socio con sus fechas de vencimiento

*Request*

GET url/socios/:idsocio/prestamos

Params key: idSocio
       value: 2

127.0.0.1:8080/socios/2/prestamos

*Response*
Status: 200 OK
[
    {
        "idLibro": 2,
        "Fecha de vencimiento": "2019-05-23T18:38:21.008Z"
    }
]

Status: 400 Bad Request
Body:
    No se puede obtener los libros prestados al socio


--Actualiza la cantidad de un libros

*Request*

PUT url/libros/:idlibro

Params key: idlibro 
       value: 1

Body:
{
	"cantidad": 0
}

*Response*

Status: 204 No Content




--Agregar nuevo socio

*Request*
Body:
{
	"id": 3, 
	"nombre": "Socio 3"
}
POST url/socios

*Response*
Status: 200 OK
[
    {
        "id": 1,
        "nombre": "Socio 1"
    },
    {
        "id": 2,
        "nombre": "Socio 2"
    },
    {
        "id": 3,
        "nombre": "Socio 3"
    }
]




--Agrega nuevo libro

*Request*

POST url/libros
Body:
    {
	"id": 7, 
	"titulo": "Libro 7", 
	"cantidad": 10

}
*Response*
Status: 201 Created
[
    {
        "id": 1,
        "titulo": "Libro 1",
        "cantidad": 1
    },
    {
        "id": 2,
        "titulo": "Libro 2",
        "cantidad": 5
    },
    {
        "id": 7,
        "titulo": "Libro 7",
        "cantidad": 10
    }
]



--Registra un prestamo de un libro a un socio

*Request*

POST url/prestamos

body
{
	"id": 4,
	"idLibro": 1,
	"idSocio": 2,
	"dias": 0
}


*Response*

Status: 201 Created
Body:
[
    {
        "id": 1,
        "idLibro": 1,
        "idSocio": 1,
        "fechaVencimiento": "2019-05-18T18:38:21.008Z"
    },
    {
        "id": 2,
        "idLibro": 2,
        "idSocio": 2,
        "fechaVencimiento": "2019-05-23T18:38:21.008Z"
    },
    {
        "id": 3,
        "idLibro": 2,
        "idSocio": 1,
        "fechaVencimiento": "2019-05-16T18:38:21.008Z"
    },
    {
        "id": 4,
        "idLibro": 2,
        "idSocio": 2,
        "fechaVencimiento": "2019-05-13T18:57:07.603Z"
    }
]

Status: 400 Bad Request
Body:
No se puede realizar el prestamo




--Socio devuelve libro prestamo, se borra el prestamo

*Request*

DELETE url/prestamos/:idSocio/:idLibro

Params key: 3
        value: 2
*Response*

No se puede borrar el prestamo, no existe



--Se borra un libro

*Request*
Params: key: id
        value: 1

Params: key: id
        value: 3

DELETE url/libros/:id

*Response*
Status: 400 Bad Request
Body:
    No se puede eliminar el libro

Status: 200
