package api

import (
	"database/sql"
	"fmt"
	db "monta_no_mori/db/sqlc"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CreateCategoryResponse struct {
	Category db.Category `json:"category"`
}

// CreateCategory godoc
// @Summary カテゴリーを作成する
// @Description 新しいカテゴリーを作成します。
// @Tags categories
// @Produce  json
// @Param name formData string true "カテゴリー名"
// @Success 200 {object} CreateCategoryResponse
// @Failure 500 {object} ErrorResponse
// @Router /admin/category/create [post]
func (server *Server) CreateCategory(ctx *gin.Context) {
	name := ctx.PostForm("name")

	fmt.Println(name)

	category, err := server.store.CreateCategory(ctx, name)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, CreateCategoryResponse{
		Category: category,
	})
}

type EditCategoryResponse struct {
	Category db.Category `json:"category"`
}

// EditCategory godoc
// @Summary カテゴリーを編集する
// @Description 指定されたIDのカテゴリーを編集します。
// @Tags categories
// @Produce  json
// @Param id path int true "カテゴリーID"
// @Param name formData string true "カテゴリー名"
// @Success 200 {object} EditCategoryResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /admin/category/edit/{id} [put]
func (server *Server) EditCategory(ctx *gin.Context) {
	strId := ctx.Param("id")
	id, err := strconv.Atoi(strId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	name := ctx.PostForm("name")

	arg := db.UpdateCategoryParams{
		ID:   int64(id),
		Name: name,
	}

	newCategory, err := server.store.UpdateCategory(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, EditCategoryResponse{
		Category: newCategory,
	})
}

type ListCategoriesResponse struct {
	Category []db.Category `json:"category"`
}

// ListCategories godoc
// @Summary カテゴリー一覧を取得する
// @Description 登録されているカテゴリーの一覧を取得します。
// @Tags categories
// @Produce  json
// @Success 200 {object} ListCategoriesResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /category [get]
func (server *Server) ListCategories(ctx *gin.Context) {
	arg := db.ListCategoriesParams{
		Limit:  100,
		Offset: 0,
	}

	categories, err := server.store.ListCategories(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, ListCategoriesResponse{
		Category: categories,
	})
}

type ListImageCategoriesResponse struct {
	Category []db.Category `json:"category"`
}

// ListImageCategories godoc
// @Summary 特定の画像に紐づくカテゴリー一覧を取得する
// @Description 指定された画像IDに紐づくカテゴリーの一覧を取得します。
// @Tags categories
// @Produce  json
// @Param id path int true "画像ID"
// @Success 200 {object} ListImageCategoriesResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /category/{id} [get]
func (server *Server) ListImageCategories(ctx *gin.Context) {
	image_id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(fmt.Errorf("bad request : %w", err)))
		return
	}

	imageCategoriesIDs, err := server.store.ListImageCategoriesByImage(ctx, int64(image_id))
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("failed to list imageCategories by imageID : %w", err)))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var categories []db.Category
	for _, imageCategory := range imageCategoriesIDs {
		category, err := server.store.GetCategory(ctx, imageCategory.CategoryID)
		if err != nil {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("failed to get category image.categoryID : %d, err : %w", imageCategory.CategoryID, err)))
			return
		}

		categories = append(categories, category)
	}

	ctx.JSON(http.StatusOK, ListImageCategoriesResponse{
		Category: categories,
	})
}

// DeleteCategory godoc
// @Summary カテゴリーを削除する
// @Description 指定されたIDのカテゴリーを削除します。
// @Tags categories
// @Produce  json
// @Param id path int true "カテゴリーID"
// @Success 200 nil
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /admin/category/delete/{id} [delete]
func (server *Server) DeleteCategory(ctx *gin.Context) {
	idStr := ctx.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	err = server.store.DeleteCategory(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, nil)
}
