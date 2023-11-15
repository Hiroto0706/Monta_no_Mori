package api

import (
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (server *Server) GetImages(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Hello World! from GinServer",
	})
}

// 仮のGCSアップロード関数
func uploadToGCS(file *multipart.FileHeader) (string, error) {
	return "https://storage.googleapis.com/bucket_name/uploaded_file.jpg", nil
}

func (server *Server) UploadImage(ctx *gin.Context) {
	title := ctx.PostForm("title")
	imageType := ctx.PostForm("type")
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// GCSにアップロード
	urlPath, err := uploadToGCS(file)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "Get Image Data from FontEnd",
		"title":    title,
		"type":     imageType,
		"url_path": urlPath,
	})
}
