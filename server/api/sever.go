package api

import (
	db "monta_no_mori/db/sqlc"
	util "monta_no_mori/utils"

	"github.com/gin-gonic/gin"
)

type Server struct {
	store  *db.Store
	router *gin.Engine
	config util.Config
}

// NewServer creates a new HTTP server and setup routing
func NewServer(store *db.Store, config util.Config) *Server {
	server := &Server{store: store, config: config}
	router := gin.Default()
	router.Use(CORSMiddleware())

	// UserサイドAPI
	router.GET("/", server.GetImages)

	// AdminサイドAPI
	admin := router.Group("/admin")
	admin.GET("/", server.ListImages)
	admin.POST("/upload", server.UploadImage)
	admin.PUT("/edit/:id", server.EditImage)
	admin.DELETE("/delete/:id", server.DeleteImage)

	adminType := admin.Group("/type")
	adminType.GET("/", server.ListTypes)
	adminType.POST("/upload", server.UploadType)
	adminType.PUT("/edit/:id", server.EditType)
	adminType.DELETE("/delete/:id", server.DeleteType)

	adminCategory := admin.Group("/category")
	adminCategory.GET("/", server.ListCategories)
	adminCategory.POST("/create", server.CreateCategory)
	adminCategory.PUT("/edit/:id", server.EditCategory)
	adminCategory.DELETE("/delete/:id", server.DeleteCategory)

	server.router = router
	return server
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
