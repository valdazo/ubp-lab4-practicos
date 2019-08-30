# REQ PRINCIPALES #

**RQ1.1**: Agregar libro a la librería. 

*Request*

    POST url/libros

    Body:
    { 
        titulo: <titulo>,
        cantidad: <cantidad>
    }

*Response*
	
    201: Created.
	Body: {“id”:<id>}
    400: Bad request.
    Body: {"Cantidad debe ser mayor a 0 y entera"}
    400: Bad request.
    Body: {"Se debe ingresar un titulo del libro"}

**RQ1.2**: Eliminar libro la librería. 

*Request*

    DELETE url/libros/:idLibro

    Body:
    {
    }

*Response*

	204: No Content.
	Body:{“id”: <id> }
    404: Not found.
    Body: { "No existe el libro" }
    400: Bad request.
    Body: { "No se puede eliminar un libro prestado" }

**RQ1.3**: Modificar la cantidad de ejemplares de un libro en la librería.

*Request*

    PUT url/libros/:idLibro

    Body:
    {
        “cantidad”: <cantidad>
    }

*Response*
	
    200: OK.
	Body:
    {
        “id”: <id>,
        “titulo”: <id>,
        “cantidad”:<cantidad>
    }
    400: Bad request.
    Body: { "Se espera un entero mayor a cero" }
    404: Not found.
    Body: { "No existe el libro" }
    400: Bad request.
    Body: { "La cantidad a ingresar debe ser mayor a la cantidad prestada" }

**RQ1.4**: Obtener la cantidad de ejemplares disponibles para préstamo en la librería

*Request*

    GET url/libros/:idLibro

    Body:
    {
    }

*Response*

	200: OK.
	Body:
    {
        “cantidad”:<cantidad>
    }
    404: Not found.
    Body: { No existe el libro" }

**RQ2.1**: Agregar socio. 

*Request*

    POST url/socios

    Body:
    { 
        nombre: <nombre>,
    }

*Response*

	201: Created.
	Body: {“id”:<id>}

**RQ2.2**: Obtener los libros prestados al socio con sus fechas de vencimiento.

*Request*

    GET url/prestamos/:idSocio

    Body:
    { 
    }

*Response*

	200: OK.
	Body: 
    {
	    [
            “id”:<id>
            “idLibro”: <idLibro>
            “idSocio”: <idSocio>
            “fechaVto”: <fechaVto>
        ]
    }
    404: Not found.
    Body: { "No existe el socio"}
    400: Bad request.
    Body: { "No se encontraron libros prestado   al socio" }

**RQ3.1**: Registrar un préstamo de un libro a un socio.

*Request*

    POST url/prestamos

    Body:
    { 
        “idLibro”: <idLibro>,
        “idSocio”: <idSocio>
    }

*Response*

	201: Created.
	Body: {“id”: <id>}
    404: Not found.
    Body: { "El libro o socio no existen" }
    400: Bad request.
    Body: { "No hay ejemplares disponibles" }
    400: Bad request.
    Body: { "Socio tiene prestamos vencidos, no puede pedir libros" }
    

**RQ3.2**: Devolver libro prestado.

*Request*

    DELETE url/prestamos/:idPrestamos

    Body:
    { 
    }

*Response*

	204: No Content.
	Body: {“idLibro”: <idLibro>}
    404: Not found.
    Body: { "El prestamo no existe" }

## REQ ADICIONALES ##

**REQ Obtener libros**

*Request*

    GET url/libros

*Response*

	200: OK.
	Body:
    {
        [
            “id”: <id>
            “titulo: <titulo>
            “cantidad”: <cantidad>
		]
    }

**REQ Obtener socios**

*Request*

    GET url/socios

*Response*

	200: OK.
	Body:
    {
        [
            “id”: <id>
            “nombre: <titulo>
		]
    }

**REQ Obtener prestamos**

*Request*

    GET url/prestamos

*Response*

	200: OK.
	Body:
    {
        [
            “id”: <id>
            “idLibro: <idLibro>
            “idSocio”: <idSocio>
            “fechaVto”: <fechaVto>
		]
    }
