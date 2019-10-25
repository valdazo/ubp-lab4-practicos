## REQ Principal-BibliotecaBD
**RQ1.1** Agregar libros 

*Request:*
```html
Post url/libros 

Body
{
    [
        "titulo":<titulo>
        "cantidad":<cantidad>
        "id_libro":<id_libro>
    ]
}
```

*Response:*
```html
201: Created.
Body: {“id”:<id>}
400: Bad request.
Body: {"Cantidad debe ser mayor a 0 y entera"}
400: Bad request.
Body: {"Se debe ingresar un titulo del libro"}
```
**RQ1.2** Eliminar Libro

*Request:*
```html
Delete url/libros/:id_libro
```
*Response:*
```html
204: No Content.
Body:{“id”: <id> }
```
**RQ1.3** Modificar cantidad de ejemplares de un libro

*Request:*
```html
Put url/libros/:id_libro

Body:
{
    “cantidad”: <cantidad>
}
```
*Response:*
```html
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
```
**RQ1.4** Obtener la cantidad de ejemplares disponibles para préstamo en la librería

*Request:*
```html
Get url/libros/:id_libro
Body:
{
}
```
*Request:*
```html
200: OK.
Body:
{
    “cantidad”:<cantidad>
}
404: Libro no existe.
Body: { Supera el maximo de prestamos" }
```


**RQ2.1** Agregar socios

*Request:*
```html
Post url/socios
Body
{
    [
        "nombre":<nombre>
    ]
}
```
*Response:*
```html
201: Created.
Body: {“id”:<id>}
```
**RQ2.2** Obtener los libros prestados al socio con sus fechas de vencimiento.

*Request:*
```html
Get url/prestamos/:id_socio

Body:
{ 
}
```
*Response:*
```html
200: OK.
Body: 
{
    [
        “id”:<id>
        “idLibro”: <id_libro>
        “idSocio”: <id_socio>
        “fechaVto”: <fecha_Vto>
    ]
}
404: Not found.
Body: { "No existe el socio"}
400: Bad request.
Body: { "No se encontraron libros prestado   al socio" }
```
**RQ3.1** Registrar un préstamo de un libro a un socio.

*Request:*
```html
Post url/prestamos

Body:
{ 
    “id_libro”: <id_libro>,
    “id_socio”: <id_socio>
}
```
*Response:*
```html
201: Created.
Body: {“id”: <id>}
404: Not found.
Body: { "El libro o socio no existen" }
400: Bad request.
Body: { "No hay ejemplares disponibles" }
400: Bad request.
Body: { "Socio tiene prestamos vencidos, no puede pedir libros" }
```
**RQ3.2** Devolver libro prestado.

*Request:*
```html
DELETE url/prestamos/:id_prestamos

Body:
{ 
}
```
*Response:*
```html
204: No Content.
Body: {“idLibro”: <id_libro>}
404: Not found.
Body: { "No se puede realizar el prestamo" }
```
### REQ Adicional
**RQ** Obtener socios

*Request:*
```html
Get url/socios
```
*Response:*
```html
200:OK
Body
{
    [
        "id_socio":<id_socio>
        "nombre":<nombre>
    ]
}
```
**RQ** Obtener libros

*Request:*
```html
Get url/libros
``` 

*Response:*

```html
200: OK
Body
{
    [
        "id_libro":<id_libro>
        "titulo_libro":<id_libro>
        "cantidad":<cantidad>
    ]
}
```
**RQ** Obtener prestamos

*Request:*
```html 
Get url/prestamo
```
*Response*
```html
200:OK
Body
{
    [
        "id":<id>
        "id_libro":<id_libro>
        "id_socio":<id_socio>
        "fecha_Vto":<fecha_Vto>
    ]
}
```
