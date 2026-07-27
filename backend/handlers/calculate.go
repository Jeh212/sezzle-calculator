package handlers

import (
	"encoding/json"
	"net/http"

	"sezzle-calculator/backend/calculator"
	"sezzle-calculator/backend/models"
)

func ptr[T any](v T) *T { return &v }

func CalculateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.CalculateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	result, err := calculator.Calculate(req.Operand1, req.Operand2, req.Operation)

	var resp models.CalculateResponse
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		resp.Error = ptr(err.Error())
	} else {
		resp.Result = ptr(result)
	}

	json.NewEncoder(w).Encode(resp)
}
