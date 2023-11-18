package api

import (
	"fmt"
	db "monta_no_mori/db/sqlc"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

func (server *Server) GetImages(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Hello World! from GinServer",
	})
}

func (server *Server) UploadImage(ctx *gin.Context) {
	title := ctx.PostForm("title")
	imageType := ctx.PostForm("type")
	categoryData := ctx.PostFormArray("categories")

	type Category struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
	var categories []Category
	for _, data := range categoryData {
		parts := strings.Split(data, ":")
		if len(parts) == 2 {
			id, _ := strconv.Atoi(parts[0])
			name := parts[1]
			categories = append(categories, Category{ID: id, Name: name})
		}
	}
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// GCSにアップロード
	fileType := "image"
	urlPath, err := server.UploadToGCS(ctx, file, fileType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	argType := db.CreateTypeParams{
		Name: imageType,
	}

	argImage := db.CreateImageParams{
		Title:  title,
		Src:    urlPath,
		TypeID: 1,
	}
	image, err := server.store.CreateImage(ctx, argImage)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	fmt.Println(categories)
	for _, category := range categories {
		argImageCategory := db.CreateImageCategoryParams{
			ImageID:    image.ID,
			CategoryID: int64(category.ID),
		}

		_, err := server.store.CreateImageCategory(ctx, argImageCategory)
		if err != nil {
			if pqErr, ok := err.(*pq.Error); ok {
				switch pqErr.Code.Name() {
				case "unique_violation":
					ctx.JSON(http.StatusForbidden, errorResponse(err))
					return
				}
			}
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"image": image,
		"type":  argType,
	})
}
