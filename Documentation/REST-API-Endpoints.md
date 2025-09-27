# Kudo Application REST API Endpoints

## Base URL

**Internal microservice**: `http://kudos-app:${APP_HTTP_PORT}/kudo-app/api`

## Quick Test

**Test the API:**
```bash
curl http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/kudo-card/test
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
curl "http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/users?role=STUDENT&limit=25"
```

**Response:**
```json
[
  {
    "userId": "12345678-1234-1234-1234-123456789abc",
    "email": "joker@gotham.com",
    "name": "The Joker",
    "role": "STUDENT"
  }
]
```

### `GET /api/users/{id}`
Get a specific user by UUID.

**Parameters:**
- `id` (path): User UUID

**Example:**
```bash
curl http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/users/12345678-1234-1234-1234-123456789abc
```

**Response:**
```json
{
  "userId": "12345678-1234-1234-1234-123456789abc",
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
curl -X POST http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/users \
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
  "userId": "12345678-1234-1234-1234-123456789abc",
  "email": "riddler@gotham.com",
  "name": "The Riddler",
  "role": "STUDENT"
}
```

### `PUT /api/users/{id}`
Update an existing user.

**Parameters:**
- `id` (path): User UUID

**Request Body:**
```json
{
  "name": "Two-Face",
  "role": "INSTRUCTOR"
}
```

**Example:**
```bash
curl -X PUT http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/users/12345678-1234-1234-1234-123456789abc \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Two-Face",
    "role": "INSTRUCTOR"
  }'
```

**Response:**
```json
{
  "userId": "12345678-1234-1234-1234-123456789abc",
  "email": "twoface@gotham.com",
  "name": "Two-Face",
  "role": "INSTRUCTOR"
}
```

### `DELETE /api/users/{id}`
Delete a user.

**Parameters:**
- `id` (path): User UUID

**Example:**
```bash
curl -X DELETE http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/users/87654321-4321-4321-4321-987654321xyz
```

## Kudo Card API


### `GET /api/kudo-card/list/sent`
Get list of card IDs sent by a user.

**Parameters:**
- `user_id` (query): User UUID

**Example:**
```bash
curl "http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/kudo-card/list/sent?user_id=12345678-1234-1234-1234-123456789abc"
```

**Response:**
```json
{
  "card_id": [
    "abcd1234-1234-1234-1234-123456789def",
    "abcd1234-1234-1234-1234-123456789ghi"
  ]
}
```

### `GET /api/kudo-card/list/received`
Get list of card IDs received by a user.

**Parameters:**
- `user_id` (query): User UUID

**Example:**
```bash
curl "http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/kudo-card/list/received?user_id=12345678-1234-1234-1234-123456789abc"
```

**Response:**
```json
{
  "card_id": [
    "abcd1234-1234-1234-1234-123456789jkl",
    "abcd1234-1234-1234-1234-123456789mno"
  ]
}
```

### `GET /api/kudo-card/{card_id}`
Get a specific kudo card.

**Parameters:**
- `card_id` (path): Card UUID
- `user_id` (query): Requesting user UUID

**Example:**
```bash
curl "http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/kudo-card/abcd1234-1234-1234-1234-123456789def?user_id=12345678-1234-1234-1234-123456789abc"
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
  "isAnonymous": true,
  "status": "PENDING",
  "approvedBy": null
}
```

### `POST /api/kudo-card`
Create a new kudo card.

**Request Body:**
```json
{
  "senderId": "87654321-1234-1234-1234-123456789xyz",
  "recipientId": "12345678-1234-1234-1234-123456789abc",
  "classId": "12345678-1234-1234-1234-123456789def",
  "title": "Great work!",
  "content": "You did an excellent job on the presentation.",
  "isAnonymous": true
}
```

**Example:**
```bash
curl -X POST http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/kudo-card \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "87654321-1234-1234-1234-123456789xyz",
    "recipientId": "12345678-1234-1234-1234-123456789abc",
    "classId": "12345678-1234-1234-1234-123456789def",
    "title": "Great work!",
    "content": "You did an excellent job on the presentation.",
    "isAnonymous": true
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
  "isAnonymous": true,
  "status": "PENDING",
  "approvedBy": null
}
```

### `DELETE /api/kudo-card/{card_id}`
Delete a kudo card.

**Parameters:**
- `card_id` (path): Card UUID
- `user_id` (query): Requesting user UUID (must be recipient)

**Example:**
```bash
curl -X DELETE "http://kudos-app:${APP_HTTP_PORT}/kudo-app/api/kudo-card/abcd1234-1234-1234-1234-123456789def?user_id=12345678-1234-1234-1234-123456789abc"
```

**Response:**
```
204 No Content
```
