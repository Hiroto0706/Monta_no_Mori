package api

import (
	"database/sql"
	db "monta_no_mori/db/sqlc"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

const FILE_TYPE = "type"

func (server *Server) ListTypes(ctx *gin.Context) {
	arg := db.ListTypeParams{
		Limit:  100,
		Offset: 0,
	}
	types, err := server.store.ListType(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "type list",
		"types":   types,
	})
}

func (server *Server) UploadType(ctx *gin.Context) {
	name := ctx.PostForm("name")
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	urlPath, err := server.UploadToGCS(ctx, file, FILE_TYPE)
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

func (server *Server) EditType(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.PostForm("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	name := ctx.PostForm("name")
	file, err := ctx.FormFile("file")
	if err != nil {
		if err != http.ErrMissingFile {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	}

	oldType, err := server.store.GetType(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var urlPath string
	if file != nil {
		urlPath, err = server.UploadToGCS(ctx, file, FILE_TYPE)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	} else {
		urlPath = oldType.Src
	}

	argType := db.UpdateTypeParams{
		ID:   int64(id),
		Name: name,
		Src:  urlPath,
	}

	editedType, err := server.store.UpdateType(ctx, argType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"name": editedType.Name,
		"file": editedType.Src,
	})
}

func (server *Server) DeleteType(ctx *gin.Context) {
	idStr := ctx.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	deleteType, err := server.store.GetType(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	err = server.DeleteFileFromGCS(ctx, deleteType.Src, FILE_TYPE)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	err = server.store.DeleteType(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Type deleted successfully"})
}
