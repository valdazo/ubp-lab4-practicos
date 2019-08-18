# REST API LIBRARY

# About

API manages a library's list of members, books and loans

# Requests

## Get /books/
>Obtain all the books
>```
>127.0.0.1:8080/libros
>```
>#### Example Request
>>```
>>curl --location --request GET "127.0.0.1:8080/libros"
>>```
>#### Example Response
>>{
>>    "data": [
>>        {
>>            "id": 10,
>>            "title": "Harry Potter",
>>            "amount": 100
>>        },
>>        {
>>            "id": 20,
>>            "title": "Lord of the Rings",
>>            "amount": 10
>>        }
>>    ]
>>}

## GET /books/:id
>```
>127.0.0.1:8080/books/:id
>```
>**Path Variables:**
>>```
>>id:        id of the book to be searched
>>```
>#### Example Response:
>#### ***Case* 200 OK** 
>>```
>>{
>>    "data": {
>>        "bookId": 10,
>>        "title": "Harry Potter",
>>        "available": 100
>>    }
>>}
>>```
>#### ***Case* 404 Not Found** 
>>```
>>{
>>    "error": {
>>        "code": 404,
>>        "message": "book not found"
>>    }
>>}
>>```

## POST /books/
>```
>127.0.0.1:8080/books
>```
>#### Body
>>```
>>{
>>	"id":100,
>>	"title":"Don Quijote",
>>	"quantity":100
>>}
>>```
>#### Example Request
>>```
>>curl --location --request POST "127.0.0.1:8080/books"
>>```
>#### Example Response
>>- 201 Created
>>>{
>>>    "status": "success",
>>>    "message": "book added"
>>>}
>>>```
>>- 404 Bad Request
>>>```
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "there's already another book with that id"
>>>    }
>>>}
>>>```




















## GET /members/
>Obtain all the library's members
>```
>127.0.0.1:8080/socios
>```
>#### Example Request
>>```
>>curl --location --request GET "127.0.0.1:8080/socios"
>>```
>#### Example Response 200 OK
>>
>>```
>>[
>>  {
>>    "id": 1,
>>    "nombre": "A"
>>  },
>>  {
>>    "id": 2,
>>    "nombre": "B"
>>  }
>>]
>>```

## GET Socio Info
```
127.0.0.1:8080/socios/:idSocio
```
**Path Variables:**
```
idSocio	      <idSocio>
	      ID del Socio a buscar
```
#### Example Request
```
curl --location --request GET "127.0.0.1:8080/socios/0"
```
#### *Case*: Socio Encontrado 200 OK
```
{
  "id": 1,
  "nombre": "A"
}
```
#### *Case*: Socio No Encontrado 404 Not Found
```
"Socio no encontrado"
```



## GET prestamos socio
Obtains all the loans made by a member
```
127.0.0.1:8080/socios/:idSocio/prestamos
```
**Path Variables:**
```
idSocio     <idSocio>
	    ID del socio a consultar los prestamos realizados
```
#### Example Response
#### ***Case* Socio con Prestamos 200 OK**
```
[
  {
    "idLibro": 10,
    "Fecha Vencimiento": "2019-05-24T18:46:34.184Z"
  }
]
```

#### ***Case* Socio sin Prestamos 200 OK**
```
"No hay Prestamos Realizados por el Socio"
```

#### ***Case* Socio Inexistente 400 OK**
```
"Socio No Encontrado"
```
## POST Socio
```
127.0.0.1:8080/socios
```
#### Headers
```
Content-Type application/json
```
#### Body
```
{
	"nombre": <nombre>,
	"id": <cantidad>
}
```
#### Example Request
```
curl --location --request POST "127.0.0.1:8080/socios" \
  --header "Content-Type: application/json" \
  --data "{
    \"nombre\": \"Socio A\",
    \"id\": 10
}"
```
#### Example Response
- 201 Created
```
{
  "nombre": "Socio A",
  "id": 10
}
```



## POST Prestamo
```
127.0.0.1:8080/prestamos
```
#### Headers
Content-Type application/json

#### Body
```
{
    "idSocio": <idSocio>,
    "idLibro": <idLibro>,
    "dias":    <dias>
}
```
#### Example Request
```
curl --location --request POST "127.0.0.1:8080/prestamos" \
  --header "Content-Type: application/json" \
  --data "{
    \"idSocio\": 1,
    \"idLibro\": 10,
    \"dias\": 10
}"
```
#### Example Response
- Case 200 OK
```
"Prestamo realizado con exito"
```
- Case Socio Adeuda Libros 400 Bad Request
```
"El socio adeuda libros"
```
- Case Sin Ejemplares Disponibles 404 Not Found
```
"No hay ejemplares disponibles para prestamo"
```
## DELETE Libro
```
127.0.0.1:8080/libros/:idLibro
```
#### Headers
Content-Type application/json

#### Path Variables
```
idLibro   <idLibro>
	  ID del Libro a Eliminar
```
### Example Request
```
curl --location --request DELETE "127.0.0.1:8080/libros/10" \
  --header "Content-Type: application/json"
```
### Example Response
- Case Libro Encontrado 200 OK
```
Libro Eliminado
```
- Case Libro No Encontrado 404 Not Found
```
Libro No Encontrado
```
- Case Libro Prestado
```
No se puede eliminar el libro porque hay ejemplares prestados
```
## DELETE Prestamo
```
127.0.0.1:8080/prestamos/:idSocio/:idLibro
```
#### Path Variables:
```
idSocio     <idSocio>
            ID del Socio que devuelve el Libro

idLibro     <idLibro>
            ID del Libro devuelto
```
### Example Request
```
curl --location --request DELETE "127.0.0.1:8080/prestamos/1/10"
```
### Example Response
- Case Libro Devuelto 200 OK
```
Libro devuelto
```
- Case Error al Devolver el Libro 400 Bad Request
```
La operacion no se pudo llevar a cabo
```
## PUT Libro
```
127.0.0.1:8080/libros/:idLibro
```
#### Headers
Content-Type application/json
#### Path Variables
```
idLibro      <idLibro>
	     ID del libro a actualizar la cantidad de ejemplares
```
#### Body
```
{
    "cantidad": 0
}
```

### Example Request
```
curl --location --request PUT "127.0.0.1:8080/libros/10" \
  --header "Content-Type: application/json" \
  --data "{
	\"cantidad\":100
}"
```
### Example Response
- Case Cantidad de Ejemplares Actualizada 200 OK
```
{
  "id": 10,
  "titulo": "Harry Potter",
  "cantidad": 100
}
```
- Case Libro No Encontrado 400 Bad Request
```
"Libro no encontrado"
```
- Case Cantidad nueva menor a la cantidad de libros prestados  400 Bad Request
```
Error: la cantidad de libros es menor a la cantidad de libros prestados"
```

