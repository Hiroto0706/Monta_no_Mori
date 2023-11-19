package api

import (
	"database/sql"
	"fmt"
	db "monta_no_mori/db/sqlc"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (server *Server) CreateCategory(ctx *gin.Context) {
	name := ctx.PostForm("name")

	fmt.Println(name)

	category, err := server.store.CreateCategory(ctx, name)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	fmt.Println(category)

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "category created successfully",
		"category": category,
	})
}

func (server *Server) EditCategory(ctx *gin.Context) {
	strId := ctx.PostForm("id")
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

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "category created successfully",
		"category": newCategory,
	})
}

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

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "list categories successfully",
		"category": categories,
	})
}

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

	ctx.JSON(http.StatusOK, gin.H{
		"message": "delete category successfully",
	})
}
