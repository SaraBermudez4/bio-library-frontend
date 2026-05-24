# Modelos de Datos

## User
```json
{
  "id": 10,
  "dni": "1020100001",
  "email": "carlos.garcia@itm.edu.co",
  "phoneNumber": "+573012345678",
  "role": "STUDENT | ADMIN",
  "university": "ITM",
  "carnet": "20210001",
  "gpa": 3.5,
  "hasSanction": false,
  "sanctionEndDate": "2026-05-20T00:00:00",
  "activeLoans": 0
}
```

## Book
```json
{
  "id": "b1",
  "title": "Clean Architecture",
  "author": { "name": "Robert", "lastName": "Martin" },
  "isbn": "9780134494166",
  "synopsis": "Principios de arquitectura de software...",
  "pdfUrl": "https://...",
  "coverImageUrl": "https://...",
  "license": {
    "maxConcurrentLoans": 5,
    "activeLoanCount": 2
  },
  "active": true
}
```

## Loan
```json
{
  "id": 1,
  "studentId": 10,
  "bookId": "b1",
  "startDate": "2026-05-16T12:00:00",
  "endDate": "2026-05-26T12:00:00",
  "hasUsed": false,
  "active": true
}
```
---