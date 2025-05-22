package models

type Post struct {
	ID       int    `json:"id"`
	PersonID int    `json:"personId"`
	Text     string `json:"text"`
	TimeUnix int64  `json:"time"`
	Comments int    `json:"comments"`
	Retweets int    `json:"retweets"`
	Likes    int    `json:"likes"`
	Views    int    `json:"views"`
}

type CreatePostRequest struct {
	PersonID int    `json:"personId" binding:"required"`
	Text     string `json:"text" binding:"required"`
	TimeUnix int64  `json:"time" binding:"required"`
	Comments int    `json:"comments" binding:"required"`
	Retweets int    `json:"retweets" binding:"required"`
	Likes    int    `json:"likes" binding:"required"`
	Views    int    `json:"views" binding:"required"`
}