package services

import "mime/multipart"

// 仮のGCSアップロード関数
func UploadToGCS(file *multipart.FileHeader) (string, error) {
	return "https://storage.googleapis.com/bucket_name/uploaded_file.jpg", nil
}
