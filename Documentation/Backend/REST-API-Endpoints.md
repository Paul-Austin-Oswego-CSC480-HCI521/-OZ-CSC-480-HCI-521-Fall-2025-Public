# Kudo Application REST API Endpoints

## Base URL

**Internal microservice**: `http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api`

## Quick Test

**Test the API:**
```bash
curl http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card/test
# Expected: Hello World!
```

## User Management API

### `GET /api/users`
Get all users with optional filtering and pagination.

**Parameters:**
- `role` (query, optional): `STUDENT` or `INSTRUCTOR`
- `limit` (query, optional): Maximum users to return (default: 100)
- `offset` (query, optional): Users to skip (default: 0)

**Example:**
```bash
curl "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/users?role=STUDENT&limit=25"
```

**Response:**
```json
[
  {
    "user_id": "12345678-1234-1234-1234-123456789abc",
    "email": "joker@gotham.com",
    "name": "The Joker",
    "role": "STUDENT"
  }
]
```

### `GET /api/users/{user_id}`
Get a specific user by UUID.

**Parameters:**
- `user_id` (path): User UUID

**Example:**
```bash
curl http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/users/12345678-1234-1234-1234-123456789abc
```

**Response:**
```json
{
  "user_id": "12345678-1234-1234-1234-123456789abc",
  "email": "penguin@gotham.com",
  "name": "The Penguin",
  "role": "STUDENT"
}
```

### `POST /api/users`
Create a new user.

**Request Body:**
```json
{
  "email": "riddler@gotham.com",
  "name": "The Riddler",
  "password": "password123",
  "role": "STUDENT"
}
```

**Example:**
```bash
curl -X POST http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "riddler@gotham.com",
    "name": "The Riddler",
    "password": "password123",
    "role": "STUDENT"
  }'
```

**Response:**
```json
{
  "user_id": "12345678-1234-1234-1234-123456789abc",
  "email": "riddler@gotham.com",
  "name": "The Riddler",
  "role": "STUDENT"
}
```

### `PUT /api/users/{user_id}`
Update an existing user.

**Parameters:**
- `user_id` (path): User UUID

**Request Body:**
```json
{
  "name": "Two-Face",
  "role": "INSTRUCTOR"
}
```

**Example:**
```bash
curl -X PUT http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/users/12345678-1234-1234-1234-123456789abc \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Two-Face",
    "role": "INSTRUCTOR"
  }'
```

**Response:**
```json
{
  "user_id": "12345678-1234-1234-1234-123456789abc",
  "email": "twoface@gotham.com",
  "name": "Two-Face",
  "role": "INSTRUCTOR"
}
```

### `DELETE /api/users/{user_id}`
Delete a user.

**Parameters:**
- `user_id` (path): User UUID

**Example:**
```bash
curl -X DELETE http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/users/87654321-4321-4321-4321-987654321xyz
```

### `GET /kudo-app/api/users/{user_id}/classes`
Retrieve a list of all classes which the user is enrolled in.

Call: GET http://kudos-backend-network:9080/kudo-app/api/users/{user_id}/classes

**Parameters:**
- `user_id` (path): the UUID of the user who's enrolled classes are to be queried
- `enrollment_status` (query): the enrollment_status of the user in the classes to be queried (APPROVED (default), PENDING, DENIED)
- `is_archived` (query): whether or not the given class is archived (default = false)

**Example:**
```bash
curl -X POST http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/users/12345678-1234-1234-1234-123456789abc/classes \
  -H "Content-Type: application/json" \
```

**Response:**
```json
{"class_id":["87654321-4321-4321-4321-987654321xyz"]}
```

## Kudo Card API

### `GET /api/kudo-card/list/sent`
Get list of card IDs sent by a user.

**Parameters:**
- `user_id` (query): User UUID
- `values` : a list of values to get from the record

**Example:**
```bash
curl "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card/list/sent?user_id=12345678-1234-1234-1234-123456789abc"
```

**Response:**
```json
[
  {
    card_id:"X-X-X-X-X",
    ...
  }

  OR (when values is empty)
  
  {
    "card_id":["X-X-X-X-X", ...]
  }
]
```

### `GET /api/kudo-card/list/received`
Get list of card IDs received by a user.

**Parameters:**
- `user_id` (query): User UUID
- `values` : a list of values to get from the record
```

**Example:**
```bash
curl "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card/list/received?user_id=12345678-1234-1234-1234-123456789abc"
```

**Response:**
```json
[
  {
    card_id:"X-X-X-X-X",
    ...
  }
]

OR (when values is empty) 

{
  "card_id":["X-X-X-X-X", ...]
} 
```

### `GET /api/kudo-card/{card_id}`
Get a specific kudo card.

**Parameters:**
- `card_id` (path): Card UUID
- `user_id` (query): Requesting user UUID

**Example:**
```bash
curl "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card/abcd1234-1234-1234-1234-123456789def?user_id=12345678-1234-1234-1234-123456789abc"
```

**Response (recipient view, anonymous):**
```json
{
  "card_id": "abcd1234-1234-1234-1234-123456789def",
  "sender_id": null,
  "recipient_id": "12345678-1234-1234-1234-123456789abc",
  "class_id": "12345678-1234-1234-1234-123456789def",
  "title": "Great work!",
  "content": "You did an excellent job on the presentation.",
  "is_anonymous": true,
  "status": "PENDING",
  "approved_by": null
}
```

### `PATCH /api/kudo-card/{card_id}/markAsRead`

Mark a card as read values.

**Parameters:**

* `card_id` (path): card UUID


**Example:**

```bash
curl -X PATCH "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card/abcd1234-1234-1234-1234-123456789def/markAsRead" \
```

**Response:**
```
202 Accepted
```


### `POST /api/kudo-card`
Create a new kudo card.

**Request Body:**
```json
{
  "sender_id": "87654321-1234-1234-1234-123456789xyz",
  "recipient_id": "12345678-1234-1234-1234-123456789abc",
  "class_id": "12345678-1234-1234-1234-123456789def",
  "title": "Great work!",
  "content": "You did an excellent job on the presentation.",
  "is_anonymous": true
}
```

**Example:**
```bash
curl -X POST http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card \
  -H "Content-Type: application/json" \
  -d '{
    "sender_id": "87654321-1234-1234-1234-123456789xyz",
    "recipient_id": "12345678-1234-1234-1234-123456789abc",
    "class_id": "12345678-1234-1234-1234-123456789def",
    "title": "Great work!",
    "content": "You did an excellent job on the presentation.",
    "is_anonymous": true
  }'
```

**Response:**
```json
{
  "card_id": "abcd1234-1234-1234-1234-123456789def",
  "sender_id": "87654321-1234-1234-1234-123456789xyz",
  "recipient_id": "12345678-1234-1234-1234-123456789abc",
  "class_id": "12345678-1234-1234-1234-123456789def",
  "title": "Great work!",
  "content": "You did an excellent job on the presentation.",
  "is_anonymous": true,
  "status": "PENDING",
  "approved_by": null
}
```

### `DELETE /api/kudo-card/{card_id}`
Delete a kudo card.

**Parameters:**
- `card_id` (path): Card UUID
- `user_id` (query): Requesting user UUID (must be recipient)

**Example:**
```bash
curl -X DELETE "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card/abcd1234-1234-1234-1234-123456789def?user_id=12345678-1234-1234-1234-123456789abc"
```

**Response:**
```
204 No Content
```

### `PATCH /kudo-app/api/kudo-card` 
Update a kudos card to change it's status

**Request Body:**
```json
{
  "card_id":"12345678-1234-1234-1234-123456789abc",
  "status":"PENDING|APPROVED|DENIED|RECEIVED",
  "approved_by":"87654321-4321-4321-4321-987654321xyz"
}
```

**Example:**
```bash
curl -X PATCH http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/kudo-card \
  -H "Content-Type: application/json" \
  -d '{
    "card_id":"12345678-1234-1234-1234-123456789abc",
    "status":"PENDING|APPROVED|DENIED|RECEIVED",
    "approved_by":"87654321-4321-4321-4321-987654321xyz"
  }'
```

**Response:**
```json
{
  "card_id":"12345678-1234-1234-1234-123456789abc",
  "status":"PENDING|APPROVED|DENIED|RECEIVED",
  "approved_by":"87654321-4321-4321-4321-987654321xyz"
}
```

## Classes API

### `POST /api/class`

Create a new class.

**Request:**

```json
{
  "class_name": "Teaching 101",
  "created_by": "Jonny",
  "end_date": "2026-08-24T14:00:00"
}
```

**Example:**

```bash
curl -X POST "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class?class_name=Teaching%20101"
```

**Response:**

```json
{
  "class_id": "12345678-1234-1234-1234-123456789abc",
  "class_name": "Teaching 101",
  "join_code": 123456
}
```


### `PATCH /api/class/{class_id}`

Update a class’s values.

**Parameters:**

* `class_id` (path): Class UUID

**Request Body:**

```json
{
  "end_date": "2025-01-15T10:30:00"
}
```

**Example:**

```bash
curl -X PATCH "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/abcd1234-1234-1234-1234-123456789def" \
  -H "Content-Type: application/json" \
  -d '{
    "end_date": "2025-01-15T10:30:00"
  }'
```

**Response:**

```json
{
  "class_id": "abcd1234-1234-1234-1234-123456789def",
  "class_name": "Teaching 101",
  "join_code": "123456"
}
```

**Status Codes:**

* `200 OK` – Successfully updated class
* `500 Internal Server Error` – Database error



### `PATCH /api/class/{class_id}/regenerateJoinCode`

Regenerate a class’s join code (only if the class has not yet ended).

**Parameters:**

* `class_id` (path): Class UUID

**Example:**

```bash
curl -X PATCH "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/abcd1234-1234-1234-1234-123456789def/regenerateJoinCode"
```

**Response:**

```json
{
  "class_id": "abcd1234-1234-1234-1234-123456789def",
  "join_code": "654321"
}
```

**Status Codes:**

* `200 OK` – Successfully regenerated join code
* `404 Not Found` – Class not found or already ended
* `500 Internal Server Error` – Database error


### `PUT /api/class/{class_id}`

Add students to a class.

**Parameters:**

- `class_id` (path): UUID of the class

**Request Body:**

```json
{
  "user_id": [
    "12345678-1234-1234-1234-123456789abc",
    "87654321-4321-4321-4321-987654321xyz"
  ]
}
```

**Example:**

```bash
curl -X PUT http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/12345678-1234-1234-1234-123456789abc \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": [
      "12345678-1234-1234-1234-123456789abc",
      "87654321-4321-4321-4321-987654321xyz"
    ]
  }'
```

**Response:**

```json
{
  "class_id": "12345678-1234-1234-1234-123456789abc"
}
```

### `GET /api/class/classes`

Retrieve a list of all classes.

**Example:**

```bash
curl http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/classes
```

**Response:**

```json
{
  "class_id": [
    "12345678-1234-1234-1234-123456789abc",
    "87654321-4321-4321-4321-987654321xyz"
  ]
}
```

### `GET /api/class/{class_id}`

Retrieve details of a specific class.

**Parameters:**

- `class_id` (path): UUID of the class

**Example:**

```bash
curl http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/12345678-1234-1234-1234-123456789abc
```

**Response:**

```json
{
  "class": [
    {
      "class_id": "12345678-1234-1234-1234-123456789abc",
      "class_name": "Grifting"
    }
  ]
}
```

### `DELETE /api/class/{class_id}`

Delete a class.

**Parameters:**

- `class_id` (path): UUID of the class to delete

**Example:**

```bash
curl -X DELETE http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/12345678-1234-1234-1234-123456789abc
```

**Response:**

```
200 OK
```

### `DELETE /api/class/{class_id}/{user_id}`

Remove a user from a class.

**Parameters:**

- `class_id` (path): UUID of the class
- `user_id` (path): UUID of user to delete

**Example:**

```bash
curl -X DELETE "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/12345678-1234-1234-1234-123456789abc/87654321-4321-4321-4321-987654321xyz"
```

**Response:**

```
200 OK
```

## Enrollment API

### `POST /api/class/enrollment/request`

Submit a student enrollment request using a class join code.

**Parameters:**

* `join_code` (query): The join code for the class
* `user_id` (query): The UUID of the student requesting enrollment

**Example:**

```bash
curl -X POST "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/enrollment/request?join_code=123456&user_id=abcd1234-1234-1234-1234-123456789def"
```

**Response:**

```json
{
  "message": "Enrollment request submitted successfully",
  "class_name": "Teaching 101",
  "status": "PENDING"
}
```

**Status Codes:**

* `201 Created` – Enrollment request successfully submitted
* `400 Bad Request` – Missing parameters or class has ended / already enrolled
* `404 Not Found` – Invalid or expired join code
* `409 Conflict` – Student already has an enrollment or pending request
* `500 Internal Server Error` – Database error

---

### `GET /api/class/pending-requests`

Retrieve all pending enrollment requests for the instructor’s classes.

**Parameters:**

* `instructor_id` (query): The UUID of the instructor

**Example:**

```bash
curl -X GET "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/pending-requests?instructor_id=abcd1234-1234-1234-1234-123456789def"
```

**Response:**

```json
[
  {
    "user_id": "12345678-1234-1234-1234-123456789abc",
    "class_id": "87654321-4321-4321-4321-987654321xyz",
    "student_name": "John Doe",
    "student_email": "john@example.com",
    "class_name": "Teaching 101"
  }
]
```

**Status Codes:**

* `200 OK` – Successfully retrieved pending requests
* `400 Bad Request` – Missing instructor ID
* `500 Internal Server Error` – Database error

---

### `PATCH /api/class/enrollment/{user_id}/{class_id}`

Approve or deny a pending student enrollment request.

**Parameters:**

* `user_id` (path): The UUID of the student
* `class_id` (path): The UUID of the class
* `action` (query): Either `approve` or `deny`
* `instructor_id` (query): The UUID of the instructor performing the action

**Example:**

```bash
curl -X PATCH "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/enrollment/abcd1234-1234-1234-1234-123456789def/87654321-4321-4321-4321-987654321xyz?action=approve&instructor_id=12345678-1234-1234-1234-123456789abc"
```

**Response:**

```json
{
  "message": "Enrollment request approved successfully",
  "student_name": "John Doe",
  "class_name": "Teaching 101",
  "status": "APPROVED"
}
```

**Status Codes:**

* `200 OK` – Enrollment request successfully updated
* `400 Bad Request` – Invalid or missing action/instructor ID
* `403 Forbidden` – Instructor not authorized to modify this class
* `404 Not Found` – Pending enrollment request not found or class not found
* `500 Internal Server Error` – Database error


### `GET /api/class/{class_id}/users`

Retrieve the roster (list of users) for a specific class.

**Parameters:**

* `class_id` (path): Class UUID
* `enrollment_status` (query, optional): Filter users by enrollment status. Must be one of:

    * `PENDING`
    * `APPROVED`
    * `DENIED`
      If omitted, defaults to `APPROVED`.

**Example:**

```bash
curl -X GET "http://kudos-backend-network:${BACKEND_HTTP_PORT}/kudo-app/api/class/abcd1234-1234-1234-1234-123456789def/users?enrollment_status=APPROVED"
```

**Response:**

```json
[
  {
    "id": "12345678-1234-1234-1234-123456789abc",
    "name": "John Doe"
  },
  {
    "id": "87654321-4321-4321-4321-987654321xyz",
    "name": "Jane Smith"
  }
]
```

**Status Codes:**

* `200 OK` – Successfully retrieved class roster
* `400 Bad Request` – Invalid `enrollment_status` value
* `500 Internal Server Error` – Database error
