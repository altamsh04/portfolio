package handlers

import (
	"blog-api/internal/models"
	"blog-api/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	repo *repository.AuthRepository
}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		repo: repository.NewAuthRepository(),
	}
}

func (h *AuthHandler) AdminLogin(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body. Email and password are required."})
		return
	}

	auth, err := h.repo.GetByEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(auth.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := h.repo.UpdateLastLoggedIn(auth.ID); err != nil {
	}

	updatedAuth, err := h.repo.GetByID(auth.ID)
	if err != nil {
		updatedAuth = auth
	}

	c.JSON(http.StatusOK, models.LoginResponse{
		ID:           updatedAuth.ID,
		Email:        updatedAuth.Email,
		Role:         updatedAuth.Role,
		LastLoggedIn: updatedAuth.LastLoggedIn,
		Message:      "Login successful",
	})
}
