package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (server *Server) HelloWorld(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Hello World! from GinServer",
	})
}
