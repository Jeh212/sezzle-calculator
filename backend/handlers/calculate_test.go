package handlers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"sezzle-calculator/backend/handlers"
)

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name       string
		method     string
		body       string
		wantStatus int
		wantResult *float64
		wantError  *string
	}{
		{
			name:       "divide success",
			method:     http.MethodPost,
			body:       `{"operand1":10,"operand2":5,"operation":"divide"}`,
			wantStatus: http.StatusOK,
			wantResult: floatPtr(2),
		},
		{
			name:       "add success",
			method:     http.MethodPost,
			body:       `{"operand1":3,"operand2":4,"operation":"add"}`,
			wantStatus: http.StatusOK,
			wantResult: floatPtr(7),
		},
		{
			name:       "divide by zero",
			method:     http.MethodPost,
			body:       `{"operand1":10,"operand2":0,"operation":"divide"}`,
			wantStatus: http.StatusBadRequest,
			wantError:  strPtr("Cannot divide by zero"),
		},
		{
			name:       "unknown operation",
			method:     http.MethodPost,
			body:       `{"operand1":1,"operand2":1,"operation":"modulo"}`,
			wantStatus: http.StatusBadRequest,
			wantError:  strPtr("unknown operation"),
		},
		{
			name:       "wrong method",
			method:     http.MethodGet,
			body:       "",
			wantStatus: http.StatusMethodNotAllowed,
		},
		{
			name:       "malformed json",
			method:     http.MethodPost,
			body:       `{bad json}`,
			wantStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, "/api/calculate", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", "application/json")
			rec := httptest.NewRecorder()

			handlers.CalculateHandler(rec, req)

			if rec.Code != tt.wantStatus {
				t.Errorf("status = %d, want %d", rec.Code, tt.wantStatus)
			}

			if tt.wantResult == nil && tt.wantError == nil {
				return
			}

			var resp struct {
				Result *float64 `json:"result"`
				Error  *string  `json:"error"`
			}
			if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
				t.Fatalf("failed to decode response: %v", err)
			}

			if tt.wantResult != nil {
				if resp.Result == nil || *resp.Result != *tt.wantResult {
					t.Errorf("result = %v, want %v", resp.Result, *tt.wantResult)
				}
			}

			if tt.wantError != nil {
				if resp.Error == nil || *resp.Error != *tt.wantError {
					t.Errorf("error = %v, want %q", resp.Error, *tt.wantError)
				}
			}
		})
	}
}

func floatPtr(v float64) *float64 { return &v }
func strPtr(v string) *string     { return &v }
