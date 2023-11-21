package api

import (
	"database/sql"
	"fmt"
	db "monta_no_mori/db/sqlc"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type responseImage struct {
	Image      db.Image      `json:"image"`
	ImageType  db.Type       `json:"type"`
	Categories []db.Category `json:"categories"`
}

func (server *Server) GetImages(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Hello World! from GinServer",
	})
}

func (server *Server) ListImages(ctx *gin.Context) {
	arg := db.ListImageParams{
		Limit:  100,
		Offset: 0,
	}
	images, err := server.store.ListImage(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	resImages := []responseImage{}
	for _, image := range images {
		resImage := responseImage{}
		resImage.Image = image

		typeID := resImage.Image.TypeID
		imageType, err := server.store.GetType(ctx, typeID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to get type id from image type_id : %w", err)))
			return
		}
		resImage.ImageType = imageType

		imageID := resImage.Image.ID
		imageCategories, err := server.store.ListImageCategoriesByImage(ctx, imageID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to get image_categories by image id : %w", err)))
			return
		}
		categories := []db.Category{}
		for _, imageCategory := range imageCategories {
			category, err := server.store.GetCategory(ctx, imageCategory.CategoryID)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to get category : %w", err)))
				return
			}
			categories = append(categories, category)
		}
		resImage.Categories = categories
		resImages = append(resImages, resImage)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "List images successfully",
		"images":  images,
		"payload": resImages,
	})
}

func (server *Server) UploadImage(ctx *gin.Context) {
	title := ctx.PostForm("title")
	typeIdStr := ctx.PostForm("typeId")
	typeId, err := strconv.Atoi(typeIdStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
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

	argImage := db.CreateImageParams{
		Title:  title,
		Src:    urlPath,
		TypeID: int64(typeId),
	}
	image, err := server.store.CreateImage(ctx, argImage)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

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
		"message": "image create successfully",
		"image":   image,
	})
}
