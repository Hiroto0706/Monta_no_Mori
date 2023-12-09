CREATE TABLE "users" (
  "username" varchar PRIMARY KEY,
  "hashed_password" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY,
  "username" varchar NOT NULL,
  "email" varchar NOT NULL,
  "refresh_token" varchar NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT 'now()'
);
CREATE TABLE "images" (
  "id" bigserial PRIMARY KEY,
  "title" varchar NOT NULL,
  "src" varchar NOT NULL,
  "type_id" bigint NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT 'now()',
  "created_at" timestamptz NOT NULL DEFAULT 'now()'
);
CREATE TABLE "types" (
  "id" bigserial PRIMARY KEY,
  "name" varchar NOT NULL,
  "src" varchar NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT 'now()',
  "created_at" timestamptz NOT NULL DEFAULT 'now()'
);
CREATE TABLE "categories" (
  "id" bigserial PRIMARY KEY,
  "name" varchar NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT 'now()',
  "created_at" timestamptz NOT NULL DEFAULT 'now()'
);
CREATE TABLE "image_categories" (
  "id" bigserial PRIMARY KEY,
  "image_id" bigint NOT NULL,
  "category_id" bigint NOT NULL
);
CREATE UNIQUE INDEX ON "image_categories" ("image_id", "category_id");
ALTER TABLE "sessions"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "images"
ADD FOREIGN KEY ("type_id") REFERENCES "types" ("id");
ALTER TABLE "image_categories"
ADD FOREIGN KEY ("image_id") REFERENCES "images" ("id");
ALTER TABLE "image_categories"
ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");