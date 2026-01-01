package routes

import (
	"blog-api/internal/handlers"
	"blog-api/internal/middleware"
	"blog-api/internal/services"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	var cloudinaryService *services.CloudinaryService
	cloudinaryService, err := services.NewCloudinaryService()
	if err != nil {
		log.Printf("Warning: Cloudinary service initialization failed: %v. Image upload will not be available.", err)
	}

	blogHandler := handlers.NewBlogHandler(cloudinaryService)
	authHandler := handlers.NewAuthHandler()
	authRoutePath := os.Getenv("AUTH_ROUTE_PATH")

	api := router.Group("/api/v1")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		blogs := api.Group("/blogs")
		blogs.Use(middleware.APIKeyAuth())
		blogs.Use(middleware.RateLimit())
		{
			blogs.POST("", blogHandler.CreateBlog)
			blogs.GET("", blogHandler.GetAllBlogs)
			blogs.GET("/:id", blogHandler.GetBlog)
			blogs.GET("/slug/:slug", blogHandler.GetBlogBySlug)
			blogs.PUT("/:id", blogHandler.UpdateBlog)
			blogs.DELETE("/:id", blogHandler.DeleteBlog)
		}

		if authRoutePath != "" {
			auth := api.Group(authRoutePath)
			{
				auth.POST("/admin", middleware.APIKeyAuth(), authHandler.AdminLogin)
			}
		}
	}
}
