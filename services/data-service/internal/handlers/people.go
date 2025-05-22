package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/silasjul/TradeSocial/services/scraping-data-service/internal/database"
	"github.com/silasjul/TradeSocial/services/scraping-data-service/internal/models"
)

func GetAllPeopleHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		people, err := database.GetAllPeople(db)
		if err != nil {
			http.Error(w, "Error fetching people", http.StatusInternalServerError)
			return
		}
		
		w.Header().Set("Content-Type", "application/json")

		if err = json.NewEncoder(w).Encode(people); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
			return
		}
	}
}

func AddPersonHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Convert post body into DTO
		var req models.CreatePersonRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Add person
		err = database.AddPerson(db, req.ProfileName, req.Username, req.DescriptionText, req.ImgURL)
		if err != nil {
			http.Error(w, "Error adding person", http.StatusInternalServerError)
			return
		}

		// Status 201
		w.WriteHeader(http.StatusCreated)
	}
}