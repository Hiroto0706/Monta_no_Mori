package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ImageDataFromClient struct {
	Title string `json:"title"`
	Type  string `json:"type"`
}

func (server *Server) GetImages(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Hello World! from GinServer",
	})
}

func (server *Server) UploadImage(ctx *gin.Context) {
	var imageData ImageDataFromClient

	if err := ctx.BindJSON(&imageData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Get Image Data from FontEnd",
		"title":   imageData.Title,
		"type":    imageData.Type,
	})
}
