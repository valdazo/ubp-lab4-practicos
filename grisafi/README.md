# REST API LIBRARY

# About

API manages a library's list of members, books and loans

# Requests

## **Get */books/***
>Obtain all the books
>```css
>localhost:8080/books
>```
>### **Example Response**
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

## **GET */books/:id***
>```css
>localhost:8080/books/:id
>```
>**Path Variables:**
>>```css
>>id:        id of the book to be searched
>>```
>### **Example Response**
>>- ***Case* 200 OK** 
>>>```json
>>>{
>>>    "data": {
>>>        "bookId": 10,
>>>        "title": "Harry Potter",
>>>        "available": 100
>>>    }
>>>}
>>>```
>>- ***Case* 404 NOT FOUND** 
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "book not found"
>>>    }
>>>}
>>>```

## **POST */books/***
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
>### **Example Response**
>>- **201 Created**
>>>```json
>>>{
>>>    "status": "success",
>>>    "message": "book added"
>>>}
>>>```
>>- **400 Wrong Parameters BAD REQUEST**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 400,
>>>        "message": "wrong parameters"
>>>    }
>>>}
>>>```
>>- **400 Wrong ID BAD REQUEST**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 400,
>>>        "message": "there's already another book with that id"
>>>    }
>>>}
>>>```

## **DELETE */book/***
>```css
>localhost:8080/books/:id
>```
>#### Path Variables
>>```css
>>id: ID of the book to be deleted
>>```
>### **Example Response**
>>- **Case 200 OK**
>>>```json
>>>{
>>>    "success": true,
>>>    "message": "book deleted"
>>>}
>>>```
>>- **404 NOT FOUND**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "book not found"
>>>    }
>>>}
>>>```
>>- **Case 403 FORBIDDEN**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 403,
>>>        "message": "cannot delete the book due to there are borrowed copies"
>>>    }
>>>}
>>>```

## **PUT */books/:id***
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
>### **Example Response**
>>- **Case 200 OK**
>>>```json
>>>{
>>>    "status": "success",
>>>    "message": "amount of copies of book with id: {id} updated successfully"
>>>}
>>>```
>>- **Case 404 NOT FOUND**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "book not found"
>>>    }
>>>}
>>>```
>>- **Case 403 FORBIDDEN**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 400,
>>>        "message": "wrong amount of books"
>>>    }
>>>}
>>>```
>>- **Case 400 BAD REQUEST**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 400,
>>>        "message": "wrong parameters"
>>>    }
>>>}
>>>```

## **GET */members/***
>Obtain all the library's members
>```css
>localhost:8080/members
>```
>### **Example Response**
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

## **GET */members/:id***
>```css
>localhost:8080/members/:id
>```
>**Path Variables:**
>>```css
>>id: id of the member to search
>>```
>### **Example Response**
>>- **Case 200 OK**
>>>```json
>>>{
>>>    "data": {
>>>        "id": 1,
>>>        "name": "A"
>>>    }
>>>}
>>>```
>>- **Case 404 NOT FOUND**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "Member not found"
>>>    }
>>>}
>>>```

## **POST */member/***
>```css
>localhost:8080/members
>```
>#### Body
>>```json
>>{
>>	"id":3,
>>	"name":"member 3"
>>}
>>```
>### **Example Response**
>>```json
>>{
>>    "data": {
>>        "id": 3,
>>        "name": "member 3"
>>    },
>>    "message": "Member with id 3 created successfully"
>>}
>>```

## **GET */loans/***
>```css
>localhost:8080/loans
>```
>### **Example Response**
>>```json
>>{
>>    "data": [
>>        {
>>            "id": 1,
>>            "memberId": 1,
>>            "bookId": 10,
>>            "expiracyDate": 1567900080238
>>        },
>>        {
>>            "id": 2,
>>            "memberId": 2,
>>            "bookId": 10,
>>            "expiracyDate": 1567900080238
>>        }
>>    ]
>>}
>>```

## **GET */loans/:id***
>Obtains all the loans made by a member via his id
>```css
>localhost:8080/loans/:id
>```
>**Path Variables:**
>```css
>id: member's id to search all the loans made by him
>```
>### **Example Response**
>- ***Case* 200 OK**
>>```json
>>{
>>    "data": [
>>        {
>>            "bookId": 10,
>>            "expiracyDate": "2019-09-07T23:48:00.238Z"
>>        }
>>    ]
>>}
>>```
>- ***Case* 404 NOT FOUND**
>>```json
>>{
>>    "error": {
>>        "code": 404,
>>        "message": "Member not found"
>>    }
>>}
>>```

## **POST */loans/***
>```css
>localhost:8080/loans
>```
>### **Body**
>>```json
>>{
>>	"memberId":1,
>>	"bookId":10,
>>	"days":5
>>}
>>```
>### **Example Response**
>>- **Case 200 OK**
>>>```json
>>>{
>>>    "success": true,
>>>    "message": "loan of book with id {id} created successfully"
>>>}
>>>```
>>- **Case Member has Unreturned Books**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 400,
>>>        "message": "member {id} has unreturned books"
>>>    }
>>>}
>>>```
>>- **Case Wrong Days**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 400,
>>>        "message": "wrong number of days"
>>>    }
>>>}
>>>```
>>- **Case No Available Copies**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 400,
>>>        "message": "there are no available copies of Book {id} available for loan"
>>>    }
>>>}
>>>```
>>- **Case 404 Member NOT FOUND**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "member not found"
>>>    }
>>>}
>>>```
>>- **Case 404 Book NOT FOUND**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "book not found"
>>>    }
>>>}
>>>```




## **DELETE */loans/:id***
>```css
>localhost:8080/loans/:id
>```
>### **Path Variables**
>```css
>id: loan id to be deleted
>```
>### **Example Response**
>>- **Case 200 OK**
>>>```json
>>>{
>>>    "status": "success",
>>>    "message": "loan deleted successfully"
>>>}
>>>```
>>- **Case 404 NOT FOUND**
>>>```json
>>>{
>>>    "error": {
>>>        "code": 404,
>>>        "message": "loan not found"
>>>    }
>>>}
>>>```