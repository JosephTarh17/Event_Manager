# Event API

Base URL:

```text
http://localhost:5000
```

## Health and API information

### GET /api/health

Returns API health status.

Example response:

```json
{
  "status": "ok"
}
```

### GET /

Returns a short API description and main endpoint paths.

## Event endpoints

Resource collection:

```text
/api/events
```

### GET /api/events

Returns all events, sorted by date.

Example response:

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Design Team Workshop",
    "description": "A planning workshop.",
    "date": "2027-08-20T00:00:00.000Z",
    "topic": "Workshop",
    "budget": 850,
    "status": "Planning",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  }
]
```

### POST /api/events

Creates an event.

Example body:

```json
{
  "title": "Design Team Workshop",
  "description": "A planning workshop.",
  "date": "2027-08-20",
  "topic": "Workshop",
  "budget": 850,
  "status": "Planning"
}
```

Returns:
- `201` when created
- `400` for invalid or missing fields

### GET /api/events/:id

Returns one event.

Returns:
- `200` with the event
- `400` for an invalid MongoDB ID
- `404` when the event does not exist

### PUT /api/events/:id

Updates an event. Validation is run by Mongoose.

Example body:

```json
{
  "title": "Updated Team Workshop",
  "status": "Confirmed",
  "budget": 900
}
```

Returns:
- `200` with the updated event
- `400` for an invalid ID or invalid fields
- `404` when the event does not exist

### DELETE /api/events/:id

Deletes an event.

Returns:
- `204` when deleted
- `400` for an invalid MongoDB ID
- `404` when the event does not exist

## Validation Rules

- `title`: required
- `topic`: required
- `date`: required
- `budget`: required number and cannot be negative
- `status`: required enum; `Planning` or `Confirmed`
- `description`: optional and defaults to an empty string

## Error Response

Example:

```json
{
  "message": "Event validation failed: status: `NotAValidStatus` is not a valid enum value for path `status`."
}
```
