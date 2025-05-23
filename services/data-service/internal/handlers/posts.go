package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/silasjul/TradeSocial/services/scraping-data-service/internal/database"
	"github.com/silasjul/TradeSocial/services/scraping-data-service/internal/models"
)

func GetAllPostsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := database.GetAllPosts(db)
		if err != nil {
			log.Println("Failed to get posts:", err)
			http.Error(w, "Failed to get posts", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		if err = json.NewEncoder(w).Encode(posts); err != nil {
			log.Println("Failed to encode posts")
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func GetPostsByIdHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		posts, err := database.GetPostsByUsername(db, id)
		if err != nil {
			http.Error(w, "Failed to get posts", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		if err = json.NewEncoder(w).Encode(posts); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func AddPostsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Convert post body into DTO
		var req []models.CreatePostRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			log.Println("Error decoding body:", err)
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Add posts
		for i := range req {
			err = database.AddPost(db, req[i].PersonID, req[i].Text, req[i].Time, req[i].Comments, req[i].Retweets, req[i].Likes, req[i].Views)
				if err != nil {
					http.Error(w, "Error adding post", http.StatusInternalServerError)
					return
			}
		}

		// Status 201
		w.WriteHeader(http.StatusCreated)
	}
}