package repository

import (
	"blog-api/internal/database"
	"blog-api/internal/models"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BlogRepository struct{}

func NewBlogRepository() *BlogRepository {
	return &BlogRepository{}
}

func (r *BlogRepository) Create(blog *models.Blog) error {
	if err := database.DB.Create(blog).Error; err != nil {
		return fmt.Errorf("failed to create blog: %w", err)
	}
	return nil
}

func (r *BlogRepository) GetByID(id uuid.UUID) (*models.Blog, error) {
	var blog models.Blog
	if err := database.DB.
		Select("id, title, slug, content, excerpt, category, tags, status, featured_image, published_at, created_at, updated_at").
		Where("id = ?", id).
		First(&blog).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("blog not found")
		}
		return nil, fmt.Errorf("failed to get blog: %w", err)
	}
	return &blog, nil
}

func (r *BlogRepository) GetBySlug(slug string) (*models.Blog, error) {
	var blog models.Blog
	if err := database.DB.
		Select("id, title, slug, content, excerpt, category, tags, status, featured_image, published_at, created_at, updated_at").
		Where("slug = ?", slug).
		First(&blog).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("blog not found")
		}
		return nil, fmt.Errorf("failed to get blog by slug: %w", err)
	}
	return &blog, nil
}

func (r *BlogRepository) GetAll(limit, offset int) ([]*models.Blog, error) {
	var blogs []*models.Blog
	if err := database.DB.
		Select("id, title, slug, content, excerpt, category, tags, status, featured_image, published_at, created_at, updated_at").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&blogs).Error; err != nil {
		return nil, fmt.Errorf("failed to get blogs: %w", err)
	}
	return blogs, nil
}

func (r *BlogRepository) Update(id uuid.UUID, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}

	result := database.DB.Model(&models.Blog{}).Where("id = ?", id).Updates(updates)
	if result.Error != nil {
		return fmt.Errorf("failed to update blog: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("blog not found")
	}

	return nil
}

func (r *BlogRepository) Delete(id uuid.UUID) error {
	result := database.DB.Where("id = ?", id).Delete(&models.Blog{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete blog: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("blog not found")
	}

	return nil
}
