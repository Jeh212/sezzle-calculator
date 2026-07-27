package models

type CalculateRequest struct {
	Operand1  float64 `json:"operand1"`
	Operand2  float64 `json:"operand2"`
	Operation string  `json:"operation"`
}

type CalculateResponse struct {
	Result *float64 `json:"result"`
	Error  *string  `json:"error"`
}
