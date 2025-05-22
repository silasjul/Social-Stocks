package models

type Person struct {
	ID              int    `json:"id"`
	ProfileName     string `json:"profileName"`
	Username        string `json:"username"`
	DescriptionText string `json:"description"`
	ImgURL          string `json:"imgUrl"`
}

type CreatePersonRequest struct {
	ProfileName     string `json:"profileName" binding:"required"`
	Username        string `json:"username" binding:"required"`
	DescriptionText string `json:"description" binding:"required"`
	ImgURL          string `json:"imgUrl" binding:"required"`
}