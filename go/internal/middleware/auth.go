package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func APIKeyAuth() gin.HandlerFunc {
	expectedAPIKey := os.Getenv("API_KEY")
	
	return func(c *gin.Context) {
		if expectedAPIKey == "" {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "API authentication is not configured. Please set API_KEY environment variable.",
			})
			c.Abort()
			return
		}

		apiKey := c.GetHeader("X-API-Key")
		
		if apiKey == "" {
			authHeader := c.GetHeader("Authorization")
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				apiKey = authHeader[7:]
			}
		}

		if apiKey == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "API key is required. Provide it in X-API-Key header or Authorization: Bearer <key>",
			})
			c.Abort()
			return
		}

		if apiKey != expectedAPIKey {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid API key",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

