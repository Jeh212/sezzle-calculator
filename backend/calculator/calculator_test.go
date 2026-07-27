package calculator_test

import (
	"errors"
	"testing"

	"sezzle-calculator/backend/calculator"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		op      string
		want    float64
		wantErr error
	}{
		{name: "add", a: 3, b: 2, op: "add", want: 5},
		{name: "add negative", a: -1, b: -2, op: "add", want: -3},
		{name: "subtract", a: 10, b: 4, op: "subtract", want: 6},
		{name: "subtract negative result", a: 2, b: 5, op: "subtract", want: -3},
		{name: "multiply", a: 3, b: 4, op: "multiply", want: 12},
		{name: "multiply by zero", a: 100, b: 0, op: "multiply", want: 0},
		{name: "divide", a: 10, b: 5, op: "divide", want: 2},
		{name: "divide float result", a: 1, b: 3, op: "divide", want: 1.0 / 3.0},
		{name: "divide by zero", a: 10, b: 0, op: "divide", wantErr: calculator.ErrDivisionByZero},
		{name: "unknown operation", a: 1, b: 1, op: "modulo", wantErr: calculator.ErrUnknownOperation},
		{name: "empty operation", a: 1, b: 1, op: "", wantErr: calculator.ErrUnknownOperation},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := calculator.Calculate(tt.a, tt.b, tt.op)

			if tt.wantErr != nil {
				if !errors.Is(err, tt.wantErr) {
					t.Errorf("Calculate(%v, %v, %q) error = %v, wantErr %v", tt.a, tt.b, tt.op, err, tt.wantErr)
				}
				return
			}

			if err != nil {
				t.Errorf("Calculate(%v, %v, %q) unexpected error: %v", tt.a, tt.b, tt.op, err)
				return
			}

			if got != tt.want {
				t.Errorf("Calculate(%v, %v, %q) = %v, want %v", tt.a, tt.b, tt.op, got, tt.want)
			}
		})
	}
}
