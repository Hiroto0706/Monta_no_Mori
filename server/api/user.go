package api

import (
	"database/sql"
	"fmt"
	db "monta_no_mori/db/sqlc"
	util "monta_no_mori/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// type createUserRequest struct {
// 	Username string `json:"username" binding:"required,alphanum"`
// 	Password string `json:"password" binding:"required,min=6"`
// 	Email    string `json:"email" binding:"required,email"`
// }

type userResponse struct {
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func newUserResponse(user db.User) userResponse {
	return userResponse{
		Email:     user.Email,
		Username:  user.Username,
		CreatedAt: user.CreatedAt,
	}
}

// func (server *Server) CreateUser(ctx *gin.Context) {
// 	var req createUserRequest
// 	if err := ctx.ShouldBindJSON(&req); err != nil {
// 		ctx.JSON(http.StatusBadRequest, errorResponse(err))
// 		return
// 	}

// 	hashedPassword, err := util.HashPassword(req.Password)
// 	if err != nil {
// 		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
// 		return
// 	}
// 	arg := db.CreateUserParams{
// 		Username:       req.Username,
// 		HashedPassword: hashedPassword,
// 		Email:          req.Email,
// 	}

// 	user, err := server.store.CreateUser(ctx, arg)
// 	if err != nil {
// 		if pqErr, ok := err.(*pq.Error); ok {
// 			switch pqErr.Code.Name() {
// 			case "unique_violation":
// 				ctx.JSON(http.StatusForbidden, errorResponse(err))
// 				return
// 			}
// 		}
// 		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
// 		return
// 	}

// 	res := newUserResponse(user)
// 	ctx.JSON(http.StatusOK, res)
// }

type loginUserRequest struct {
	Username string `json:"username" binding:"required,alphanum"`
	Password string `json:"password" binding:"required,min=6"`
	Email    string `json:"email" binding:"required,email"`
}

type loginUserResponse struct {
	SessionID             uuid.UUID    `json:"session_id"`
	AccessToken           string       `json:"access_token"`
	AccessTokenExpiresAt  time.Time    `json:"access_token_expires_at"`
	RefreshToken          string       `json:"refresh_token"`
	RefreshTokenExpiresAt time.Time    `json:"refresh_token_expires_at"`
	User                  userResponse `json:"user"`
}

func (server *Server) LoginUser(ctx *gin.Context) {
	var req loginUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(fmt.Errorf("bad request : %w", err)))
		return
	}

	// RequestとUserの情報が一致するか確認
	user, err := server.store.GetUser(ctx, req.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	if err = util.CheckPassword(req.Password, user.HashedPassword); err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}
	if err = util.CheckEmail(req.Email, user.Email); err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	// アクセストークンとリフレッシュトークンを作成し、セッションに保存
	accessToken, accessPayload, err := server.tokenMaker.CreateToken(
		user.Username,
		server.config.AccessTokenDuration,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	refreshToken, refreshPayload, err := server.tokenMaker.CreateToken(
		user.Username,
		server.config.RefreshTokenDuration,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	session, err := server.store.CreateSession(ctx, db.CreateSessionParams{
		ID:           refreshPayload.ID,
		Username:     user.Username,
		Email:        user.Email,
		RefreshToken: refreshToken,
		ExpiresAt:    refreshPayload.ExpiredAt,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := loginUserResponse{
		SessionID:             session.ID,
		AccessToken:           accessToken,
		AccessTokenExpiresAt:  accessPayload.ExpiredAt,
		RefreshToken:          refreshToken,
		RefreshTokenExpiresAt: refreshPayload.ExpiredAt,
		User:                  newUserResponse(user),
	}

	ctx.JSON(http.StatusOK, rsp)
}

func (server *Server) VerifyAccessToken(ctx *gin.Context) {
	accessToken := ctx.PostForm("accessToken")

	_, err := server.tokenMaker.VerifyToken(accessToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"result": "success"})
}
