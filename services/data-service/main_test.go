package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {

	router := mux.NewRouter()

	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Received /ping request")
		w.Header().Set("Content-Type", "text/plain")
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("pong"))
		if err != nil {
			fmt.Println("Error writing response:", err)
		}
	}).Methods("GET")

	router.HandleFunc("/people", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Received /people request")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`[]`)) // Returnerer en tom JSON-liste
	}).Methods("GET")

	router.HandleFunc("/people", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`[]`))
	}).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", router))

}
