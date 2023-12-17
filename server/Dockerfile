FROM golang:1.21-alpine3.18 AS builder
WORKDIR /app
COPY . .
RUN go build -o /build/main main.go

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /build/main /usr/local/bin/main
COPY app.env .
COPY credential.json .
COPY db/migration ./db/migration

EXPOSE 8080
CMD [ "/usr/local/bin/main" ]