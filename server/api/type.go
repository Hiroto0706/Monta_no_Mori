package api

import (
	"database/sql"
	db "monta_no_mori/db/sqlc"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

const FILE_TYPE = "type"

type ListTypesResponse struct {
	Types []db.Type `json:"types"`
}

// ListTypes godoc
// @Summary タイプ一覧を取得する
// @Description 登録されているタイプの一覧を取得します。
// @Tags types
// @Produce  json
// @Success 200 {object} ListTypesResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /type [get]
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

	ctx.JSON(http.StatusOK, ListTypesResponse{
		Types: types,
	})
}

type UploadTypeResponse struct {
	Name string `json:"name"`
	File string `json:"file"`
}

// UploadType godoc
// @Summary 新しいタイプをアップロードする
// @Description 新しいタイプを作成し、アップロードします。
// @Tags types
// @Accept multipart/form-data
// @Produce  json
// @Param name formData string true "タイプ名"
// @Param file formData file true "タイプファイル"
// @Success 200 nil
// @Failure 500 {object} ErrorResponse
// @Router /admin/type/upload [post]
func (server *Server) UploadType(ctx *gin.Context) {
	name := ctx.PostForm("name")
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	urlPath, err := server.UploadToGCS(ctx, file, "", FILE_TYPE)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	argType := db.CreateTypeParams{
		Name: name,
		Src:  urlPath,
	}

	_, err = server.store.CreateType(ctx, argType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, nil)
}

type EditTypeResponse struct {
	Name string `json:"name"`
	File string `json:"file"`
}

// EditType godoc
// @Summary 指定したタイプを編集する
// @Description 指定したIDのタイプを編集します。
// @Tags types
// @Accept multipart/form-data
// @Produce  json
// @Param id path int true "タイプID"
// @Param name formData string true "タイプ名"
// @Param file formData file false "タイプファイル"
// @Success 200 {object} EditTypeResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /admin/type/edit/{id} [put]
func (server *Server) EditType(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
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
		urlPath, err = server.UploadToGCS(ctx, file, "", FILE_TYPE)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
		err = server.DeleteFileFromGCS(ctx, oldType.Src)
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

	ctx.JSON(http.StatusOK, EditTypeResponse{
		Name: editedType.Name,
		File: editedType.Src,
	})
}

// DeleteType godoc
// @Summary 指定したタイプを削除する
// @Description 指定したIDのタイプを削除します。
// @Tags types
// @Produce  json
// @Param id path int true "タイプID"
// @Success 200 nil
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /admin/type/delete/{id} [delete]
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

	err = server.DeleteFileFromGCS(ctx, deleteType.Src)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	err = server.store.DeleteType(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, nil)
}
