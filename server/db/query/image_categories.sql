-- name: CreateImageCategory :one
INSERT INTO image_categories (image_id, category_id)
VALUES ($1, $2)
RETURNING *;
-- name: GetImageCategory :one
SELECT *
FROM image_categories
WHERE image_id = $1
  AND category_id = $2
LIMIT 1;
-- name: ListImageCategoriesByImage :many
SELECT *
FROM image_categories
WHERE image_id = $1
ORDER BY category_id;
-- name: ListImageCategoriesByCategory :many
SELECT *
FROM image_categories
WHERE category_id = $1
ORDER BY image_id;
-- name: UpdateImageCategory :exec
UPDATE image_categories
SET category_id = $2
WHERE image_id = $1;
-- name: DeleteImageCategory :exec
DELETE FROM image_categories
WHERE image_id = $1
  AND category_id = $2;
-- name: DeleteImageCategoryByImageID :exec
DELETE FROM image_categories
WHERE image_id = $1;