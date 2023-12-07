package api

import (
	"fmt"
	db "monta_no_mori/db/sqlc"
	"monta_no_mori/token"
	util "monta_no_mori/utils"

	"github.com/gin-gonic/gin"
)

type Server struct {
	config     util.Config
	store      *db.Store
	router     *gin.Engine
	tokenMaker token.Maker
}

// NewServer creates a new HTTP server and setup routing
func NewServer(store *db.Store, config util.Config) (*Server, error) {
	token, err := token.NewPasetoMaker(config.TokenSymmetricKey)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker : %w", err)
	}
	server := &Server{
		config:     config,
		store:      store,
		tokenMaker: token,
	}

	router := gin.Default()
	router.Use(CORSMiddleware())

	// UserサイドAPI
	v1 := router.Group("/api/v1")
	{
		v1.GET("/", server.ListImages)
		v1.GET("/search", server.SearchImages)
		v1.GET("/search/type/:name", server.SearchImagesByType)
		v1.GET("/search/category/:name", server.SearchImagesByCategory)
		v1.GET("/category/:id", server.ListImageCategories)

		// AdminサイドAPI
		admin := v1.Group("/admin")
		{
			admin.GET("/", server.ListImages)
			admin.POST("/upload", server.UploadImage)
			admin.PUT("/edit/:id", server.EditImage)
			admin.DELETE("/delete/:id", server.DeleteImage)
		}

		adminType := admin.Group("/type")
		{
			adminType.GET("/", server.ListTypes)
			adminType.POST("/upload", server.UploadType)
			adminType.PUT("/edit/:id", server.EditType)
			adminType.DELETE("/delete/:id", server.DeleteType)
		}

		adminCategory := admin.Group("/category")
		{
			adminCategory.GET("/", server.ListCategories)
			adminCategory.POST("/create", server.CreateCategory)
			adminCategory.PUT("/edit/:id", server.EditCategory)
			adminCategory.DELETE("/delete/:id", server.DeleteCategory)
		}
	}

	server.router = router
	return server, nil
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
