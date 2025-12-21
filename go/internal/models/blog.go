package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StringArray []string

func (a *StringArray) Scan(value interface{}) error {
	if value == nil {
		*a = StringArray{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	return json.Unmarshal(bytes, a)
}

func (a StringArray) Value() (driver.Value, error) {
	if len(a) == 0 {
		return "[]", nil
	}
	return json.Marshal(a)
}

func (a StringArray) GormDataType() string {
	return "jsonb"
}

type Blog struct {
	ID            uuid.UUID   `json:"id" gorm:"type:uuid;primary_key"`
	Title         string      `json:"title" gorm:"type:varchar(255);not null"`
	Slug          string      `json:"slug" gorm:"type:varchar(255);uniqueIndex;not null"`
	Content       string      `json:"content" gorm:"type:text;not null"`
	Excerpt       *string     `json:"excerpt,omitempty" gorm:"type:text"`
	Category      string      `json:"category" gorm:"type:varchar(100)"`
	Tags          StringArray `json:"tags" gorm:"type:jsonb"`
	Status        string      `json:"status" gorm:"type:varchar(20);default:'draft'"`
	FeaturedImage *string     `json:"featured_image,omitempty" gorm:"type:varchar(255)"`
	PublishedAt   *time.Time  `json:"published_at,omitempty" gorm:"type:timestamp"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
}

func (b *Blog) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	if b.Status == "published" && b.PublishedAt == nil {
		now := time.Now()
		b.PublishedAt = &now
	}
	return nil
}

type UpdateBlogRequest struct {
	Title         *string   `json:"title"`
	Slug          *string   `json:"slug"`
	Content       *string   `json:"content"`
	Excerpt       *string   `json:"excerpt"`
	Category      *string   `json:"category"`
	Tags          *[]string `json:"tags"`
	Status        *string   `json:"status"`
	FeaturedImage *string   `json:"featured_image"`
}
