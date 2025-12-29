package handlers

import (
	"blog-api/internal/models"
	"blog-api/internal/repository"
	"blog-api/internal/services"
	"blog-api/internal/utils"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BlogHandler struct {
	repo              *repository.BlogRepository
	cloudinaryService *services.CloudinaryService
}

func NewBlogHandler(cloudinaryService *services.CloudinaryService) *BlogHandler {
	return &BlogHandler{
		repo:              repository.NewBlogRepository(),
		cloudinaryService: cloudinaryService,
	}
}

func (h *BlogHandler) CreateBlog(c *gin.Context) {
	title := c.PostForm("title")
	content := c.PostForm("content")
	excerpt := c.PostForm("excerpt")
	category := c.PostForm("category")
	tagsStr := c.PostForm("tags")
	status := c.PostForm("status")

	if title == "" || content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title and content are required"})
		return
	}

	slug := utils.GenerateSlug(title)

	if status == "" {
		status = "draft"
	}

	var excerptPtr *string
	if excerpt != "" {
		excerptPtr = &excerpt
	}

	var tags models.StringArray
	if tagsStr != "" {
		tagList := strings.Split(tagsStr, ",")
		for i := range tagList {
			tagList[i] = strings.TrimSpace(tagList[i])
		}
		tags = models.StringArray(tagList)
	}

	var featuredImageURL *string
	file, err := c.FormFile("image")
	if err != http.ErrMissingFile && err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to get image file: " + err.Error()})
		return
	}
	
	if err == nil && file != nil {
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open image file"})
			return
		}
		defer src.Close()

		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExts := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}
		allowed := false
		for _, allowedExt := range allowedExts {
			if ext == allowedExt {
				allowed = true
				break
			}
		}

		if !allowed {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid image file type. Allowed types: jpg, jpeg, png, gif, webp"})
			return
		}

		if file.Size > 10*1024*1024 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "image file size exceeds 10MB limit"})
			return
		}

		if h.cloudinaryService == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "image upload service is not available"})
			return
		}

		publicID := uuid.New().String()
		uploadedURL, err := h.cloudinaryService.UploadImage(c.Request.Context(), src, publicID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to upload image: %v", err)})
			return
		}

		featuredImageURL = &uploadedURL
	}

	blog := &models.Blog{
		ID:            uuid.New(),
		Title:         title,
		Slug:          slug,
		Content:       content,
		Excerpt:       excerptPtr,
		Category:      category,
		Tags:          tags,
		Status:        status,
		FeaturedImage: featuredImageURL,
	}

	if err := h.repo.Create(blog); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, blog)
}

func (h *BlogHandler) GetBlog(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	blog, err := h.repo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "blog not found"})
		return
	}

	c.JSON(http.StatusOK, blog)
}

func (h *BlogHandler) GetBlogBySlug(c *gin.Context) {
	slug := c.Param("slug")
	
	blog, err := h.repo.GetBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "blog not found"})
		return
	}

	c.JSON(http.StatusOK, blog)
}

func (h *BlogHandler) GetAllBlogs(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	blogs, err := h.repo.GetAll(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"blogs":  blogs,
		"limit":  limit,
		"offset": offset,
	})
}

func (h *BlogHandler) UpdateBlog(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	var req models.UpdateBlogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := make(map[string]interface{})

	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Slug != nil {
		updates["slug"] = *req.Slug
	}
	if req.Content != nil {
		updates["content"] = *req.Content
	}
	if req.Excerpt != nil {
		updates["excerpt"] = *req.Excerpt
	}
	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.Tags != nil {
		updates["tags"] = models.StringArray(*req.Tags)
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	if req.FeaturedImage != nil {
		updates["featured_image"] = *req.FeaturedImage
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
		return
	}

	if err := h.repo.Update(id, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	blog, err := h.repo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch updated blog"})
		return
	}

	c.JSON(http.StatusOK, blog)
}

func (h *BlogHandler) DeleteBlog(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	if err := h.repo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "blog deleted successfully"})
}
