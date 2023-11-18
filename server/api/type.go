package api

import (
	db "monta_no_mori/db/sqlc"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (server *Server) UploadType(ctx *gin.Context) {
	name := ctx.PostForm("name")
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	fileType := "type"
	urlPath, err := server.UploadToGCS(ctx, file, fileType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	argType := db.CreateTypeParams{
		Name: name,
		Src:  urlPath,
	}

	createdType, err := server.store.CreateType(ctx, argType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"name": createdType.Name,
		"file": createdType.Src,
	})
}
