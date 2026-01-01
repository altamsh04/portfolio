package repository

import (
	"blog-api/internal/database"
	"blog-api/internal/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthRepository struct{}

func NewAuthRepository() *AuthRepository {
	return &AuthRepository{}
}

func (r *AuthRepository) Create(auth *models.Auth) error {
	if err := database.DB.Create(auth).Error; err != nil {
		return fmt.Errorf("failed to create auth: %w", err)
	}
	return nil
}

func (r *AuthRepository) GetByEmail(email string) (*models.Auth, error) {
	var auth models.Auth
	if err := database.DB.
		Select("id, email, password, role, last_logged_in, created_at, updated_at").
		Where("email = ?", email).
		First(&auth).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("auth not found")
		}
		return nil, fmt.Errorf("failed to get auth: %w", err)
	}
	return &auth, nil
}

func (r *AuthRepository) GetByID(id uuid.UUID) (*models.Auth, error) {
	var auth models.Auth
	if err := database.DB.
		Select("id, email, role, last_logged_in, created_at, updated_at").
		Where("id = ?", id).
		First(&auth).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("auth not found")
		}
		return nil, fmt.Errorf("failed to get auth: %w", err)
	}
	return &auth, nil
}

func (r *AuthRepository) UpdateLastLoggedIn(id uuid.UUID) error {
	now := time.Now()
	if err := database.DB.Model(&models.Auth{}).Where("id = ?", id).Update("last_logged_in", now).Error; err != nil {
		return fmt.Errorf("failed to update last logged in: %w", err)
	}
	return nil
}

func (r *AuthRepository) Update(id uuid.UUID, updates map[string]interface{}) error {
	if err := database.DB.Model(&models.Auth{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update auth: %w", err)
	}
	return nil
}

func (r *AuthRepository) Delete(id uuid.UUID) error {
	if err := database.DB.Delete(&models.Auth{}, id).Error; err != nil {
		return fmt.Errorf("failed to delete auth: %w", err)
	}
	return nil
}
