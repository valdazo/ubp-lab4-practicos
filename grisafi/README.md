# REST API LIBRARY

# About

API manages a library's list of members, books and loans

# Requests

## Get */books/* 
>Obtain all the books
>```css
>localhost:8080/books
>```
>#### Example Request
>>```js
>>curl --location --request GET "localhost:8080/libros"
>>```
>#### Example Response
>>```json
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
>>```

## GET */books/:id*
>```css
>localhost:8080/books/:id
>```
>**Path Variables:**
>>```css
>>id:        id of the book to be searched
>>```
>#### Example Response:
>- ***Case* 200 OK** 
>>```json
>>{
>>    "data": {
>>        "bookId": 10,
>>        "title": "Harry Potter",
>>        "available": 100
>>    }
>>}
>>```
>- ***Case* 404 Not Found** 
>>```json
>>{
>>    "error": {
>>        "code": 404,
>>        "message": "book not found"
>>    }
>>}
>>```

## POST */books/*
>```css
>localhost:8080/books
>```
>#### Body
>>```json
>>{
>>	"id":100,
>>	"title":"Don Quijote",
>>	"quantity":100
>>}
>>```
>#### Example Request
>>```js
>>curl --location --request POST "localhost:8080/books"
>>```
>#### Example Response
>>- **201 Created**
>>>```json
>>>{
>>>    "status": "success",
>>>    "message": "book added"
>>>}
>>>```
>>- **404 Bad Request**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "there's already another book with that id"
>>>    }
>>>}
>>>```

## DELETE */book/*
>```css
>localhost:8080/books/:id
>```
>#### Path Variables
>>```css
>>id: ID of the book to be deleted
>>```
>### **Example Request**
>>```
>>curl --location --request DELETE "localhost:8080/books/10" \
>>```
>### **Example Response**
>>- **Case 200 OK**
>>>```json
>>>{
>>>    "success": true,
>>>    "message": "book deleted"
>>>}
>>>```
>>- **404 Not Found**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "book not found"
>>>    }
>>>}
>>>```
>>- **Case 403 Forbidden**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 403,
>>>        "message": "cannot delete the book due to there >>>are borrowed copies"
>>>    }
>>>}
>>>```

## PUT */books/:id*
>```css
>localhost:8080/libros/:idLibro
>```
>#### Path Variables
>>```css
>>id: ID of the book to update amount of copies
>>```
>#### Body
>>```json
>>{
>>	"bookId":100,
>>	"quantity":20
>>}
>>```
>### Example Request
>>```
>>curl --location --request PUT "127.0.0.1:8080/libros/10"
>>```
>### Example Response
>- **Case 200 OK**
>>```json
>>{
>>    "status": "success",
>>    "message": "amount of copies of book with id: {id} updated successfully"
>>}
>>```
>- **Case 404 Not Found**
>>```json
>>{
>>    "error": {
>>        "code": 404,
>>        "message": "book not found"
>>    }
>>}
>>```
>- **Case 403 Forbidden**
>>```json
>>{
>>    "error": {
>>        "code": 400,
>>        "message": "wrong amount of books"
>>    }
>>}
>>```

## GET */members/*
>Obtain all the library's members
>```css
>localhost:8080/members
>```
>#### Example Request
>>```
>>curl --location --request GET "127.0.0.1:8080/socios"
>>```
>#### Example Response 
>- **200 OK**
>>```json
>>{
>>    "data": [
>>        {
>>            "id": 1,
>>            "name": "A"
>>        },
>>        {
>>            "id": 2,
>>            "name": "B"
>>        }
>>    ]
>>}
>>```

## GET */members/:id*
>```
>localhost:8080/members/:id
>```
>**Path Variables:**
>>```css
>>id: id of the member to search
>>```
>#### Example Request
>>```
>>curl --location --request GET "127.0.0.1:8080/members/0"
>>```
>### Example Response
>- **Case 200 OK**
>>```json
>>{
>>    "data": {
>>        "id": 1,
>>        "name": "A"
>>    }
>>}
>>```
>- **Case 404 Not Found**
>>```json
>>{
>>    "error": {
>>        "code": 404,
>>        "message": "Member not found"
>>    }
>>}
>>```

## POST */member/*
>```css
>localhost:8080/socios
>```
>#### Body
>>```json
>>{
>>	"id":3,
>>	"name":"member 3"
>>}
>>```
>#### Example Request
>>```
>>curl --location --request POST "127.0.0.1:8080/socios" \
>>```
>#### Example Response
>- **201 Created**
>>```json
>>{
>>    "data": {
>>        "id": 3,
>>        "name": "member 3"
>>    },
>>    "message": "Member with id 3 created successfully"
>>}
>>```



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

