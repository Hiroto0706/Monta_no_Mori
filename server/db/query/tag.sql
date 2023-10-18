-- name: CreateTag :one
INSERT INTO tags (
  name,
  image_id
) VALUES (
  $1, $2
) RETURNING *;

-- name: GetTag :one
SELECT * FROM tags
WHERE id = $1 LIMIT 1;

-- name: GetTagByImageID :one
SELECT * FROM tags
WHERE image_id = $1 LIMIT 1;

-- name: ListTag :many
SELECT * FROM tags
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: UpdateTag :one
UPDATE tags
SET name = $2
WHERE id = $1
RETURNING *;

-- name: DeleteTag :exec
DELETE FROM tags
WHERE id = $1;