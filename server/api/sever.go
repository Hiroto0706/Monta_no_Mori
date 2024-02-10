package api

import (
	"database/sql"
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

	// MasterUserの作成
	err = insertMasterUser(server)
	if err != nil {
		return nil, err
	}

	// UserサイドAPI
	v1 := router.Group("/api/v1")
	{
		v1.GET("/", server.ListImages)
		v1.GET("/favorite", server.ListFavoriteImages)
		v1.GET("/others", server.ListOtherImages)
		v1.GET("/search", server.SearchImages)
		v1.GET("/search/type/:name", server.SearchImagesByType)
		v1.GET("/search/category/:name", server.SearchImagesByCategory)
		v1.GET("/image/:title", server.GetImageFromTitle)
		v1.GET("/category/:id", server.ListImageCategories)
		v1.GET("/category", server.ListCategories)
		v1.GET("/type", server.ListTypes)
		v1.POST("/login", server.LoginUser)
		v1.POST("/login/verify", server.VerifyAccessToken)

		// AdminサイドAPI
		admin := v1.Group("/admin")
		admin.Use(authMiddleware(server.tokenMaker))
		{
			admin.GET("/", server.ListImages)
			admin.POST("/upload", server.UploadImage)
			admin.DELETE("/delete/:id", server.DeleteImage)
			admin.PUT("/edit/:id", server.EditImage)

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
	}

	server.router = router
	return server, nil
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

func errorResponse(err error) ErrorResponse {
	return ErrorResponse{Error: err.Error()}
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

// MasterUserが存在しなければ作成する
func insertMasterUser(server *Server) error {
	ctx := &gin.Context{}
	existingUser, err := server.store.GetUser(ctx, server.config.MasterUsername)
	if err != nil && err != sql.ErrNoRows {
		return fmt.Errorf("failed to GetUser : %w", err)
	}

	if existingUser.Username == server.config.MasterUsername {
		return nil
	}

	hashedPassword, err := util.HashPassword(server.config.MasterPassword)
	if err != nil {
		return fmt.Errorf("cannot create hash password : %w", err)
	}
	_, err = server.store.CreateUser(ctx, db.CreateUserParams{
		Username:       server.config.MasterUsername,
		HashedPassword: hashedPassword,
		Email:          server.config.MasterEmail,
	})
	if err != nil {
		return fmt.Errorf("cannot create MasterUser : %w", err)
	}

	return nil
}
