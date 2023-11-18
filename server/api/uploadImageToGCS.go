package api

import (
	"fmt"
	"io"
	"mime/multipart"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)

// 仮のGCSアップロード関数
func (server *Server) UploadToGCS(ctx *gin.Context, file *multipart.FileHeader, fileType string) (string, error) {
	// setting for upload request
	client, err := createGCSClient(ctx, server)
	if err != nil {
		return "", fmt.Errorf("cannot create client : %w", err)
	}

	bucket := client.Bucket(server.config.BucketName)
	currentTime := time.Now()
	gcsFileName := fmt.Sprintf("%s/%s.png", fileType, currentTime.Format("200601021504"))

	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("error opening file : %w", err)
	}
	defer src.Close()
	obj := bucket.Object(gcsFileName)

	// write file to gcs
	wc := obj.NewWriter(ctx)
	if _, err = io.Copy(wc, src); err != nil {
		return "", fmt.Errorf("error writing file : %w", err)
	}
	if err = wc.Close(); err != nil {
		return "", fmt.Errorf("error closing file : %w", err)
	}

	fmt.Println("ここまでは来てる 5")
	resImagePath := fmt.Sprintf("https://storage.googleapis.com/%s/%s", server.config.BucketName, gcsFileName)
	return resImagePath, nil
}

// GCSクライアントとの接続
func createGCSClient(ctx *gin.Context, server *Server) (*storage.Client, error) {
	credentialFilePath := server.config.JsonPath
	client, err := storage.NewClient(ctx, option.WithCredentialsFile(credentialFilePath))
	if err != nil {
		return nil, fmt.Errorf("failed to create : %w", err)
	}

	defer client.Close()

	return client, err
}
