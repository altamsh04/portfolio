package services

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	cld *cloudinary.Cloudinary
	folder string
}

func NewCloudinaryService() (*CloudinaryService, error) {
	folder := os.Getenv("CLOUDINARY_FOLDER")
	if folder == "" {
		return nil, fmt.Errorf("CLOUDINARY_FOLDER environment variable is not set")
	}
	cloudinaryURL := os.Getenv("CLOUDINARY_URL")
	if cloudinaryURL == "" {
		return nil, fmt.Errorf("CLOUDINARY_URL environment variable is not set")
	}

	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return &CloudinaryService{cld: cld, folder: folder}, nil
}

func (s *CloudinaryService) UploadImage(ctx context.Context, file io.Reader, publicID string) (string, error) {
	uploadParams := uploader.UploadParams{
		Folder:   s.folder,
		PublicID: publicID,
	}

	result, err := s.cld.Upload.Upload(ctx, file, uploadParams)
	if err != nil {
		return "", fmt.Errorf("failed to upload image to Cloudinary: %w", err)
	}

	return result.SecureURL, nil
}

