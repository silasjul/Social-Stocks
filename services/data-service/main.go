package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
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
	database.DeleteAllTables(db)
	database.InitTables(db)

	// Routes
	router := mux.NewRouter()

	router.HandleFunc("/people", handlers.GetAllPeopleHandler(db)).Methods("GET")
	router.HandleFunc("/people", handlers.AddPersonHandler(db)).Methods("POST")

	router.HandleFunc("/posts", handlers.GetAllPostsHandler(db)).Methods("GET")
	router.HandleFunc("/posts", handlers.AddPostHandler(db)).Methods("POST")
	router.HandleFunc("/posts/{id}", handlers.GetPostsByIdHandler(db)).Methods("GET")

	// Start
	fmt.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", router))
}