package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/silasjul/TradeSocial/services/scraping-data-service/internal/database"
	"github.com/silasjul/TradeSocial/services/scraping-data-service/internal/handlers"
)

func main() {
	// Database connection
	db, err := database.CreateConnection() 
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Reset db
	if err = database.DeleteAllTables(db); err != nil {
		log.Fatal(err)
	}
	if err = database.InitTables(db); err != nil {
		log.Fatal(err)
	}

	// Routes
	router := mux.NewRouter()

	router.HandleFunc("/people", handlers.GetAllPeopleHandler(db)).Methods("GET")
	router.HandleFunc("/people", handlers.AddPersonHandler(db)).Methods("POST")

	router.HandleFunc("/posts", handlers.GetAllPostsHandler(db)).Methods("GET")
	router.HandleFunc("/posts", handlers.AddPostsHandler(db)).Methods("POST")
	router.HandleFunc("/posts/{id}", handlers.GetPostsByIdHandler(db)).Methods("GET")

	// CORS policy
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000", "http://127.0.0.1:3000",},
		AllowedMethods: []string{"GET", "POST"}, 
		AllowedHeaders: []string{"Content-Type"},
	})
	handler := c.Handler(router)

	// Start
	fmt.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}