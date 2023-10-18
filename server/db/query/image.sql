-- name: CreateImage :one
INSERT INTO images (
  title,
  description,
  url
) VALUES (
  $1, $2, $3
) RETURNING *;

-- name: GetImage :one
SELECT * FROM images
WHERE id = $1 LIMIT 1;

-- name: ListImage :many
SELECT * FROM images
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: UpdateImage :one
UPDATE images
SET title = $2 AND description = $3 AND url = $4
WHERE id = $1
RETURNING *;

-- name: DeleteImage :exec
DELETE FROM images
WHERE id = $1;