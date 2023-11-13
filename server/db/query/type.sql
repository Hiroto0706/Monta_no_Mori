-- name: CreateType :one
INSERT INTO types (name, src)
VALUES ($1, $2)
RETURNING *;

-- name: GetType :one
SELECT *
FROM types
WHERE id = $1
LIMIT 1;

-- name: GetTypeByName :one
SELECT *
FROM types
WHERE name = $1
LIMIT 1;

-- name: ListType :many
SELECT *
FROM types
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: UpdateType :one
UPDATE types
SET name = $2
  AND src = $3
WHERE id = $1
RETURNING *;

-- name: DeleteType :exec
DELETE FROM types
WHERE id = $1;