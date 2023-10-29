FROM golang:1.21-alpine3.18

RUN apk update && apk add git

COPY ./server/go.mod ./app
COPY ./server/go.sum ./app

WORKDIR /app

COPY ./server .

RUN go build -o main main.go

CMD [ "/app/main" ]