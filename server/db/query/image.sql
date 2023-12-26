-- name: CreateImage :one
INSERT INTO images (title, src, type_id, filename)
VALUES ($1, $2, $3, $4)
RETURNING *;
-- name: GetImage :one
SELECT *
FROM images
WHERE id = $1
LIMIT 1;
-- name: ListImage :many
SELECT *
FROM images
ORDER BY id DESC
LIMIT $1 OFFSET $2;
-- name: UpdateImage :one
UPDATE images
SET title = $2,
  src = $3,
  type_id = $4,
  filename = $5
WHERE id = $1
RETURNING *;
-- name: DeleteImage :exec
DELETE FROM images
WHERE id = $1;
-- name: ListImageByTitle :many
SELECT *
FROM images
WHERE title LIKE '%' || COALESCE(sqlc.arg(title)) || '%'
ORDER BY id DESC
LIMIT $1 OFFSET $2;
-- name: ListImageByType :many
SELECT *
FROM images
WHERE type_id = $1
ORDER BY id DESC
LIMIT $2 OFFSET $3;