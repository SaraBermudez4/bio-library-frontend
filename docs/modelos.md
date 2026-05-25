# Modelos de Datos

## User
```json
{
  "id": 10,
  "dni": "1020100001",
  "name": "Carlos",
  "lastName": "García",
  "email": "carlos.garcia@itm.edu.co",
  "phoneNumber": "+573012345678",
  "role": "STUDENT",
  "university": "ITM",
  "carnet": "20210001",
  "gpa": 3.5,
  "hasSanction": false,
  "sanctionEndDate": "2026-08-01",
  "activeLoans": 0
}
```

## Book (frontend)
```json
{
  "id": "b1",
  "isbn": "9780134494166",
  "title": "Clean Architecture",
  "author": { "name": "Robert", "lastName": "Martin" },
  "category": "SOFTWARE_ENGINEERING",
  "synopsis": "Principios de arquitectura de software...",
  "pdfUrl": "https://...",
  "coverImageUrl": "https://...",
  "license": {
    "maxConcurrentLoans": 5,
    "activeLoanCount": 2
  }
}
```

## Book (respuesta backend catalog)
```json
{
  "id": "b1",
  "isbn": "9780134494166",
  "title": "Clean Architecture",
  "author": "Robert Martin",
  "category": "SOFTWARE_ENGINEERING",
  "description": "Principios de arquitectura de software...",
  "pdfUrl": "https://...",
  "imagenUrl": "https://...",
  "totalLicenses": 5,
  "availableLicenses": 3
}
```

## Loan
```json
{
  "id": 1,
  "studentId": 10,
  "bookId": "b1",
  "startDate": "2026-05-16",
  "endDate": "2026-05-26",
  "hasUsed": false,
  "active": true
}
```
---