-- name: CreateSession :one
INSERT INTO sessions (
    id,
    username,
    email,
    refresh_token,
    expires_at
  )
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetSession :one
SELECT *
FROM sessions
WHERE id = $1
LIMIT 1;