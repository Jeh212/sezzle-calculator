package main

import (
	"log"
	"net/http"

	"sezzle-calculator/backend/handlers"
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func main() {
	http.HandleFunc("/api/calculate", corsMiddleware(handlers.CalculateHandler))

	log.Println("Backend listening on :8090")
	log.Fatal(http.ListenAndServe(":8090", nil))
}
