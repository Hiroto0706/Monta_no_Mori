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
const OTHER_IMAGE_FETCH_LIMIT = 8

type responseImage struct {
	Image      db.Image      `json:"image"`
	ImageType  db.Type       `json:"type"`
	Categories []db.Category `json:"categories"`
}

// ListImagesResponse represents a list of images response
type ListImagesResponse struct {
	Payload []responseImage `json:"payload"`
}

// ListImages godoc
// @Summary Imagesを取得する
// @Tags images
// @Produce  json
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} ListImagesResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router / [get]
func (server *Server) ListImages(ctx *gin.Context) {
	page, err := strconv.Atoi(ctx.Query("p"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, errorResponse(err))
		return
	}
	arg := db.ListImageParams{
		Limit:  int32(server.config.ImageFetchLimit),
		Offset: int32(page * server.config.ImageFetchLimit),
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

	ctx.JSON(http.StatusOK, ListImagesResponse{
		Payload: resImages,
	})
}

type ListFavoriteImagesResponse struct {
	Payload []responseImage `json:"payload"`
}

// ListFavoriteImages godoc
// @Summary お気に入りのImagesを取得する
// @Tags images
// @Produce  json
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} ListImagesResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /favorite [get]
func (server *Server) ListFavoriteImages(ctx *gin.Context) {
	favIDs := ctx.Query("id")
	images, err := server.store.ListFavoriteImage(ctx, favIDs)
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

	ctx.JSON(http.StatusOK, ListImagesResponse{
		Payload: resImages,
	})
}

// ListOtherImagesResponse represents a list of images response
type ListOtherImagesResponse struct {
	Payload []responseImage `json:"payload"`
}

// ListOtherImages godoc
// @Summary 画像詳細にて表示するその他のおすすめ画像
// @Tags images
// @Produce  json
// @Success 200 {object} ListImagesResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /others [get]
func (server *Server) ListOtherImages(ctx *gin.Context) {
	arg := db.ListRandomImageParams{
		Limit:  OTHER_IMAGE_FETCH_LIMIT,
		Offset: 0,
	}
	images, err := server.store.ListRandomImage(ctx, arg)
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

		resImages = append(resImages, resImage)
	}

	ctx.JSON(http.StatusOK, ListOtherImagesResponse{
		Payload: resImages,
	})
}

type SearchImagesResponse struct {
	Result []responseImage `json:"result"`
}

// SearchImages godoc
// @Summary クエリパラメータをもとに画像を検索する
// @Description 指定されたテキストに基づいて画像を検索します。
// @Tags images
// @Accept  json
// @Produce  json
// @Param q query string false "検索テキスト"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} SearchImagesResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /search [get]
func (server *Server) SearchImages(ctx *gin.Context) {
	searchText := ctx.Query("q")
	page, err := strconv.Atoi(ctx.Query("p"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, errorResponse(err))
		return
	}
	args := db.ListImageByTitleParams{
		Limit:  int32(server.config.ImageFetchLimit),
		Offset: int32(page * server.config.ImageFetchLimit),
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

	ctx.JSON(http.StatusOK, SearchImagesResponse{
		Result: resImages,
	})
}

type UploadImageResponse struct {
	Image db.Image `json:"image"`
}

// UploadImage godoc
// @Summary 画像のアップロード
// @Description タイトル、ファイル名、タイプID、カテゴリー、画像ファイルを受け取り、画像をアップロードします。
// @Tags images
// @Accept multipart/form-data
// @Produce  json
// @Param title formData string true "タイトル"
// @Param filename formData string true "ファイル名"
// @Param typeId formData int true "タイプID"
// @Param categories formData []string false "カテゴリー（ID:名前の形式）"
// @Param file formData file true "アップロードする画像ファイル"
// @Success 200 {object} UploadImageResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /admin/upload [post]
func (server *Server) UploadImage(ctx *gin.Context) {
	title := ctx.PostForm("title")
	filename := strings.ReplaceAll(ctx.PostForm("filename"), " ", "-")
	typeIdStr := ctx.PostForm("typeId")
	typeId, err := strconv.Atoi(typeIdStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	categoryData := ctx.PostFormArray("categories")

	type category struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
	var categories []category
	for _, data := range categoryData {
		parts := strings.Split(data, ":")
		if len(parts) == 2 {
			id, _ := strconv.Atoi(parts[0])
			name := parts[1]
			categories = append(categories, category{ID: id, Name: name})
		}
	}
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// GCSにアップロード
	urlPath, err := server.UploadToGCS(ctx, file, filename, FILE_TYPE_IMAGE)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	argImage := db.CreateImageParams{
		Title:    title,
		Src:      urlPath,
		TypeID:   int64(typeId),
		Filename: filename,
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

	ctx.JSON(http.StatusOK, UploadImageResponse{
		Image: image,
	})
}

type EditImageResponse struct {
	Image db.Image `json:"image"`
}

// EditImage godoc
// @Summary 画像情報の編集
// @Description 与えられたIDの画像情報を編集します。
// @Tags images
// @Accept multipart/form-data
// @Produce  json
// @Param id path int true "画像ID"
// @Param title formData string true "タイトル"
// @Param filename formData string true "ファイル名"
// @Param typeId formData int true "タイプID"
// @Param categories formData []string false "カテゴリー（ID:名前の形式）"
// @Param file formData file false "アップロードする画像ファイル"
// @Success 200 {object} EditImageResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router admin/edit/{id} [put]
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
	filename := strings.ReplaceAll(ctx.PostForm("filename"), " ", "-")
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

		// 既存イメージの削除
		err = server.DeleteFileFromGCS(ctx, image.Src)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("delete existing file from GCS failed : %w", err)))
			return
		}

		// GCSにアップロード
		urlPath, err = server.UploadToGCS(ctx, file, filename, FILE_TYPE_IMAGE)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to upload file to GCS: %w", err)))
			return
		}

	}

	argImage := db.UpdateImageParams{
		ID:       int64(id),
		Title:    title,
		Src:      urlPath,
		TypeID:   int64(typeId),
		Filename: filename,
	}

	newImage, err := server.store.UpdateImage(ctx, argImage)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to update image : %w", err)))
		return
	}

	ctx.JSON(http.StatusOK, EditImageResponse{
		Image: newImage,
	})
}

// DeleteImage godoc
// @Summary 画像の削除
// @Description 指定されたIDの画像を削除します。
// @Tags images
// @Accept  json
// @Produce  json
// @Param id path int true "画像ID"
// @Success 200 {object} nil
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /admin/delete/{id} [delete]
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

	ctx.JSON(http.StatusOK, nil)
}

type SearchImagesByTypeResponse struct {
	Payload []responseImage `json:"payload"`
}

// SearchImagesByType godoc
// @Summary 特定のタイプに基づいて画像を検索する
// @Description 指定されたタイプ名に基づいて画像を検索します。
// @Tags images
// @Accept  json
// @Produce  json
// @Param name path string true "画像タイプ名"
// @Success 200 {object} SearchImagesByTypeResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /search/type/{name} [get]
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
	page, err := strconv.Atoi(ctx.Query("p"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, errorResponse(err))
		return
	}
	args := db.ListImageByTypeParams{
		TypeID: searchType.ID,
		Limit:  int32(server.config.ImageFetchLimit),
		Offset: int32(page * server.config.ImageFetchLimit),
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

	ctx.JSON(http.StatusOK, SearchImagesByTypeResponse{
		Payload: resImages,
	})
}

type SearchImagesByCategoryResponse struct {
	Payload []responseImage `json:"payload"`
}

// SearchImagesByCategory godoc
// @Summary 特定のカテゴリーに基づいて画像を検索する
// @Description 指定されたカテゴリー名に基づいて画像を検索します。
// @Tags images
// @Accept  json
// @Produce  json
// @Param name path string true "カテゴリー名"
// @Success 200 {object} SearchImagesByCategoryResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /search/category/{name} [get]
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

	ctx.JSON(http.StatusOK, SearchImagesByCategoryResponse{
		Payload: resImages,
	})
}

type GetImageFromTitleResponse struct {
	Result responseImage `json:"result"`
}

// GetImageFromTitle godoc
// @Summary タイトルに基づいて画像を取得する
// @Description 指定されたタイトルに基づいて画像を取得します。
// @Tags images
// @Accept  json
// @Produce  json
// @Param title path string true "画像のタイトル"
// @Success 200 {object} GetImageFromTitleResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /images/{title} [get]
func (server *Server) GetImageFromTitle(ctx *gin.Context) {
	title := ctx.Param("title")
	image, err := server.store.GetImageByTitle(ctx, title)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("no images were found for the title received : %w", err)))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to GetImageByTitle() : %w", err)))
		return
	}

	// TODO: この箇所はListImageと重複しているので修正する必要あり
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

	ctx.JSON(http.StatusOK, GetImageFromTitleResponse{
		Result: resImage,
	})
}
