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

const FILE_TYPE_IMAGE = "image"

type responseImage struct {
	Image      db.Image      `json:"image"`
	ImageType  db.Type       `json:"type"`
	Categories []db.Category `json:"categories"`
}

func (server *Server) ListImages(ctx *gin.Context) {
	// TODO: 引数が固定なので修正する必要あり
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
		"payload": resImages,
	})
}

func (server *Server) SearchImages(ctx *gin.Context) {
	searchText := ctx.Query("q")
	args := db.ListImageByTitleParams{
		Limit:  100,
		Offset: 0,
		Title: sql.NullString{
			String: searchText,
			Valid:  true,
		},
	}
	images, err := server.store.ListImageByTitle(ctx, args)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("no images were found for the title received : %w", err)))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to ListImageByTitle() : %w", err)))
		return
	}

	// TODO: この箇所はListImageと重複しているので修正する必要あり
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

	ctx.JSON(http.StatusOK, gin.H{"result": resImages})
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
	urlPath, err := server.UploadToGCS(ctx, file, FILE_TYPE_IMAGE)
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

func (server *Server) EditImage(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(fmt.Errorf("bad request : %w", err)))
		return
	}
	typeId, err := strconv.Atoi(ctx.PostForm("typeId"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	title := ctx.PostForm("title")
	categoryData := ctx.PostFormArray("categories")
	type Category struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
	var newCategories []Category
	for _, data := range categoryData {
		parts := strings.Split(data, ":")
		if len(parts) == 2 {
			id, _ := strconv.Atoi(parts[0])
			name := parts[1]
			newCategories = append(newCategories, Category{ID: id, Name: name})
		}
	}
	// 新しいカテゴリーのセットを作成
	newImageCategorySet := make(map[int64]struct{})
	for _, category := range newCategories {
		newImageCategorySet[int64(category.ID)] = struct{}{}
	}

	image, err := server.store.GetImage(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to get image from db : %w", err)))
		return
	}

	// 古いカテゴリーのセットを作成
	oldImageCategories, err := server.store.ListImageCategoriesByImage(ctx, image.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to list image_categories by imageID : %w", err)))
		return
	}
	oldImageCategorySet := make(map[int64]struct{})
	for _, imageCategory := range oldImageCategories {
		oldImageCategorySet[imageCategory.CategoryID] = struct{}{}
	}

	// 新しいカテゴリーを追加（古いカテゴリーに存在しないもののみ）
	for _, category := range newCategories {
		if _, exists := oldImageCategorySet[int64(category.ID)]; !exists {
			argImageCategory := db.CreateImageCategoryParams{
				ImageID:    image.ID,
				CategoryID: int64(category.ID),
			}
			_, err := server.store.CreateImageCategory(ctx, argImageCategory)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, errorResponse(err))
				return
			}
		}
	}

	// 古いカテゴリーを削除（新しいカテゴリーに存在しないもののみ）
	for _, category := range oldImageCategories {
		if _, exists := newImageCategorySet[category.CategoryID]; !exists {
			err := server.store.DeleteImageCategory(ctx, db.DeleteImageCategoryParams{
				ImageID:    image.ID,
				CategoryID: category.CategoryID,
			})
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, errorResponse(err))
				return
			}
		}
	}

	// urlPathはfileの更新がなければ既存のものを使う
	var urlPath string
	file, err := ctx.FormFile("file")
	if err != nil {
		if err.Error() == "http: no such file" {
			urlPath = image.Src
		} else {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("get file is bad request : %w", err)))
			return
		}
	} else {
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("get file data is failed : %w", err)))
			return
		}

		// GCSにアップロード
		urlPath, err = server.UploadToGCS(ctx, file, FILE_TYPE_IMAGE)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to upload file to GCS: %w", err)))
			return
		}

		// 既存イメージの削除
		err = server.DeleteFileFromGCS(ctx, image.Src)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("delete existing file from GCS failed : %w", err)))
			return
		}
	}

	argImage := db.UpdateImageParams{
		ID:     int64(id),
		Title:  title,
		Src:    urlPath,
		TypeID: int64(typeId),
	}

	newImage, err := server.store.UpdateImage(ctx, argImage)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to update image : %w", err)))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "image update successfully",
		"image":   newImage,
	})
}

func (server *Server) DeleteImage(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(fmt.Errorf("bad request : %w", err)))
		return
	}

	err = server.store.DeleteImageCategoryByImageID(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("delete image_categories failed : %w", err)))
		return
	}

	image, err := server.store.GetImage(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("get image failed : %w", err)))
		return
	}

	err = server.store.DeleteImage(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("delete image failed : %w", err)))
		return
	}

	err = server.DeleteFileFromGCS(ctx, image.Src)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("delete image from GCS failed : %w", err)))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "delete image successfully",
	})
}

func (server *Server) SearchImagesByType(ctx *gin.Context) {
	typeName := ctx.Param("name")
	searchType, err := server.store.GetTypeByName(ctx, typeName)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("no type was found for the title received : %w", err)))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to GetTypeByName() : %w", err)))
		return
	}
	args := db.ListImageByTypeParams{
		TypeID: searchType.ID,
		Limit:  100,
		Offset: 0,
	}
	images, err := server.store.ListImageByType(ctx, args)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("no images were found for the title received : %w", err)))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to ListImageByTitle() : %w", err)))
		return
	}

	// TODO: この箇所はListImageと重複しているので修正する必要あり
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

	ctx.JSON(http.StatusOK, gin.H{"payload": resImages})
}

func (server *Server) SearchImagesByCategory(ctx *gin.Context) {
	categoryName := ctx.Param("name")
	searchCategory, err := server.store.GetCategoryByName(ctx, categoryName)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("no category was found for the title received : %w", err)))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to GetCategoryByName() : %w", err)))
		return
	}

	imageCategories, err := server.store.ListImageCategoriesByCategory(ctx, searchCategory.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("no imageCategories were found for the title received : %w", err)))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to ListImageCategoriesByCategory() : %w", err)))
		return
	}

	// TODO: この箇所はListImageと重複しているので修正する必要あり
	resImages := []responseImage{}
	for _, imgCate := range imageCategories {
		resImage := responseImage{}
		i, err := server.store.GetImage(ctx, imgCate.ImageID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to GetImage() : err = %w, image_id = %d", err, imgCate.ImageID)))
		}
		resImage.Image = i

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

	ctx.JSON(http.StatusOK, gin.H{"payload": resImages})
}
