# Biblioteca - API REST

## Tabla de contenidos
[Descripción](#Descripción)  
[Escenario](#Escenario)  
[Socios](#Get---listAllPartners)  
[Libros](#GET---listAllBooks)  
[Préstamos](#GET---listAllLoans)  
[Control de tiempo](#POST---modifyTime)

# 
## Descripción
Esta es una API REST desarrollada en node.js para controlar el funcionamiento de una biblioteca con socios.
## Escenario
La biblioteca posee una base de datos de socios (*partners*) y otra de libros (*books*), de las cuales se pueden realizar operaciones de consulta, creación y eliminación.
Los socios pueden pedir prestados cuantos libros quieran por determinado tiempo, vencido el cual ya no pueden llevarse más hasta devolver los que se hayan pasado de fecha.

## Endpoints
#### GET - listAllPartners()
>localhost:5555/partners/

**Response code:** 200
**Response body:**

    [
	    {
        	"name": "john",
        	"surname": "doe",
        	"id": 1
	    },
	    ...
    ]

### GET - getPartner()
>localhost:5555/partners/{id}

|  | OK| No encontrado | ID no válido |
|--|--|--|--|
| Response code | 200 | 404 | 400 |
| Response body| 1*| 2*| 3* |


**Response body: (1)**

    {	
        "name": "john",
        "surname": "doe",
        "id": 1
	}
**Response body: (2)**

    {
	    "message": "The partner doesn't exist."
	}
**Response body: (3)**

    {
	    "message": "Invalid id."
	}
### POST - addPartner()
>localhost:5555/partners/

**Request body:**

    {	
        "name": "john",
        "surname": "doe",
        "id": 1
	}
|  | OK | Datos inválidos | Conflicto |
|--|--|--|--|
| Response code | 200 | 404 | 409 |
| Response body| 1*| 2*| 3* |

**Response body: (1)**

    {	
	    "message": "Created.",
        "name": "john",
        "surname": "doe",
        "id": 1
	}

**Response body: (2)**

    {	
	    "message": "Invalid data."
	}
**Response body: (3)**

    {
	    "message": "The partner already exist."
	}
### DELETE- deletePartner()
>localhost:5555/partners/{id}

|  | OK| No encontrado | ID no válido |
|--|--|--|--|
| Response code | 200 | 404 | 400 |
| Response body| 1*| 2*| 3* |


**Response body: (1)**

    {	
        "message": "Deleted."
	}
**Response body: (2)**

    {
	    "message": "The partner doesn't exist."
	}
**Response body: (3)**

    {
	    "message": "Invalid id."
	}
### GET - listAllBooks()
>localhost:5555/books/

**Response code:** 200
**Response body:**

    [
	    {
	        "title": "The beauty and the beast",
	        "author": "Gabrielle-Suzanne Barbot de Villeneuve",
	        "inventory": 2
	        "id": 1
	    },
	    ...
    ]
    
### GET - getBook()
>localhost:5555/boooks/{id}

|  | OK| No encontrado | ID no válido |
|--|--|--|--|
| Response code | 200 | 404 | 400 |
| Response body| 1*| 2*| 3* |


**Response body: (1)**

    {
	    "title": "The beauty and the beast",
	    "author": "Gabrielle-Suzanne Barbot de Villeneuve",
	    "inventory": 2
	    "id": 1
	}
**Response body: (2)**

    {
	    "message": "The book doesn't exist."
	}
**Response body: (3)**

    {
	    "message": "Invalid id."
	}
### POST - addBook()
>localhost:5555/books/

**Request body:**

    {	
        "title": "Pinocho",
        "author": "Carlo Collodi",
        "id": 2
	}
|  | Libro nuevo | Libro existente  | Datos inválidos|
|--|--|--|--|
| Response code | 201 | 200 | 404 |
| Response body| 1* | 2* | 3* |

**Response body: (1)**

    {
	    "message": "Book added to collection."
	}

**Response body: (2)**

    {	
	    "message": "Book added to inventory."
	}
**Response body: (3)**

    {
	    "message": "Invalid data."
	}
### DELETE- deleteBook()
>localhost:5555/books/{id}

|  | OK| Inventario vacío | ID no válido |
|--|--|--|--|
| Response code | 200 | 404 | 400 |
| Response body| 1*| 2*| 3* |


**Response body: (1)**

    {	
        "message": "Deleted."
	}
**Response body: (2)**

    {
	    "message": "The inventory of this book is empty."
	}
**Response body: (3)**

    {
	    "message": "Invalid id."
	}
### GET - listAllLoans()
>localhost:5555/loans/

**Response code:** 200
**Response body:**

    [
	    {
	        "partner": 7,
	        "book": 3,
	        "expiration_date": "2019-05-19T13:38:16.812Z"
	    },
	    ...
    ]
### GET - lentBook()
>localhost:5555/boooks/{id}

**Request body:**

    {
		"Bid": 3,
		"Pid": 7
	}
	
|  | OK| En deuda | Socio inexistente | Sin inventario | Libro inexistente | Datos inválidos |
|--|--|--|--|--|--|--|
| Response code | 200 | 400| 404 | 404 | 404 | 400 |
| Response body| 1*| 2*| 3* | 4* | 5* | 6* |


**Response body: (1)**

    {
	    "message": "Book lent.",
	    "expiration_date": "2019-05-19T13:38:16.812Z"
	}
**Response body: (2)**

    {
	    "message": "The partner has overdue debts.",
	}
**Response body: (3)**

    {
	    "message": "The partner doesn't exist."
	}
**Response body: (4)**

    {
	    "message": "The inventory of this book is empty."
	}
**Response body: (5)**

    {
	    "message": "The book doesn't exist."
	}
**Response body: (6)**

    {
	    "message": "Invalid data."
	}
### POST- lentBook()
>localhost:5555/boooks/{id}

|  | OK| En deuda | Socio inexistente | Sin inventario | Libro inexistente | Datos inválidos |
|--|--|--|--|--|--|--|
| Response code | 200 | 400| 404 | 404 | 404 | 400 |
| Response body| 1*| 2*| 3* | 4* | 5* | 6* |


**Response body: (1)**

    {
	    "message": "Book lent.",
	    "expiration_date": "2019-05-19T13:38:16.812Z"
	}
**Response body: (2)**

    {
	    "message": "The partner has overdue debts.",
	}
**Response body: (3)**

    {
	    "message": "The partner doesn't exist."
	}
**Response body: (4)**

    {
	    "message": "The inventory of this book is empty."
	}
**Response body: (5)**

    {
	    "message": "The book doesn't exist."
	}
**Response body: (6)**

    {
	    "message": "Invalid data."
	}
### POST- returnBook()
>localhost:5555/boooks/{id}

|  | OK| Libro o socio incorrectos | Socio inexistente | Libro inexistente | Datos inválidos |
|--|--|--|--|--|--|
| Response code | 200 | 404| 404 | 404 | 400 |
| Response body| 1*| 2*| 3* | 4* | 5* |


**Response body: (1)**

    {
	    "message": "Book returned."
	}
**Response body: (2)**

    {
	    "message": "The partner doesn't have that book.",
	}
**Response body: (3)**

    {
	    "message": "The partner doesn't exist."
	}
**Response body: (4)**

    {
	    "message": "The book doesn't exist."
	}
**Response body: (5)**

    {
	    "message": "Invalid data."
	}

### POST - modifyTime()
>localhost:5555/time/

Endpoint utilizado para testing, permite movernos hacia adelante y hacia atrás en el tiempo para forzar el vencimiento de los préstamos.
**Request body:**

    {	
        "days": 7
	}
|  | OK| Valor inválido |
|--|--|--|
| Response code | 200 | 400 |
| Response body| 1*| 2*|


**Response body: (1)**

    {
	    "message": "Time changed.",
	    "new_time": "2019-05-09T00:00:00.000Z"
	}
**Response body: (2)**

    {
	    "message": "Invalid value."
	}
