-- name: CreateImage :one
INSERT INTO images (title, src, type_id, filename)
VALUES ($1, $2, $3, $4)
RETURNING *;
-- name: GetImage :one
SELECT *
FROM images
WHERE id = $1
LIMIT 1;
-- name: GetImageByTitle :one
SELECT *
FROM images
WHERE title = $1
LIMIT 1;
-- name: ListImage :many
SELECT *
FROM images
ORDER BY id DESC
LIMIT $1 OFFSET $2;
-- name: ListFavoriteImage :many
SELECT *
FROM images
WHERE id = ANY(string_to_array($1, ',')::int [])
ORDER BY id DESC;
-- name: ListRandomImage :many
SELECT *
FROM images
ORDER BY RANDOM()
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
ORDER BY id DESC;
-- name: ListImageByType :many
SELECT *
FROM images
WHERE type_id = $1
ORDER BY id DESC;
-- name: CountUpViewCount :one
UPDATE images
SET view_count = view_count + 1
WHERE id = $1
RETURNING view_count;
-- name: CountUpFavoriteCount :one
UPDATE images
SET favorite_count = favorite_count + 1
WHERE id = $1
RETURNING favorite_count;
-- name: CountDownFavoriteCount :one
UPDATE images
SET favorite_count = favorite_count - 1
WHERE id = $1
RETURNING favorite_count;