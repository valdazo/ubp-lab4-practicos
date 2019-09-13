# Documentación Práctico Biblioteca

### **RQ1.1:** Agregar libro a la librería
##### *Request*
	POST url/libros
	Body:
	{
		titulo: <titulo>,
		cantidad: <cantidad>
	}

##### *Response*
	201 Created
	Body: {“idLibro”:<id_Libro>}

#### Si se ingresa una cantidad que es negativa o igual a cero:
##### *Response*
	400 Bad Request
	Body: {"La cantidad debe ser un entero mayor a cero”}

#### Si se quiere agregar un libro sin ingresar un titulo:
##### *Response*
	400 Bad Request
	Body: {"No puede agregarse un libro sin ingresar un titulo"}


### **RQ1.2:** Eliminar libro de la librería
##### *Request*
	DELETE url/libros/<id_libro>
##### *Response*
	204 No Content

#### Si se ingresa el id de un libro que no existe:
##### *Response*
	404 Not Found
	Body: {"El id del libro ingresado no existe"}	

#### Si se quiere eliminar un libro que está prestado:
##### *Response*
	400 Bad Request
	Body: {"El libro no puede ser eliminado porque está prestado"}


### **RQ1.3:** Modificar la cantidad de ejemplares de un libro en la librería
##### *Request*
	PUT url/libros/<id_libro>
	Body:
	{
		cantidad: <cantidad>
	}
##### *Response*
	204 No Content

#### Si se ingresa el id de un libro que no existe:
##### *Response*
	404 Not Found
	Body: {"El id del libro ingresado no existe"}	

#### Si se ingresa una cantidad que es negativa o igual a cero:
##### *Response*
	400 Bad Request
	Body: {"La cantidad debe ser un entero mayor a cero”}

#### Si se quiere ingresar una cantidad que es menor a la cantidad de libros que están prestados:
##### *Response*
	400 Bad Request
	Body: {"La cantidad nueva no puede ser menor a la cantidad de ejemplares que estan prestados"}


### **RQ1.4:** Obtener la cantidad de ejemplares disponibles para préstamo en la librería
##### *Request*
	GET url/libros/<id_libro>
##### *Response*
	200 OK
	Body: {“Cantidad disponible”:<disponibles>}

#### Si se ingresa el id de un libro que no existe:
##### *Response*
	404 Not Found
	Body: {"El id del libro ingresado no existe"}	


### **RQ2.1:** Crear socio.
##### *Request*
	POST url/socios
	Body:
	{
		nombre: <nombre>
	}
##### *Response*
	201 Created
	Body: {“idSocio:” <id_Socio>}

#### Si se quiere crear un socio sin ingresar un nombre:
##### *Response*
	400 Bad Request
	Body: {"No puede agregarse un socio sin ingresar un nombre"}


### **RQ2.2:** Obtener los libros prestados al socio con sus fechas de vencimiento.
##### *Request*
	GET url/socios/<id_socio>/prestamos
##### *Response*
	200 OK
	Body: 
    {
        idPrestamo: <idPrestamo>,
        idLibro: <idLibro>,
        fechaVencimiento: <fechaVencimiento>
    }

#### Si se ingresa el id de un socio que no existe:
##### *Response*
	404 Not Found
	Body: {"El id del socio ingresado no existe”}

#### Si el socio ingresado no tiene libros prestados:
##### *Response*
	204 No Content
	Body: {"El socio no tiene libros prestados"}


### **RQ3.1:** Registrar un préstamo de un libro a un socio.
##### *Request*
	POST url/prestamos
	Body:
	{
		idSocio: <idSocio>,
		idLibro: <idLibro>,
		diasPrestamo: <diasPrestamo>
	}
##### *Response*
	201 Created
	Body: {“idPrestamo”: <id_Prestamo>}

#### Si se ingresa el id de un socio que no existe:
##### *Response*
	404 Not Found
	Body: {"El id del socio ingresado no existe”}

#### Si se ingresa el id de un libro que no existe:
##### *Response*
	404 Not Found
	Body: {"El id del libro ingresado no existe”}

#### Si no hay ejemplares disponibles:
##### *Response*
	400 Bad Request
	Body: {"No hay ejemplares disponibles”}

#### Si el socio tiene préstamos vencidos:
##### *Response*
	400 Bad Request
	Body: {"Socio tiene prestamos vencidos, no puede pedir libros"}

#### Si la cantidad de dias de prestamo ingresada es nula o negativa:
##### *Response*
	400 Bad Request
	Body: {"La cantidad de dias del prestamo de no debe ser nula ni negativa"}


### **RQ3.2:** Un socio puede devolver un libro prestado.
##### *Request*
	DELETE url/prestamos/<id_prestamo>
##### *Response*
	204 No Content

#### Si se ingresa el id de un préstamo que no existe:
##### *Response*
	404 Not Found
	Body: {"El id del prestamo ingresado no existe”}
