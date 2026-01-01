package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Auth struct {
	ID           uuid.UUID  `json:"id" gorm:"type:uuid;primary_key"`
	Email        string     `json:"email" gorm:"type:varchar(255);uniqueIndex;not null"`
	Password     string     `json:"-" gorm:"type:varchar(255);not null"` // Hidden from JSON
	Role         string     `json:"role" gorm:"type:varchar(50);default:'user'"`
	LastLoggedIn *time.Time `json:"last_logged_in,omitempty" gorm:"type:timestamp"`
	CreatedAt    time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
}

func (a *Auth) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	ID           uuid.UUID  `json:"id"`
	Email        string     `json:"email"`
	Role         string     `json:"role"`
	LastLoggedIn *time.Time `json:"last_logged_in,omitempty"`
	Message      string     `json:"message"`
}
