DB_URL=postgresql://root:secret@localhost:5432/monta_no_mori?sslmode=disable

postgres:
	docker run --name monta_no_mori-db -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:14-alpine

access:
	docker exec -it monta_no_mori-db psql -U root

createdb:
	docker exec -it monta_no_mori-db createdb --username=root --owner=root monta_no_mori

dropdb:
	docker exec -it monta_no_mori-db dropdb monta_no_mori

migrateup:
	migrate -path server/db/migration -database "$(DB_URL)" -verbose up

migratedown:
	migrate -path server/db/migration -database "$(DB_URL)" -verbose down

sqlc:
	cd server/ && sqlc generate

server:
	cd server/ && go run main.go

dc-up:
	docker compose up

dc-down:
	docker compose down

.PHONY: postgres createdb dropdb migrateup migratedown access server dc-up dc-down sqlc