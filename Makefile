DB_URL=postgresql://root:secret@localhost:5432/monta_no_mori?sslmode=disable

postgres:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:14-alpine

access:
	docker exec -it postgres psql -U root

createdb:
	docker exec -it postgres createdb --username=root --owner=root monta_no_mori

dropdb:
	docker exec -it postgres dropdb monta_no_mori

migrateup:
	migrate -path server/db/migration -database "$(DB_URL)" -verbose up

migratedown:
	migrate -path server/db/migration -database "$(DB_URL)" -verbose down

sqlc:
	cd server/ && sqlc generate

.PHONY: postgres createdb dropdb migrateup migratedown access